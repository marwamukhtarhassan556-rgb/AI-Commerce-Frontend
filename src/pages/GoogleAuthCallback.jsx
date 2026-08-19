import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, XCircle } from 'lucide-react';
import { decodeToken, getRedirectPathByRole, normalizeRole } from '../api/authService';

/**
 * GoogleAuthCallback
 * ------------------
 * Handles the redirect from the .NET backend after Google OAuth completes.
 *
 * The backend redirects to one of these URLs (all supported):
 *   /auth/google/callback?token=xxx&refreshToken=yyy&role=zzz&...
 *   /auth/callback?token=xxx&...
 *   /signin?token=xxx&...   (legacy)
 *
 * Query params the backend may return:
 *   token / accessToken          — JWT access token
 *   refreshToken                 — refresh token
 *   aiToken / aiAccessToken      — AI service token
 *   role                         — user role
 *   userId / user_id             — user ID
 *   organizationId               — org ID
 *   storeId / store_id           — store ID
 *   email                        — user email
 *   firstName / first_name       — first name
 *   lastName / last_name         — last name
 *   profilePictureUrl            — avatar URL
 *   error                        — error message from backend
 */
export default function GoogleAuthCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const backendError = params.get('error') || params.get('error_description');
    if (backendError) {
      setErrorMessage(backendError);
      return;
    }

    const token =
      params.get('token') ||
      params.get('accessToken') ||
      params.get('access_token');

    if (!token) {
      setErrorMessage(
        'Google authentication did not return a valid session token. Please try signing in again.',
      );
      return;
    }

    // ─── Persist all session data ───────────────────────────────────────────
    localStorage.setItem('token', token);

    const refreshToken = params.get('refreshToken') || params.get('refresh_token');
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

    const aiToken = params.get('aiToken') || params.get('aiAccessToken') || params.get('ai_token');
    localStorage.setItem('aiToken', aiToken || token);

    const userId = params.get('userId') || params.get('user_id');
    if (userId) localStorage.setItem('userId', userId);

    const storeId = params.get('storeId') || params.get('store_id');
    if (storeId) {
      localStorage.setItem('storeId', storeId);
      localStorage.setItem('currentStoreId', storeId);
    }

    const organizationId = params.get('organizationId') || params.get('organization_id') || params.get('orgId') || params.get('org_id') || storeId;
    if (organizationId) {
      localStorage.setItem('organizationId', String(organizationId));
      localStorage.setItem('orgId', String(organizationId));
    }

    // ─── Role normalisation ────────────────────────────────────────────────
    const tokenDetails = decodeToken(token);
    const rawRole =
      params.get('role') ||
      tokenDetails?.role ||
      tokenDetails?.Role ||
      'seller';
    const role = normalizeRole(rawRole);
    localStorage.setItem('userRole', role);

    // ─── Persist profile data ──────────────────────────────────────────────
    const email =
      params.get('email') || tokenDetails?.email || params.get('userEmail') || '';
    if (email) localStorage.setItem('userEmail', email);

    const firstName = params.get('firstName') || params.get('first_name') || tokenDetails?.firstName || '';
    const lastName  = params.get('lastName')  || params.get('last_name')  || tokenDetails?.lastName  || '';
    const name = [firstName, lastName].filter(Boolean).join(' ');
    const profilePictureUrl = params.get('profilePictureUrl') || params.get('profile_picture_url') || '';

    let currentProfile = {};
    try { currentProfile = JSON.parse(localStorage.getItem('merchantProfile') || '{}'); } catch { /* ignore */ }
    localStorage.setItem('merchantProfile', JSON.stringify({
      ...currentProfile,
      firstName,
      lastName,
      name,
      email,
      profilePictureUrl,
    }));
    window.dispatchEvent(new Event('merchant-profile-updated'));

    // ─── Redirect ──────────────────────────────────────────────────────────
    const redirectPath = role === 'super-admin'
      ? getRedirectPathByRole(role)
      : (storeId ? '/merchant/dashboard' : '/onboarding?step=3');

    navigate(redirectPath, { replace: true });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-900/40">
          <XCircle className="h-8 w-8 text-rose-400" />
        </div>
        <h1 className="text-xl font-bold text-white">Google Sign-In Failed</h1>
        <p className="max-w-sm text-sm text-slate-400">{errorMessage}</p>
        <button
          type="button"
          onClick={() => navigate('/signin', { replace: true })}
          className="mt-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-all"
        >
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-5 text-center">
      <Loader2 className="h-10 w-10 animate-spin text-indigo-400" />
      <p className="text-sm font-medium text-slate-400">
        Completing Google sign-in, please wait…
      </p>
    </div>
  );
}
