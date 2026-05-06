import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// CHANGE THIS TO YOUR COMPUTER'S IP ADDRESS
// Run 'ipconfig' in CMD to find your IP
const IP_ADDRESS = '172.20.80.1'; // CHANGE THIS!
const API_BASE_URL = `http://172.20.80.1:8000/api`;

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

export const API_URL = API_BASE_URL;

// Auth APIs
export const register = (userData) => api.post('/auth/register/', userData);
export const login = (credentials) => api.post('/auth/login/', credentials);
export const getProfile = () => api.get('/users/me/');

// Farm APIs
export const getFarms = () => api.get('/farms/');
export const getFarm = (id) => api.get(`/farms/${id}/`);
export const createFarm = (data) => api.post('/farms/', data);
export const updateFarm = (id, data) => api.put(`/farms/${id}/`, data);
export const deleteFarm = (id) => api.delete(`/farms/${id}/`);

// Scan APIs
export const getScans = (params) => api.get('/scans/', { params });
export const createScan = (data) => api.post('/scans/', data);

// Alert APIs
export const getAlerts = () => api.get('/alerts/');
export const updateAlertStatus = (id, status) => 
  api.patch(`/alerts/${id}/update_status/`, { status });

// Dashboard API
export const getDashboardStats = () => api.get('/dashboard/stats/');

export default api;