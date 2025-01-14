import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';

const PublicRoutes = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />; 
  }

  return <Outlet />; 
};

export default PublicRoutes;
