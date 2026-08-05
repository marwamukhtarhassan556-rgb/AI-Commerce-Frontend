export const normalizeSubscription = (data = {}) => {
  const status = String(data.status || '').toLowerCase();
  const remainingDays = Number(data.remainingDays ?? data.trialDays ?? 0);
  const isTrialing = data.isInTrial === true || status === 'trialing' || status === 'trial';
  const isActive = data.hasActiveSubscription === true || status === 'active';
  const isExpired = data.isTrialExpired === true || status === 'expired' || (!isTrialing && !isActive && Boolean(status));

  return {
    ...data,
    status,
    remainingDays: Number.isFinite(remainingDays) ? Math.max(0, Math.ceil(remainingDays)) : 0,
    isTrialing,
    isActive,
    isExpired,
    canStartTrial: data.canStartTrial ?? (!isTrialing && !isActive && !isExpired),
    canUsePaidFeatures: data.canUsePaidFeatures ?? (isTrialing || isActive),
  };
};
