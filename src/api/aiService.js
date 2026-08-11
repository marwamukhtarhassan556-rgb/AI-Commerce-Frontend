// src/api/aiService.js
// Dedicated Axios client for the Railway-hosted AI Service.
// Priority: All endpoints that exist in both the ASP.NET backend and here
// should be fetched from this client (AI Service takes precedence).
import axios from 'axios';

const configuredAiBaseUrl = import.meta.env.VITE_AI_SERVICE_URL;
const AI_BASE_URL = configuredAiBaseUrl?.startsWith('/') ? configuredAiBaseUrl : '/api-ai';

const aiService = axios.create({
  baseURL: AI_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT from localStorage on every request with validation
aiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const skipAuth = config.skipAuth === true;

    // التأكد من أن التوكن موجود وفعلي وليس null أو undefined كـ String
    if (!skipAuth && token && token !== 'null' && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Normalize response errors into a consistent shape
aiService.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    if (status === 401) console.warn('[AI Service] Unauthorized — check JWT token.');
    if (status === 403) console.warn('[AI Service] Forbidden — insufficient role (need super_admin).');
    return Promise.reject(err);
  }
);

export default aiService;

// ─── Liveness ────────────────────────────────────────────────────────────────
export const fetchAiLiveness = () => aiService.get('/health/', { skipAuth: true }).then((r) => r.data);

// ─── Audit Logs (AI Service — priority) ──────────────────────────────────────
export const fetchAiAuditLogs = (skip = 0, limit = 50) =>
  aiService.get('/api/v1/auth/audit-logs', { params: { skip, limit } }).then((r) => r.data);

// ─── Sentiment Analytics (AI Service — priority) ─────────────────────────────
export const fetchSentimentOverview = () =>
  aiService.get('/api/v1/admin/analytics/sentiment/overview').then((r) => r.data);

export const fetchStoreSentiment = (storeId) =>
  aiService.get('/api/v1/analytics/sentiment-summary', { params: { store_id: storeId } }).then((r) => r.data);

// ─── AI Model & Provider Health ───────────────────────────────────────────────
export const fetchAiHealth = () => aiService.get('/api/v1/ai/health').then((r) => r.data);

export const fetchProviderHealth = (provider) =>
  aiService.get(`/api/v1/ai/provider/${provider}/health`).then((r) => r.data);

export const fetchAiModels = () => aiService.get('/api/v1/ai/models').then((r) => r.data);

export const fetchAiProviders = () => aiService.get('/api/v1/ai/providers').then((r) => r.data);

export const fetchProviderModels = (provider) =>
  aiService.get(`/api/v1/ai/provider/${provider}/models`).then((r) => r.data);

// ─── Prompt Management ────────────────────────────────────────────────────────
export const fetchPrompts = (params = {}) =>
  aiService.get('/api/v1/admin/prompts', { params }).then((r) => r.data);

export const fetchPromptByKey = (key) =>
  aiService.get(`/api/v1/admin/prompts/${key}`).then((r) => r.data);

export const createPrompt = (data) =>
  aiService.post('/api/v1/admin/prompts', data).then((r) => r.data);

export const updatePrompt = (key, data) =>
  aiService.put(`/api/v1/admin/prompts/${key}`, data).then((r) => r.data);

export const deletePrompt = (key) =>
  aiService.delete(`/api/v1/admin/prompts/${key}`).then((r) => r.data);

export const restorePromptDefault = (key) =>
  aiService.post(`/api/v1/admin/prompts/${key}/restore`).then((r) => r.data);

export const seedPrompts = () =>
  aiService.post('/api/v1/admin/prompts/seed').then((r) => r.data);

// ─── Bundle Promo Tracking ────────────────────────────────────────────────────
export const fetchBundlesTracking = (topOnly = false) =>
  aiService.get('/api/v1/admin/bundles/tracking', { params: { top_only: topOnly } }).then((r) => r.data);

export const fetchBundleTrackingByKey = (bundleKey) =>
  aiService.get(`/api/v1/admin/bundles/tracking/${bundleKey}`).then((r) => r.data);

export const recordBundleTrack = (data) =>
  aiService.post('/api/v1/admin/bundles/track', data).then((r) => r.data);

export const promoteTopBundle = (data) =>
  aiService.post('/api/v1/admin/bundles/top/promote', data).then((r) => r.data);

export const demoteTopBundle = (bundleKey) =>
  aiService.delete(`/api/v1/admin/bundles/top/${bundleKey}`).then((r) => r.data);

export const fetchBundleConfig = () =>
  aiService.get('/api/v1/admin/bundles/config').then((r) => r.data);

export const updateBundleConfig = (data) =>
  aiService.put('/api/v1/admin/bundles/config', data).then((r) => r.data);

// ─── RAG Chat ─────────────────────────────────────────────────────────────────
export const sendRagChat = (payload, providerName = 'openrouter') =>
  aiService.post('/rag/chat', payload, { params: { provider_name: providerName } }).then((r) => r.data);

// Streaming version — returns a fetch Response for manual stream reading
export const sendRagChatStream = async (payload, providerName = 'openrouter') => {
  const token = localStorage.getItem('token');
  const baseUrl = AI_BASE_URL.replace(/\/$/, '');
  const url = new URL(`${baseUrl}/rag/chat/stream`, window.location.origin);
  url.searchParams.set('provider_name', providerName);

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token && token !== 'null' && token !== 'undefined') {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  return response; // caller reads .body as ReadableStream
};
