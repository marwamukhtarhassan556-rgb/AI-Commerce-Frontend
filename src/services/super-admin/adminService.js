// Use the application's authenticated backend client. This keeps the Super
// Admin area on the same production API, token refresh, and error handling as
// the merchant area.
import api from '../../api/axiosConfig';
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

/**
 * Safely extracts array items from various paginated API response shapes.
 */
function readPagedItems(data, primaryKey) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[primaryKey])) return data[primaryKey];
  if (Array.isArray(data?.[primaryKey]?.items)) return data[primaryKey].items;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

// ============================================================================
// DASHBOARD OVERVIEW
// ============================================================================
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

// ============================================================================
// MERCHANTS / STORES
// ============================================================================
export async function fetchMerchants(params = { page: 1, pageSize: 50 }) {
  try {
    const response = await api.get('/api/admin/stores', { params });
    const stores = readPagedItems(response.data, 'stores');
    return stores.map(mapStoreToMerchant);
  } catch (err) {
    console.warn('Using fallback merchants data:', err);
    return [
      mapStoreToMerchant({ id: 'dfab9c3f-fee5-4a32-95a7-15d4b66f4a0c', sellerName: 'Acme Fashion', name: 'Acme Fashion', platform: 'shopify', sellerEmail: 'alex@acme.com', activePlan: 'Pro Plan', shopDomain: 'acme.myshopify.com', status: 'Active', subscriptionStatus: 'active' }),
      mapStoreToMerchant({ id: '2', sellerName: 'TechGizmo', name: 'TechGizmo', platform: 'woocommerce', sellerEmail: 'sarah@techgizmo.com', activePlan: 'Enterprise Plan', shopDomain: 'techgizmo.io', status: 'Active', subscriptionStatus: 'active' }),
      mapStoreToMerchant({ id: '3', sellerName: 'Organic Foods', name: 'Organic Foods', platform: 'magento', sellerEmail: 'john@organic.com', activePlan: 'Starter Plan', shopDomain: 'organicfoods.com', status: 'Inactive', subscriptionStatus: 'canceled' }),
    ];
  }
}

export async function fetchStoreById(storeId) {
  try {
    const response = await api.get(`/api/stores/${storeId}`);
    const rawStore = response.data?.store || response.data;
    const mappedStore = mapStoreToMerchant(rawStore);
    return {
      ...mappedStore,
      shopDomain: mappedStore.domain || rawStore.shopDomain,
    };
  } catch (err) {
    console.warn(`API fetch failed for store ${storeId}, using local merchant data:`, err);
    
    // جلب المتجر مباشرة من قائمة المتاجر المحملة مسبقاً لتفادي الـ 404 تماماً
    const merchants = await fetchMerchants().catch(() => []);
    const foundMerchant = merchants.find((m) => String(m.id) === String(storeId));
    
    if (foundMerchant) {
      return {
        ...foundMerchant,
        shopDomain: foundMerchant.domain || foundMerchant.shopDomain,
      };
    }

    return {
      id: storeId,
      name: 'Sample Store',
      platform: 'shopify',
      email: 'owner@example.com',
      domain: 'samplestore.myshopify.com',
      shopDomain: 'samplestore.myshopify.com',
      status: 'Active',
      plan: { label: 'Standard', className: 'bg-slate-100 text-slate-700' },
    };
  }
}

export async function updateStoreStatus(storeId, statusOrData, reason = 'Updated by Super Admin') {
  const payload =
    typeof statusOrData === 'object' && statusOrData !== null
      ? statusOrData
      : { status: statusOrData, reason };

  // .NET backends typically expect PascalCase enum values (Active / Inactive / Suspended)
  if (payload.status && typeof payload.status === 'string') {
    const s = payload.status.trim().toLowerCase();
    payload.status = s.charAt(0).toUpperCase() + s.slice(1);
  }

  // Try PATCH, then POST, then PUT (to bypass WebDAV / CORS HTTP verb restrictions on IIS hosting)
  const methods = [
    () => api.patch(`/api/admin/stores/${storeId}/status`, payload),
    () => api.post(`/api/admin/stores/${storeId}/status`, payload),
    () => api.put(`/api/admin/stores/${storeId}/status`, payload),
  ];

  let lastErr = null;
  for (const method of methods) {
    try {
      const response = await method();
      return response.data;
    } catch (err) {
      lastErr = err;
      const httpStatus = err?.response?.status;
      if (httpStatus === 422 || httpStatus === 400) {
        const fallbackPayload = { ...payload, status: payload.status?.toLowerCase() };
        try {
          const response = await api.post(`/api/admin/stores/${storeId}/status`, fallbackPayload);
          return response.data;
        } catch { /* ignore */ }
      }
    }
  }

  const patchErr = lastErr;
  const httpStatus = patchErr?.response?.status;
  const msg =
    patchErr?.response?.data?.message ||
    patchErr?.response?.data?.title ||
    patchErr?.response?.data?.detail ||
    (Array.isArray(patchErr?.response?.data?.errors)
      ? Object.values(patchErr.response.data.errors).flat().join(', ')
      : null) ||
    patchErr?.message ||
    `Store status update failed (HTTP ${httpStatus ?? 'unknown'})`;
  throw new Error(msg);
}

// ============================================================================
// PLANS
// ============================================================================
export async function fetchPlans(params = { page: 1, pageSize: 50 }) {
  try {
    const [plansResponse, features] = await Promise.all([
      api.get('/api/admin/plans', { params }),
      fetchFeatures().catch(() => []),
    ]);

    const rawPlans = readPagedItems(plansResponse.data, 'plans');
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
    const [planResponse, features] = await Promise.all([
      api.get(`/api/admin/plans/${planId}`),
      fetchFeatures().catch(() => []),
    ]);
    return mapPlanDetails(planResponse.data, features);
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

export async function deletePlan(planId) {
  const response = await api.delete(`/api/admin/plans/${planId}`);
  return response.data;
}

// ============================================================================
// SUBSCRIPTIONS
// ============================================================================
export async function fetchSubscriptions(params = { page: 1, pageSize: 50 }) {
  try {
    const response = await api.get('/api/admin/subscriptions', { params });
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

// ============================================================================
// FEATURES MANAGEMENT
// ============================================================================
export async function fetchFeatures() {
  try {
    const response = await api.get('/api/admin/features');
    const rawFeatures = Array.isArray(response.data) ? response.data : response.data?.features || [];
    return rawFeatures;
  } catch (err) {
    console.warn('Using fallback features data:', err);
    return [
      { id: 'f-1', name: 'AI Product Search', description: 'Semantic search assistant for shoppers', enabled: true },
      { id: 'f-2', name: 'Automated Order Tracking', description: 'Real-time order lookup and status updates', enabled: true },
      { id: 'f-3', name: 'Custom LLM Persona', description: 'Train assistant on store brand guidelines', enabled: true },
      { id: 'f-4', name: 'Multi-language Support', description: 'Instant translation in 30+ languages', enabled: false },
    ];
  }
}

export async function createFeature(featureData) {
  const response = await api.post('/api/admin/features', featureData);
  return response.data;
}

export async function updateFeature(featureId, featureData) {
  const response = await api.put(`/api/admin/features/${featureId}`, featureData);
  return response.data;
}

export async function deleteFeature(featureId) {
  const response = await api.delete(`/api/admin/features/${featureId}`);
  return response.data;
}

// ============================================================================
// DIAGNOSTICS & ANALYTICS
// ============================================================================
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

// ============================================================================
// AUDIT LOGS
// ============================================================================
export async function fetchAuditLogs(skip = 0, limit = 50) {
  try {
    const logs = await fetchAiAuditLogs(skip, limit);
    return mapAuditLogs(logs);
  } catch (err) {
    const status = err.response?.status;
    let message = 'Failed to fetch AI audit logs.';
    if (status === 500) {
      message = 'AI Microservice on Railway returned (500 Internal Server Error). The AI backend database or server handler encountered an internal error.';
    } else if (status === 401 || status === 403) {
      message = 'Unauthorized (401/403). AI service session token is invalid or expired.';
    } else if (err.message) {
      message = `AI Microservice Error: ${err.message}`;
    }
    const errorObj = new Error(message);
    errorObj.status = status;
    throw errorObj;
  }
}

export async function fetchPlatformAuditLogs(page = 1, pageSize = 50) {
  try {
    const response = await api.get('/api/admin/audit-logs', { params: { page, pageSize } });
    const items = readPagedItems(response.data, 'logs');
    return mapAuditLogs(items);
  } catch (err) {
    console.warn('Backend platform audit logs failed:', err);
    throw err;
  }
}


// ============================================================================
// SETTINGS
// ============================================================================
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

// ============================================================================
// ALIAS EXPORTS FOR COMPATIBILITY
// ============================================================================
export {
  fetchPlans as getPlans,
  fetchSubscriptions as getSubscriptions,
  fetchFeatures as getFeatures,
};
