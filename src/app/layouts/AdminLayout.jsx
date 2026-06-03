import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { RoadSentryLogo } from '../../components/ui/RoadSentryLogo';
import { adminAuthService } from '../../features/admin/services/adminAuth.service';

export const AdminLayout = () => {
  const navigate = useNavigate();

  // Cek autentikasi saat komponen dimuat
  useEffect(() => {
    if (!adminAuthService.isAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    adminAuthService.logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-body">
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
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </Link>
          <Link to="/admin/reports">
            <i className="fas fa-file-alt"></i> Laporan
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Keluar
          </button>
        </div>
      </nav>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};
