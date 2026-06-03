import { FaImage, FaEye } from 'react-icons/fa';
import { REPORT_STATUS, PRIORITY_LABELS } from '../constants/reportStatus';

export const AdminReportsTable = ({ reports, loading, onViewReport, onStatusChange }) => {
    console.log(reports);
    const getPriorityBadge = (priority) => {
        const p = PRIORITY_LABELS[priority] || PRIORITY_LABELS.low;

        return (
            <span className={`priority-badge ${p.color}`}>
                {p.label === 'Tinggi' && '!'}
                {p.label === 'Sedang' && '!'}
                {p.label === 'Rendah' && '✓'}
                {' '}{p.label}
            </span>
        );
    };

    const getStatusBadge = (status) => {
        const s = REPORT_STATUS[status] || REPORT_STATUS.submitted;
        return (
            <span className={`status-badge ${s.color}`}>
                {s.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="table-container">
                <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
                    Memuat data...
                </div>
            </div>
        );
    }

    if (reports.length === 0) {
        return (
            <div className="table-container">
                <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
                    Tidak ada data laporan
                </div>
            </div>
        );
    }

    return (
        <div className="table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Info</th>
                        <th>Lokasi</th>
                        <th>Deskripsi</th>
                        <th>Prioritas</th>
                        <th>Status</th>
                        <th>Tanggal</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map((report) => (
                       <tr key={report.reportId}>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div className="thumbnail"><FaImage /></div>
                                    <div>
                                        <div style={{ fontSize: '0.6rem', color: '#94A3B8' }}>ID</div>
                                        <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', fontWeight: 600 }}>
                                            {report.reportId}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
                                {report.location?.lat}, {report.location?.lng}
                            </td>
                            <td>{report.description?.substring(0, 60)}...</td>
                            <td>{getPriorityBadge(report.priorityLabel || 'low')}</td>
                            <td>{getStatusBadge(report.status)}</td>
                            <td style={{ fontSize: '0.7rem' }}>
                                {new Date(report.submittedAt).toLocaleDateString('id-ID')}
                            </td>
                            <td>
                                <button
                                    className="action-btn"
                                    onClick={() => onViewReport(report.reportId)}
                                >
                                    <FaEye />
                                </button>
                                <select
                                    className="status-select"
                                    value={report.status}
                                    onChange={(e) => onStatusChange(report.reportId, e.target.value)}
                                >
                                    <option key="submitted" value="submitted">Dikirim</option>
                                    <option key="validated" value="validated">Tervalidasi</option>
                                    <option key="prioritized" value="prioritized">Diprioritaskan</option>
                                    <option key="reviewed" value="reviewed">Ditinjau</option>
                                    <option key="in_progress" value="in_progress">Dikerjakan</option>
                                    <option key="resolved" value="resolved">Selesai</option>
                                    <option key="rejected" value="rejected">Ditolak</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};