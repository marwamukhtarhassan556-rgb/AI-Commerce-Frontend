import axios from 'axios';

const getAiBaseUrl = () => {
  if (import.meta.env.VITE_AI_SERVICE_URL) {
    return import.meta.env.VITE_AI_SERVICE_URL;
  }
  return '/api-ai';
};

const aiService = axios.create({
  baseURL: getAiBaseUrl(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

aiService.interceptors.request.use((config) => {
  const token = localStorage.getItem('aiToken') || localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchAiLiveness = async () => {
  try {
    const r = await aiService.get('/health/', { params: { _t: Date.now() }, skipAuth: true });
    if (r.data && typeof r.data === 'string' && r.data.trim().startsWith('<')) {
      throw new Error('Received HTML index.html fallback instead of JSON');
    }
    if (r.data) return r.data;
    throw new Error('Empty response');
  } catch (err) {
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      try {
        const directRes = await fetch(`https://aicommerce-ai-service-production.up.railway.app/health/?_t=${Date.now()}`);
        return await directRes.json();
      } catch (fallbackErr) {
        console.warn('[AI Service] Direct fallback failed:', fallbackErr);
      }
    }
    throw err;
  }
};



export const fetchAiAuditLogs = (skip = 0, limit = 50) =>
  aiService.get('/api/v1/auth/audit-logs', { params: { skip, limit } }).then((response) => response.data);
export const fetchSentimentOverview = () =>
  aiService.get('/api/v1/admin/analytics/sentiment/overview').then((response) => response.data);
export const fetchAiHealth = () => aiService.get('/api/v1/ai/health').then((response) => response.data);
export const fetchAiModels = () => aiService.get('/api/v1/ai/models').then((response) => response.data);
export const fetchAiProviders = () => aiService.get('/api/v1/ai/providers').then((response) => response.data);
export const fetchProviderHealth = (provider) =>
  aiService.get(`/api/v1/ai/provider/${provider}/health`).then((response) => response.data);

export const fetchPrompts = (params = {}) =>
  aiService.get('/api/v1/admin/prompts', { params }).then((response) => response.data);
export const fetchPromptByKey = (key) =>
  aiService.get(`/api/v1/admin/prompts/${key}`).then((response) => response.data);
export const createPrompt = (data) =>
  aiService.post('/api/v1/admin/prompts', data).then((response) => response.data);
export const updatePrompt = (key, data) =>
  aiService.put(`/api/v1/admin/prompts/${key}`, data).then((response) => response.data);
export const deletePrompt = (key) =>
  aiService.delete(`/api/v1/admin/prompts/${key}`).then((response) => response.data);
export const restorePromptDefault = (key) =>
  aiService.post(`/api/v1/admin/prompts/${key}/restore`).then((response) => response.data);
export const seedPrompts = () => aiService.post('/api/v1/admin/prompts/seed').then((response) => response.data);

export const fetchBundlesTracking = (topOnly = false) =>
  aiService.get('/api/v1/admin/bundles/tracking', { params: { top_only: topOnly } }).then((response) => response.data);
export const promoteTopBundle = (data) =>
  aiService.post('/api/v1/admin/bundles/top/promote', data).then((response) => response.data);
export const demoteTopBundle = (bundleKey) =>
  aiService.delete(`/api/v1/admin/bundles/top/${bundleKey}`).then((response) => response.data);
export const fetchBundleConfig = () =>
  aiService.get('/api/v1/admin/bundles/config').then((response) => response.data);
export const updateBundleConfig = (data) =>
  aiService.put('/api/v1/admin/bundles/config', data).then((response) => response.data);

export const sendRagChat = (payload, providerName = 'openrouter') =>
  aiService.post('/rag/chat', payload, { params: { provider_name: providerName } }).then((response) => response.data);
export const sendRagChatStream = async (payload, providerName = 'openrouter') => {
  const token = localStorage.getItem('aiToken') || localStorage.getItem('token');
  return fetch(`/api-ai/rag/chat/stream?${new URLSearchParams({ provider_name: providerName })}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(payload),
  });
};

export default aiService;
