import { apiRequest, buildQueryString, API_BASE_URL } from './apiClient.js';

export function getDashboardOverview() {
  return apiRequest('/api/admin/dashboard/overview');
}

export function getStores(params = {}) {
  return apiRequest(`/api/admin/stores${buildQueryString(params)}`);
}

export function updateStoreStatus(storeId, payload) {
  return apiRequest(`/api/admin/stores/${storeId}/status`, {
    method: 'PATCH',
    body: payload,
  });
}

export function getPlans() {
  return apiRequest('/api/admin/plans');
}

export function getPlanById(planId) {
  return apiRequest(`/api/admin/plans/${planId}`);
}

export function createPlan(payload) {
  return apiRequest('/api/admin/plans', {
    method: 'POST',
    body: payload,
  });
}

export function updatePlan(planId, payload) {
  return apiRequest(`/api/admin/plans/${planId}`, {
    method: 'PUT',
    body: payload,
  });
}

export function deletePlan(planId) {
  return apiRequest(`/api/admin/plans/${planId}`, {
    method: 'DELETE',
  });
}

export function getFeatures() {
  return apiRequest('/api/admin/features');
}

export function getFeatureById(featureId) {
  return apiRequest(`/api/admin/features/${featureId}`);
}

export function createFeature(payload) {
  return apiRequest('/api/admin/features', {
    method: 'POST',
    body: payload,
  });
}

export function updateFeature(featureId, payload) {
  return apiRequest(`/api/admin/features/${featureId}`, {
    method: 'PUT',
    body: payload,
  });
}

export function deleteFeature(featureId) {
  return apiRequest(`/api/admin/features/${featureId}`, {
    method: 'DELETE',
  });
}

export function getSubscriptions(params = {}) {
  return apiRequest(`/api/admin/subscriptions${buildQueryString(params)}`);
}

export function getAiAnalytics() {
  return apiRequest('/api/admin/analytics/ai');
}

export function getAuditLogs(params = {}) {
  return apiRequest(`/api/admin/audit-logs${buildQueryString(params)}`);
}

// ── Profile API ──────────────────────────────────────────────────────────────

export function getProfile() {
  return apiRequest('/api/profile');
}

export function updateProfile(data) {
  return apiRequest('/api/profile', {
    method: 'PUT',
    body: data,
  });
}

// Profile picture uses multipart/form-data — do NOT set Content-Type manually;
// the browser sets it with the correct boundary when using FormData.
export async function uploadProfilePicture(file) {
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/profile/picture`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (response.status === 204) return null;

  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload !== null
        ? payload.message ?? payload.title ?? 'Upload failed'
        : payload || 'Upload failed';
    throw new Error(message);
  }

  return payload;
}

export function changePassword(data) {
  return apiRequest('/api/profile/change-password', {
    method: 'POST',
    body: data,
  });
}

