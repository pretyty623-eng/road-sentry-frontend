import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReportPage } from './features/report/pages/ReportPage';
import './styles/globals.css';
import { AdminDashboardPage } from './features/admin/pages/AdminDashboardPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ReportPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/status/:reportId" element={<div>Status Page - Coming Soon</div>} />
      </Routes>
    </Router>
  );
}

export default App;