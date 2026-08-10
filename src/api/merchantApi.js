import api from './axiosConfig';
import axios from 'axios';

// الـ URLs الخاصة بالسيرفرات
const AI_SERVICE_BASE = import.meta.env.VITE_AI_SERVICE_URL || '/api-ai/api/v1';

// Helper لعمل طلبات لخدمة الـ AI مع التوكين
const aiApi = axios.create({
  baseURL: AI_SERVICE_BASE,
  headers: { 'Content-Type': 'application/json' }
} );

aiApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const merchantApi = {
  // --- 1. DASHBOARD & ANALYTICS ---
  getOverviewStats: async (storeId) => {
    try {
      const [rev, growth, aiSentiment] = await Promise.all([
        api.get(`/api/v1/dashboard/total-revenue?storeId=${storeId}`),
        api.get(`/api/v1/dashboard/revenue-growth?storeId=${storeId}`),
        aiApi.get('/analytics/sentiment-summary', { params: { store_id: storeId } })
      ]);
      return {
        revenue: rev.data.totalRevenue,
        growth: growth.data.growthPercentage,
        sentiment: aiSentiment.data
      };
    } catch (error) {
      console.error("Error in getOverviewStats:", error);
      throw error;
    }
  },

  // --- 2. PRODUCTS & CATEGORIES ---
  getProducts: async (storeId, page = 1) => {
    const res = await api.get(`/api/v1/products?storeId=${storeId}&pageIndex=${page}&pageSize=10`);
    return res.data;
  },

  // --- 3. BUNDLE TRACKING (AI Service) ---
  getBundles: async (storeId) => {
    const res = await aiApi.get('/admin/bundles/tracking', { params: { store_id: storeId } });
    return res.data;
  },

  promoteBundle: async (storeId, bundleKey) => {
    return await aiApi.post(`/admin/bundles/top/promote?store_id=${storeId}`, { bundle_key: bundleKey });
  },

  // --- 4. INTEGRATION & SYNC ---
  getConnections: async (storeId) => {
    const res = await aiApi.get('/integration/connections', { params: { store_id: storeId } });
    return res.data;
  },

  syncStore: async (connectionId) => {
    const res = await aiApi.post(`/integration/connections/${connectionId}/sync`);
    return res.data;
  },

  // --- 5. PROMPTS MANAGEMENT ---
  getPrompts: async () => {
    const res = await aiApi.get('/admin/prompts');
    return res.data.items;
  }
};

export default merchantApi;
