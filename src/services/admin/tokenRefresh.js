// ─────────────────────────────────────────────
// Super Admin — Automatic Token Refresh (Mutex-Protected)
//
// Uses raw fetch() to avoid triggering any axios interceptors.
// A single in-flight refresh promise is shared across all callers
// so that concurrent 401s result in exactly ONE refresh request.
// ─────────────────────────────────────────────

const API_BASE_URL =
  (import.meta?.env?.VITE_API_BASE_URL) ?? 'https://aisales123.runasp.net';

const REFRESH_ENDPOINT = `${API_BASE_URL}/api/auth/refresh-token`;

/** @type {Promise<string> | null} */
let refreshPromise = null;

/**
 * Attempt to refresh the access token using the stored refresh token.
 *
 * Mutex behaviour:
 *  - If a refresh is already in-flight, every subsequent caller receives
 *    the **same** promise, ensuring only one network request is made.
 *  - Once the request settles the mutex is released for future calls.
 *
 * @returns {Promise<string>} The new access token.
 * @throws  If no refresh token is available or the backend rejects it.
 */
export async function refreshAccessToken() {
  // Reuse in-flight refresh (mutex)
  if (refreshPromise) return refreshPromise;

  refreshPromise = executeRefresh().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

// ── Internal ────────────────────────────────

async function executeRefresh() {
  const storedRefreshToken = localStorage.getItem('refreshToken');

  if (!storedRefreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(REFRESH_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: storedRefreshToken }),
  });

  if (!response.ok) {
    // 401 = invalid/expired/revoked refresh token; any other error = server issue.
    // In both cases the caller should treat it as an unrecoverable auth failure.
    throw new Error('Token refresh failed');
  }

  const data = await response.json();

  // The backend may return the access token as "token" or "accessToken".
  const newAccessToken = data.token || data.accessToken;
  const newRefreshToken = data.refreshToken;

  if (newAccessToken) {
    localStorage.setItem('token', newAccessToken);
  }

  // Backend rotates refresh tokens — always store the latest one.
  if (newRefreshToken) {
    localStorage.setItem('refreshToken', newRefreshToken);
  }

  return newAccessToken;
}

// ── Logout helper ───────────────────────────

const AUTH_KEYS = [
  'token',
  'aiToken',
  'refreshToken',
  'userRole',
  'userId',
  'userEmail',
  'storeId',
  'currentStoreId',
  'merchantProfile',
];

/**
 * Clear all authentication state and redirect to the sign-in page.
 * Safe to call multiple times (idempotent).
 */
export function forceAdminLogout() {
  AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
  window.location.href = '/signin';
}
