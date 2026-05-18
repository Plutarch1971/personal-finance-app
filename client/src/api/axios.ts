import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || '';
const cleanApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

const api = axios.create({
    baseURL: `${cleanApiUrl}/api`,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;