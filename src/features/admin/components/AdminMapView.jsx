import { useCallback, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { FaMapMarkerAlt, FaCalendarAlt, FaChartBar, FaSyncAlt } from 'react-icons/fa';
import { adminService } from '../services/admin.service';
import { getReportImageUrl } from '../../../utils/mediaUrl';

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom marker icon
const createPriorityIcon = (priority) => {
  const colors = {
    high:   { fill: '#EF4444', stroke: '#991B1B', label: '!' },
    medium: { fill: '#F59E0B', stroke: '#92400E', label: '~' },
    low:    { fill: '#22C55E', stroke: '#166534', label: 'OK' },
  };
  const c = colors[priority] || colors.low;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
      <path d="M16 2C9.373 2 4 7.373 4 14c0 9 12 26 12 26s12-17 12-26C28 7.373 22.627 2 16 2z"
        fill="${c.fill}" stroke="${c.stroke}" stroke-width="1.5"/>
      <circle cx="16" cy="14" r="7" fill="white" opacity="0.9"/>
      <text x="16" y="19" text-anchor="middle"
        font-family="sans-serif" font-size="11" font-weight="700"
        fill="${c.stroke}">${c.label}</text>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -44],
  });
};

// Format date
const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};

// Priority label mapping
const PRIORITY_LABEL = {
  high:   { text: 'Tinggi',  badgeClass: 'map-popup-badge-high' },
  medium: { text: 'Sedang',  badgeClass: 'map-popup-badge-medium' },
  low:    { text: 'Rendah',  badgeClass: 'map-popup-badge-low' },
};

// Status label mapping
const STATUS_CLASS = {
  prioritized: 'map-popup-badge-status',
  reviewed:    'map-popup-badge-status',
  in_progress: 'map-popup-badge-status',
  resolved:    'map-popup-badge-status',
};

// Fit bounds component
const FitBounds = ({ reports }) => {
  const map = useMap();
  useEffect(() => {
    if (reports.length === 0) return;
    const bounds = L.latLngBounds(reports.map(r => [r.latitude, r.longitude]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [reports, map]);
  return null;
};

export const AdminMapView = () => {
  const [reports, setReports]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [filter, setFilter]           = useState('all');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getMapReports();
      if (res.success) {
        setReports(res.data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      setError('Gagal memuat data peta. Periksa koneksi server.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReports();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchReports]);

  const filtered = filter === 'all'
    ? reports
    : reports.filter(r => r.priorityLabel === filter);

  const counts = {
    high:   reports.filter(r => r.priorityLabel === 'high').length,
    medium: reports.filter(r => r.priorityLabel === 'medium').length,
    low:    reports.filter(r => r.priorityLabel === 'low').length,
  };

  const defaultCenter = [-2.5489, 118.0149];
  return (
    <div className="admin-map-container">
      {/* Header */}
      <div className="admin-map-header">
        <div>
          <h3 className="admin-map-title">Peta Sebaran Laporan</h3>
          {lastUpdated && (
            <p className="admin-map-subtitle">
              Diperbarui {lastUpdated.toLocaleTimeString('id-ID')}
            </p>
          )}
        </div>
        <button onClick={fetchReports} disabled={loading} className="admin-map-refresh">
          <FaSyncAlt className={loading ? 'animate-spin' : ''} />
          {loading ? 'Memuat...' : 'Refresh'}
        </button>
      </div>

      {/* Filter bar + legend */}
      <div className="admin-map-filter-bar">
        <div className="admin-map-filter-group">
          {[
            { key: 'all',    label: `Semua (${reports.length})` },
            { key: 'high',   label: `Tinggi (${counts.high})` },
            { key: 'medium', label: `Sedang (${counts.medium})` },
            { key: 'low',    label: `Rendah (${counts.low})` },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`admin-map-filter-btn ${filter === f.key ? 'active' : ''}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="admin-map-legend">
          <span className="admin-map-legend-item">
            <span className="admin-map-legend-dot high" />
            Tinggi
          </span>
          <span className="admin-map-legend-item">
            <span className="admin-map-legend-dot medium" />
            Sedang
          </span>
          <span className="admin-map-legend-item">
            <span className="admin-map-legend-dot low" />
            Rendah
          </span>
        </div>
      </div>

      {/* Map area */}
      <div className="admin-map-area">
        {/* Error */}
        {error && (
          <div className="admin-map-error">
            <div className="admin-map-error-content">
              <p className="admin-map-error-text">{error}</p>
              <button onClick={fetchReports} className="admin-map-retry-btn">
                Coba Lagi
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && reports.length === 0 && (
          <div className="admin-map-loading">
            <div className="admin-map-loader">
              <div className="admin-map-spinner" />
              <p className="admin-map-loading-text">Memuat peta...</p>
            </div>
          </div>
        )}

        <MapContainer center={defaultCenter} zoom={5} zoomControl={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filtered.length > 0 && <FitBounds reports={filtered} />}
          {filtered.map((report) => (
            <Marker
              key={report.reportId}
              position={[report.latitude, report.longitude]}
              icon={createPriorityIcon(report.priorityLabel)}
            >
              <Popup minWidth={260} maxWidth={300}>
                <div>
                  {report.imageUrl && (
                    <img
                      src={report.originalImageAbsoluteUrl || getReportImageUrl(report.reportId, report.originalImageUrl || report.imageUrl)}
                      alt="Foto laporan"
                      className="map-popup-image"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  )}

                  <div className="map-popup-badges">
                    <span className={`map-popup-badge ${PRIORITY_LABEL[report.priorityLabel]?.badgeClass || 'map-popup-badge-low'}`}>
                      {PRIORITY_LABEL[report.priorityLabel]?.text || 'Rendah'}
                    </span>
                    <span className={`map-popup-badge ${STATUS_CLASS[report.status] || 'map-popup-badge-status'}`}>
                      {report.status?.replace('_', ' ') || 'Dikirim'}
                    </span>
                  </div>

                  <p className="map-popup-description">
                    {report.description?.substring(0, 120)}{report.description?.length > 120 ? '...' : ''}
                  </p>

                  <div className="map-popup-meta">
                    <span className="map-popup-meta-item">
                      <FaMapMarkerAlt /> {report.latitude.toFixed(5)}, {report.longitude.toFixed(5)}
                    </span>
                    <span className="map-popup-meta-item">
                      <FaCalendarAlt /> {formatDate(report.submittedAt)}
                    </span>
                    {report.priorityScore > 0 && (
                      <span className="map-popup-meta-item">
                        <FaChartBar /> Skor: {report.priorityScore.toFixed(1)}
                      </span>
                    )}
                    <span className="map-popup-id">ID: {report.reportId}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Filter kosong */}
        {filter !== 'all' && filtered.length === 0 && !loading && (
          <div className="admin-map-floating-info">
            Tidak ada laporan prioritas {filter}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="admin-map-footer">
        <span>Total: <strong>{reports.length}</strong> laporan</span>
        <span>Ditampilkan: <strong>{filtered.length}</strong></span>
        <span className="admin-map-footer-source">Sumber: OpenStreetMap</span>
      </div>
    </div>
  );
};

export default AdminMapView;
