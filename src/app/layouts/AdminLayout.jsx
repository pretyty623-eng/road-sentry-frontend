import { Outlet, Link } from 'react-router-dom';

export const AdminLayout = () => {
  return (
    <div className="admin-body">
      <nav className="admin-navbar">
        <div className="admin-brand">
          <div className="admin-brand-icon">
            <i className="fas fa-road"></i>
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
          <Link to="/">
            <i className="fas fa-sign-out-alt"></i> Keluar
          </Link>
        </div>
      </nav>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};