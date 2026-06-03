
import { Link } from 'react-router-dom';
import { FaRoad } from 'react-icons/fa';

export const Navbar = ({ onTentangClick, onStatistikClick }) => {
  return (
    <nav className="navbar">
      <div className="brand">
        <div className="brand-icon">
          <FaRoad />
        </div>
        <span className="brand-text">ROAD<span>-SENTRY</span></span>
      </div>
      <div className="nav-links">
        <button onClick={onTentangClick} className="nav-link">Tentang</button>
        <button onClick={onStatistikClick} className="nav-link">Statistik</button>
        <Link to="/admin" className="btn-login">Admin Dashboard</Link>
      </div>
    </nav>
  );
};