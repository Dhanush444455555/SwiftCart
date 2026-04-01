import axios from 'axios';
import Cookie from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
    const token = Cookie.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle responses
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response ? .status === 401) {
            Cookie.remove('token');
            Cookie.remove('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;