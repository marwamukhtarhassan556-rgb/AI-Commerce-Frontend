import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { subscriptionsApi } from '../../../api/integrationApi';
import { normalizeSubscription } from '../../../components/merchant/subscription/subscriptionStatus';

export default function SubscriptionDetailsPage() {
  const [subscription, setSubscription] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    subscriptionsApi.getCurrent().then(({ data }) => setSubscription(normalizeSubscription(data)))
      .catch(() => setError('Subscription details will appear here once the subscription endpoint is available.'));
  }, []);

  return <div className="mx-auto max-w-3xl p-6 sm:p-8"><h1 className="text-3xl font-extrabold">Subscription</h1><p className="mt-2 text-sm text-slate-500">Manage your plan and billing status.</p>
    <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {error ? <><p className="text-sm text-slate-600">{error}</p><Link to="/onboarding?step=3" className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">View plans</Link></> : <dl className="divide-y divide-slate-100"> <Row label="Current plan" value={subscription?.planName || '—'} /><Row label="Status" value={subscription?.status || '—'} /><Row label="Trial days left" value={subscription?.isTrialing ? `${subscription.remainingDays} day(s)` : '—'} /><Row label="Renewal date" value={subscription?.renewDate || subscription?.renewalDate || '—'} /></dl>}
    </section>
  </div>;
}

function Row({ label, value }) { return <div className="flex items-center justify-between gap-5 py-4 text-sm"><dt className="text-slate-500">{label}</dt><dd className="font-semibold text-slate-900">{value}</dd></div>; }
