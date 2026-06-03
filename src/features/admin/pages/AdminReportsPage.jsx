import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaFileAlt, FaSignOutAlt } from 'react-icons/fa';
import { RoadSentryLogo } from '../../../components/ui/RoadSentryLogo';
import { adminAuthService } from '../services/adminAuth.service';
import { useAdminReports } from '../hooks/useAdminReports';
import { AdminFilterBar } from '../components/AdminFilterBar';
import { AdminReportsTable } from '../components/AdminReportsTable';
import { AdminReportDetailModal } from '../components/AdminReportDetailModal';

export const AdminReportsPage = () => {
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const {
    reports,
    loading,
    total,
    page,
    limit,
    filters,
    updateStatus,
    changePage,
    updateFilters,
    resetFilters,
    refresh
  } = useAdminReports();

  const handleViewReport = (id) => {
    const report = reports.find(r => r.reportId === id);
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateStatus(id, newStatus);
  };

  const handleLogout = () => {
    adminAuthService.logout();
    navigate('/admin/login', { replace: true });
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="admin-body">
      {/* Navbar */}
      <nav className="admin-navbar">
        <div className="admin-brand">
          <div className="admin-brand-icon">
            <RoadSentryLogo size={28} />
          </div>
          ROAD-SENTRY
          <span className="admin-badge">ADMIN</span>
        </div>
        <div className="admin-nav-links">
          <Link to="/admin">
            <FaTachometerAlt /> Dashboard
          </Link>
          <Link to="/admin/reports">
            <FaFileAlt /> Laporan
          </Link>
          <button type="button" onClick={handleLogout}>
            <FaSignOutAlt /> Keluar
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">Manajemen Laporan</h1>
          <p className="admin-subtitle">Kelola semua laporan jalan rusak</p>
        </div>

        {/* Reports Table */}
        <div className="reports-section">
          <div className="reports-header">
            <h2 className="reports-title">Daftar Laporan</h2>
            <button className="refresh-btn" onClick={refresh}>
              <FaFileAlt /> Refresh
            </button>
          </div>

          <AdminFilterBar 
            filters={filters}
            onFilterChange={updateFilters}
            onReset={resetFilters}
          />

          <AdminReportsTable 
            reports={reports}
            loading={loading}
            onViewReport={handleViewReport}
            onStatusChange={handleStatusChange}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="admin-pagination">
              <button 
                className="admin-pagination-btn"
                disabled={page === 1}
                onClick={() => changePage(page - 1)}
              >
                Sebelumnya
              </button>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Halaman {page} dari {totalPages}
              </span>
              <button 
                className="admin-pagination-btn"
                disabled={page === totalPages}
                onClick={() => changePage(page + 1)}
              >
                Selanjutnya
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="admin-footer">
        <p>2026 ROAD-SENTRY | Sistem Pelaporan Jalan Rusak Berbasis AI & GIS</p>
      </footer>

      {/* Modal */}
      <AdminReportDetailModal 
        isOpen={isModalOpen}
        report={selectedReport}
        onClose={handleCloseModal}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};
