import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    FaRoad,
    FaTachometerAlt,
    FaFileAlt,
    FaSignOutAlt
} from 'react-icons/fa';
import { adminService } from '../services/admin.service';
import { useAdminReports } from '../hooks/useAdminReports';
import { AdminStatsCard } from '../components/AdminStatsCard';
import { AdminUrgentReports } from '../components/AdminUrgentReports';
import { AdminMapView } from '../components/AdminMapView';
import { AdminFilterBar } from '../components/AdminFilterBar';
import { AdminReportsTable } from '../components/AdminReportsTable';
import { AdminReportDetailModal } from '../components/AdminReportDetailModal';


export const AdminDashboardPage = () => {
    const [dashboardStats, setDashboardStats] = useState({
        total: 0,
        pending: 0,
        resolved: 0,
        highPriority: 0
    });
    const [urgentReports, setUrgentReports] = useState([]);
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

    const fetchDashboardStats = useCallback(async () => {
        try {
            const response = await adminService.getDashboardStats();
            if (response.success) {
                setDashboardStats({
                    total: response.data.total || 0,

                    pending:
                        (response.data.pending || 0) +
                        (response.data.reviewed || 0) +
                        (response.data.inProgress || 0),

                    resolved: response.data.resolved || 0,

                    highPriority: response.data.priority?.high || 0
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    }, []);

    const fetchUrgentReports = useCallback(async () => {
        try {
            const response = await adminService.getUrgentReports();
            if (response.success) {
                setUrgentReports(response.data.slice(0, 3));
            }
        } catch (error) {
            console.error('Error fetching urgent reports:', error);
            setUrgentReports([
                {
                    _id: '1',
                    reportId: 'RPT_aB3xK9',
                    description: 'Jalan berlubang besar di depan SDN 01, membahayakan anak sekolah',
                    latitude: -6.2088,
                    longitude: 106.8456,
                    submittedAt: new Date().toISOString()
                },
                {
                    _id: '2',
                    reportId: 'RPT_cD7yM2',
                    description: 'Ambles di Jalan Raya Sudirman, mengganggu arus lalu lintas',
                    latitude: -6.2156,
                    longitude: 106.8125,
                    submittedAt: new Date().toISOString()
                }
            ]);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        adminService.getDashboardStats()
            .then(response => {
                if (cancelled || !response.success) return;
                setDashboardStats({
                    total: response.data.total || 0,

                    pending:
                        (response.data.pending || 0) +
                        (response.data.reviewed || 0) +
                        (response.data.inProgress || 0),

                    resolved: response.data.resolved || 0,

                    highPriority: response.data.priority?.high || 0
                });
            })
            .catch(error => console.error('Error fetching dashboard stats:', error));

        adminService.getUrgentReports()
            .then(response => {
                if (cancelled || !response.success) return;
                setUrgentReports(response.data.slice(0, 3));
            })
            .catch(() => {
                if (cancelled) return;
                setUrgentReports([
                    {
                        _id: '1',
                        reportId: 'RPT_aB3xK9',
                        description: 'Jalan berlubang besar di depan SDN 01, membahayakan anak sekolah',
                        latitude: -6.2088,
                        longitude: 106.8456,
                        submittedAt: new Date().toISOString()
                    },
                    {
                        _id: '2',
                        reportId: 'RPT_cD7yM2',
                        description: 'Ambles di Jalan Raya Sudirman, mengganggu arus lalu lintas',
                        latitude: -6.2156,
                        longitude: 106.8125,
                        submittedAt: new Date().toISOString()
                    }
                ]);
            });

        return () => { cancelled = true; };
    }, []);

    const handleViewReport = (id) => {
        const report = reports.find(r => r.reportId === id)
        setSelectedReport(report);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedReport(null);
    };

    const handleStatusChange = async (id, newStatus) => {
    console.log(" handleStatusChange called:", id, "→", newStatus); 
    const success = await updateStatus(id, newStatus);
    if (success) {
        console.log(" Update success, refreshing...");
        fetchDashboardStats();
        fetchUrgentReports();
        refresh(); 
    } else {
        console.log(" Update failed");
    }
};

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="admin-body">
            {/* Navbar */}
            <nav className="admin-navbar">
                <div className="admin-brand">
                    <div className="admin-brand-icon">
                        <FaRoad />
                    </div>
                    ROAD-SENTRY
                    <span className="admin-badge">ADMIN</span>
                </div>
                <div className="admin-nav-links">
                    <a href="#dashboard-section">
                        <FaTachometerAlt /> Dashboard
                    </a>
                    <a href="#reports-section">
                        <FaFileAlt /> Laporan
                    </a>
                    <Link to="/">
                        <FaSignOutAlt /> Keluar
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <div className="admin-content">
                <div className="admin-header">
                    <h1 className="admin-title">Dashboard Admin</h1>
                    <p className="admin-subtitle">Kelola dan pantau laporan jalan rusak</p>
                </div>

                {/* Stats Cards */}
                <section id="dashboard-section">
                    <AdminStatsCard stats={dashboardStats} />
                </section>

                {/* Urgent Reports */}
                <AdminUrgentReports
                    reports={urgentReports}
                    onViewReport={handleViewReport}
                />

                {/* Map View */}
                <AdminMapView/>

                {/* Reports Table */}
               <section id="reports-section" className="reports-section">
                    <div className="reports-header">
                        <h2 className="reports-title">Semua Laporan</h2>
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
                </section>
            </div>

            {/* Footer */}
            <footer className="admin-footer">
                <p>2026 ROAD-SENTRY | Sistem Pelaporan Jalan Rusak Berbasis AI & GIS</p>
                <p style={{ marginTop: '8px', opacity: 0.6 }}>
                    Dikembangkan untuk Coding Camp 2026 powered by DBS Foundation
                </p>
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