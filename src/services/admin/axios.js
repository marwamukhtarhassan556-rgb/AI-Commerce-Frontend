import { apiRequest } from './apiClient';

const baseURL = 'https://aisales123.runasp.net/api';

const axiosInstance = {
  defaults: {
    baseURL,
  },
  get: (url, config = {}) => apiRequest(url.startsWith('/api') ? url : `/api${url}`, { method: 'GET', ...config }),
  post: (url, data, config = {}) => apiRequest(url.startsWith('/api') ? url : `/api${url}`, { method: 'POST', body: data, ...config }),
  put: (url, data, config = {}) => apiRequest(url.startsWith('/api') ? url : `/api${url}`, { method: 'PUT', body: data, ...config }),
  patch: (url, data, config = {}) => apiRequest(url.startsWith('/api') ? url : `/api${url}`, { method: 'PATCH', body: data, ...config }),
  delete: (url, config = {}) => apiRequest(url.startsWith('/api') ? url : `/api${url}`, { method: 'DELETE', ...config }),
};

export default axiosInstance;
export { baseURL };
