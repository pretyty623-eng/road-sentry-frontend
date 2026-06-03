import { useState, useEffect } from 'react';
import axios from '../../../services/axios.js';
import {
  FiSend,
  FiCpu,
  FiCheckCircle,
  FiTarget,
  FiEye,
  FiTool,
  FiAward,
  FiXCircle,
  FiLoader,
  FiInfo
} from 'react-icons/fi';
import {
  PiTrafficConeBold,
  PiRoadHorizonBold
} from 'react-icons/pi';
import { TbAlertTriangle } from 'react-icons/tb'
import { BsLightbulb } from 'react-icons/bs';

const STATUS_CONFIG = {
  submitted:   { icon: FiSend,       label: 'Terkirim',  color: 'blue' },
  validating:  { icon: FiCpu,        label: 'Divalidasi', color: 'yellow' },
  validated:   { icon: FiCheckCircle,label: 'Valid',      color: 'yellow' },
  prioritized: { icon: FiTarget,     label: 'Diterima',   color: 'green' },
  reviewed:    { icon: FiEye,        label: 'Ditinjau',   color: 'blue' },
  in_progress: { icon: FiTool,       label: 'Diproses',   color: 'blue' },
  resolved:    { icon: FiAward,      label: 'Selesai',    color: 'green' },
  rejected:    { icon: FiXCircle,    label: 'Ditolak',    color: 'red' }
};

const SEVERITY_CONFIG = {
  high:   { label: 'Parah',  color: '#E24B4A' },
  medium: { label: 'Sedang', color: '#EF9F27' },
  low:    { label: 'Ringan', color: '#639922' }
};

export default function ReportStatus({ reportId, originalImage }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null); // null | { src, alt }

  // Tutup lightbox dengan Esc
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Polling status
  useEffect(() => {
    if (!reportId) return;

    const poll = async () => {
      try {
        const res = await axios.get(`/reports/${reportId}/status`);
        setData(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Gagal fetch status:', err);
        setLoading(false);
      }
    };

    poll();

    const pendingStatuses = ['submitted', 'validating', 'validated'];
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`/reports/${reportId}/status`);
        const newData = res.data.data;
        setData(newData);
        if (!pendingStatuses.includes(newData.status)) {
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [reportId]);

  const getStatusClass = (status) => {
    const colorMap = { blue: 'blue', yellow: 'yellow', green: 'green', red: 'red' };
    const color = STATUS_CONFIG[status]?.color || 'gray';
    return {
      cardClass:       `status-card status-card-${colorMap[color] || 'gray'}`,
      iconWrapperClass:`status-icon-wrapper status-icon-wrapper-${colorMap[color] || 'gray'}`,
      iconClass:       `status-icon status-icon-${colorMap[color] || 'gray'}`,
      labelClass:      `status-label-text status-label-text-${colorMap[color] || 'gray'}`,
      messageClass:    `status-message status-message-${colorMap[color] || 'gray'}`,
      idBorderClass:   `status-id-section status-id-section-${colorMap[color] || 'gray'}`,
      idValueClass:    `status-id-value status-id-value-${colorMap[color] || 'gray'}`
    };
  };

  if (loading) {
    return (
      <div className="status-loading">
        <FiLoader />
        <span>Memuat status...</span>
      </div>
    );
  }

  if (!data) return null;

  const config      = STATUS_CONFIG[data.status] || STATUS_CONFIG.submitted;
  const StatusIcon  = config.icon;
  const isPending   = ['submitted', 'validating', 'validated'].includes(data.status);
  const severity    = SEVERITY_CONFIG[data.aiResult?.severityHint];
  const statusClasses = getStatusClass(data.status);
  const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  return (
    <div className="report-status-container">

      {/* Lightbox overlay — di luar semua card supaya z-index aman */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out'
          }}
        >
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 8, objectFit: 'contain' }}
          />
        </div>
      )}

      {/* Status card */}
      <div className={statusClasses.cardClass}>
        <div className="status-header">
          <div className={statusClasses.iconWrapperClass}>
            <StatusIcon className={statusClasses.iconClass} />
          </div>
          <div className="status-info">
            <div className="status-label">
              <span className={statusClasses.labelClass}>{config.label}</span>
              {isPending && <FiLoader className="status-spinner" />}
            </div>
            <p className={statusClasses.messageClass}>{data.message}</p>
          </div>
        </div>
        <div className={statusClasses.idBorderClass}>
          <p className="status-id-label">ID Laporan</p>
          <p className={statusClasses.idValueClass}>{data.reportId}</p>
        </div>
      </div>

      {/* Hasil AI */}
      {data.aiResult && data.status !== 'rejected' && (
        <div className="ai-result-card">
          <div className="ai-result-header">
            <FiCpu />
            <p>Hasil Analisis AI</p>
          </div>

          <div className="ai-result-body">
            {/* Stats kerusakan */}
            <div className="ai-stats-grid">
              <div className="stat-card-pothole">
                <PiTrafficConeBold className="stat-icon stat-icon-pothole" />
                <p className="stat-value stat-value-pothole">{data.aiResult.potholeCount}</p>
                <p className="stat-label stat-label-pothole">Lubang</p>
              </div>
              <div className="stat-card-crack">
                <PiRoadHorizonBold className="stat-icon stat-icon-crack" />
                <p className="stat-value stat-value-crack">{data.aiResult.crackCount}</p>
                <p className="stat-label stat-label-crack">Retak</p>
              </div>
              <div
                className="stat-card-severity"
                style={{
                  backgroundColor: severity ? severity.color + '15' : '#f3f4f6',
                  borderColor:     severity ? severity.color + '30' : '#e5e7eb'
                }}
              >
                <TbAlertTriangle className="stat-icon" style={{ color: severity?.color || '#6b7280' }} />
                <p className="stat-value" style={{ color: severity?.color || '#6b7280', fontSize: '0.875rem' }}>
                  {severity?.label || '-'}
                </p>
                <p className="stat-label" style={{ color: severity?.color || '#6b7280' }}>Tingkat</p>
              </div>
            </div>

            {/* Foto perbandingan */}
            {data.aiResult.annotatedImage && (
              <div>
                <p className="image-compare-title">Hasil Deteksi</p>
                <div className="image-grid">
                  <div className="image-box">
                    <p className="image-label">Foto Asli</p>
                    <img
                      src={`${BACKEND_URL}${originalImage}`}
                      alt="Foto asli"
                      className="image-preview"
                      style={{ cursor: 'zoom-in' }}
                      onClick={() => setLightbox({ src: `${BACKEND_URL}${originalImage}`, alt: 'Foto asli' })}
                      onError={e => e.target.style.display = 'none'}
                    />
                  </div>
                  <div className="image-box">
                    <p className="image-label">Deteksi AI</p>
                    <img
                      src={data.aiResult.annotatedImage}
                      alt="Hasil deteksi AI"
                      className="image-preview"
                      style={{ cursor: 'zoom-in' }}
                      onClick={() => setLightbox({ src: data.aiResult.annotatedImage, alt: 'Hasil deteksi AI' })}
                    />
                  </div>
                </div>
                <div className="ai-info-note">
                  <FiInfo />
                  <p>Kotak pada gambar menunjukkan area kerusakan yang terdeteksi</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tips jika ditolak */}
      {data.status === 'rejected' && (
        <div className="tips-card">
          <div className="tips-header">
            <BsLightbulb className="tips-icon" />
            <div>
              <p className="tips-title">Tips Foto yang Baik</p>
              <ul className="tips-list">
                <li><FiCheckCircle /> Pastikan kerusakan jalan terlihat jelas</li>
                <li><FiCheckCircle /> Ambil foto saat pencahayaan cukup</li>
                <li><FiCheckCircle /> Jangan terlalu jauh dari kerusakan</li>
                <li><FiCheckCircle /> Pastikan foto tidak buram</li>
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}