import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { adminAuthService } from '../features/admin/services/adminAuth.service';

export const PrivateRoute = () => {
  const location = useLocation();
  const isAuthenticated = adminAuthService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  
  return <Outlet />;
};
