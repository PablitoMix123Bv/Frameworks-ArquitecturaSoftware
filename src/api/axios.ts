import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', // URL de tu Backend
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor: Antes de cada petición, pega el Token si existe
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;