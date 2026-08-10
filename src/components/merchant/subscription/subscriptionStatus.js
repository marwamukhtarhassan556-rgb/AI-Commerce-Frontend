export const normalizeSubscription = (data = {}) => {
  const status = String(data.status || '').toLowerCase();
  const rawDays = data.remainingDays ?? data.trialDays ?? data.daysLeft ?? data.trialRemainingDays ?? data.remainingTrialDays ?? 0;
  const remainingDays = Number(rawDays);
  const hasRemainingTrialDays = Number.isFinite(remainingDays) && remainingDays > 0;
  const isTrialing = data.isInTrial === true || data.isTrialActive === true || status === 'trialing' || status === 'trial' || status === 'free_trial' || status === 'freetrial' || hasRemainingTrialDays;
  const isActive = (data.hasActiveSubscription === true || status === 'active' || status === 'subscribed') && !isTrialing;
  const isExpired = data.isTrialExpired === true || status === 'expired' || status === 'cancelled' || status === 'canceled';

  return {
    ...data,
    planName: data.planName || data.name || (isTrialing ? 'Free Trial' : isActive ? 'Active Subscription' : 'Expired Plan'),
    status: isTrialing ? 'trialing' : status || (isExpired ? 'expired' : 'trialing'),
    remainingDays: Number.isFinite(remainingDays) ? Math.max(0, Math.ceil(remainingDays)) : (isTrialing ? 0 : 0),
    isTrialing,
    isActive,
    isExpired,
    canStartTrial: data.canStartTrial ?? (!isTrialing && !isActive && !isExpired),
    canUsePaidFeatures: data.canUsePaidFeatures ?? (isTrialing || isActive),
  };
};
