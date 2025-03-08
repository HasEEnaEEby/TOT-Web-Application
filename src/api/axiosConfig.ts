// src/api/axiosConfig.ts
import axios from 'axios';

// Determine base URL with more verbose logging
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';
console.log('🔧 API Configuration:', { 
  baseURL, 
  env: import.meta.env.MODE,
  fullEnv: import.meta.env 
});

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true, // Important for cookies/auth
  timeout: 10000
});

// Request interceptor with extensive logging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('📤 Axios Request:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      params: config.params,
      data: config.data
    });

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Authorization header set');
    } else {
      console.warn('⚠️ No auth token found');
    }
    return config;
  },
  (error) => {
    console.error('❌ Axios Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with comprehensive error tracking
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Axios Response:', {
      status: response.status,
      data: response.data,
      url: response.config.url
    });
    return response;
  },
  (error) => {
    console.error('❌ Axios Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
      message: error.message,
      fullError: error
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;