import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { authState } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  if (authState.isAuthenticated && authState.user) {

    switch (authState.user.role) {
      case "admin":
        return <Navigate to="/admin" replace />;
      case "customer":
        return <Navigate to="/customer-dashboard" replace />;
      default:
        return <Navigate to={from} replace />;
    }
  }

  return <>{children}</>;
};