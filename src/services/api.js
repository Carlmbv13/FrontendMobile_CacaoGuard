// services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// CHANGE THIS TO YOUR COMPUTER'S IP ADDRESS
const IP_ADDRESS = '192.168.100.212'; // Make sure this is correct!
const API_BASE_URL = `http://${IP_ADDRESS}:8000/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });
          await AsyncStorage.setItem('access_token', response.data.access);
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return api(originalRequest);
        } catch (refreshError) {
          await AsyncStorage.clear();
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs - MAKE SURE THESE ARE EXPORTED
export const register = (userData) => {
  console.log('Making API call to:', `${API_BASE_URL}/auth/register/`);
  console.log('With data:', userData);
  return api.post('/auth/register/', userData);
};

export const login = (credentials) => api.post('/auth/login/', credentials);
export const getProfile = () => api.get('/users/me/');

// Email Verification APIs
export const verifyEmail = (token) => api.post('/auth/verify-email/', { token });
export const resendVerificationEmail = (email) => api.post('/auth/resend-verification/', { email });

// Other APIs
export const getFarms = () => api.get('/farms/');
export const getFarm = (id) => api.get(`/farms/${id}/`);
export const createFarm = (data) => api.post('/farms/', data);
export const updateFarm = (id, data) => api.put(`/farms/${id}/`, data);
export const deleteFarm = (id) => api.delete(`/farms/${id}/`);
export const getScans = (params) => api.get('/scans/', { params });
export const createScan = (data) => api.post('/scans/', data);
export const getAlerts = () => api.get('/alerts/');
export const updateAlertStatus = (id, status) => api.patch(`/alerts/${id}/update_status/`, { status });
export const getDashboardStats = () => api.get('/dashboard/stats/');

export const API_URL = API_BASE_URL;
export default api;