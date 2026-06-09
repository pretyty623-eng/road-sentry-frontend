import axios from 'axios';
import { adminAuthService } from './adminAuth.service';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = adminAuthService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const adminService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get('/reports/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  },

  // Get all reports with pagination and filters
  getReports: async (params = {}) => {
    try {
      const { page = 1, limit = 10, status = '', priority = '', search = '' } = params;
      const response = await api.get('/reports', {
        params: { page, limit, status, priority, search }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      throw error;
    }
  },

// Get reports untuk GIS map
getMapReports: async () => {
  try {
    const response = await api.get('/reports/map');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch map reports:', error);
    throw error;
  }
},

  // Get single report by ID
  getReportById: async (id) => {
    try {
      const response = await api.get(`/reports/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch report:', error);
      throw error;
    }
  },

  // Update report status
  updateReportStatus: async (id, status) => {
    try {
      const response = await api.patch(`/reports/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Failed to update report status:', error);
      throw error;
    }
  },

  // Get urgent reports (high priority)
  getUrgentReports: async () => {
    try {
      const response = await api.get('/reports', {
        params: { priority: 'high', limit: 5 }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch urgent reports:', error);
      throw error;
    }
  }
};
