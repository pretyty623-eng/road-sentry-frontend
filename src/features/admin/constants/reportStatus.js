export const REPORT_STATUS = {
  submitted: { label: 'Dikirim', color: 'status-submitted', icon: 'FaClock' },
  validated: { label: 'Tervalidasi', color: 'status-validated', icon: 'FaRobot' },
  prioritized: { label: 'Diprioritaskan', color: 'status-prioritized', icon: 'FaChartLine' },
  reviewed: { label: 'Ditinjau', color: 'status-reviewed', icon: 'FaEye' },
  in_progress: { label: 'Dikerjakan', color: 'status-progress', icon: 'FaTools' },
  resolved: { label: 'Selesai', color: 'status-resolved', icon: 'FaCheckCircle' },
  rejected: { label: 'Ditolak', color: 'status-rejected', icon: 'FaTimesCircle' }
};

export const PRIORITY_LABELS = {
  high: { label: 'Tinggi', color: 'priority-high', icon: 'FaExclamationTriangle' },
  medium: { label: 'Sedang', color: 'priority-medium', icon: 'FaExclamationCircle' },
  low: { label: 'Rendah', color: 'priority-low', icon: 'FaCheck' }
};

export const STATUS_OPTIONS = [
  { value: '', label: 'Semua Status' },
  { value: 'submitted', label: 'Dikirim' },
  { value: 'validated', label: 'Tervalidasi' },
  { value: 'prioritized', label: 'Diprioritaskan' },
  { value: 'reviewed', label: 'Ditinjau' },
  { value: 'in_progress', label: 'Dikerjakan' },
  { value: 'resolved', label: 'Selesai' },
  { value: 'rejected', label: 'Ditolak' }
];

export const PRIORITY_OPTIONS = [
  { value: '', label: 'Semua Prioritas' },
  { value: 'high', label: 'Tinggi' },
  { value: 'medium', label: 'Sedang' },
  { value: 'low', label: 'Rendah' }
];