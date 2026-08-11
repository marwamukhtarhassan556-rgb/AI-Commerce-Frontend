// src/api/client.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://aisales123.runasp.net', // أو رابط البيئة الحقيقي
});

// إضافة الـ Bearer Token تلقائياً في كل الطلبات
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// دالة تحويل snake_case إلى camelCase
export const normalizeKeys = (obj) => {
  if (Array.isArray(obj)) return obj.map(normalizeKeys);
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      acc[camelKey] = normalizeKeys(obj[key]);
      return acc;
    }, {});
  }
  return obj;
};

export default api;