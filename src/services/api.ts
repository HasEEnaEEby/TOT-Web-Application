import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const API_VERSION = '/api/v1';

// Log configuration in development
if (import.meta.env.DEV) {
  console.log('API Configuration:', {
    baseURL: `${API_BASE_URL}${API_VERSION}`,
    env: import.meta.env.MODE
  });
}

// Custom type for FormData methods
type FormDataMethod = <T = object, R = AxiosResponse<T>>(
  url: string, 
  data: FormData, 
  config?: AxiosRequestConfig
) => Promise<R>;

// Extend AxiosInstance with custom methods
interface CustomAxiosInstance extends AxiosInstance {
  postForm: FormDataMethod;
  putForm: FormDataMethod;
}

// Create the API instance with custom type
const api = axios.create({
  baseURL: `${API_BASE_URL}${API_VERSION}`,
  headers: {
    'Accept': 'application/json'
  },
  withCredentials: true,
  timeout: 25000 
}) as CustomAxiosInstance;

// Helper function to determine content type
const getContentType = (config: InternalAxiosRequestConfig) => {
  if (config.data instanceof FormData) {
    return 'multipart/form-data'; // Explicitly set for FormData
  }
  return 'application/json';
};

api.interceptors.request.use(
  (config) => {
    // Set dynamic content type
    config.headers['Content-Type'] = getContentType(config);

    // Add token if exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data instanceof FormData 
          ? 'FormData (contents hidden)' 
          : JSON.stringify(config.data),
          token: token ? 'Present' : 'Missing'
      });

      // Additional debugging for FormData
      if (config.data instanceof FormData) {
        for (const [key, value] of config.data.entries()) {
          console.log(`FormData - ${key}:`, value);
        }
      }
    }

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    // Log errors in development
    if (import.meta.env.DEV) {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data
      });
    }

    // Network error handling
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    // Extract error message
    const errorMessage = 
      error.response.data?.message || 
      error.response.data?.error || 
      'Something went wrong';

    // Error handling by status code
    switch (error.response.status) {
      case 400:
        toast.error(errorMessage);
        break;
      case 401:
        // Clear authentication
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.error('Session expired. Please login again.');
        // Redirect to login page
        window.location.href = '/login';
        break;
      case 403:
        toast.error('Access denied');
        break;
      case 404:
        toast.error('Resource not found');
        break;
      case 422:
        toast.error(errorMessage);
        break;
      case 429:
        toast.error('Too many requests. Please try again later.');
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

// Utility methods for different request types
api.postForm = (url, data, config = {}) => 
  api.post(url, data, {
    ...config,
    headers: {
      'Content-Type': 'multipart/form-data',
      ...config.headers
    }
  });

api.putForm = (url, data, config = {}) => 
  api.put(url, data, {
    ...config,
    headers: {
      'Content-Type': 'multipart/form-data',
      ...config.headers
    }
  });

export default api;