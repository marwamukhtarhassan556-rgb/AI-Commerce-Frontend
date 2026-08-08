import axios from 'axios';

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
        const previousToken = localStorage.getItem('token');
        localStorage.setItem('token', accessToken);
        if (data?.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
        if (localStorage.getItem('aiToken') === previousToken) localStorage.setItem('aiToken', accessToken);
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
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
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
    console.error('[AI Service Error]', error.response?.status, error.response?.data);
    return retryAfterRefresh(error, aiApi);
  }
);

export default api;
