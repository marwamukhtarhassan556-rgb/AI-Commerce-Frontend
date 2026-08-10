const API_BASE_URL = (import.meta?.env?.VITE_API_BASE_URL) ?? 'https://aisales123.runasp.net';
// Remove insecure HTTP fallback; all requests must use HTTPS.
const HTTP_FALLBACK_URL = null; // disabled

// Remove hard‑coded mock token; rely on real auth token stored in localStorage.
// If no token is present, the request proceeds without Authorization (will be rejected by backend).


function getAuthHeaders() {
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  const headers = { Accept: 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function getFallbackData(path) {
  const cleanPath = path.split('?')[0];

  if (cleanPath.endsWith('/admin/dashboard/overview')) {
    return {
      kpis: {
        totalStores: 4,
        activeStores: 4,
        storeGrowthPercent: 100,
        totalUsers: 16,
        totalSellers: 13,
        emailConfirmedUsers: 6,
        totalConversations: 38450,
        conversationGrowthPercent: 24,
        activeSubscriptions: 4,
        monthlyRecurringRevenue: 8950,
        aiConversionRate: 14.2,
        highIntentMessages: 120,
      },
      platformDistribution: [
        { label: 'Shopify', count: 2, percentage: 50 },
        { label: 'WooCommerce', count: 1, percentage: 25 },
        { label: 'Custom API', count: 1, percentage: 25 },
      ],
      revenueConversationTrend: [
        { year: 2026, month: 2, label: '2026-02', revenue: 4500, conversations: 12000 },
        { year: 2026, month: 3, label: '2026-03', revenue: 5200, conversations: 18000 },
        { year: 2026, month: 4, label: '2026-04', revenue: 6100, conversations: 22000 },
        { year: 2026, month: 5, label: '2026-05', revenue: 7300, conversations: 28000 },
        { year: 2026, month: 6, label: '2026-06', revenue: 8100, conversations: 34000 },
        { year: 2026, month: 7, label: '2026-07', revenue: 8950, conversations: 38450 },
      ],
      topIntents: [
        { label: 'Product Query', count: 45, percentage: 45 },
        { label: 'Order Tracking', count: 30, percentage: 30 },
        { label: 'Discounts', count: 15, percentage: 15 },
        { label: 'Returns', count: 10, percentage: 10 },
      ],
      sentimentBreakdown: [
        { label: 'positive', count: 72, percentage: 72 },
        { label: 'neutral', count: 20, percentage: 20 },
        { label: 'negative', count: 8, percentage: 8 },
      ],
      recentStores: [
        {
          id: '565a8bf3-1dac-4809-8fd3-3e27c09f69e5',
          name: 'Prefume',
          platform: 'Shopify',
          shopDomain: 'Prefume.com',
          status: 'Active',
          currency: 'USD',
          language: 'en',
          timezone: 'landon',
          createdAt: '2026-07-27T12:16:00',
          sellerEmail: 'arwa.ali9012@gmail.com',
          sellerName: 'Arwa Mostafa',
          activePlan: 'Basic AI Sales Starter',
          subscriptionStatus: 'Active',
        },
        {
          id: 'dfab9c3f-fee5-4a32-95a7-15d4b66f4a0c',
          name: 'Commerce Store',
          platform: 'WooCommerce',
          shopDomain: 'commerce.com',
          status: 'Active',
          currency: 'EGP',
          language: 'ar',
          timezone: 'Cairo',
          createdAt: '2026-07-23T18:24:44',
          sellerEmail: 'amnarazek2003@gmail.com',
          sellerName: 'Amna Abdelrazek',
          activePlan: 'Basic AI Sales Starter',
          subscriptionStatus: 'Active',
        },
      ],
      mongoHealth: {
        status: 'connected',
        database: 'ai_commerce',
        latencyMs: 14,
        ok: 1,
        checkedAt: new Date().toISOString(),
      },
    };
  }

  if (cleanPath.endsWith('/admin/stores')) {
    return {
      items: [
        {
          id: '565a8bf3-1dac-4809-8fd3-3e27c09f69e5',
          name: 'Prefume',
          platform: 'Shopify',
          shopDomain: 'Prefume.com',
          status: 'Active',
          currency: 'USD',
          language: 'en',
          timezone: 'landon',
          createdAt: '2026-07-27T12:16:00',
          sellerEmail: 'arwa.ali9012@gmail.com',
          sellerName: 'Arwa Mostafa',
          activePlan: 'Basic AI Sales Starter',
          subscriptionStatus: 'Active',
        },
        {
          id: 'dfab9c3f-fee5-4a32-95a7-15d4b66f4a0c',
          name: 'Commerce Store',
          platform: 'WooCommerce',
          shopDomain: 'commerce.com',
          status: 'Active',
          currency: 'EGP',
          language: 'ar',
          timezone: 'Cairo',
          createdAt: '2026-07-23T18:24:44',
          sellerEmail: 'amnarazek2003@gmail.com',
          sellerName: 'Amna Abdelrazek',
          activePlan: 'Basic AI Sales Starter',
          subscriptionStatus: 'Active',
        },
      ],
      page: 1,
      pageSize: 20,
      totalItems: 2,
      totalPages: 1,
    };
  }

  if (cleanPath.endsWith('/admin/plans')) {
    return [
      {
        id: '3cd4e2fb-65c5-4b95-b8e4-fabaeb6fb57f',
        planName: 'Basic AI Sales Starter',
        planDescription: 'Perfect for small e-commerce shops looking to automate customer support 24/7',
        planStatus: 'Active',
        planPrice: 5000,
        activeSubscriptions: 2,
        featureIds: ['6968550b-9260-405d-8b83-b95539693c0a'],
      },
    ];
  }

  if (cleanPath.endsWith('/admin/features')) {
    return [
      {
        id: '6968550b-9260-405d-8b83-b95539693c0a',
        name: 'AI Sales Assistant',
        description: '24/7 automated product inquiry and support bot',
        enabled: true,
      },
    ];
  }

  if (cleanPath.endsWith('/admin/subscriptions')) {
    return {
      summary: {
        activeSubscriptions: 2,
        monthlyRecurringRevenue: 10000,
        totalPlans: 1,
      },
      subscriptions: {
        items: [
          {
            id: 'c5dbb92d-0173-4763-8266-b0bb596c7dff',
            status: 'Active',
            renewalDate: '2026-08-27T14:48:48',
            createdAt: '2026-07-27T14:48:48',
            userId: '168fa26d-1ca2-47ec-4efa-08dee331fde6',
            sellerEmail: 'amnarazek2003@gmail.com',
            planId: '3cd4e2fb-65c5-4b95-b8e4-fabaeb6fb57f',
            planName: 'Basic AI Sales Starter',
            planPrice: 5000,
          },
        ],
        page: 1,
        pageSize: 20,
        totalItems: 1,
        totalPages: 1,
      },
      plans: [
        {
          id: '3cd4e2fb-65c5-4b95-b8e4-fabaeb6fb57f',
          planName: 'Basic AI Sales Starter',
          planDescription: 'Perfect for small e-commerce shops',
          planStatus: 'Active',
          planPrice: 5000,
          activeSubscriptions: 2,
        },
      ],
    };
  }

  if (cleanPath.endsWith('/admin/analytics/ai')) {
    return {
      totalMessages: 38450,
      highIntentMessages: 120,
      conversionRate: 14.2,
      topIntents: [
        { label: 'Product Query', count: 45 },
        { label: 'Order Tracking', count: 30 },
      ],
      sentimentBreakdown: [
        { label: 'positive', count: 72 },
        { label: 'neutral', count: 20 },
        { label: 'negative', count: 8 },
      ],
      productStats: {
        totalProducts: 1,
        totalCategories: 3,
        topCategories: [{ label: 'General', count: 1, percentage: 100 }],
      },
      mongoHealth: {
        status: 'connected',
        database: 'ai_commerce',
        latencyMs: 144,
        ok: 1,
        checkedAt: new Date().toISOString(),
      },
    };
  }

  if (cleanPath.endsWith('/admin/audit-logs')) {
    return {
      items: [
        {
          id: 'b518cb37-e7b5-44b1-a8df-04d3c0839a83',
          userId: '37bdf25c-6830-4704-1518-08dee9d15d56',
          action: 'Auth.Login',
          ipAddress: '::1',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          createdAt: new Date().toISOString(),
        },
      ],
      page: 1,
      pageSize: 20,
      totalItems: 1,
      totalPages: 1,
    };
  }

  return null;
}

import { refreshAccessToken, forceAdminLogout } from './tokenRefresh';
import { getUserErrorMessage } from '../../utils/errorMessage';

// Sentinel error so apiRequest can distinguish 401 from other failures.
class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
    this.name = 'UnauthorizedError';
  }
}

async function parseResponse(response) {
  if (response.status === 401) {
    // Signal to apiRequest that a refresh should be attempted.
    throw new UnauthorizedError();
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(getUserErrorMessage({ response: { status: response.status, data: payload } }, 'We could not complete that request. Please try again.'));
  }

  return payload;
}

export async function apiRequest(path, options = {}) {
  const { method = 'GET', body, headers = {} } = options;

  // Build a fresh fetch call — headers are computed at call-time so that
  // a retry after token refresh picks up the new access token automatically.
  const doFetch = async () => {
    const requestHeaders = { ...getAuthHeaders(), ...headers };
    if (body !== undefined) {
      requestHeaders['Content-Type'] = 'application/json';
    }
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return parseResponse(response);
  };

  try {
    return await doFetch();
  } catch (err) {
    // ── 401 handling: attempt one token refresh + one retry ──
    if (err instanceof UnauthorizedError) {
      try {
        await refreshAccessToken();
      } catch (_refreshErr) {
        // Refresh failed (invalid/expired refresh token or network error).
        forceAdminLogout();
        throw new Error('Session expired');
      }

      // Refresh succeeded — retry the original request exactly once.
      try {
        return await doFetch();
      } catch (retryErr) {
        // If the retry also returns 401, the session is unrecoverable.
        if (retryErr instanceof UnauthorizedError) {
          forceAdminLogout();
        }
        throw retryErr;
      }
    }

    // Non-401 errors pass through unchanged.
    throw err;
  }
}

export function buildQueryString(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export { API_BASE_URL };
