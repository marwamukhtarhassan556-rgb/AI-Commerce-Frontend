import axios from 'axios';

// ─────────────────────────────────────────────
// 1. BACKEND — ASP.NET Core
//    https://aisales123.runasp.net
// ─────────────────────────────────────────────
const BACKEND_URL = import.meta.env.VITE_MAIN_API_URL || 'https://aisales123.runasp.net';

export const api = axios.create({
  baseURL: BACKEND_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/api/auth/login');
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.clear();
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────
// 2. AI SERVICE — FastAPI (Railway)
//    https://aicommerce-ai-service-production.up.railway.app
//    عبر Vite Proxy في التطوير: /api-ai → AI Service
// ─────────────────────────────────────────────
const AI_BASE_URL = import.meta.env.VITE_AI_SERVICE_URL || '/api-ai/api/v1';

export const aiApi = axios.create({
  baseURL: AI_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// AI Service token: من localStorage (بعد login) أو الـ fallback للـ dev
aiApi.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('aiToken') ||
    localStorage.getItem('token') ||
    import.meta.env.VITE_AI_DEV_TOKEN;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

aiApi.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error('[AI Service Error]', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;
