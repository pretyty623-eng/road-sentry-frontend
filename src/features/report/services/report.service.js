import api from '../../../services/axios';

export const reportService = {
  submitReport: async (data) => {
    const formData = new FormData();
    formData.append('image', data.image);
    formData.append('latitude', data.latitude);
    formData.append('longitude', data.longitude);
    formData.append('description', data.description);

    const response = await api.post('/reports', formData);
    return response.data;
  },

  getReportById: async (reportId) => {
    const response = await api.get(`/reports/${reportId}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/reports/stats')
    return response.data;
  }
};