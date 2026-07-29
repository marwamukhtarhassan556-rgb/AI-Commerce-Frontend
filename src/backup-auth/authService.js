import api from './axiosConfig';
import { jwtDecode } from 'jwt-decode';

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

    return { decoded, role, email, userId };
  } catch (err) {
    console.error('JWT decode failed:', err);
    return null;
  }
};

// بيرجع المسار حسب الـ Role
export const getRedirectPathByRole = (role) => {
  if (!role) return '/merchant/dashboard';
  const lowerRole = String(role).toLowerCase();
  if (lowerRole.includes('admin')) {
    return '/admin/dashboard';
  } else if (lowerRole.includes('seller') || lowerRole.includes('merchant')) {
    return '/merchant/dashboard';
  } else {
    return '/dashboard';
  }
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
  const refreshToken = data.refreshToken;
  const userId = data.userId;
  const userEmail = data.email || email;

  const tokenDetails = decodeToken(token);
  const role = tokenDetails?.role || data.role || 'Seller';

  if (token) localStorage.setItem('token', token);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
  if (role) localStorage.setItem('userRole', role);
  if (userId) localStorage.setItem('userId', userId);
  if (userEmail) localStorage.setItem('userEmail', userEmail);

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
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  window.location.href = '/signin';
};