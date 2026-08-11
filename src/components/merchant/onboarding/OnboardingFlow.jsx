import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Check, ChevronLeft, Code2, Download, FileJson, FileText, HelpCircle, Loader2, Sparkles, Upload, X } from 'lucide-react';
import { parse as parseYaml } from 'yaml';
import api, { refreshAccessToken } from '../../../api/axiosConfig';
import { contactApi, integrationApi, knowledgeApi, subscriptionsApi } from '../../../api/integrationApi';
import { normalizeSubscription } from '../subscription/subscriptionStatus';
import { getUserErrorMessage } from '../../../utils/errorMessage';

const initialStore = { name: '', description: '', platform: 'custom', shopDomain: '', ecommerceEmail: '', ecommercePassword: '', currency: 'USD', language: 'en', timezone: 'UTC' };

const messageFor = (error, fallback) => getUserErrorMessage(error, fallback);

const replacePlaceholderServer = (rawSpec, shopDomain) => {
  const serverUrl = shopDomain?.trim();
  if (!serverUrl || !Array.isArray(rawSpec?.servers)) return rawSpec;
  const baseUrl = /^https?:\/\//i.test(serverUrl) ? serverUrl : `https://${serverUrl}`;
  const servers = rawSpec.servers.map((server) => /api\.ecommerce-platform\.com/i.test(server?.url || '') ? { ...server, url: baseUrl } : server);
  return { ...rawSpec, servers };
};

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedStep = Number(searchParams.get('step'));
  const [step, setStep] = useState(() => ([3, 4, 5].includes(requestedStep) ? requestedStep : 3));
  const [store, setStore] = useState(initialStore);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [trialStatus, setTrialStatus] = useState(null);
  const [hasUsedFreeTrial, setHasUsedFreeTrial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(false);
  const [integrationProgress, setIntegrationProgress] = useState({ schema: false, policies: false, widget: false });
  const [integrationLoading, setIntegrationLoading] = useState({ schema: false, policies: false });
  const [developerModalOpen, setDeveloperModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token') || requestedStep === 1 || requestedStep === 2) {
      navigate('/signin', { replace: true });
    }
  }, [navigate, requestedStep]);

  useEffect(() => {
    if (step !== 3) return undefined;
    let active = true;
    const load = async () => {
      setPlansLoading(true); setError('');
      try {
        const { data } = await subscriptionsApi.listPlans();
        if (!active) return;
        setPlans(Array.isArray(data) ? data : []);
      } catch (requestError) {
        if (active) setError(messageFor(requestError, 'Could not load subscription plans.'));
      } finally { if (active) setPlansLoading(false); }

      // Never make plan selection wait for my-subscription. trial-status is enough
      // to decide whether a free trial is currently active.
      subscriptionsApi.getTrialStatus()
        .then(({ data }) => active && setTrialStatus(normalizeSubscription(data)))
        .catch(() => active && setTrialStatus(normalizeSubscription({})))

      subscriptionsApi.hasUsedFreeTrial()
        .then(({ data }) => active && setHasUsedFreeTrial(data?.hasUsedFreeTrial === true))
        // Do not offer a free trial when eligibility cannot be verified.
        .catch(() => active && setHasUsedFreeTrial(true));

      // This supplements the status with an active paid subscription when available.
      subscriptionsApi.getCurrent().then(({ data }) => {
        if (!active || String(data?.status || '').toLowerCase() === 'trial') return;
        setTrialStatus(normalizeSubscription(data));
      }).catch(() => {});
    };
    void load();
    return () => { active = false; };
  }, [step]);

  const openPlan = async (plan) => {
    setLoading(true); setError('');
    try { const { data } = await subscriptionsApi.getPlanById(plan.id); setSelectedPlan(data); }
    catch (requestError) { setError(messageFor(requestError, 'Could not load plan details.')); }
    finally { setLoading(false); }
  };

  const startFreeTrial = async () => {
    setLoading(true); setError('');
    try {
      const { data } = await subscriptionsApi.startFreeTrial(selectedPlan.id);
      setTrialStatus(normalizeSubscription({ ...data, isInTrial: true, status: 'trialing' }));
      setSelectedPlan(null);
      if (localStorage.getItem('currentStoreId') || localStorage.getItem('storeId')) setStep(5);
      else setStep(4);
    } catch (requestError) {
      // A second click, refresh, or an interrupted onboarding can return "trial already exists".
      // Continue the seller to the pending store setup instead of leaving them at an error.
      const backendMessage = String(requestError.response?.data?.message || requestError.response?.data?.title || '').toLowerCase();
      const trialAlreadyExists = requestError.response?.status === 409 || (/(trial|subscription).*(already|exist)|(already|exist).*(trial|subscription)/).test(backendMessage);
      if (trialAlreadyExists) {
        setSelectedPlan(null);
        if (localStorage.getItem('currentStoreId') || localStorage.getItem('storeId')) setStep(5);
        else setStep(4);
      } else setError(messageFor(requestError, 'Could not start the free trial.'));
    }
    finally { setLoading(false); }
  };

  const createCheckoutSession = async () => {
    setLoading(true); setError('');
    try {
      const { data } = await subscriptionsApi.createCheckoutSession(selectedPlan.id);
      if (!data?.checkoutUrl) throw new Error('Could not start the secure checkout.');
      window.location.href = data.checkoutUrl;
    } catch (requestError) { setError(messageFor(requestError, 'Could not start checkout.')); }
    finally { setLoading(false); }
  };

  const submitStore = async (event) => {
    event.preventDefault(); setLoading(true); setError('');
    try {
      const { ecommerceEmail, ecommercePassword, ...storeDetails } = store;
      const { data } = await api.post('/api/stores', {
        ...storeDetails,
        adminEmail: ecommerceEmail.trim(),
        adminPassword: ecommercePassword,
      });
      if (!data?.id) throw new Error('The store was created without a store ID.');
      localStorage.setItem('storeId', data.id);
      localStorage.setItem('currentStoreId', data.id);

      // The backend refreshes the JWT after the store exists, so the next AI
      // requests start with the latest access token and store context.
      await refreshAccessToken();
      setStep(5);
    } catch (requestError) {
      setError(messageFor(requestError, 'Your store was created, but we could not refresh your session. Please sign in again.'));
    } finally { setLoading(false); }
  };

  const back = () => { setError(''); setStep((current) => Math.max(3, current - 1)); };
  const setField = (setter) => (event) => setter((current) => ({ ...current, [event.target.name]: event.target.value }));

  const uploadSchema = async (file) => {
    if (!file) return;
    const storeId = localStorage.getItem('currentStoreId') || localStorage.getItem('storeId');
    if (!storeId) return setError('Create your store before uploading an OpenAPI schema.');
    setIntegrationLoading((current) => ({ ...current, schema: true })); setError('');
    try {
      const source = await file.text();
      const parsedSpec = /\.ya?ml$/i.test(file.name) ? parseYaml(source) : JSON.parse(source);
      const rawSpec = replacePlaceholderServer(parsedSpec, store.shopDomain);
      if (!rawSpec || typeof rawSpec !== 'object') throw new Error('The OpenAPI schema is empty or invalid.');
      const platformName = rawSpec?.info?.title || rawSpec?.title || 'Custom store';
      const accessToken = localStorage.getItem('token');
      if (!accessToken) throw new Error('Your session is missing an access token. Please sign in again.');
      const { data } = await integrationApi.agentSync({
        platform_name: platformName,
        raw_spec: rawSpec,
        store_id: storeId,
        name: `${platformName} connection`,
        credentials: { Authorization: `Bearer ${accessToken}` },
        auto_sync: true,
      });
      if (data?.error || data?.user_friendly_error) throw new Error(data.user_friendly_error || data.error);
      setIntegrationProgress((current) => ({ ...current, schema: true }));
    } catch (requestError) {
      setError(requestError instanceof SyntaxError ? 'Please upload a valid OpenAPI JSON or YAML schema.' : messageFor(requestError, 'Could not analyze the OpenAPI schema.'));
    } finally { setIntegrationLoading((current) => ({ ...current, schema: false })); }
  };

  const uploadPolicies = async (file) => {
    if (!file) return;
    const storeId = localStorage.getItem('currentStoreId') || localStorage.getItem('storeId');
    const organizationId = localStorage.getItem('organizationId');
    const uploadedBy = localStorage.getItem('userId');
    if (!storeId || !organizationId || !uploadedBy) return setError('Your store session is incomplete. Please log in again.');
    setIntegrationLoading((current) => ({ ...current, policies: true })); setError('');
    try {
      const { data } = await knowledgeApi.upload(file, { storeId, organizationId, uploadedBy, knowledgeScope: 'general' });
      const documentId = data?.document_id || data?.id;
      const filePath = data?.file_path || data?.storage_path || data?.path;
      if (!documentId || !filePath) throw new Error('The upload response is missing document details.');
      await knowledgeApi.processDocument({ documentId, filePath, mimeType: data?.mime_type || file.type });
      setIntegrationProgress((current) => ({ ...current, policies: true }));
    } catch (requestError) { setError(messageFor(requestError, 'Could not upload and process this document.')); }
    finally { setIntegrationLoading((current) => ({ ...current, policies: false })); }
  };

  const downloadWidget = () => {
    const storeId = localStorage.getItem('currentStoreId') || localStorage.getItem('storeId');
    const source = `/* AICommerce widget starter. Configure the API URL before production. */\nwindow.AICommerceWidget = { storeId: '${storeId || ''}', init() { console.info('AICommerce widget ready'); } };\nwindow.AICommerceWidget.init();\n`;
    const url = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
    const link = document.createElement('a'); link.href = url; link.download = 'aicommerce-widget.js'; link.click(); URL.revokeObjectURL(url);
    setIntegrationProgress((current) => ({ ...current, widget: true }));
  };

  return <main className="onboarding-shell min-h-screen text-slate-800">
    {step >= 3 && <header className="onboarding-header"><div><span className="onboarding-header__eyebrow"><Sparkles size={14} /> One step closer to going live <ArrowRight size={14} /></span><h1>Merchant Onboarding</h1></div><button type="button" className="onboarding-header__help" aria-label="Onboarding help"><HelpCircle className="h-5 w-5" /></button></header>}
    <section className={`onboarding-card mx-auto w-full px-8 py-12 sm:px-14 sm:py-16 ${step === 3 ? 'onboarding-plan-page onboarding-plans-card' : ''}`} style={{ maxWidth: step === 3 ? '1200px' : '1000px' }}>
      <Progress step={step} />
      {error && <p className="mb-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">{error}</p>}
      {step === 3 && <PlansStep plans={plans} trialStatus={trialStatus} loading={plansLoading || loading} onSelect={openPlan} onCreateStore={() => (localStorage.getItem('currentStoreId') || localStorage.getItem('storeId')) ? setStep(5) : setStep(4)} />}
      {step === 4 && <StoreStep value={store} onChange={setField(setStore)} onSubmit={submitStore} loading={loading} onBack={back} />}
      {step === 5 && <IntegrationLayout progress={integrationProgress} loading={integrationLoading} onUploadSchema={uploadSchema} onUploadPolicies={uploadPolicies} onDownloadWidget={downloadWidget} onAskDeveloper={() => setDeveloperModalOpen(true)} onFinish={() => navigate('/merchant/dashboard')} />}
    </section>
    {selectedPlan && <PlanModal plan={selectedPlan} trialStatus={trialStatus} hasUsedFreeTrial={hasUsedFreeTrial} loading={loading} onClose={() => { setSelectedPlan(null); setError(''); }} onStartFreeTrial={startFreeTrial} onCheckout={createCheckoutSession} />}
    {developerModalOpen && <DeveloperModal plans={plans} store={store} onClose={() => setDeveloperModalOpen(false)} />}
  </main>;
}

function Progress({ step }) { const current = step - 2; const percent = (current / 3) * 100; return <><div className="mb-3 flex items-center justify-between text-sm"><span className="font-semibold text-blue-600">Step {current} of 3</span><span className="text-slate-500">{Math.round(percent)}% Complete</span></div><div className="mb-8 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-blue-600 transition-all" style={{ width: `${percent}%` }} /></div></>; }
function Button({ children, loading, ...props }) { return <button {...props} disabled={loading || props.disabled} className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 ${props.className || ''}`}>{loading && <Loader2 className="h-4 w-4 animate-spin" />}{children}</button>; }
function Back({ onClick }) { return <button type="button" onClick={onClick} className="onboarding-back mb-5 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"><ChevronLeft className="h-4 w-4" />Back</button>; }
function Fields({ fields, value, onChange }) { return <div className="space-y-4">{fields.map(([name, label, type, autoComplete]) => <label key={name} className="block text-sm font-medium text-slate-700">{label}<input required name={name} type={type} autoComplete={autoComplete} value={value[name]} onChange={onChange} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" /></label>)}</div>; }
function PlansStep({ plans, trialStatus, loading, onSelect, onCreateStore, onBack }) { const trialMessage = trialStatus?.remainingDays > 0 ? `${trialStatus.remainingDays} day(s) remaining` : trialStatus?.trialEndDate ? 'Your trial ends today' : 'Your trial is active'; return <div><Back onClick={onBack} /><h1 className="text-2xl font-bold">Choose a subscription plan</h1><p className="mt-2 mb-3 text-sm text-slate-500">Select a plan to view its complete details.</p>{trialStatus?.isTrialing && <div className="mb-6 flex flex-col gap-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 sm:flex-row sm:items-center sm:justify-between"><div><b>Free trial active</b><p className="mt-1">{trialMessage}{trialStatus.remainingDays > 0 && trialStatus.trialEndDate ? `, ending ${new Date(trialStatus.trialEndDate).toLocaleDateString()}` : ''}.</p></div><button type="button" onClick={onCreateStore} disabled={loading} className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">Build your store</button></div>}{trialStatus?.isActive && <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"><b>Active subscription</b><p className="mt-1">Your current plan is {trialStatus.planName || 'active'}.</p></div>}{trialStatus?.isExpired && <div className="mb-6 rounded-xl border border-slate-300 bg-slate-50 p-4 text-sm text-slate-900"><b>Your free trial has ended</b><p className="mt-1">Choose a plan to continue using paid features.</p></div>}{loading ? <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-600" /></div> : <div className="grid gap-3">{plans.map((plan) => <button type="button" key={plan.id} onClick={() => onSelect(plan)} className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-600 hover:shadow-sm"><div className="flex items-start justify-between gap-4"><h2 className="font-bold">{plan.planName}</h2><span className="font-semibold text-blue-600">${plan.planPrice}/mo</span></div><p className="mt-2 text-sm text-slate-500">{(plan.numOfTokens || 0).toLocaleString()} tokens</p><ul className="mt-3 space-y-1 text-sm text-slate-600">{(plan.features || []).slice(0, 3).map((feature) => <li key={feature.featureId} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-blue-600" />{feature.featureName}</li>)}</ul></button>)}{!plans.length && <p className="py-8 text-center text-sm text-slate-500">No subscription plans are available right now.</p>}</div>}</div>; }
function PlanModal({ plan, trialStatus, hasUsedFreeTrial, loading, onClose, onStartFreeTrial, onCheckout }) { const eligibilityKnown = hasUsedFreeTrial !== null; const canStartTrial = eligibilityKnown && !hasUsedFreeTrial && trialStatus?.canStartTrial !== false; const hasSubscription = trialStatus && !canStartTrial; return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"><div className="onboarding-plan-modal max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"><button type="button" onClick={onClose} className="float-right rounded p-1 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button><h2 className="text-2xl font-bold">{plan.planName}</h2><p className="mt-2 text-slate-600">{plan.planDescription}</p><div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm"><b>{(plan.numOfTokens || 0).toLocaleString()} tokens</b></div><h3 className="mt-5 font-semibold">Included features</h3><div className="mt-3 space-y-3">{(plan.features || []).map((feature) => <div key={feature.featureId} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" /><div><p className="text-sm font-medium">{feature.featureName}</p><p className="text-xs text-slate-500">{feature.featureDescription}</p></div></div>)}</div>{canStartTrial ? <Button className="mt-6" loading={loading} onClick={onStartFreeTrial}>Start Free Trial</Button> : <p className="mt-6 rounded-lg bg-slate-100 p-3 text-sm text-slate-700">{!eligibilityKnown ? 'Checking free-trial eligibility…' : hasSubscription ? 'Your account already has a trial or subscription. Choose a plan below to pay.' : 'Free trial is not available for this account.'}</p>}<button type="button" disabled={loading} onClick={onCheckout} className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-blue-600 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60">Continue to Checkout</button></div></div>; }
function StoreStep({ value, onChange, onSubmit, loading, onBack }) { return <form onSubmit={onSubmit} autoComplete="off"><Back onClick={onBack} /><h1 className="text-2xl font-bold">Create your store</h1><p className="mt-2 mb-6 text-sm text-slate-500">Add your store details and the login credentials for your own e-commerce platform.</p><Fields fields={[['name', 'Store Name', 'text', 'off'], ['description', 'Description', 'text', 'off'], ['shopDomain', 'Website Domain', 'url', 'url'], ['ecommerceEmail', 'Your e-commerce admin email', 'email', 'off'], ['ecommercePassword', 'Your e-commerce admin password', 'password', 'new-password'], ['currency', 'Currency', 'text', 'off'], ['language', 'Language', 'text', 'off'], ['timezone', 'Timezone', 'text', 'off']]} value={value} onChange={onChange} /><p className="mt-3 text-xs text-slate-500">Use the email and password you use to access your own store platform. These are not your Navi account credentials and are never saved in the browser.</p><Button className="mt-6" loading={loading} type="submit">Create Store</Button></form>; }
function IntegrationLayout({ progress, loading, onUploadSchema, onUploadPolicies, onDownloadWidget, onAskDeveloper, onFinish }) {
  return <div>
    <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-start sm:justify-between"><div><h1 className="text-2xl font-bold">Connect your store</h1><p className="mt-2 text-sm text-slate-500">Finish these three steps before opening your dashboard.</p></div><button type="button" onClick={onAskDeveloper} className="inline-flex min-h-10 items-center justify-center rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50">Ask for Developer</button></div>
    <div className="mt-6 space-y-4"><SetupCard icon={FileJson} title="1. Upload OpenAPI schema" description="Upload an OpenAPI JSON, YAML, or YML file. We will analyze its endpoints and integration capabilities." complete={progress.schema}><FilePicker accept=".json,.yaml,.yml,application/json,application/yaml,text/yaml" loading={loading.schema} label="Upload OpenAPI schema" onChange={onUploadSchema} /></SetupCard><SetupCard icon={FileText} title="2. Upload FAQ / Policies" description="Upload PDF, DOCX, CSV, or TXT policies, FAQs, and product guides for the first store setup. Future updates stay in AI Knowledge." complete={progress.policies}><FilePicker accept=".pdf,.docx,.csv,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/csv" loading={loading.policies} label="Upload FAQ / Policies" onChange={onUploadPolicies} /></SetupCard><SetupCard icon={Code2} title="3. Download Widget" description="Download the starter widget file. Framework-specific installation instructions will be added with the widget service." complete={progress.widget}><button type="button" onClick={onDownloadWidget} disabled={loading.schema || loading.policies} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 disabled:opacity-60"><Download className="h-4 w-4" />Download Widget</button></SetupCard></div>
    <Button className="mt-8" onClick={onFinish}>Open Merchant Dashboard</Button><p className="mt-2 text-center text-xs text-slate-500">You can complete or update these items later from your store setup.</p>
  </div>;
}

function SetupCard({ icon: Icon, title, description, complete, children }) { return <div className={`rounded-xl border p-5 ${complete ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200 bg-white'}`}><div className="flex gap-4"><div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${complete ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-50 text-blue-600'}`}>{complete ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}</div><div className="min-w-0 flex-1"><h2 className="font-semibold text-slate-900">{title}</h2><p className="mt-1 text-sm text-slate-500">{description}</p><div className="mt-4">{complete ? <span className="text-sm font-medium text-emerald-700">Completed</span> : children}</div></div></div></div>; }

function FilePicker({ accept, loading, label, onChange }) { return <label className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 ${loading ? 'pointer-events-none opacity-60' : ''}`}><Upload className="h-4 w-4" />{loading ? 'Working…' : label}<input className="sr-only" type="file" accept={accept} onChange={(event) => { void onChange(event.target.files?.[0]); event.target.value = ''; }} /></label>; }

function DeveloperModal({ plans, store, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [prices, setPrices] = useState({});

  useEffect(() => {
    let active = true;
    Promise.allSettled(plans.map((plan) => subscriptionsApi.getDevelopmentPrice(plan.id))).then((results) => {
      if (!active) return;
      setPrices(Object.fromEntries(results.map((result, index) => [plans[index].id, result.status === 'fulfilled' ? result.value.data?.developmentPrice : null])));
    });
    return () => { active = false; };
  }, [plans]);

  const submit = async (event) => {
    event.preventDefault(); setSending(true); setError('');
    const form = new FormData(event.currentTarget);
    try {
      await contactApi.createDeveloperRequest({
        email: form.get('email'), storeName: form.get('storeName'), storeDescription: store.description || '',
        message: form.get('message'), phoneNumber: form.get('phoneNumber'), contactPreference: form.get('contactPreference'), notes: '',
      });
      setSubmitted(true);
    } catch (requestError) { setError(messageFor(requestError, 'Could not send your request. Please try again.')); }
    finally { setSending(false); }
  };

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"><div className="developer-request-modal"><button type="button" onClick={onClose} className="float-right rounded p-1 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button><h2 className="text-xl font-bold">Ask for Developer</h2><p className="mt-1 text-sm text-slate-500">Need help connecting your store? Leave your details and our team will contact you.</p><div className="mt-5 rounded-lg bg-slate-50 p-4"><p className="text-sm font-semibold">Development price by plan</p><div className="mt-2 space-y-1 text-sm text-slate-600">{plans.length ? plans.map((plan) => <div key={plan.id} className="flex justify-between gap-4"><span>{plan.planName}</span><b>{prices[plan.id] === undefined ? 'Loading…' : prices[plan.id] === null ? 'Unavailable' : `$${prices[plan.id]}`}</b></div>) : <span>Pricing will appear here when plans are available.</span>}</div></div>{submitted ? <p className="mt-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">Your request was sent successfully. Our team will contact you soon.</p> : <form className="mt-5 space-y-3" onSubmit={submit}>{error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="grid gap-3 sm:grid-cols-2"><ModalInput name="email" label="Email" type="email" /><ModalInput name="storeName" label="Store name" defaultValue={store.name} /><ModalInput name="phoneNumber" label="Phone number" /></div><label className="block text-sm font-medium text-slate-700">Preferred contact<select required name="contactPreference" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5"><option value="phone">Phone</option><option value="email">Email</option><option value="other">Other</option></select></label><label className="block text-sm font-medium text-slate-700">Message<textarea required name="message" rows="3" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5" /></label><Button type="submit" loading={sending}>Send request</Button></form>}</div></div>;
}
function ModalInput({ name, label, type = 'text', defaultValue = '' }) { return <label className="block text-sm font-medium text-slate-700">{label}<input required name={name} type={type} defaultValue={defaultValue} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5" /></label>; }
