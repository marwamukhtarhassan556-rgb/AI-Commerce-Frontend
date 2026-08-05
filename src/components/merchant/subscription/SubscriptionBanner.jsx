import { useEffect, useState } from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { subscriptionsApi } from '../../../api/integrationApi';
import { normalizeSubscription } from './subscriptionStatus';

export default function SubscriptionBanner() {
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    let mounted = true;
    subscriptionsApi.getCurrent()
      .then(({ data }) => mounted && setSubscription(normalizeSubscription(data)))
      .catch(() => {
        // Keep the merchant area usable until the new endpoint is available.
      });
    return () => { mounted = false; };
  }, []);

  if (!subscription || subscription.isActive) return null;

  if (subscription.isTrialing) {
    const lastDay = subscription.remainingDays <= 1;
    return <Banner tone={lastDay ? 'amber' : 'blue'} icon={<Clock3 className="h-5 w-5" />}>
      <div><b>{lastDay ? 'Your free trial ends today' : 'Free trial active'}</b><p>{subscription.remainingDays} {subscription.remainingDays === 1 ? 'day' : 'days'} left in your trial.</p></div>
      <Link to="/onboarding?step=3" className="inline-flex shrink-0 items-center justify-center gap-1 rounded-lg bg-white/80 px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white">View plans <ArrowRight className="h-4 w-4" /></Link>
    </Banner>;
  }

  if (subscription.isExpired) {
    return <Banner tone="slate" icon={<AlertTriangle className="h-5 w-5" />}>
      <div><b>Your free trial has ended</b><p>Choose a plan to keep using paid features.</p></div>
      <Link to="/onboarding?step=3" className="inline-flex shrink-0 items-center justify-center gap-1 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100">Choose a plan <ArrowRight className="h-4 w-4" /></Link>
    </Banner>;
  }

  return null;
}

function Banner({ tone, icon, children }) {
  const styles = {
    blue: 'border-blue-200 bg-blue-50 text-blue-950',
    amber: 'border-amber-300 bg-amber-50 text-amber-950',
    slate: 'border-slate-300 bg-slate-50 text-slate-900',
  };
  return <div className={`subscription-banner flex flex-col gap-3 border px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${styles[tone]}`}>
    <div className="flex items-start gap-3"><span className="mt-0.5 shrink-0">{icon}</span><div className="text-sm"><div className="flex items-center gap-2">{children[0]}</div></div></div>
    {children[1]}
  </div>;
}
