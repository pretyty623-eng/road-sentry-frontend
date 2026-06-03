import { FaExclamationTriangle, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

export const AdminUrgentReports = ({ reports, onViewReport }) => {
  if (!reports || reports.length === 0) {
    return (
      <div className="urgent-section">
        <div className="urgent-header">
          <FaExclamationTriangle />
          <h3>Laporan Mendesak</h3>
          <span className="urgent-count">0 laporan</span>
        </div>
        <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
          Tidak ada laporan mendesak
        </div>
      </div>
    );
  }

  return (
    <div className="urgent-section">
      <div className="urgent-header">
        <FaExclamationTriangle />
        <h3>Laporan Mendesak Hari Ini</h3>
        <span className="urgent-count">{reports.length} laporan</span>
      </div>
      <div className="urgent-list">
        {reports.map((report) => (
          <div 
            key={report.reportId} 
            className="urgent-item"
            style={{ cursor: 'pointer' }}
            onClick={() => onViewReport(report._id)}
          >
            <div className="urgent-priority">!</div>
            <div className="urgent-content">
              <div className="urgent-title">{report.description}</div>
              <div className="urgent-meta">
                <span><FaMapMarkerAlt /> {report.latitude}, {report.longitude}</span>
                <span><FaClock /> {new Date(report.submittedAt).toLocaleString()}</span>
              </div>
            </div>
            <div className="urgent-status">Prioritas Tinggi</div>
          </div>
        ))}
      </div>
    </div>
  );
};