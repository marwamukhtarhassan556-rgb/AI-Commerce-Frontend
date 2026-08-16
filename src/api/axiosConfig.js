import axios from 'axios';
import { prepareUserError } from '../utils/errorMessage';

// ─────────────────────────────────────────────
// 1. BACKEND — ASP.NET Core
//    https://aisales123.runasp.net
// ─────────────────────────────────────────────
const BACKEND_URL = import.meta.env.VITE_MAIN_API_URL || 'https://aisales123.runasp.net';

const refreshClient = axios.create({
  baseURL: BACKEND_URL,
  headers: { 'Content-Type': 'application/json' },
});

let refreshInFlight = null;

const clearSessionAndRedirect = () => {
  localStorage.clear();
  if (window.location.pathname !== '/signin') window.location.assign('/signin');
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('No refresh token is available.');
  if (!refreshInFlight) {
    refreshInFlight = refreshClient.post('/api/auth/refresh-token', { refreshToken })
      .then(({ data }) => {
        const accessToken = data?.accessToken || data?.token;
        if (!accessToken) throw new Error('Refresh completed without an access token.');
        localStorage.setItem('token', accessToken);
        if (data?.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
        // The AI service always reads aiToken first. A credential update must
        // therefore refresh that token too, even when login originally returned
        // a separate AI token.
        localStorage.setItem('aiToken', data?.aiToken || data?.aiAccessToken || accessToken);
        return accessToken;
      })
      .finally(() => { refreshInFlight = null; });
  }
  return refreshInFlight;
};

const retryAfterRefresh = async (error, client) => {
  const request = error.config;
  const isRefreshRequest = request?.url?.includes('/api/auth/refresh-token');
  if (error.response?.status !== 401 || !request || request._retriedAfterRefresh || isRefreshRequest) throw error;
  request._retriedAfterRefresh = true;
  try {
    const accessToken = await refreshAccessToken();
    request.headers = request.headers || {};
    request.headers.Authorization = `Bearer ${accessToken}`;
    return client(request);
  } catch (refreshError) {
    clearSessionAndRedirect();
    throw refreshError;
  }
};

export const api = axios.create({
  baseURL: BACKEND_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const url = config.url || '';
  const isAuthEndpoint = [
    '/api/auth/login',
    '/api/auth/google',
    '/api/auth/register',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
  ].some((endpoint) => url.includes(endpoint));

  const token = localStorage.getItem('token');
  if (token && !isAuthEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    prepareUserError(error);
    const isLoginRequest = error.config?.url?.includes('/api/auth/login');
    if (!isLoginRequest) return retryAfterRefresh(error, api);
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
  if (config.headers?.Authorization) return config;
  const token =
    localStorage.getItem('aiToken') ||
    localStorage.getItem('token') ||
    import.meta.env.VITE_AI_DEV_TOKEN;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

aiApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    // Suppress expected errors (404 Not Found, 422 Validation) to avoid console noise
    const status = error.response?.status;
    if (status !== 404 && status !== 422) {
      console.error('[AI Service Error]', status, error.response?.data);
    }
    prepareUserError(error);
    return retryAfterRefresh(error, aiApi);
  }
);

export default api;
