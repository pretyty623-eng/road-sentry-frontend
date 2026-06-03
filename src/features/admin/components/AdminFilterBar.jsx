import { FaSearch, FaUndoAlt } from 'react-icons/fa';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../constants/reportStatus';

export const AdminFilterBar = ({ filters, onFilterChange, onReset }) => {
  const handleStatusChange = (e) => {
    onFilterChange({ status: e.target.value });
  };

  const handlePriorityChange = (e) => {
    onFilterChange({ priority: e.target.value });
  };

  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value });
  };

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <div className="filter-input-wrapper">
          <FaSearch className="filter-input-icon" />
          <input
            type="text"
            className="filter-input"
            placeholder="Cari laporan..."
            value={filters.search || ''}
            onChange={handleSearchChange}
          />
        </div>
        
        <select 
          className="filter-select" 
          value={filters.status || ''}
          onChange={handleStatusChange}
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        
        <select 
          className="filter-select" 
          value={filters.priority || ''}
          onChange={handlePriorityChange}
        >
          {PRIORITY_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        
        <button className="filter-reset" onClick={onReset}>
          <FaUndoAlt /> Reset
        </button>
      </div>
    </div>
  );
};