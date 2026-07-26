import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:7041', // استبدل ده بالـ URL اللي بيظهرلك لما تشغل الباك إند (dotnet run )
    headers: {
        'Content-Type': 'application/json'
    }
});

// إضافة الـ Token تلقائياً لكل طلب لو المستخدم مسجل دخول
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
