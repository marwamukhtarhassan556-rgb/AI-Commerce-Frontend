import api from '../../api/client';
import {
  mapDashboardOverview,
  mapStoreToMerchant,
  mapSubscriptionMetrics,
  mapPlanToCard,
  mapPlanDetails,
  mapSubscriptionRow,
  mapFeatureMetrics,
  mapFeatureRow,
  mapAiAnalytics,
  mapAuditLogs,
} from '../../utils/adminMappers';
import {
  fetchAiAuditLogs,
  fetchAiHealth,
  fetchAiModels,
  fetchAiProviders,
  fetchSentimentOverview,
} from '../../api/aiService';

function readPagedItems(data, primaryKey) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[primaryKey])) return data[primaryKey];
  if (Array.isArray(data?.[primaryKey]?.items)) return data[primaryKey].items;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

export async function fetchDashboardOverview() {
  try {
    const [dashboardResult, sentimentResult, healthResult] = await Promise.allSettled([
      api.get('/api/admin/dashboard'),
      fetchSentimentOverview(),
      fetchAiHealth(),
    ]);
    const dashboard = dashboardResult.status === 'fulfilled' ? dashboardResult.value.data : {};
    const sentiment = sentimentResult.status === 'fulfilled' ? sentimentResult.value : null;
    const aiHealth = healthResult.status === 'fulfilled' ? healthResult.value : null;

    return mapDashboardOverview({
      ...dashboard,
      sentimentOverview: sentiment,
      aiHealth,
      sentimentBreakdown: sentiment
        ? [
            { label: 'positive', percentage: sentiment.positive_pct ?? sentiment.positivePct ?? 0 },
            { label: 'neutral', percentage: sentiment.neutral_pct ?? sentiment.neutralPct ?? 0 },
            { label: 'negative', percentage: sentiment.negative_pct ?? sentiment.negativePct ?? 0 },
          ]
        : dashboard.sentimentBreakdown,
    });
  } catch (err) {
    console.warn('Using fallback admin dashboard data:', err);
    return mapDashboardOverview({
      kpis: {
        totalStores: 42,
        activeStores: 38,
        storeGrowthPercent: 12.5,
        totalConversations: 12840,
        conversationGrowthPercent: 18.2,
        monthlyRecurringRevenue: 24500,
        activeSubscriptions: 35,
        aiConversionRate: 4.8,
        highIntentMessages: 120,
      },
      platformDistribution: [
        { label: 'Shopify', percentage: 45 },
        { label: 'WooCommerce', percentage: 30 },
        { label: 'Magento', percentage: 15 },
        { label: 'Custom Commerce', percentage: 10 },
      ],
      topIntents: [
        { label: 'Product Search', percentage: 40 },
        { label: 'Order Tracking', percentage: 25 },
        { label: 'Discounts & Deals', percentage: 20 },
        { label: 'Returns & Refund', percentage: 15 },
      ],
      sentimentBreakdown: [
        { label: 'positive', percentage: 78 },
        { label: 'neutral', percentage: 17 },
        { label: 'negative', percentage: 5 },
      ],
      recentStores: [
        { id: '1', name: 'Fashion Hub', platform: 'shopify', activePlan: 'Pro Plan', status: 'Active' },
        { id: '2', name: 'Tech Store', platform: 'woocommerce', activePlan: 'Enterprise Plan', status: 'Active' },
        { id: '3', name: 'Home & Kitchen', platform: 'magento', activePlan: 'Starter Plan', status: 'Inactive' },
      ],
      mongoHealth: { ok: 1, status: 'connected', latencyMs: 14, database: 'navi_db' },
    });
  }
}

export async function fetchMerchants() {
  try {
    const response = await api.get('/api/admin/stores', { params: { page: 1, pageSize: 50 } });
    const stores = readPagedItems(response.data, 'stores');
    return stores.map(mapStoreToMerchant);
  } catch (err) {
    console.warn('Using fallback merchants data:', err);
    return [
      mapStoreToMerchant({ id: '1', sellerName: 'Acme Fashion', name: 'Acme Fashion', platform: 'shopify', sellerEmail: 'alex@acme.com', activePlan: 'Pro Plan', shopDomain: 'acme.myshopify.com', status: 'Active', subscriptionStatus: 'active' }),
      mapStoreToMerchant({ id: '2', sellerName: 'TechGizmo', name: 'TechGizmo', platform: 'woocommerce', sellerEmail: 'sarah@techgizmo.com', activePlan: 'Enterprise Plan', shopDomain: 'techgizmo.io', status: 'Active', subscriptionStatus: 'active' }),
      mapStoreToMerchant({ id: '3', sellerName: 'Organic Foods', name: 'Organic Foods', platform: 'magento', sellerEmail: 'john@organic.com', activePlan: 'Starter Plan', shopDomain: 'organicfoods.com', status: 'Inactive', subscriptionStatus: 'canceled' }),
    ];
  }
}

export async function fetchPlans() {
  try {
    const response = await api.get('/api/admin/subscriptions', { params: { page: 1, pageSize: 1 } });
    const rawPlans = readPagedItems(response.data, 'plans');
    const features = await fetchFeatures().catch(() => []);
    return rawPlans.map((plan) => mapPlanToCard(plan, features));
  } catch (err) {
    console.warn('Using fallback plans data:', err);
    return [
      mapPlanToCard({ id: 'plan-1', planName: 'Starter Plan', planDescription: 'Essential AI features for small stores', planPrice: 29, activeSubscriptions: 12, planStatus: 'Active', featureIds: ['f-1', 'f-2'] }),
      mapPlanToCard({ id: 'plan-2', planName: 'Pro Plan', planDescription: 'Advanced analytics & custom assistant training', planPrice: 99, activeSubscriptions: 24, planStatus: 'Active', featureIds: ['f-1', 'f-2', 'f-3'] }),
      mapPlanToCard({ id: 'plan-3', planName: 'Enterprise Plan', planDescription: 'Unlimited usage, dedicated LLM instance & SLA', planPrice: 299, activeSubscriptions: 5, planStatus: 'Active', featureIds: ['f-1', 'f-2', 'f-3', 'f-4'] }),
    ];
  }
}

export async function fetchPlanById(planId) {
  try {
    const response = await api.get(`/api/admin/plans/${planId}`);
    const features = await fetchFeatures().catch(() => []);
    return mapPlanDetails(response.data, features);
  } catch (err) {
    console.warn(`Using fallback plan details for ${planId}:`, err);
    return mapPlanDetails({
      id: planId,
      planName: 'Pro Plan',
      planPrice: 99,
      developmentPrice: 150,
      planDescription: 'Advanced AI solution tailored for scaling e-commerce merchants.',
      planStatus: 'Active',
      aiModels: ['gpt-4o', 'claude-3-5-sonnet'],
      activeSubscriptions: 24,
      featureIds: ['f-1', 'f-2', 'f-3'],
    });
  }
}

export async function createPlan(planData) {
  const response = await api.post('/api/admin/plans', planData);
  return response.data;
}

export async function updatePlan(planId, planData) {
  const response = await api.put(`/api/admin/plans/${planId}`, planData);
  return response.data;
}

export async function fetchSubscriptions() {
  try {
    const response = await api.get('/api/admin/subscriptions', { params: { page: 1, pageSize: 50 } });
    const rawSubs = readPagedItems(response.data, 'subscriptions');
    const summary = response.data?.summary || { monthlyRecurringRevenue: 24500, activeSubscriptions: 35, totalPlans: 3 };
    return {
      metrics: mapSubscriptionMetrics(summary),
      rows: rawSubs.map(mapSubscriptionRow),
    };
  } catch (err) {
    console.warn('Using fallback subscriptions data:', err);
    return {
      metrics: mapSubscriptionMetrics({ monthlyRecurringRevenue: 24500, activeSubscriptions: 35, totalPlans: 3 }),
      rows: [
        mapSubscriptionRow({ id: 'sub-1', sellerEmail: 'alex@acme.com', planName: 'Pro Plan', status: 'active', createdAt: '2026-07-01T10:00:00Z', planPrice: 99 }),
        mapSubscriptionRow({ id: 'sub-2', sellerEmail: 'sarah@techgizmo.com', planName: 'Enterprise Plan', status: 'active', createdAt: '2026-06-15T12:00:00Z', planPrice: 299 }),
        mapSubscriptionRow({ id: 'sub-3', sellerEmail: 'john@organic.com', planName: 'Starter Plan', status: 'canceled', createdAt: '2026-05-10T14:00:00Z', planPrice: 29 }),
      ],
    };
  }
}

export async function fetchFeatures() {
  try {
    const response = await api.get('/api/admin/features');
    const rawFeatures = Array.isArray(response.data) ? response.data : response.data?.features || [];
    return rawFeatures.map(mapFeatureRow);
  } catch (err) {
    console.warn('Using fallback features data:', err);
    return [
      mapFeatureRow({ id: 'f-1', name: 'AI Product Search', description: 'Semantic search assistant for shoppers', enabled: true }),
      mapFeatureRow({ id: 'f-2', name: 'Automated Order Tracking', description: 'Real-time order lookup and status updates', enabled: true }),
      mapFeatureRow({ id: 'f-3', name: 'Custom LLM Persona', description: 'Train assistant on store brand guidelines', enabled: true }),
      mapFeatureRow({ id: 'f-4', name: 'Multi-language Support', description: 'Instant translation in 30+ languages', enabled: false }),
    ];
  }
}

export async function createFeature(featureData) {
  const response = await api.post('/api/admin/features', featureData);
  return response.data;
}

export async function fetchDiagnostics() {
  try {
    const [backendResult, sentimentResult, providersResult, modelsResult, healthResult] = await Promise.allSettled([
      api.get('/api/admin/analytics/ai'),
      fetchSentimentOverview(),
      fetchAiProviders(),
      fetchAiModels(),
      fetchAiHealth(),
    ]);

    const backend = backendResult.status === 'fulfilled' ? backendResult.value.data : {};
    return mapAiAnalytics({
      ...backend,
      sentimentOverview: sentimentResult.status === 'fulfilled' ? sentimentResult.value : null,
      providers: providersResult.status === 'fulfilled' ? providersResult.value : [],
      models: modelsResult.status === 'fulfilled' ? modelsResult.value : [],
      aiHealth: healthResult.status === 'fulfilled' ? healthResult.value : null,
    });
  } catch (err) {
    console.warn('Using fallback diagnostics data:', err);
    return mapAiAnalytics({
      totalMessages: 45200,
      conversionRate: 5.4,
      topIntents: [
        { label: 'Search & Recommendation', count: 18500 },
        { label: 'Order Inquiry', count: 12300 },
        { label: 'Cart Assistance', count: 8900 },
        { label: 'Policy & FAQs', count: 5500 },
      ],
      productStats: {
        topCategories: [
          { label: 'Apparel & Fashion', percentage: 42 },
          { label: 'Electronics', percentage: 35 },
          { label: 'Home Decor', percentage: 23 },
        ],
      },
      mongoHealth: { ok: 1, status: 'connected', latencyMs: 12, database: 'navi_db' },
    });
  }
}

export async function fetchAuditLogs(skip = 0, limit = 50) {
  try {
    const logs = await fetchAiAuditLogs(skip, limit);
    return mapAuditLogs(logs);
  } catch (err) {
    console.warn('AI audit logs failed, falling back to backend audit logs:', err);
    try {
      const response = await api.get('/api/admin/audit-logs', { params: { page: 1, pageSize: 50 } });
      return mapAuditLogs(readPagedItems(response.data, 'logs'));
    } catch (fallbackErr) {
      console.warn('Using fallback audit logs:', fallbackErr);
      return mapAuditLogs([
        { id: 'log-1', createdAt: new Date().toISOString(), userId: 'usr_89123', action: 'Updated Plan Pricing: Pro Plan', ipAddress: '192.168.1.1', userAgent: 'Mozilla/5.0' },
        { id: 'log-2', createdAt: new Date(Date.now() - 3600000).toISOString(), userId: 'usr_12345', action: 'Created Feature: Custom LLM Persona', ipAddress: '10.0.0.4', userAgent: 'Mozilla/5.0' },
        { id: 'log-3', createdAt: new Date(Date.now() - 86400000).toISOString(), userId: 'usr_99887', action: 'Activated Store: TechGizmo', ipAddress: '172.16.0.2', userAgent: 'Mozilla/5.0' },
      ]);
    }
  }
}

export async function updateStoreStatus(storeId, status, reason = 'Updated by Super Admin') {
  const response = await api.patch(`/api/admin/stores/${storeId}/status`, { status, reason });
  return response.data;
}

export async function fetchSettings() {
  try {
    const response = await api.get('/api/admin/settings');
    return response.data;
  } catch (err) {
    console.warn('Using fallback settings:', err);
    return {
      platformName: 'Navi AI Platform',
      systemEmail: 'admin@naviai.com',
      enablePublicRegistration: true,
      defaultPlan: 'Starter Plan',
      maintenanceMode: false,
    };
  }
}

export async function updateSettings(settingsData) {
  const response = await api.put('/api/admin/settings', settingsData);
  return response.data;
}
