import axios from 'axios';

// Ek Axios instance banayein
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Request interceptor (Token ko har request ke saath bhejta hai)
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

// Response interceptor (401 error - yaani token invalid - ko handle karta hai)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token invalid ya expire ho gaya hai
      localStorage.removeItem('token');
      // Auth screen par wapas bhej dein
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;

