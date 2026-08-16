import { useEffect, useState } from 'react';
import { BarChart3, Bot, CalendarDays, Coins, Loader2, MessageSquare, RefreshCw } from 'lucide-react';
import { analyticsApi } from '../../../api/integrationApi';
import { getUserErrorMessage } from '../../../utils/errorMessage';

const number = (value) => Number(value || 0).toLocaleString();
const date = (value) => value ? new Date(value).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Not available';

export default function AIUsagePage() {
  const [storeId] = useState(() => localStorage.getItem('currentStoreId') || localStorage.getItem('storeId') || '');
  const [usage, setUsage] = useState(null);
  const [limit, setLimit] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(Boolean(storeId));
  const [error, setError] = useState(storeId ? '' : 'Select a store before viewing AI usage.');

  const load = async () => {
    if (!storeId) return;
    setLoading(true); setError('');
    try {
      const [usageResponse, limitResponse, planResponse] = await Promise.all([
        analyticsApi.getAIUsage(storeId),
        analyticsApi.getDailyMessageLimit(),
        analyticsApi.getSubscriptionPlan(),
      ]);
      setUsage(usageResponse.data);
      setLimit(limitResponse.data);
      setPlan(planResponse.data);
    } catch (requestError) { setError(getUserErrorMessage(requestError, 'We could not load your AI usage right now. Please try again.')); }
    finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, [storeId]);

  const tokens = usage?.tokens || {};
  const percentage = Math.min(100, Math.max(0, Number(tokens.percentage || 0)));
  return <div className="min-h-screen bg-surface p-6 text-on-surface lg:p-10"><div className="mx-auto max-w-6xl space-y-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary"><Bot className="h-4 w-4" />Your AI plan</p><h1 className="text-3xl font-extrabold tracking-tight">AI usage</h1><p className="mt-1 text-sm text-on-surface-variant">Monitor token usage, plan allowance, and customer message limits for your store.</p></div><button type="button" onClick={load} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant bg-white px-4 py-2.5 text-sm font-bold hover:bg-surface-container-low disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</button></div>{error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}{loading ? <div className="flex min-h-80 items-center justify-center rounded-2xl border border-outline-variant/40 bg-white"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div> : <><section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><Metric icon={<Coins />} label="Tokens used" value={number(tokens.used)} hint={`of ${number(tokens.limit)} tokens`} /><Metric icon={<Bot />} label="Tokens remaining" value={number(tokens.remaining)} hint={`${percentage.toFixed(1)}% of allowance used`} /><Metric icon={<MessageSquare />} label="AI requests" value={number(usage?.requests)} hint={`${number(usage?.completion_tokens)} completion tokens`} /><Metric icon={<BarChart3 />} label="AI cost" value={`$${Number(usage?.cost_usd || 0).toFixed(2)}`} hint={`${number(usage?.prompt_tokens)} prompt tokens`} /></section><section className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]"><div className="rounded-2xl border border-outline-variant/40 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="font-bold">Token allowance</h2><p className="mt-1 text-sm text-on-surface-variant">Your current billing-period consumption.</p></div><span className="text-lg font-extrabold text-primary">{percentage.toFixed(1)}%</span></div><div className="mt-6 h-3 overflow-hidden rounded-full bg-surface-container-high"><div className={`h-full rounded-full transition-all ${percentage >= 90 ? 'bg-red-500' : percentage >= 70 ? 'bg-amber-500' : 'bg-primary'}`} style={{ width: `${percentage}%` }} /></div><div className="mt-3 flex justify-between text-xs text-on-surface-variant"><span>{number(tokens.used)} used</span><span>{number(tokens.remaining)} remaining</span></div><div className="mt-6 grid gap-3 border-t border-outline-variant/30 pt-5 sm:grid-cols-2"><Detail label="Plan" value={usage?.plan || plan?.subscription_status || 'Not available'} /><Detail label="Subscription status" value={usage?.subscription_status || plan?.subscription_status || 'Not available'} /><Detail label="Billing period ends" value={date(usage?.billing_period?.ends_at || usage?.billing_period?.renewal_date)} /><Detail label="Plan renewal" value={date(plan?.renewal_date)} /></div></div><div className="rounded-2xl border border-outline-variant/40 bg-white p-6 shadow-sm"><div className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary" /><h2 className="font-bold">Customer message limit</h2></div><p className="mt-2 text-sm leading-6 text-on-surface-variant">This is the number of messages one customer may send to your storefront AI widget in a day.</p><p className="mt-6 text-4xl font-extrabold text-on-surface">{number(limit?.daily_allowed_message ?? usage?.consumer_daily_limit)}</p><p className="mt-1 text-sm text-on-surface-variant">messages per customer, per day</p><div className="mt-6 rounded-xl bg-surface-container-low p-4 text-xs text-on-surface-variant">Your plan allows up to <b className="text-on-surface">{number(usage?.consumer_daily_limit_max)}</b> messages. Update this limit in <b className="text-on-surface">My Store</b> whenever needed.</div></div></section></>}</div></div>;
}

function Metric({ icon, label, value, hint }) { return <article className="rounded-2xl border border-outline-variant/40 bg-white p-5 shadow-sm"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</div><p className="mt-4 text-xs font-bold uppercase tracking-wide text-on-surface-variant">{label}</p><p className="mt-1 text-2xl font-extrabold">{value}</p><p className="mt-1 text-xs text-on-surface-variant">{hint}</p></article>; }
function Detail({ label, value }) { return <div><p className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>; }
