import axios from 'axios';

const api = axios.create({
    baseURL: process.env.API_BASE_URL || 'https://apptasksfullstack.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
  
export default api; 