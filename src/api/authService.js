import api from './axiosConfig';
import { jwtDecode } from 'jwt-decode';

const normalizeMerchantProfile = (profile = {}) => {
  const firstName = profile.firstName || profile.first_name || '';
  const lastName = profile.lastName || profile.last_name || '';
  const name = profile.name || [firstName, lastName].filter(Boolean).join(' ') || '';
  const email = profile.email || profile.userEmail || '';

  return {
    firstName,
    lastName,
    name,
    email,
  };
};

const saveMerchantProfile = (profile = {}) => {
  const normalizedProfile = normalizeMerchantProfile(profile);
  localStorage.setItem('merchantProfile', JSON.stringify(normalizedProfile));
  return normalizedProfile;
};

const firstDefined = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== '');

const saveOrRemove = (key, value) => {
  if (value === undefined || value === null || value === '') {
    localStorage.removeItem(key);
    return;
  }
  localStorage.setItem(key, String(value));
};

// بيفك شفرة التوكين ويطلع الـ Role والبيانات
export const decodeToken = (token) => {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    
    const role =
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'] ||
      decoded['role'] ||
      decoded['Roles'] ||
      (Array.isArray(decoded['roles']) ? decoded['roles'][0] : decoded['roles']) ||
      'Seller';

    const email =
      decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
      decoded['email'] ||
      decoded['sub'] ||
      '';

    const userId =
      decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
      decoded['nameid'] ||
      decoded['userId'] ||
      decoded['sub'] ||
      '';

    const organizationId =
      decoded.organizationId ||
      decoded.organization_id ||
      decoded.orgId ||
      decoded.org_id ||
      decoded.tenantId ||
      decoded.tenant_id ||
      '';

    return { decoded, role, email, userId, organizationId };
  } catch (err) {
    console.error('JWT decode failed:', err);
    return null;
  }
};

// بيرجع المسار حسب الـ Role
export const normalizeRole = (role) => {
  if (!role) return 'seller';
  const normalized = String(role).toLowerCase().trim();
  if (normalized === 'superadmin' || normalized === 'super-admin' || normalized === 'super_admin') {
    return 'super-admin';
  }
  return normalized;
};

export const getRedirectPathByRole = (role) => {
  if (!role) return '/merchant/dashboard';
  const lowerRole = normalizeRole(role);
  if (lowerRole === 'super-admin') return '/admin/dashboard';
  if (lowerRole.includes('seller') || lowerRole.includes('merchant') || lowerRole.includes('admin')) {
    return '/merchant/dashboard';
  }
  return '/dashboard';
};

// بيشيك لو المستخدم مسجل دخول والتوكين لسه صالح
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp && decoded.exp < currentTime) {
      logoutUser();
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

// بيجيب الـ Role الحالي
export const getCurrentUserRole = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const details = decodeToken(token);
  return details?.role || localStorage.getItem('userRole') || null;
};

// Login
export const loginUser = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password });
  const data = response.data;

  const token = data.token || data.accessToken;
  const aiToken = data.aiToken || data.aiAccessToken;
  const refreshToken = data.refreshToken;
  const tokenDetails = decodeToken(token);
  const aiTokenDetails = decodeToken(aiToken);
  const user = data.user || data.profile || {};
  const userId = firstDefined(
    data.userId,
    data.user_id,
    user.id,
    user.userId,
    user.user_id,
    tokenDetails?.userId,
    aiTokenDetails?.userId,
  );
  const organizationId = firstDefined(
    data.organizationId,
    data.organization_id,
    data.orgId,
    data.org_id,
    user.organizationId,
    user.organization_id,
    user.orgId,
    user.org_id,
    tokenDetails?.organizationId,
    aiTokenDetails?.organizationId,
  );
  const userEmail = firstDefined(data.email, user.email, tokenDetails?.email, email);
  const storeId = firstDefined(data.storeId, data.store_id, user.storeId, user.store_id);
  const role = tokenDetails?.role || data.role || 'Seller';

  if (token) localStorage.setItem('token', token);
  if (aiToken) localStorage.setItem('aiToken', aiToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
  if (role) localStorage.setItem('userRole', role);
  saveOrRemove('userId', userId);
  saveOrRemove('organizationId', organizationId);
  localStorage.removeItem('orgId');
  saveOrRemove('userEmail', userEmail);
  saveMerchantProfile({
    firstName: data.firstName || data.first_name || user.firstName || user.first_name || '',
    lastName: data.lastName || data.last_name || user.lastName || user.last_name || '',
    name: data.name || user.name || '',
    email: userEmail,
  });
  saveOrRemove('storeId', storeId);
  saveOrRemove('currentStoreId', storeId);

  return {
    ...data,
    token,
    role,
    redirectPath: getRedirectPathByRole(role),
  };
};

// Register
export const registerUser = async ({ firstName, lastName, email, password, confirmPassword }) => {
  const response = await api.post('/api/auth/register', {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
  });
  return response.data;
};

// Forgot Password
export const forgotPasswordUser = async (email) => {
  const response = await api.post('/api/auth/forgot-password', { email });
  return response.data;
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('aiToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  localStorage.removeItem('organizationId');
  localStorage.removeItem('orgId');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('storeId');
  localStorage.removeItem('currentStoreId');
  localStorage.removeItem('merchantProfile');
  window.location.href = '/signin';
};
