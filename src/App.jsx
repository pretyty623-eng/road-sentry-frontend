import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './app/PrivateRoute';
import { ReportPage } from './features/report/pages/ReportPage';
import { AdminDashboardPage } from './features/admin/pages/AdminDashboardPage';
import AdminLoginPage from './features/admin/pages/AdminLoginPage';
import { AdminReportsPage } from './features/admin/pages/AdminReportsPage';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ReportPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<PrivateRoute />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
