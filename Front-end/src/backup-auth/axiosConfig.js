import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5261',
  headers: {
    'Content-Type': 'application/json',
  },
});

// بيضيف التوكين تلقائي في كل طلب
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// لو الباك رجع 401 (مش مسموح) → يمسح التوكين ويروح لـ SignIn
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      
      if (window.location.pathname !== '/signin') {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

export default api;