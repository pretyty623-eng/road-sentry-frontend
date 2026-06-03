const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

export const resolveMediaUrl = (value) => {
  if (!value) return '';

  if (/^(https?:|data:|blob:)/i.test(value)) {
    return value;
  }

  const path = value.startsWith('/') ? value : `/${value}`;
  return `${BACKEND_ORIGIN}${path}`;
};

export const getReportImageUrl = (reportId, fallback) => {
  if (reportId) return `${API_BASE_URL}/reports/${reportId}/image`;
  return resolveMediaUrl(fallback);
};
