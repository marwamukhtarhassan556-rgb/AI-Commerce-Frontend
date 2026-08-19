import { api } from './axiosConfig';
import { aiApi } from './axiosConfig';

// ══════════════════════════════════════════════════════════════════
// BACKEND API (ASP.NET) — https://aisales123.runasp.net
// ══════════════════════════════════════════════════════════════════

// ── Dashboard ──────────────────────────────────────────────────────
export const dashboardApi = {
  getTotalRevenue: (storeId) =>
    api.get(`/api/v1/dashboard/total-revenue?storeId=${storeId}`),

  getRevenueGrowth: (storeId) =>
    api.get(`/api/v1/dashboard/revenue-growth?storeId=${storeId}`),

  getTicketMetrics: (storeId) =>
    aiApi.get('/tickets/metrics/resolution', { params: { store_id: storeId } }),

  // جلب كل الـ dashboard stats دفعة واحدة
  getOverviewStats: async (storeId) => {
    const [rev, growth, tickets] = await Promise.allSettled([
      api.get(`/api/v1/dashboard/total-revenue?storeId=${storeId}`),
      api.get(`/api/v1/dashboard/revenue-growth?storeId=${storeId}`),
      aiApi.get('/tickets/metrics/resolution', { params: { store_id: storeId } }),
    ]);
    return {
      revenue: rev.status === 'fulfilled' ? rev.value.data : null,
      growth: growth.status === 'fulfilled' ? growth.value.data : null,
      tickets: tickets.status === 'fulfilled' ? tickets.value.data : null,
    };
  },
};

// ── Products ────────────────────────────────────────────────────────
export const productsApi = {
  // GET /api/v1/products
  list: ({ storeId, pageIndex = 1, pageSize = 10, search = '', status = '' } = {}) =>
    api.get('/api/v1/products', {
      params: { storeId, pageIndex, pageSize, ...(search && { search }), ...(status && { status }) },
    }),

  // GET /api/v1/products/{id}
  getById: (productId, storeId) =>
    api.get(`/api/v1/products/${productId}`, { params: { storeId } }),

  // PATCH /api/v1/products/{id}/max-discount
  updateMaxDiscount: (productId, storeId, maxAllowedDiscount) =>
    api.patch(`/api/v1/products/${productId}/max-discount`, { storeId, maxAllowedDiscount }),
};

// ── Categories ──────────────────────────────────────────────────────
export const categoriesApi = {
  // GET /api/v1/categories
  list: (storeId, search = '') =>
    api.get('/api/v1/categories', { params: { storeId, ...(search && { search }) } }),

  // GET /api/v1/categories/{id}
  getById: (categoryId, storeId) =>
    api.get(`/api/v1/categories/${categoryId}`, { params: { storeId } }),
};

// ── Tickets ─────────────────────────────────────────────────────────
export const ticketsApi = {
  // GET /api/v1/tickets
  list: ({ storeId, status = '', priority = '', sentiment = '', page = 1, pageSize = 20 } = {}) =>
    aiApi.get('/tickets', {
      params: {
        store_id: storeId,
        page,
        page_size: pageSize,
        ...(status && { status }),
        ...(priority && { priority }),
        ...(sentiment && { sentiment }),
      },
    }),

  // GET /api/v1/tickets/{id}
  getById: (ticketId) => aiApi.get(`/tickets/${ticketId}`),

  // PATCH /api/v1/tickets/{id}/status
  updateStatus: (ticketId, status, resolutionType) =>
    aiApi.patch(`/tickets/${ticketId}/status`, { status, resolution_type: resolutionType }),

  // POST /api/v1/tickets/{id}/messages
  addMessage: (ticketId, { sender = 'agent', content }) =>
    aiApi.post(`/tickets/${ticketId}/messages`, { sender, content }),

  // POST /api/v1/tickets/{id}/resolve
  resolve: (ticketId, { resolutionType = 'human', message = null } = {}) =>
    aiApi.post(`/tickets/${ticketId}/resolve`, { resolution_type: resolutionType, message }),

  // POST /api/v1/tickets/{id}/escalate
  escalate: (ticketId, { priority = 'high', assignedTo = null, eta = null, message = null } = {}) =>
    aiApi.post(`/tickets/${ticketId}/escalate`, { priority, assigned_to: assignedTo, eta, message }),

  // DELETE /api/v1/tickets/{id}
  delete: (ticketId) => aiApi.delete(`/tickets/${ticketId}`),

  // GET /api/v1/tickets/{ticket_id}/notifications
  listNotifications: (ticketId, { customerId, unreadOnly = false, limit = 50 } = {}) =>
    aiApi.get(`/tickets/${ticketId}/notifications`, {
      params: {
        ...(customerId && { customer_id: customerId }),
        unread_only: unreadOnly,
        limit,
      },
    }),

  // GET /api/v1/tickets/metrics/resolution
  getMetrics: (storeId) =>
    aiApi.get('/tickets/metrics/resolution', { params: { store_id: storeId } }),
};

// ── Stores ──────────────────────────────────────────────────────────
export const storesApi = {
  // POST /api/stores
  create: (data) => api.post('/api/stores', data),

  // GET /api/stores
  list: () => api.get('/api/stores'),

  // GET /api/stores/{id}
  getById: (storeId) => api.get(`/api/stores/${storeId}`),

  // PUT /api/stores/{id}
  update: (storeId, data) => api.put(`/api/stores/${storeId}`, data),

  // PUT /api/stores/{id}/settings
  updateSettings: (storeId, { currency, language, timezone }) =>
    api.put(`/api/stores/${storeId}/settings`, { currency, language, timezone }),

  // GET /api/stores/{storeId}/daily-allowed-message
  getDailyAllowedMessage: (storeId) =>
    api.get(`/api/stores/${storeId}/daily-allowed-message`),

  // PUT /api/stores/{storeId}/update-daily-allowed-message
  updateDailyAllowedMessage: (storeId, dailyAllowedMessage) =>
    api.put(`/api/stores/${storeId}/update-daily-allowed-message`, { dailyAllowedMessage }),

  // PUT /api/stores/{id}/admin-info
  updateAdminInfo: (storeId, { adminEmail, adminPassword }) =>
    api.put(`/api/stores/${storeId}/admin-info`, { adminEmail, adminPassword }),

  // POST /api/stores/{storeId}/sync-old-revenue
  syncOldRevenue: (storeId) => api.post(`/api/stores/${storeId}/sync-old-revenue`),

  // DELETE /api/stores/{id}
  delete: (storeId) => api.delete(`/api/stores/${storeId}`),
};

export const storeCapabilitiesApi = {
  get: (storeId) =>
    api.get(`/api/StoreCapabilities/${storeId}/capabilities`),

  update: ({ storeId, capabilities }) =>
    api.put('/api/StoreCapabilities/update-capabilities', { storeId, capabilities }, { timeout: 12000 }),
};

export const subscriptionsApi = {
  listPlans: () => api.get('/api/admin/plans'),
  getPlanById: (planId) => api.get(`/api/admin/plans/${planId}`),
  getDevelopmentPrice: (planId) => api.get(`/api/admin/plans/${planId}/development-price`),
  // Current seller subscription: plan, status and renewal date.
  getCurrent: () => api.get('/api/seller/subscriptions/my-subscription'),
  getTrialStatus: () => api.get('/api/seller/subscriptions/trial-status'),
  hasUsedFreeTrial: () => api.get('/api/seller/subscriptions/has-used-free-trial'),
  startFreeTrial: (planId) => api.post('/api/seller/subscriptions/free-trial', { planId }),
  createCheckoutSession: (planId) => api.post('/api/seller/subscriptions/checkout-session', { planId }),
  subscribe: (planId) => api.post('/api/seller/subscriptions/checkout-session', { planId }),
  cancel: () => api.post('/api/seller/subscriptions/cancel'),
};

export const contactApi = {
  createDeveloperRequest: (data) => api.post('/api/contact', data),
};


// ══════════════════════════════════════════════════════════════════
// AI SERVICE API (FastAPI) — Railway
// ══════════════════════════════════════════════════════════════════

// ── AI Chat ─────────────────────────────────────────────────────────
export const aiChatApi = {
  // POST /api/v1/ai/chat
  chat: (messages, model = 'openai/gpt-4o-mini', options = {}) =>
    aiApi.post('/ai/chat', { messages, model, ...options }),

  // POST /api/v1/ai/chat/stream (SSE)
  chatStream: (messages, model = 'openai/gpt-4o-mini', options = {}) =>
    aiApi.post('/ai/chat/stream', { messages, model, stream: true, ...options }),

  // GET /api/v1/ai/health
  health: () => aiApi.get('/ai/health'),

  // GET /api/v1/ai/models
  listModels: () => aiApi.get('/ai/models'),

  // GET /api/v1/ai/providers
  listProviders: () => aiApi.get('/ai/providers'),
};

// ── RAG Chat ────────────────────────────────────────────────────────
// ── Integration & Connections ────────────────────────────────────────
export const integrationApi = {
  // GET /api/v1/integration/connections
  listConnections: (storeId, page = 1, pageSize = 20) =>
    aiApi.get('/integration/connections', { params: { store_id: storeId, page, page_size: pageSize } }),

  // POST /api/v1/integration/connections
  createConnection: (data) => aiApi.post('/integration/connections', data),

  // GET /api/v1/integration/connections/{id}
  getConnection: (connectionId) => aiApi.get(`/integration/connections/${connectionId}`),

  // DELETE /api/v1/integration/connections/{id}
  deleteConnection: (connectionId) => aiApi.delete(`/integration/connections/${connectionId}`),

  // PUT /api/v1/integration/connections/{id}/mappings
  updateMappings: (connectionId, entityMappings) =>
    aiApi.put(`/integration/connections/${connectionId}/mappings`, { entity_mappings: entityMappings }),

  // PUT /api/v1/integration/connections/{id}/credentials
  updateCredentials: (connectionId, { authConfig, credentials }) =>
    aiApi.put(`/integration/connections/${connectionId}/credentials`, { auth_config: authConfig, credentials }),

  // POST /api/v1/integration/connections/{id}/sync
  syncConnection: (connectionId, entityTypes = []) =>
    aiApi.post(`/integration/connections/${connectionId}/sync`, { entity_types: entityTypes }),

  // POST /api/v1/integration/schemas/parse
  parseSchema: (platformName, rawSpec) =>
    aiApi.post('/integration/schemas/parse', { platform_name: platformName, raw_spec: rawSpec }),

  // POST /api/v1/integration/schemas/agent-parse
  agentParseSchema: (platformName, rawSpec) =>
    aiApi.post('/integration/schemas/agent-parse', { platform_name: platformName, raw_spec: rawSpec }),

  // POST /api/v1/integration/agent-sync (full agent-driven setup)
  agentSync: (data) => aiApi.post('/integration/agent-sync', data),
};

// ── Bundle Tracking ─────────────────────────────────────────────────
export const bundlesApi = {
  // GET /api/v1/admin/bundles/tracking
  list: (storeId, topOnly = false) =>
    aiApi.get('/admin/bundles/tracking', { params: { store_id: storeId, top_only: topOnly } }),

  // GET /api/v1/admin/bundles/tracking/{bundle_key}
  getOne: (bundleKey, storeId) =>
    aiApi.get(`/admin/bundles/tracking/${bundleKey}`, { params: { store_id: storeId } }),

  // POST /api/v1/admin/bundles/top/promote
  promote: (storeId, bundleKey) =>
    aiApi.post(`/admin/bundles/top/promote?store_id=${storeId}`, { bundle_key: bundleKey }),

  // DELETE /api/v1/admin/bundles/top/{bundle_key}
  demote: (storeId, bundleKey) =>
    aiApi.delete(`/admin/bundles/top/${bundleKey}?store_id=${storeId}`),

  // GET /api/v1/admin/bundles/config
  getConfig: (storeId) =>
    aiApi.get('/admin/bundles/config', { params: { store_id: storeId } }),

  // PUT /api/v1/admin/bundles/config
  updateConfig: (storeId, { threshold, enabled }) =>
    aiApi.put(`/admin/bundles/config?store_id=${storeId}`, { threshold, enabled }),

  // POST /api/v1/admin/bundles/track
  track: (data) => aiApi.post('/admin/bundles/track', data),
};

export const widgetInstallationsApi = {
  list: () =>
    aiApi.get('/admin/widget-installations').catch((err) => {
      if (err.response?.status === 403) return { data: [] };
      throw err;
    }),
  create: ({ environment, allowedOrigins, scopes }) =>
    aiApi.post('/admin/widget-installations', { environment, allowed_origins: allowedOrigins, scopes }).catch((err) => {
      if (err.response?.status === 403) return { data: { widget_key: '' } };
      throw err;
    }),
  disable: (widgetId) =>
    aiApi.patch(`/admin/widget-installations/${widgetId}/disable`).catch((err) => {
      if (err.response?.status === 403) return { data: {} };
      throw err;
    }),
};

// ── Analytics ────────────────────────────────────────────────────────
export const analyticsApi = {
  // GET /api/v1/analytics/sentiment-summary
  getSentimentSummary: (storeId) =>
    aiApi.get('/analytics/sentiment-summary', { params: { store_id: storeId } }),

  // GET /api/v1/analytics/ai-usage
  getAIUsage: (storeId) =>
    aiApi.get('/analytics/ai-usage', { params: { store_id: storeId } }),

  // GET /api/v1/analytics/ai-usage/daily-message-limit
  getDailyMessageLimit: () => aiApi.get('/analytics/ai-usage/daily-message-limit'),

  // PUT /api/v1/analytics/ai-usage/consumer-limit
  updateConsumerDailyLimit: (limit) =>
    aiApi.put('/analytics/ai-usage/consumer-limit', { consumer_daily_message_limit: limit }),

  // GET /api/v1/analytics/ai-usage/subscription-plan
  getSubscriptionPlan: () => aiApi.get('/analytics/ai-usage/subscription-plan'),
};

// ── Knowledge Base ───────────────────────────────────────────────────
export const knowledgeApi = {
  // POST /api/v1/knowledge-base/upload (multipart)
  upload: (file, { uploadedBy, organizationId, storeId, knowledgeScope = 'general' }) => {
    const form = new FormData();
    form.append('file', file);
    return aiApi.post('/knowledge-base/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: {
        uploaded_by: uploadedBy,
        organization_id: organizationId,
        store_id: storeId,
        knowledge_scope: knowledgeScope,
      },
    });
  },

  // GET /api/v1/knowledge-base/documents
  listDocuments: (storeId, page = 1, pageSize = 20) =>
    aiApi.get('/knowledge-base/documents', {
      params: { store_id: storeId, status: 'active', page, page_size: pageSize },
    }),

  // DELETE /api/v1/knowledge-base/documents/{id}
  deleteDocument: (documentId) => aiApi.delete(`/knowledge-base/documents/${documentId}`),

  // PUT /api/v1/knowledge-base/documents/{id}
  updateDocument: (documentId, data) => aiApi.put(`/knowledge-base/documents/${documentId}`, data),

  // POST /api/v1/knowledge-base/process
  processDocument: ({ documentId, filePath, mimeType }) =>
    aiApi.post('/knowledge-base/process', {
      document_id: documentId,
      file_path: filePath,
      mime_type: mimeType,
      also_chunk: true,
      strategy: 'recursive_character',
      chunk_size: 1000,
      overlap: 200,
    }),

  // POST /api/v1/knowledge-base/search
  search: ({ query, storeId, topK = 10, useHybrid = false }) =>
    aiApi.post('/knowledge-base/search', {
      query,
      store_id: storeId,
      top_k: topK,
      use_hybrid: useHybrid,
    }),

  // POST /api/v1/knowledge-base/summary
  generateSummary: (storeId, model = 'gemini-2.0-flash-001') =>
    aiApi.post(`/knowledge-base/summary?store_id=${storeId}`, { model, temperature: 0.3, max_tokens: 2048 }),

  // POST /api/v1/knowledge-base/summary/regenerate
  regenerateSummary: () => aiApi.post('/knowledge-base/summary/regenerate'),

  // GET /api/v1/knowledge-base/summaries/history
  getSummaryHistory: (page = 1, pageSize = 10) =>
    aiApi.get('/knowledge-base/summaries/history', { params: { page, page_size: pageSize } }),

  // POST /api/v1/knowledge-base/search/hybrid
  hybridSearch: ({ query, storeId, organizationId, topK = 10 }) =>
    aiApi.post('/knowledge-base/search/hybrid', { query, store_id: storeId, organization_id: organizationId, top_k: topK, use_hybrid: true }),

  // GET /api/v1/knowledge-base/jobs/{job_id}
  getJobStatus: (jobId) => aiApi.get(`/knowledge-base/jobs/${jobId}`),
};

// ── Recommendations ──────────────────────────────────────────────────
export const recommendationsApi = {
  // POST /api/v1/recommendations/chat
  getProductRecommendations: ({ message, storeId, customerId }) =>
    aiApi.post('/recommendations/chat', { message, store_id: storeId, customer_id: customerId }),

  // POST /api/v1/recommendations/bundle-suggestion
  getBundleSuggestion: ({ message, storeId, customerId }) =>
    aiApi.post('/recommendations/bundle-suggestion', { message, store_id: storeId, customer_id: customerId }),
};

// ── Health Check ─────────────────────────────────────────────────────
export const healthApi = {
  check: () => aiApi.get('/ai/health'),
};
