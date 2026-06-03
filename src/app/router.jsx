import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ReportPage } from '../features/report/pages/ReportPage';
import { SubmissionStatusPage } from '../features/report/pages/SubmissionStatusPage';
import { AdminDashboardPage } from '../features/admin/pages/AdminDashboardPage';
import { AdminReportsPage } from '../features/admin/pages/AdminReportsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <ReportPage />
      },
      {
        path: 'status/:reportId',
        element: <SubmissionStatusPage />
      }
    ]
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboardPage />
      },
      {
        path: 'reports',
        element: <AdminReportsPage />
      }
    ]
  }
]);