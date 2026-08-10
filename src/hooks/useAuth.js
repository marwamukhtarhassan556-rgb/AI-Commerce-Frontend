import { useState, useEffect } from 'react';
import { isAuthenticated, decodeToken } from '../api/authService';

export const useAuth = () => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    role: null,
    userId: null,
    email: null,
    isLoading: true,
  });

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = isAuthenticated();
      if (loggedIn) {
        const token = localStorage.getItem('token');
        const details = decodeToken(token);
        setAuthState({
          isLoggedIn: true,
          role: details?.role || localStorage.getItem('userRole'),
          userId: details?.userId || localStorage.getItem('userId'),
          email: details?.email || localStorage.getItem('userEmail'),
          isLoading: false,
        });
      } else {
        setAuthState({
          isLoggedIn: false,
          role: null,
          userId: null,
          email: null,
          isLoading: false,
        });
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return authState;
};

export default useAuth;