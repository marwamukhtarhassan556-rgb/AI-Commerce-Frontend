import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Atom, Braces, Check, ChevronLeft, Code2, Component, Copy, FileJson, FileText, HelpCircle, Loader2, Sparkles, Triangle, Upload, X } from 'lucide-react';
import { parse as parseYaml } from 'yaml';
import api, { refreshAccessToken } from '../../../api/axiosConfig';
import { contactApi, integrationApi, knowledgeApi, subscriptionsApi } from '../../../api/integrationApi';
import { normalizeSubscription } from '../subscription/subscriptionStatus';
import { getUserErrorMessage } from '../../../utils/errorMessage';
import WidgetAccessPanel from '../../merchant/WidgetAccessPanel';

const initialStore = { name: '', description: '', platform: 'custom', shopDomain: '', ecommerceEmail: '', ecommercePassword: '', currency: 'USD', language: 'en', timezone: 'UTC' };

const messageFor = (error, fallback) => getUserErrorMessage(error, fallback);

const OPENAPI_SCHEMA_PROMPT = `You are an API documentation expert. Generate a complete, valid OpenAPI 3.0.3 YAML specification for the e-commerce REST API described below.

This specification will be uploaded to Navi AI Commerce. It must let the integration discover the real base URL, authenticate, detect products, categories, customers, orders, coupons, and inventory, then sync those records for AI search and recommendations.

RULES
- Generate the schema only from details I provide. Never invent endpoints, fields, response shapes, or credentials. Ask me for anything missing.
- Use: openapi: 3.0.3
- Add info.title, info.version, and info.description.
- Add servers with the real reachable base API URL.
- Add components.securitySchemes.BearerAuth as HTTP bearer JWT.
- Include an unauthenticated login endpoint with email and password, and a response schema with token (and expiresAt if available).
- Every GET/POST response must reference a named schema under components.schemas. Do not leave a 200 response without a schema.
- Keep objects simple with concrete string/integer/number/boolean/array types. Avoid allOf, anyOf, and oneOf unless unavoidable.

ENDPOINTS TO INCLUDE WHEN THEY EXIST
- Product list and detail: plural paths such as /api/Products.
- Category list and detail: /api/Categories.
- Customer/user list: /api/admin/users (protected with BearerAuth).
- Order list: /api/admin/orders or the real equivalent (protected when admin-scoped).
- Coupon/discount list: /api/admin/coupons or the real equivalent (protected when admin-scoped).
- Inventory/stock endpoints if they exist.

DATA RULES
- List endpoints must use GET and declare their pagination query parameters exactly as the real API uses them.
- Describe the real response envelope: data, items, results, records, rows, content, or a bare array.
- Each entity needs a stable unique id.
- Prices must be numbers or { amount, currency }, never formatted strings.
- Dates must be ISO-8601 date-time strings.
- Email, name, phone, status, and other normal text fields must be strings, not arrays.
- Product fields should include id, name/title, description, price, stock quantity, image URL, category id/name, SKU, and status whenever available.
- Order fields should include id, customer, line items, totals, currency, status, and created date whenever available.

Use this structural starting point and replace placeholders with my real API:

openapi: 3.0.3
info:
  title: My E-Commerce API
  description: OpenAPI spec for my store, enabling AI discovery and recommendations.
  version: 1.0.0
servers:
  - url: https://my-real-api.example.com
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

Before returning the final YAML, check that every endpoint, field name, casing, and type exactly matches the real API responses I gave you. Return YAML only.`;

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
  const [step, setStep] = useState(() => ([3, 4, 5, 6, 7, 8].includes(requestedStep) ? requestedStep : 3));
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
      const backendMessage = String(requestError.response?.data?.message || requestError.response?.data?.detail || '').toLowerCase();
      const duplicateDomain = requestError.response?.status === 409 || /shop\s*domain.*already\s*exists|domain.*already\s*(exists|used)|duplicate.*domain/.test(backendMessage);
      setError(duplicateDomain
        ? 'This website domain is already connected to a store. Use a different domain, or update the existing store from My Store.'
        : messageFor(requestError, 'Your store could not be created. Please check the details and try again.'));
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

  return <main className="onboarding-shell min-h-screen text-slate-800">
    {step >= 3 && <header className="onboarding-header"><div><span className="onboarding-header__eyebrow"><Sparkles size={14} /> One step closer to going live <ArrowRight size={14} /></span><h1>Merchant Onboarding</h1></div><button type="button" className="onboarding-header__help" aria-label="Onboarding help"><HelpCircle className="h-5 w-5" /></button></header>}
    <section className={`onboarding-card mx-auto w-full px-8 py-12 sm:px-14 sm:py-16 ${step === 3 ? 'onboarding-plan-page onboarding-plans-card' : ''}`} style={{ maxWidth: step === 3 ? '1200px' : '1000px' }}>
      <Progress step={step} />
      {error && <p className="mb-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">{error}</p>}
      {step === 3 && <PlansStep plans={plans} trialStatus={trialStatus} loading={plansLoading || loading} onSelect={openPlan} onCreateStore={() => (localStorage.getItem('currentStoreId') || localStorage.getItem('storeId')) ? setStep(5) : setStep(4)} />}
      {step === 4 && <StoreStep value={store} onChange={setField(setStore)} onSubmit={submitStore} loading={loading} onBack={back} />}
      {step === 5 && <SchemaGuideStep onBack={back} onContinue={() => setStep(6)} onAskDeveloper={() => setDeveloperModalOpen(true)} />}
      {step === 6 && <SchemaUploadStep complete={integrationProgress.schema} loading={integrationLoading.schema} onBack={back} onUpload={uploadSchema} onContinue={() => setStep(7)} />}
      {step === 7 && <PoliciesUploadStep complete={integrationProgress.policies} loading={integrationLoading.policies} onBack={back} onUpload={uploadPolicies} onContinue={() => setStep(8)} />}
      {step === 8 && <WidgetSetupStep onBack={back} onFinish={() => navigate('/merchant/dashboard')} />}
    </section>
    {selectedPlan && <PlanModal plan={selectedPlan} trialStatus={trialStatus} hasUsedFreeTrial={hasUsedFreeTrial} loading={loading} onClose={() => { setSelectedPlan(null); setError(''); }} onStartFreeTrial={startFreeTrial} onCheckout={createCheckoutSession} />}
    {developerModalOpen && <DeveloperModal plans={plans} store={store} onClose={() => setDeveloperModalOpen(false)} />}
  </main>;
}

function Progress({ step }) { const current = step - 2; const percent = (current / 6) * 100; return <><div className="mb-3 flex items-center justify-between text-sm"><span className="font-semibold text-blue-600">Step {current} of 6</span><span className="text-slate-500">{Math.round(percent)}% Complete</span></div><div className="mb-8 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-blue-600 transition-all" style={{ width: `${percent}%` }} /></div></>; }
function Button({ children, loading, ...props }) { return <button {...props} disabled={loading || props.disabled} className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 ${props.className || ''}`}>{loading && <Loader2 className="h-4 w-4 animate-spin" />}{children}</button>; }
function Back({ onClick }) { return <button type="button" onClick={onClick} className="onboarding-back mb-5 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"><ChevronLeft className="h-4 w-4" />Back</button>; }
function Fields({ fields, value, onChange }) { return <div className="space-y-4">{fields.map(([name, label, type, autoComplete]) => <label key={name} className="block text-sm font-medium text-slate-700">{label}<input required name={name} type={type} autoComplete={autoComplete} value={value[name]} onChange={onChange} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" /></label>)}</div>; }
function PlansStep({ plans, trialStatus, loading, onSelect, onCreateStore, onBack }) { const trialMessage = trialStatus?.remainingDays > 0 ? `${trialStatus.remainingDays} day(s) remaining` : trialStatus?.trialEndDate ? 'Your trial ends today' : 'Your trial is active'; return <div><Back onClick={onBack} /><h1 className="text-2xl font-bold">Choose a subscription plan</h1><p className="mt-2 mb-3 text-sm text-slate-500">Select a plan to view its complete details.</p>{trialStatus?.isTrialing && <div className="mb-6 flex flex-col gap-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 sm:flex-row sm:items-center sm:justify-between"><div><b>Free trial active</b><p className="mt-1">{trialMessage}{trialStatus.remainingDays > 0 && trialStatus.trialEndDate ? `, ending ${new Date(trialStatus.trialEndDate).toLocaleDateString()}` : ''}.</p></div><button type="button" onClick={onCreateStore} disabled={loading} className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">Build your store</button></div>}{trialStatus?.isActive && <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"><b>Active subscription</b><p className="mt-1">Your current plan is {trialStatus.planName || 'active'}.</p></div>}{trialStatus?.isExpired && <div className="mb-6 rounded-xl border border-slate-300 bg-slate-50 p-4 text-sm text-slate-900"><b>Your free trial has ended</b><p className="mt-1">Choose a plan to continue using paid features.</p></div>}{loading ? <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-600" /></div> : <div className="grid gap-3">{plans.map((plan) => <button type="button" key={plan.id} onClick={() => onSelect(plan)} className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-600 hover:shadow-sm"><div className="flex items-start justify-between gap-4"><h2 className="font-bold">{plan.planName}</h2><span className="font-semibold text-blue-600">${plan.planPrice}/mo</span></div><p className="mt-2 text-sm text-slate-500">{(plan.numOfTokens || 0).toLocaleString()} tokens</p><ul className="mt-3 space-y-1 text-sm text-slate-600">{(plan.features || []).slice(0, 3).map((feature) => <li key={feature.featureId} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-blue-600" />{feature.featureName}</li>)}</ul></button>)}{!plans.length && <p className="py-8 text-center text-sm text-slate-500">No subscription plans are available right now.</p>}</div>}</div>; }
function PlanModal({ plan, trialStatus, hasUsedFreeTrial, loading, onClose, onStartFreeTrial, onCheckout }) { const eligibilityKnown = hasUsedFreeTrial !== null; const canStartTrial = eligibilityKnown && !hasUsedFreeTrial && trialStatus?.canStartTrial !== false; const hasSubscription = trialStatus && !canStartTrial; return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"><div className="onboarding-plan-modal max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"><button type="button" onClick={onClose} className="float-right rounded p-1 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button><h2 className="text-2xl font-bold">{plan.planName}</h2><p className="mt-2 text-slate-600">{plan.planDescription}</p><div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm"><b>{(plan.numOfTokens || 0).toLocaleString()} tokens</b></div><h3 className="mt-5 font-semibold">Included features</h3><div className="mt-3 space-y-3">{(plan.features || []).map((feature) => <div key={feature.featureId} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" /><div><p className="text-sm font-medium">{feature.featureName}</p><p className="text-xs text-slate-500">{feature.featureDescription}</p></div></div>)}</div>{canStartTrial ? <Button className="mt-6" loading={loading} onClick={onStartFreeTrial}>Start Free Trial</Button> : <p className="mt-6 rounded-lg bg-slate-100 p-3 text-sm text-slate-700">{!eligibilityKnown ? 'Checking free-trial eligibility…' : hasSubscription ? 'Your account already has a trial or subscription. Choose a plan below to pay.' : 'Free trial is not available for this account.'}</p>}<button type="button" disabled={loading} onClick={onCheckout} className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-blue-600 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60">Continue to Checkout</button></div></div>; }
function StoreStep({ value, onChange, onSubmit, loading, onBack }) { return <form onSubmit={onSubmit} autoComplete="off"><Back onClick={onBack} /><h1 className="text-2xl font-bold">Create your store</h1><p className="mt-2 mb-6 text-sm text-slate-500">Add your store details and the login credentials for your own e-commerce platform.</p><Fields fields={[['name', 'Store Name', 'text', 'off'], ['description', 'Description', 'text', 'off'], ['shopDomain', 'Website Domain', 'url', 'url'], ['ecommerceEmail', 'Your e-commerce admin email', 'email', 'off'], ['ecommercePassword', 'Your e-commerce admin password', 'password', 'new-password'], ['currency', 'Currency', 'text', 'off'], ['language', 'Language', 'text', 'off'], ['timezone', 'Timezone', 'text', 'off']]} value={value} onChange={onChange} /><p className="mt-3 text-xs text-slate-500">Use the email and password you use to access your own store platform. These are not your Navi account credentials and are never saved in the browser.</p><Button className="mt-6" loading={loading} type="submit">Create Store</Button></form>; }
function StepHeading({ icon: Icon, eyebrow, title, copy, action }) { return <div className="integration-single-step"><div className="integration-step-heading"><div className="integration-step-heading__copy"><span className="integration-step-heading__eyebrow"><Icon className="h-4 w-4" />{eyebrow}</span><h1>{title}</h1><p>{copy}</p></div>{action && <div className="integration-step-heading__action">{action}</div>}</div></div>; }
function SchemaGuideStep({ onBack, onContinue, onAskDeveloper }) { const [copied, setCopied] = useState(false); const copyPrompt = async () => { try { await navigator.clipboard.writeText(OPENAPI_SCHEMA_PROMPT); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { setCopied(false); } }; return <div><Back onClick={onBack} /><StepHeading icon={Sparkles} eyebrow="Integration · 1 of 4" title="Generate your OpenAPI schema" copy="Copy this ready-made prompt into ChatGPT, Claude, or Copilot. Add only your real store API details, then save the generated result as a YAML or JSON file." action={<button type="button" onClick={onAskDeveloper} className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600">Ask for Developer</button>} /><div className="mt-6 grid gap-4 md:grid-cols-3">{[['1', 'Copy the prompt', 'Use the prompt below to ask an AI tool for a valid OpenAPI 3.0.3 file.'], ['2', 'Give real details', 'Paste your real API URL, endpoints, login request, and response samples.'], ['3', 'Save and upload', 'Save the result as .yaml, .yml, or .json. The next page is the actual upload step.']].map(([number, title, copy]) => <div key={number} className="rounded-xl border border-slate-200 bg-slate-50 p-5"><span className="text-2xl font-extrabold text-blue-600">{number}</span><h2 className="mt-3 font-bold text-slate-900">{title}</h2><p className="mt-1 text-sm leading-6 text-slate-500">{copy}</p></div>)}</div><div className="schema-prompt-card mt-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2>OpenAPI schema generation prompt</h2><p>Ready to copy — no GitHub page required.</p></div><button type="button" onClick={copyPrompt} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"><Copy className="h-4 w-4" />{copied ? 'Prompt copied' : 'Copy prompt'}</button></div><pre>{OPENAPI_SCHEMA_PROMPT}</pre></div><Button className="mt-5" onClick={onContinue}>Continue to upload schema <ArrowRight className="h-4 w-4" /></Button></div>; }
function SchemaUploadStep({ complete, loading, onBack, onUpload, onContinue }) { return <div><Back onClick={onBack} /><StepHeading icon={FileJson} eyebrow="Integration · 2 of 4" title="Upload OpenAPI schema" copy="Upload the YAML file you generated. We will analyze the endpoints, create the connection, and start the first sync." /><div className="mt-6 rounded-2xl border border-dashed border-blue-200 bg-blue-50/50 p-8 text-center"><FileJson className="mx-auto h-10 w-10 text-blue-600" /><h2 className="mt-4 font-bold text-slate-900">OpenAPI 3.0 file</h2><p className="mt-2 text-sm text-slate-500">Accepted formats: .yaml, .yml, and .json</p><div className="mt-5 flex justify-center"><FilePicker accept=".json,.yaml,.yml,application/json,application/yaml,text/yaml" loading={loading} label={complete ? 'Upload another schema' : 'Choose schema file'} onChange={onUpload} /></div>{complete && <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700"><Check className="h-4 w-4" />Schema analyzed and connection started.</p>}</div><Button className="mt-6" disabled={!complete} onClick={onContinue}>Continue to policies <ArrowRight className="h-4 w-4" /></Button></div>; }
function PoliciesUploadStep({ complete, loading, onBack, onUpload, onContinue }) { return <div><Back onClick={onBack} /><StepHeading icon={FileText} eyebrow="Integration · 3 of 4" title="Add store knowledge" copy="Give the assistant your return policy, shipping details, FAQs, and product guides so it can answer customers accurately." /><div className="mt-6 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/40 p-8 text-center"><FileText className="mx-auto h-10 w-10 text-indigo-600" /><h2 className="mt-4 font-bold text-slate-900">Policies and FAQs</h2><p className="mt-2 text-sm text-slate-500">Accepted formats: PDF, DOCX, CSV, and TXT</p><div className="mt-5 flex justify-center"><FilePicker accept=".pdf,.docx,.csv,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/csv" loading={loading} label={complete ? 'Upload another document' : 'Choose a document'} onChange={onUpload} /></div>{complete && <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700"><Check className="h-4 w-4" />Document uploaded and processing started.</p>}</div><Button className="mt-6" disabled={!complete} onClick={onContinue}>Continue to widget setup <ArrowRight className="h-4 w-4" /></Button></div>; }
const widgetFrameworks = [
  { id: 'react', name: 'React', icon: Atom, file: 'public/widget.js', detail: 'Use the project root index.html.' },
  { id: 'angular', name: 'Angular', icon: Component, file: 'src/assets/widget.js', detail: 'Use src/index.html.' },
  { id: 'vanilla', name: 'Vanilla JS', icon: Braces, file: 'widget.js beside index.html', detail: 'Use your main index.html.' },
  { id: 'vue', name: 'Vue', icon: Triangle, file: 'public/widget.js', detail: 'Use the project root index.html.' },
];

function WidgetSetupStep({ onBack, onFinish }) {
  const [framework, setFramework] = useState('');
  return <div><Back onClick={onBack} /><StepHeading icon={Code2} eyebrow="Integration · 4 of 4" title="Install your storefront widget" copy="Choose the framework your store uses. We will show you exactly where to put the widget file and the matching installation code." />
    <div className="widget-framework-grid mt-6">{widgetFrameworks.map((item) => { const Icon = item.icon; const selected = framework === item.id; return <button key={item.id} type="button" onClick={() => setFramework(item.id)} className={`widget-framework-card ${selected ? 'is-selected' : ''}`}><Icon className="h-7 w-7" /><span>{item.name}</span><small>{item.file}</small><em>{item.detail}</em></button>; })}</div>
    {framework ? <div className="mt-6"><p className="widget-framework-selected">Selected: <b>{widgetFrameworks.find((item) => item.id === framework)?.name}</b>. Complete the three steps below.</p><WidgetAccessPanel framework={framework} /></div> : <p className="mt-5 rounded-xl border border-dashed border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">Choose your framework to see the correct file path and installation code.</p>}
    <Button className="mt-6" disabled={!framework} onClick={onFinish}>Open Merchant Dashboard <ArrowRight className="h-4 w-4" /></Button></div>;
}

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
