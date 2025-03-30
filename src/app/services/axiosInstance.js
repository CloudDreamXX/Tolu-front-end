import axios from 'axios';
import { EXCLUDE_TOKEN_ENDPOINTS } from './config';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const isExcluded = EXCLUDE_TOKEN_ENDPOINTS.some((endpoint) =>
      config.url.endsWith(endpoint)
    );

    if (!isExcluded) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
