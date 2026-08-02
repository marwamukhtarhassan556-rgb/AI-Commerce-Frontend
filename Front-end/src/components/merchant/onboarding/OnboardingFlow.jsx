import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BarChart3, Check, CheckCircle2, ChevronLeft, HelpCircle, Loader2, Package, Plug, ShoppingCart, X } from 'lucide-react';
import api from '../../../api/axiosConfig';

/* Legacy onboarding step components are retained during the MVP transition. */
/* eslint-disable no-unused-vars */

function StoreStepCustom({ value, onChange, onSubmit, loading, onBack }) {
  return <form onSubmit={onSubmit}><Back onClick={onBack} /><div className="mb-6 flex items-start justify-between"><div><h1 className="text-2xl font-bold">Create your store</h1><p className="mt-2 text-sm text-slate-500">Add the details for your custom AI-commerce experience.</p></div><span className="text-xs font-medium text-blue-600">Store Setup: 1 of 2</span></div><div className="space-y-4"><label className="block text-sm font-medium">Store Name<input required name="name" value={value.name} onChange={onChange} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5" /></label><label className="block text-sm font-medium">Description<textarea required name="description" rows="3" value={value.description} onChange={onChange} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5" /></label><div className="rounded-xl border border-blue-100 bg-blue-50 p-4"><p className="text-sm font-bold text-blue-900">Custom API store</p><p className="mt-1 text-xs leading-5 text-blue-700">You will upload your OpenAPI schema, FAQs, and install the widget from the dashboard after setup.</p></div><input type="hidden" name="platform" value="custom" /><label className="block text-sm font-medium">Website Domain<input required name="shopDomain" placeholder="store.example.com" value={value.shopDomain} onChange={onChange} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5" /></label><div className="grid grid-cols-1 gap-4 sm:grid-cols-3"><Select name="currency" label="Currency" value={value.currency} onChange={onChange} options={['USD', 'EGP', 'EUR', 'GBP']} /><Select name="language" label="Language" value={value.language} onChange={onChange} options={['en', 'ar', 'fr']} /><Select name="timezone" label="Timezone" value={value.timezone} onChange={onChange} options={['UTC', 'Africa/Cairo', 'Europe/London']} /></div></div><Button className="mt-6" loading={loading} type="submit">Create Store</Button></form>;
}

function MvpWelcomeStep({ onBack, onFinish }) {
  return <div className="integration-step text-center"><div className="text-left"><Back onClick={onBack} /></div><span className="text-xs font-semibold text-blue-600">Store Setup: Complete</span><div className="integration-icon"><CheckCircle2 /></div><h1 className="integration-title">Welcome to AICommerce</h1><p className="integration-copy">Your custom store is ready. From your dashboard, upload an OpenAPI schema and FAQs, then install the widget when it is ready.</p><button type="button" onClick={onFinish} className="integration-connect integration-finish">Open Merchant Dashboard</button><div className="integration-benefits"><div><ShoppingCart /><span>Upload OpenAPI schema</span></div><div><Package /><span>Add FAQs</span></div><div><BarChart3 /><span>Install your widget</span></div></div></div>;
}

const initialStore = { name: '', description: '', platform: 'custom', shopDomain: '', currency: 'USD', language: 'en', timezone: 'UTC' };

const messageFor = (error, fallback) => {
  const data = error.response?.data;
  const validationMessages = data?.errors && Object.values(data.errors).flat().filter(Boolean);
  return validationMessages?.join(' ') || data?.message || data?.title || error.message || fallback;
};

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedStep = Number(searchParams.get('step'));
  const [step, setStep] = useState(() => ([1, 2, 3, 4, 5].includes(requestedStep) ? requestedStep : (localStorage.getItem('token') ? 3 : 1)));
  const [register, setRegister] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [login, setLogin] = useState({ email: '', password: '' });
  const [store, setStore] = useState(initialStore);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (step !== 3 || plans.length) return;

    let isActive = true;

    const loadPlans = async () => {
      setPlansLoading(true);
      setError('');

      try {
        const { data } = await api.get('/api/admin/plans');
        if (!isActive) return;
        setPlans(Array.isArray(data) ? data : []);
      } catch (requestError) {
        if (!isActive) return;
        setError(messageFor(requestError, 'Could not load subscription plans.'));
      } finally {
        if (isActive) setPlansLoading(false);
      }
    };

    void loadPlans();

    return () => {
      isActive = false;
    };
  }, [step, plans.length]);

  const submitRegister = async (event) => {
    event.preventDefault();
    if (register.password !== register.confirmPassword) return setError('Passwords do not match.');
    const [firstName, ...lastName] = register.name.trim().split(/\s+/);
    setLoading(true); setError('');
    try {
      await api.post('/api/auth/register', { firstName, lastName: lastName.join(' '), email: register.email, password: register.password, confirmPassword: register.confirmPassword });
      setLogin({ email: register.email, password: register.password });
      setStep(2);
    } catch (requestError) { setError(messageFor(requestError, 'Could not create your account.')); }
    finally { setLoading(false); }
  };

  const submitLogin = async (event) => {
    event.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/api/auth/login', login);
      const token = data.token || data.accessToken;
      if (!token) throw new Error('Login completed without an access token.');
      localStorage.setItem('token', token);
      if (data.aiToken || data.aiAccessToken) localStorage.setItem('aiToken', data.aiToken || data.aiAccessToken);
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
      if (data.role) localStorage.setItem('userRole', data.role);
      setStep(3);
    } catch (requestError) { setError(messageFor(requestError, 'Invalid email or password.')); }
    finally { setLoading(false); }
  };

  const openPlan = async (plan) => {
    setLoading(true); setError('');
    try {
      const { data } = await api.get(`/api/admin/plans/${plan.id}`);
      setSelectedPlan(data);
    } catch (requestError) { setError(messageFor(requestError, 'Could not load plan details.')); }
    finally { setLoading(false); }
  };

  const subscribe = async () => {
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/api/seller/subscriptions/subscribe', { planId: selectedPlan.id });
      if (String(data?.status).toLowerCase() !== 'active') throw new Error('Subscription was not activated.');
      const params = new URLSearchParams({ plan: data?.planName || selectedPlan.planName || 'Your selected plan' });
      if (data?.invoiceNumber) params.set('invoice', data.invoiceNumber);
      if (data?.renewalDate) params.set('renewal', new Date(data.renewalDate).toLocaleDateString());
      if (data?.invoiceUrl) params.set('invoice_url', data.invoiceUrl);
      navigate(`/checkout/success?${params.toString()}`);
    } catch (requestError) { setError(messageFor(requestError, 'Could not activate this subscription.')); }
    finally { setLoading(false); }
  };

  const submitStore = async (event) => {
    event.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/api/stores', store);
      if (!data?.id) throw new Error('The store was created without a store ID.');
      localStorage.setItem('storeId', data.id);
      localStorage.setItem('currentStoreId', data.id);
      setStep(5);
    } catch (requestError) { setError(messageFor(requestError, 'Could not create the store.')); }
    finally { setLoading(false); }
  };

  const back = () => { setError(''); setStep((current) => Math.max(1, current - 1)); };
  const setField = (setter) => (event) => setter((current) => ({ ...current, [event.target.name]: event.target.value }));

  return (
    <main className="onboarding-shell min-h-screen text-slate-800">
      {step >= 3 && <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 sm:px-10"><h1 className="text-xl font-bold text-blue-700">Merchant Onboarding</h1><HelpCircle className="h-6 w-6 text-blue-700" /></header>}
      <section
        className={`onboarding-card mx-auto w-full px-8 py-12 sm:px-14 sm:py-16 ${step === 3 ? 'onboarding-plan-page onboarding-plans-card' : ''}`}
        style={{ maxWidth: step === 3 ? '1200px' : '1000px' }}
      >
        <Progress step={step} />
        {error && <p className="mb-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">{error}</p>}
        {step === 1 && <RegisterStep value={register} onChange={setField(setRegister)} onSubmit={submitRegister} loading={loading} />}
        {step === 2 && <LoginStep value={login} onChange={setField(setLogin)} onSubmit={submitLogin} loading={loading} onBack={back} />}
        {step === 3 && <PlansStep plans={plans} loading={plansLoading || loading} onSelect={openPlan} onBack={back} />}
        {step === 4 && <StoreStepCustom value={store} onChange={setField(setStore)} onSubmit={submitStore} loading={loading} onBack={back} />}
        {step === 5 && <MvpWelcomeStep onBack={back} onFinish={() => navigate('/merchant/dashboard')} />}
      </section>
      {selectedPlan && <PlanModal plan={selectedPlan} subscription={subscription} loading={loading} onClose={() => { setSelectedPlan(null); setSubscription(null); setError(''); }} onSubscribe={subscribe} onContinue={() => { setSelectedPlan(null); setSubscription(null); setStep(4); }} />}
    </main>
  );
}

function Progress({ step }) { return <><div className="mb-3 flex items-center justify-between text-sm"><span className="font-semibold text-blue-600">Step {step} of 5</span><span className="text-slate-500">{step * 20}% Complete</span></div><div className="mb-8 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-blue-600 transition-all" style={{ width: `${step * 20}%` }} /></div></>; }
function Button({ children, loading, ...props }) { return <button {...props} disabled={loading || props.disabled} className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 ${props.className || ''}`}>{loading && <Loader2 className="h-4 w-4 animate-spin" />}{children}</button>; }
function Back({ onClick }) { return <button type="button" onClick={onClick} className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"><ChevronLeft className="h-4 w-4" />Back</button>; }
function RegisterStep({ value, onChange, onSubmit, loading }) { return <form onSubmit={onSubmit}><h1 className="text-2xl font-bold">Create your account</h1><p className="mt-2 mb-6 text-sm text-slate-500">Start setting up your AICommerce store.</p><Fields fields={[['name', 'Full name', 'text'], ['email', 'Email address', 'email'], ['password', 'Password', 'password'], ['confirmPassword', 'Confirm password', 'password']]} value={value} onChange={onChange} /><Button loading={loading} type="submit">Create Account</Button></form>; }
function LoginStep({ value, onChange, onSubmit, loading, onBack }) { return <form onSubmit={onSubmit}><Back onClick={onBack} /><h1 className="text-2xl font-bold">Log in</h1><p className="mt-2 mb-6 text-sm text-slate-500">Log in to choose a subscription plan.</p><Fields fields={[['email', 'Email address', 'email'], ['password', 'Password', 'password']]} value={value} onChange={onChange} /><Button loading={loading} type="submit">Log In</Button></form>; }
function Fields({ fields, value, onChange }) { return <div className="space-y-4">{fields.map(([name, label, type]) => <label key={name} className="block text-sm font-medium text-slate-700">{label}<input required name={name} type={type} value={value[name]} onChange={onChange} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" /></label>)}</div>; }
function PlansStep({ plans, loading, onSelect, onBack }) { return <div><Back onClick={onBack} /><h1 className="text-2xl font-bold">Choose a subscription plan</h1><p className="mt-2 mb-6 text-sm text-slate-500">Select a plan to view its complete details.</p>{loading ? <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-600" /></div> : <div className="grid gap-3">{plans.map((plan) => <button type="button" key={plan.id} onClick={() => onSelect(plan)} className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-600 hover:shadow-sm"><div className="flex items-start justify-between gap-4"><h2 className="font-bold">{plan.planName}</h2><span className="font-semibold text-blue-600">${plan.planPrice}/mo</span></div><p className="mt-2 text-sm text-slate-500">{plan.numOfTokens.toLocaleString()} tokens</p><ul className="mt-3 space-y-1 text-sm text-slate-600">{(plan.features || []).slice(0, 3).map((feature) => <li key={feature.featureId} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-blue-600" />{feature.featureName}</li>)}</ul></button>)}{!plans.length && <p className="py-8 text-center text-sm text-slate-500">No subscription plans are available right now.</p>}</div>}</div>; }
function PlanModal({ plan, subscription, loading, onClose, onSubscribe, onContinue }) { const active = subscription?.status === 'Active'; return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"><div className="onboarding-plan-modal max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"><button type="button" onClick={onClose} className="float-right rounded p-1 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>{active ? <div className="text-center"><CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" /><h2 className="mt-4 text-2xl font-bold">Subscription confirmed</h2><p className="mt-3 text-slate-600"><b>{subscription.planName}</b> — ${subscription.planPrice}/mo</p><p className="mt-1 text-sm text-slate-500">Renewal date: {new Date(subscription.renewalDate).toLocaleDateString()}</p><Button className="mt-7" onClick={onContinue}>Continue to Store Setup</Button></div> : <><h2 className="text-2xl font-bold">{plan.planName}</h2><p className="mt-2 text-slate-600">{plan.planDescription}</p><div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm"><b>{plan.numOfTokens.toLocaleString()} tokens</b>{plan.aiModels?.length > 0 && <p className="mt-2 text-slate-600">AI models: {plan.aiModels.join(', ')}</p>}</div><h3 className="mt-5 font-semibold">Included features</h3><div className="mt-3 space-y-3">{(plan.features || []).map((feature) => <div key={feature.featureId} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" /><div><p className="text-sm font-medium">{feature.featureName}</p><p className="text-xs text-slate-500">{feature.featureDescription}</p></div></div>)}</div><Button className="mt-6" loading={loading} onClick={onSubscribe}>Subscribe to this Plan</Button></>}</div></div>; }
function StoreStep({ value, onChange, onSubmit, loading, onBack }) { return <form onSubmit={onSubmit}><Back onClick={onBack} /><div className="mb-6 flex items-start justify-between"><div><h1 className="text-2xl font-bold">Create your store</h1><p className="mt-2 text-sm text-slate-500">Add the details for your business.</p></div><span className="text-xs font-medium text-blue-600">Store Setup: 1 of 2</span></div><div className="space-y-4"><label className="block text-sm font-medium">Store Name<input required name="name" value={value.name} onChange={onChange} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5" /></label><label className="block text-sm font-medium">Description<textarea required name="description" rows="3" value={value.description} onChange={onChange} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5" /></label><label className="block text-sm font-medium">Platform<select required name="platform" value={value.platform} onChange={onChange} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5"><option value="">Select platform</option><option value="shopify">Shopify</option><option value="woocommerce">WooCommerce</option><option value="custom">Custom</option><option value="none">None</option></select></label><label className="block text-sm font-medium">Shop Domain<input required name="shopDomain" placeholder="store.example.com" value={value.shopDomain} onChange={onChange} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5" /></label><div className="grid grid-cols-1 gap-4 sm:grid-cols-3"><Select name="currency" label="Currency" value={value.currency} onChange={onChange} options={['USD', 'EGP', 'EUR', 'GBP']} /><Select name="language" label="Language" value={value.language} onChange={onChange} options={['en', 'ar', 'fr']} /><Select name="timezone" label="Timezone" value={value.timezone} onChange={onChange} options={['UTC', 'Africa/Cairo', 'Europe/London']} /></div></div><Button className="mt-6" loading={loading} type="submit">Next</Button></form>; }
function Select({ name, label, value, onChange, options }) { return <label className="block text-sm font-medium">{label}<select name={name} value={value} onChange={onChange} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5">{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>; }
function IntegrationStep({ onBack, onFinish }) { return <div className="integration-step text-center"><div className="text-left"><Back onClick={onBack} /></div><span className="text-xs font-semibold text-blue-600">Store Setup: 2 of 2</span><div className="integration-icon"><Plug /></div><h1 className="integration-title">Connect Your E-commerce Store</h1><p className="integration-copy">Connect your existing store when you're ready. We'll securely sync your products, orders, and sales data in one place.</p><button disabled className="integration-connect">Connect a store</button><button type="button" onClick={onFinish} className="integration-skip">Skip for now and open dashboard</button><div className="integration-benefits"><div><ShoppingCart /><span>Products</span></div><div><Package /><span>Orders</span></div><div><BarChart3 /><span>Sales insights</span></div></div></div>; }
