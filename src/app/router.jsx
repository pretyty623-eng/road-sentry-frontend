import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { PrivateRoute } from './PrivateRoute';
import { ReportPage } from '../features/report/pages/ReportPage';
import { AdminDashboardPage } from '../features/admin/pages/AdminDashboardPage';
import { AdminReportsPage } from '../features/admin/pages/AdminReportsPage';
import AdminLoginPage from '../features/admin/pages/AdminLoginPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <ReportPage /> }
    ]
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: <PrivateRoute />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'reports', element: <AdminReportsPage /> }
    ]
  }
]);
