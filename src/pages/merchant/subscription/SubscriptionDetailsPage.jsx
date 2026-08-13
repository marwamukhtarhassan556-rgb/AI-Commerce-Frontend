import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Clock3, CreditCard, Loader2 } from 'lucide-react';
import { subscriptionsApi } from '../../../api/integrationApi';
import { normalizeSubscription } from '../../../components/merchant/subscription/subscriptionStatus';

const formatDate = (value) => {
  if (!value) return 'Not available yet';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not available yet';
  return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
};

export default function SubscriptionDetailsPage() {
  const [subscription, setSubscription] = useState(null);
  const [error, setError] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancellationRequested, setCancellationRequested] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const { data } = await subscriptionsApi.getCurrent();
        let trialData = {};
        if (String(data?.status || '').toLowerCase() === 'trial') {
          try { const response = await subscriptionsApi.getTrialStatus(); trialData = response.data || {}; } catch { /* plan information can still be shown */ }
        }
        if (active) setSubscription(normalizeSubscription({ ...data, ...trialData }));
      } catch {
        if (active) setError('We could not load your subscription details right now. Please try again shortly.');
      }
    };
    void load();
    return () => { active = false; };
  }, []);

  if (!subscription && !error) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;

  const isTrial = subscription?.isTrialing;
  const isExpired = subscription?.isExpired;
  const renewalDate = formatDate(isTrial ? subscription?.trialEndDate : (subscription?.renewalDate || subscription?.renewDate));
  const billingLabel = isTrial ? 'Trial ends' : isExpired ? 'Subscription ended' : 'Next billing date';
  const statusLabel = isTrial ? 'Free trial' : isExpired ? 'Expired' : 'Active subscription';
  const cancelSubscription = async () => {
    setIsCancelling(true);
    setError('');
    try {
      await subscriptionsApi.cancel();
      setCancellationRequested(true);
      setShowCancelDialog(false);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'We could not cancel your subscription. Please try again.');
      setShowCancelDialog(false);
    } finally { setIsCancelling(false); }
  };

  return <div className="subscription-page">
    <div className="flex items-start gap-3"><span className="rounded-xl bg-blue-100 p-3 text-blue-700"><CreditCard className="h-6 w-6" /></span><div><h1 className="text-3xl font-extrabold tracking-tight">Subscription</h1><p className="mt-1 text-sm text-slate-500">Your current plan and billing information.</p></div></div>

    {error ? <section className="subscription-page__empty-state mt-8"><div className="subscription-page__empty-icon"><CreditCard className="h-6 w-6" /></div><div><h2>You do not have an active plan yet</h2><p>Choose a plan to unlock your store's AI features, widget access, and usage allowance. You can change your plan later.</p><Link to="/onboarding?step=3" className="subscription-page__pay-action">Choose a plan</Link></div></section> : <>
      {isExpired && <div className="mt-7 flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-3"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" /><div><h2 className="font-bold text-amber-950">Your trial has ended</h2><p className="mt-1 text-sm text-amber-800">Choose a plan, then continue securely to payment.</p></div></div><Link to="/onboarding?step=3" className="inline-flex shrink-0 items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700">Choose a plan & pay</Link></div>}

      <section className="subscription-page__card"><div className="subscription-page__card-header"><h2 className="text-lg font-bold">Current subscription</h2><p className="mt-1 text-sm text-slate-500">These details update from your subscription.</p></div><dl className="subscription-page__details"> <Row label="Current plan" value={subscription.planName || '—'} /><Row label="Status" value={<span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${isExpired ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>{isExpired ? <AlertCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}{statusLabel}</span>} /><Row label="Plan price" value={subscription.planPrice != null ? `$${subscription.planPrice} / month` : '—'} />{isTrial && <Row label="Days remaining" value={`${subscription.remainingDays} ${subscription.remainingDays === 1 ? 'day' : 'days'}`} />}<Row label={billingLabel} value={<span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-slate-400" />{renewalDate}</span>} /></dl></section>
      <section className="subscription-page__card subscription-page__action-card">{isTrial && <Link to="/onboarding?step=3" className="subscription-page__pay-action">Choose a plan & pay now</Link>}{!isTrial && !isExpired && <><div><h2 className="text-base font-bold">Your subscription is active</h2><p className="mt-1 text-sm text-slate-500">{cancellationRequested ? 'Your cancellation request was sent. You can choose a plan and subscribe again at any time.' : `Your plan is scheduled to renew automatically on ${renewalDate}.`}</p></div><div className="subscription-page__action-buttons">{cancellationRequested ? <Link to="/onboarding?step=3" className="subscription-page__pay-action">Choose a plan & pay</Link> : <><Link to="/onboarding?step=3" className="subscription-page__change-action">Change plan</Link><button type="button" onClick={() => setShowCancelDialog(true)} className="subscription-page__cancel-action">Cancel subscription</button></>}</div></>}{isExpired && <><div><h2 className="text-base font-bold">Ready to continue?</h2><p className="mt-1 text-sm text-slate-500">Select the plan that fits your store, then complete payment securely.</p></div><Link to="/onboarding?step=3" className="subscription-page__pay-action">Choose a plan & pay</Link></>}</section>
    </>}
    {showCancelDialog && <div className="subscription-cancel-overlay"><div role="dialog" aria-modal="true" aria-labelledby="cancel-subscription-title" className="subscription-cancel-dialog"><h2 id="cancel-subscription-title">Cancel subscription?</h2><p>This will send a cancellation request and prevent future renewal according to your billing policy. Your current payment will not be refunded.</p><div className="subscription-cancel-dialog__actions"><button type="button" disabled={isCancelling} onClick={() => setShowCancelDialog(false)} className="subscription-cancel-dialog__keep">Keep subscription</button><button type="button" disabled={isCancelling} onClick={cancelSubscription} className="subscription-cancel-dialog__confirm">{isCancelling ? 'Cancelling…' : 'Yes, cancel subscription'}</button></div></div></div>}
  </div>;
}

function Row({ label, value }) { return <div className="subscription-page__row"><dt className="text-sm text-slate-500">{label}</dt><dd className="text-sm font-semibold text-slate-900">{value}</dd></div>; }
