import { Link } from 'react-router-dom';
import { FiBarChart2, FiInfo, FiLogIn } from 'react-icons/fi';
import { RoadSentryLogo } from '../ui/RoadSentryLogo';

export const Navbar = ({ onTentangClick, onStatistikClick }) => {
  return (
    <nav className="navbar">
      <div className="brand">
        <div className="brand-icon">
          <RoadSentryLogo size={32} />
        </div>
        <span className="brand-text">ROAD<span>-SENTRY</span></span>
      </div>
      <div className="nav-links">
        {onTentangClick && (
          <button onClick={onTentangClick} className="nav-link">
            <FiInfo />
            Tentang
          </button>
        )}
        {onStatistikClick && (
          <button onClick={onStatistikClick} className="nav-link">
            <FiBarChart2 />
            Statistik
          </button>
        )}
        <Link to="/admin/login" className="btn-login">
          <FiLogIn />
          LOGIN
        </Link>
      </div>
    </nav>
  );
};
