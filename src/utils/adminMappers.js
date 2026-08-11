// adminMappers.js - copied from backup

const INITIALS_BACKGROUNDS = [
  'bg-primary/5 text-primary',
  'bg-secondary/5 text-secondary',
  'bg-tertiary/5 text-tertiary',
  'bg-error/5 text-error',
];

const PLATFORM_ICONS = {
  shopify: 'shopping_cart',
  woocommerce: 'shopping_bag',
  magento: 'store',
  bigcommerce: 'local_mall',
  commerce: 'storefront',
};

const PLATFORM_COLORS = ['bg-primary', 'bg-secondary-container', 'bg-tertiary-fixed', 'bg-primary/60'];

const FEATURE_ICON_POOL = ['psychology', 'webhook', 'support_agent', 'inventory_2', 'local_shipping', 'auto_awesome'];
const FEATURE_ICON_BG_POOL = [
  'bg-primary/5 text-primary',
  'bg-secondary-container/20 text-secondary',
  'bg-tertiary-fixed/30 text-tertiary',
];

function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value ?? 0);
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function formatPercent(value) {
  return `${Number(value ?? 0).toFixed(1)}%`;
}

function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function formatDateTime(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function hashString(value = '') {
  return value.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

export function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '??';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function getInitialsBg(seed = '') {
  return INITIALS_BACKGROUNDS[hashString(seed) % INITIALS_BACKGROUNDS.length];
}

function normalizeStatus(status = 'Active') {
  return status.toLowerCase();
}

function planBadgeClass(planName = '') {
  const normalized = planName.toLowerCase();
  if (normalized.includes('enterprise')) return 'bg-tertiary-fixed text-tertiary';
  if (normalized.includes('pro')) return 'bg-primary/10 text-primary';
  return 'bg-[#d3e4fe] text-on-surface-variant';
}

function getPlatformIcon(platform = '') {
  return PLATFORM_ICONS[platform.toLowerCase()] ?? 'storefront';
}

export function mapDashboardOverview(data) {
  const kpis = data?.kpis ?? {};
  const sentimentOverview = data?.sentimentOverview ?? {};
  const aiHealth = data?.aiHealth ?? {};

  const kpiCards = [
    {
      label: 'Total Active Stores',
      value: formatNumber(kpis.activeStores ?? kpis.totalStores ?? data?.totalStores),
      change: `${kpis.storeGrowthPercent ?? 0}%`,
      icon: 'storefront',
      iconBg: 'bg-primary/10 text-primary',
    },
    {
      label: 'AI Conversations',
      value: formatNumber(kpis.totalConversations ?? data?.totalConversations),
      change: `${kpis.conversationGrowthPercent ?? 0}%`,
      icon: 'forum',
      iconBg: 'bg-secondary/10 text-secondary',
    },
    {
      label: 'MRR',
      value: formatCurrency(kpis.monthlyRecurringRevenue ?? data?.monthlyRecurringRevenue),
      change: `${kpis.activeSubscriptions ?? data?.activeSubscriptions ?? 0} active`,
      icon: 'payments',
      iconBg: 'bg-primary-fixed text-primary',
    },
    {
      label: 'Positive Sentiment',
      value: formatPercent(sentimentOverview.positive_pct ?? sentimentOverview.positivePct ?? kpis.aiConversionRate),
      badge: aiHealth.status ?? (kpis.highIntentMessages > 0 ? 'High Intent' : undefined),
      icon: 'bolt',
      iconBg: 'bg-tertiary-fixed text-tertiary',
      highlight: Boolean(kpis.highIntentMessages || sentimentOverview.total),
      iconFill: true,
    },
  ];

  const platformBreakdown = (data?.platformDistribution ?? []).map((item, index) => ({
    label: item.label,
    color: PLATFORM_COLORS[index % PLATFORM_COLORS.length],
    pct: `${item.percentage ?? 0}%`,
  }));

  const intents = mapTopIntents(data?.topIntents);
  const sentiment = mapSentimentBreakdown(data?.sentimentBreakdown);
  const recentStores = (data?.recentStores ?? []).map(mapStoreToRecent);

  return {
    kpiCards,
    platformBreakdown,
    totalStores: kpis.totalStores ?? kpis.activeStores ?? data?.totalStores ?? 0,
    trend: data?.revenueConversationTrend ?? [],
    intents,
    sentiment,
    recentStores,
    healthGauges: mapMongoHealth(data?.mongoHealth),
  };
}

export function mapTopIntents(intents = []) {
  if (!intents.length) {
    return [{ label: 'No intent data yet', value: 0, barClass: 'bg-primary/20' }];
  }

  const maxValue = Math.max(...intents.map((item) => item.count ?? item.percentage ?? 0), 1);

  return intents.map((item, index) => {
    const rawValue = item.percentage ?? item.count ?? 0;
    const value =
      item.percentage !== undefined
        ? rawValue
        : Math.round((rawValue / maxValue) * 100);

    return {
      label: item.label,
      value,
      barClass: index % 2 === 0 ? 'bg-primary' : 'bg-primary/70',
    };
  });
}

export function mapSentimentBreakdown(items = []) {
  if (!items.length) {
    return [
      { pct: '0%', height: '8%', color: 'bg-secondary', icon: 'sentiment_very_satisfied', textColor: 'text-secondary' },
      { pct: '0%', height: '8%', color: 'bg-[#cbdbf5]', icon: 'sentiment_neutral', textColor: 'text-outline' },
      { pct: '0%', height: '8%', color: 'bg-error', icon: 'sentiment_very_dissatisfied', textColor: 'text-error' },
    ];
  }

  const sentimentMeta = [
    { key: 'positive', color: 'bg-secondary', icon: 'sentiment_very_satisfied', textColor: 'text-secondary' },
    { key: 'neutral', color: 'bg-[#cbdbf5]', icon: 'sentiment_neutral', textColor: 'text-outline' },
    { key: 'negative', color: 'bg-error', icon: 'sentiment_very_dissatisfied', textColor: 'text-error' },
  ];

  return sentimentMeta.map((meta) => {
    const match =
      items.find((item) => item.label?.toLowerCase() === meta.key) ??
      items.find((item) => item.label?.toLowerCase().includes(meta.key));

    const percentage = match?.percentage ?? match?.count ?? 0;

    return {
      pct: `${percentage}%`,
      height: `${Math.max(percentage, 8)}%`,
      color: meta.color,
      icon: meta.icon,
      textColor: meta.textColor,
    };
  });
}

export function mapStoreToMerchant(store) {
  const displayName = store.sellerName || store.name;

  return {
    id: store.id,
    initials: getInitials(displayName),
    initialsBg: getInitialsBg(displayName),
    name: store.name,
    platform: store.platform,
    platformIcon: getPlatformIcon(store.platform),
    email: store.sellerEmail,
    plan: {
      label: store.activePlan || 'No Plan',
      className: planBadgeClass(store.activePlan),
    },
    domain: store.shopDomain,
    status: normalizeStatus(store.status),
    subscriptionStatus: store.subscriptionStatus,
  };
}

export function mapStoreToRecent(store) {
  return {
    id: store.id,
    name: store.name,
    logo: null,
    platform: store.platform,
    plan: {
      label: store.activePlan || 'No Plan',
      className: planBadgeClass(store.activePlan),
    },
    status: normalizeStatus(store.status),
  };
}

export function mapSubscriptionMetrics(summary = {}) {
  return [
    {
      label: 'Total Monthly Revenue',
      value: formatCurrency(summary.monthlyRecurringRevenue),
      icon: 'payments',
      iconBg: 'bg-secondary-container/10 text-secondary',
      accentBar: 'bg-secondary/20 group-hover:bg-secondary',
    },
    {
      label: 'Active Subscriptions',
      value: formatNumber(summary.activeSubscriptions),
      icon: 'groups',
      iconBg: 'bg-primary-container/10 text-primary',
      accentBar: 'bg-primary/20 group-hover:bg-primary',
    },
    {
      label: 'Total Plans',
      value: formatNumber(summary.totalPlans),
      icon: 'trending_up',
      iconBg: 'bg-[#dce9ff] text-on-surface-variant',
      accentBar: 'bg-primary/20 group-hover:bg-primary',
    },
  ];
}

export function mapPlanToCard(plan, allFeatures = []) {
  const featureLookup = new Map(allFeatures.map((feature) => [feature.id, feature]));

  const features = (plan.featureIds ?? []).map((featureId) => ({
    label: featureLookup.get(featureId)?.name ?? featureId,
    included: true,
  }));

  if (!features.length && allFeatures.length) {
    allFeatures.slice(0, 4).forEach((feature) => {
      features.push({
        label: feature.name,
        included: (plan.featureIds ?? []).includes(feature.id),
      });
    });
  }

  return {
    id: plan.id,
    name: plan.planName,
    description: plan.planDescription,
    price: plan.planPrice,
    users: plan.activeSubscriptions ?? 0,
    popular: plan.planStatus === 'Active' && (plan.activeSubscriptions ?? 0) > 0,
    userBadgeClass: 'bg-surface-container text-on-surface-variant',
    status: plan.planStatus,
    featureIds: plan.featureIds ?? [],
    features: features.length ? features : [{ label: 'No linked features', included: false }],
  };
}

export function mapPlanDetails(plan = {}, allFeatures = []) {
  // Extract feature IDs from plan.features array or plan.featureIds array
  const planFeatureIds = (plan.features ?? [])
    .map((f) => f.featureId || f.id)
    .concat(plan.featureIds ?? []);

  const uniquePlanFeatureIds = Array.from(new Set(planFeatureIds.filter(Boolean)));

  const includedFeatures = allFeatures.map((feature) => ({
    id: feature.id,
    label: feature.name || feature.featureName || 'Unnamed Feature',
    description: feature.description || feature.featureDescription || '',
    enabled: uniquePlanFeatureIds.includes(feature.id),
  }));

  const planName = plan.planName || plan.name || 'Untitled Plan';
  const planStatus = plan.planStatus || plan.status || 'Active';

  return {
    id: plan.id,
    name: planName,
    shortName: planName,
    price: plan.planPrice ?? plan.price ?? 0,
    developmentPrice: plan.developmentprice ?? plan.developmentPrice ?? 0,
    description: plan.planDescription || plan.description || '',
    status: planStatus,
    aiModels: Array.isArray(plan.aiModels) && plan.aiModels.length ? plan.aiModels : ['gpt-4o-mini'],
    featureIds: uniquePlanFeatureIds,
    includedFeatures,
    metrics: {
      subscribers: {
        value: formatNumber(plan.activeSubscriptions ?? 0),
        change: String(planStatus).toLowerCase() === 'active' ? 'Active' : 'Inactive',
      },
      churn: { value: '—', change: planStatus, positive: false },
      mrr: {
        value: formatCurrency((plan.planPrice ?? plan.price ?? 0) * (plan.activeSubscriptions ?? 0)),
        suffix: '/mo',
      },
    },
    aiRecommendation: 'Review linked features, AI models, and pricing to optimize plan performance.',
    performanceData: [],
    accessLogs: [],
  };
}

export function mapSubscriptionRow(subscription) {
  const email = subscription.sellerEmail ?? 'Unknown seller';
  const initial = email.charAt(0).toUpperCase();

  return {
    id: subscription.id,
    merchant: {
      name: email,
      initial,
      initialBg: getInitialsBg(email),
    },
    plan: subscription.planName ?? '—',
    status: subscription.status?.toLowerCase() === 'active' ? 'successful' : 'failed',
    date: formatDate(subscription.createdAt ?? subscription.renewalDate),
    amount: formatCurrency(subscription.planPrice),
    actionIcon: subscription.status?.toLowerCase() === 'active' ? 'receipt' : 'priority_high',
  };
}

export function mapFeatureMetrics(features = []) {
  const enabledCount = features.filter(
    (feature) => feature.enabled === true
  ).length;

  return [
    {
      label: 'Total Features',
      value: String(features.length),
      icon: 'featured_play_list',
      iconBg: 'bg-primary/10 text-primary',
    },
    {
      label: 'Enabled Features',
      value: String(enabledCount),
      icon: 'rocket_launch',
      iconBg: 'bg-secondary-container/20 text-secondary',
    },
    {
      label: 'Disabled Features',
      value: String(features.length - enabledCount),
      icon: 'auto_awesome',
      iconBg: 'bg-tertiary-fixed-dim/20 text-tertiary',
    },
  ];
}

export function mapFeatureRow(feature) {
  return {
    id: feature.id,
    name: feature.name,
    subtitle: feature.description,
    description: feature.description,
    status: feature.enabled === true ? 'Active' : 'Inactive',
  };
}

export function mapAiAnalytics(data) {
  const sentiment = data?.sentimentOverview ?? {};
  const providers = Array.isArray(data?.providers) ? data.providers : [];
  const models = Array.isArray(data?.models) ? data.models : [];
  const intents = (data?.topIntents ?? []).map((item, index) => {
    const maxCount = Math.max(...(data.topIntents ?? []).map((entry) => entry.count ?? 0), 1);
    const height = `${Math.max(Math.round(((item.count ?? 0) / maxCount) * 100), 10)}%`;

    return {
      label: item.label,
      height,
      tooltip: String(item.count ?? 0),
    };
  });

  const sentimentCategories = (data?.productStats?.topCategories ?? []).map((category) => ({
    label: category.label,
    positive: category.percentage ?? 0,
    neutral: Math.max(0, 100 - (category.percentage ?? 0) - 5),
    negative: 5,
  }));

  return {
    intents: intents.length ? intents : [{ label: 'No intents yet', height: '10%', tooltip: '0' }],
    sentimentCategories: sentimentCategories.length
      ? sentimentCategories
      : [{ label: 'No category data', positive: 0, neutral: 0, negative: 0 }],
    healthGauges: mapMongoHealth(data?.mongoHealth),
    serviceStatus: [
      ...mapMongoHealthToServices(data?.mongoHealth),
      {
        service: 'AI Service',
        status: data?.aiHealth?.status ? String(data.aiHealth.status) : 'Unknown',
        latency: data?.aiHealth?.latency_ms !== undefined ? `${data.aiHealth.latency_ms}ms` : '—',
        uptime: data?.aiHealth?.provider ? `Provider: ${data.aiHealth.provider}` : '—',
        icon: 'psychology',
      },
    ],
    conversionRate: data?.conversionRate ?? 0,
    totalMessages: data?.totalMessages ?? 0,
    sentimentTotal: sentiment.total ?? 0,
    sentimentBreakdown: [
      { label: 'Positive', value: sentiment.positive_pct ?? sentiment.positivePct ?? 0, count: sentiment.positive_count ?? sentiment.positiveCount ?? 0 },
      { label: 'Neutral', value: sentiment.neutral_pct ?? sentiment.neutralPct ?? 0, count: sentiment.neutral_count ?? sentiment.neutralCount ?? 0 },
      { label: 'Negative', value: sentiment.negative_pct ?? sentiment.negativePct ?? 0, count: sentiment.negative_count ?? sentiment.negativeCount ?? 0 },
    ],
    providerCount: providers.length,
    modelCount: models.length,
  };
}

export function mapMongoHealth(mongoHealth) {
  if (!mongoHealth) {
    return [
      { label: 'API Latency', value: '—', sub: 'Awaiting health data', icon: 'timer', accent: 'text-primary bg-primary/10' },
      { label: 'AI Service', value: 'Unknown', sub: 'No analytics data', icon: 'psychology', accent: 'text-secondary bg-secondary/10' },
      { label: 'DB Load', value: '—', sub: 'No connection data', icon: 'database', accent: 'text-on-surface-variant bg-[#dce9ff]', progress: 0 },
    ];
  }

  const isHealthy = mongoHealth.ok === 1 || mongoHealth.status === 'connected';

  return [
    {
      label: 'Mongo Latency',
      value: `${mongoHealth.latencyMs ?? '—'}ms`,
      sub: mongoHealth.database ? `Database: ${mongoHealth.database}` : 'Cluster status',
      icon: 'timer',
      accent: 'text-primary bg-primary/10',
    },
    {
      label: 'MongoDB',
      value: isHealthy ? 'Connected' : 'Degraded',
      sub: mongoHealth.checkedAt ? `Checked ${formatDateTime(mongoHealth.checkedAt)}` : 'Health check',
      icon: 'psychology',
      accent: 'text-secondary bg-secondary/10',
    },
    {
      label: 'DB Status',
      value: mongoHealth.status ?? 'Unknown',
      sub: mongoHealth.database ?? 'ai_commerce',
      icon: 'database',
      accent: 'text-on-surface-variant bg-[#dce9ff]',
      progress: isHealthy ? 32 : 72,
    },
  ];
}

function mapMongoHealthToServices(mongoHealth) {
  if (!mongoHealth) {
    return [{ service: 'MongoDB Atlas', status: 'Unknown', latency: '—', uptime: '—', icon: 'database' }];
  }

  const isHealthy = mongoHealth.ok === 1 || mongoHealth.status === 'connected';

  return [
    {
      service: 'MongoDB Atlas',
      status: isHealthy ? 'Healthy' : 'Degraded',
      latency: `${mongoHealth.latencyMs ?? '—'}ms`,
      uptime: isHealthy ? '99.99%' : '—',
      icon: 'database',
    },
  ];
}

export function mapAuditLogs(logs = []) {
  return logs.map((log) => ({
    id: log.id,
    time: formatDateTime(log.createdAt ?? log.created_at ?? log.timestamp),
    source: log.userId || log.user_id ? `User ${(log.userId ?? log.user_id).slice(0, 8)}` : 'System',
    activity: log.action,
    status: log.outcome ?? 'Success',
    statusClass: String(log.outcome ?? 'success').toLowerCase() === 'success' ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error',
    ipAddress: log.ipAddress,
    storeId: log.store_id ?? log.storeId,
    resource: log.resource,
    userAgent: log.userAgent,
  }));
}
