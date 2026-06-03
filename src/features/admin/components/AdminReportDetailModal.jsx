import { useEffect, useState } from 'react';
import {
  FaTimes,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaExpand,
  FaCamera,
  FaRobot,
  FaChartLine,
  FaInfoCircle,
  FaImage,
  FaCheckCircle
} from 'react-icons/fa';
import { getReportImageUrl, resolveMediaUrl } from '../../../utils/mediaUrl';

const BREAKDOWN_ITEMS = [
  { key: 'severityScore', label: 'Tingkat Kerusakan', color: '#ef4444' },
  { key: 'trafficScore', label: 'Kategori Jalan', color: '#f97316' },
  { key: 'publicFacilityScore', label: 'Fasilitas Publik', color: '#eab308' },
  { key: 'frequencyScore', label: 'Frekuensi Laporan', color: '#3b82f6' },
  { key: 'ageScore', label: 'Usia Kerusakan', color: '#8b5cf6' },
];

const PRIORITY_STYLE = {
  high: { bgClass: 'modal-priority-badge-high', textClass: 'modal-priority-label-high', scoreClass: 'modal-priority-score-high', label: 'Tinggi' },
  medium: { bgClass: 'modal-priority-badge-medium', textClass: 'modal-priority-label-medium', scoreClass: 'modal-priority-score-medium', label: 'Sedang' },
  low: { bgClass: 'modal-priority-badge-low', textClass: 'modal-priority-label-low', scoreClass: 'modal-priority-score-low', label: 'Rendah' },
};


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AdminReportDetailModal = ({ isOpen, report, onClose, onStatusChange }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('foto');
  const [lightbox, setLightbox] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    if (!isOpen || !report?.reportId) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setDetail(null);
      setActiveTab('foto');
      setImageErrors({});
      setLoading(true);

      fetch(`${API_BASE_URL}/reports/${report.reportId}`, { signal: controller.signal })
        .then(r => r.json())
        .then(res => setDetail(res.data))
        .catch(error => {
          if (error.name !== 'AbortError') console.error(error);
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 0);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [isOpen, report?.reportId]);

  useEffect(() => {
    if (!lightbox) return;
    const handler = e => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox]);

  if (!isOpen || !report) return null;

  const data = detail ?? report;

  const getPriorityStyle = (label) => {
    if (label === 'high') return PRIORITY_STYLE.high;
    if (label === 'medium') return PRIORITY_STYLE.medium;
    return PRIORITY_STYLE.low;
  };

  const priorityStyle = getPriorityStyle(data.priorityBreakdown?.priorityLabel);

  // Helper untuk mendapatkan URL gambar anotasi
  const getAnnotatedImageUrl = () => {
    if (detail?.annotatedImageUrl) return detail.annotatedImageUrl;
    if (detail?.aiStats?.annotatedImageUrl) return detail.aiStats.annotatedImageUrl;
    if (detail?.aiResult?.annotatedImage) return detail.aiResult.annotatedImage;
    return null;
  };

  const annotatedImageUrl = getAnnotatedImageUrl();
  const originalImageUrl = data.originalImageAbsoluteUrl || getReportImageUrl(data.reportId, data.originalImageUrl || data.imageUrl);
  const aiImageUrl = resolveMediaUrl(annotatedImageUrl);

  return (
    <>
      <div className="admin-modal-overlay" onClick={onClose}>
        <div className="admin-modal" onClick={e => e.stopPropagation()}>

          <div className="admin-modal-header">
            <h3 className="admin-modal-title">Detail Laporan</h3>
            <button className="admin-modal-close" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          {/* Tabs */}
          <div className="modal-tabs">
            {[
              { id: 'foto', label: 'Foto & AI', icon: FaCamera },
              { id: 'prioritas', label: 'Skor Prioritas', icon: FaChartLine },
              { id: 'info', label: 'Info Laporan', icon: FaInfoCircle },
            ].map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`modal-tab ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <TabIcon style={{ marginRight: '6px', fontSize: '12px' }} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="admin-modal-body">

            {/* Tab: Foto & AI */}
            {activeTab === 'foto' && (
              <>
                <div className="modal-photo-grid">
                  {/* Foto asli */}
                  <div>
                    <div className="modal-photo-label">
                      <FaCamera style={{ marginRight: '4px', fontSize: '10px' }} />
                      FOTO ASLI
                    </div>
                    <div className="modal-photo-container">
                      {originalImageUrl && !imageErrors.original ? (
                        <>
                          <img
                            src={originalImageUrl}
                            alt="Foto asli"
                            className="modal-photo"
                            onClick={() => setLightbox('original')}
                            onError={() => setImageErrors(prev => ({ ...prev, original: true }))}
                          />
                          <FaExpand className="modal-expand-icon" />
                        </>
                      ) : (
                        <div className="modal-photo-placeholder">
                          <FaImage style={{ marginRight: '6px' }} />
                          Tidak ada gambar
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Foto deteksi AI */}
                  <div>
                    <div className="modal-photo-label">
                      <FaRobot style={{ marginRight: '4px', fontSize: '10px' }} />
                      DETEKSI AI
                    </div>
                    <div className="modal-photo-container">
                      {loading ? (
                        <div className="modal-photo-placeholder">Memuat...</div>
                      ) : aiImageUrl && !imageErrors.ai ? (
                        <>
                          <img
                            src={aiImageUrl}
                            alt="Deteksi AI"
                            className="modal-photo"
                            onClick={() => setLightbox('ai')}
                            onError={() => setImageErrors(prev => ({ ...prev, ai: true }))}
                          />
                          <FaExpand className="modal-expand-icon" />
                        </>
                      ) : (
                        <div className="modal-photo-placeholder">
                          <FaRobot style={{ marginRight: '6px' }} />
                          Belum tersedia
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* AI Stats */}
                {detail?.aiStats && (
                  <div className="modal-ai-stats">
                    <div className="modal-ai-stats-title">
                      <FaRobot style={{ marginRight: '6px', fontSize: '11px' }} />
                      HASIL ANALISIS AI
                    </div>
                    <div className="modal-ai-stats-grid">
                      <div className="modal-stat-chip">
                        <div className="modal-stat-chip-label">
                          <div style={{ marginRight: '4px', fontSize: '9px' }} />
                          Lubang
                        </div>
                        <div className="modal-stat-chip-value">{detail.aiStats.potholeCount ?? 0}</div>
                      </div>
                      <div className="modal-stat-chip">
                        <div className="modal-stat-chip-label">
                          <div style={{ marginRight: '4px', fontSize: '9px' }} />
                          Retak
                        </div>
                        <div className="modal-stat-chip-value">{detail.aiStats.crackCount ?? 0}</div>
                      </div>
                      <div className="modal-stat-chip">
                        <div className="modal-stat-chip-label">Kerusakan</div>
                        <div className="modal-stat-chip-value" style={{ color: detail.aiStats.damageDetected ? '#16a34a' : '#9ca3af' }}>
                          {detail.aiStats.damageDetected ? <><FaCheckCircle style={{ marginRight: '4px' }} /> Terdeteksi</> : 'Tidak'}
                        </div>
                      </div>
                      {detail.aiStats.severityHint && (
                        <div className="modal-stat-chip">
                          <div className="modal-stat-chip-label">Tingkat</div>
                          <div className="modal-stat-chip-value">{detail.aiStats.severityHint}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Tab: Skor Prioritas */}
            {activeTab === 'prioritas' && (
              <>
                {loading ? (
                  <div className="modal-loading">Memuat...</div>
                ) : detail?.priorityBreakdown ? (
                  <>
                    <div className="modal-priority-container">
                      <div className={`modal-priority-badge ${priorityStyle.bgClass}`}>
                        <div className={`modal-priority-label ${priorityStyle.textClass}`}>
                          {priorityStyle.label}
                        </div>
                        <div className={`modal-priority-score ${priorityStyle.scoreClass}`}>
                          {detail.priorityBreakdown.priorityScore}
                        </div>
                        <div className={`modal-priority-sub ${priorityStyle.textClass}`}>Total Skor</div>
                      </div>
                    </div>

                    <div className="modal-breakdown">
                      {BREAKDOWN_ITEMS.map(({ key, label, color }) => {
                        const score = detail.priorityBreakdown[key] ?? 0;
                        const pct = Math.min(score * 100, 100);
                        return (
                          <div key={key} className="modal-breakdown-item">
                            <div className="modal-breakdown-header">
                              <span className="modal-breakdown-label">{label}</span>
                              <span className="modal-breakdown-score" style={{ color }}>
                                {(score * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="modal-breakdown-bar-bg">
                              <div className="modal-breakdown-bar" style={{ width: `${pct}%`, background: color }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="modal-breakdown-note">* Skor 0–100% per komponen</div>
                  </>
                ) : (
                  <div className="modal-empty">Skor prioritas belum tersedia untuk laporan ini.</div>
                )}
              </>
            )}

            {/* Tab: Info Laporan */}
            {activeTab === 'info' && (
              <>
                <div className="admin-modal-info-row">
                  <div className="admin-modal-info-label">ID Laporan</div>
                  <div className="admin-modal-info-value">{data.reportId}</div>
                </div>

                <div className="admin-modal-info-row">
                  <div className="admin-modal-info-label">Lokasi</div>
                  <div className="admin-modal-info-value">
                    <FaMapMarkerAlt style={{ marginRight: '4px' }} />
                    {data.location?.lat}, {data.location?.lng}
                  </div>
                </div>

                <div className="admin-modal-info-row">
                  <div className="admin-modal-info-label">Tanggal</div>
                  <div className="admin-modal-info-value">
                    <FaCalendarAlt style={{ marginRight: '4px' }} />
                    {new Date(data.submittedAt).toLocaleString('id-ID')}
                  </div>
                </div>

                <div className="admin-modal-description">
                  <strong>Deskripsi</strong>
                  <p>{data.description}</p>
                </div>

                <label className="admin-modal-label">Ubah Status</label>
                <select
                  className="admin-modal-select"
                  value={data.status}
                  onChange={e => {
                    console.log("Modal - onChange triggered:", e.target.value); 
                    onStatusChange(data.reportId, e.target.value);
                  }}
                >
                  <option value="submitted">Dikirim</option>
                  <option value="validated">Tervalidasi</option>
                  <option value="prioritized">Diprioritaskan</option>
                  <option value="reviewed">Ditinjau</option>
                  <option value="in_progress">Dikerjakan</option>
                  <option value="resolved">Selesai</option>
                  <option value="rejected">Ditolak</option>
                </select>
              </>
            )}

          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="modal-lightbox" onClick={() => setLightbox(null)}>
          <img
            src={lightbox === 'original' ? originalImageUrl : aiImageUrl}
            alt={lightbox === 'original' ? 'Foto asli' : 'Deteksi AI'}
          />
        </div>
      )}
    </>
  );
};
