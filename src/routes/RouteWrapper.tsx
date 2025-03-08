import { Suspense } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { RouteConfig, UserRole } from "./types";
import { getRedirectPath } from "./utils";

interface RouteWrapperProps {
  config: RouteConfig;
}

export const RouteWrapper: React.FC<RouteWrapperProps> = ({ config }) => {
  const { state: authState } = useAuth();
  const location = useLocation();

  // Handle public routes when user is authenticated
  if (config.isPublic && authState.isAuthenticated && authState.user) {
    const redirectPath = getRedirectPath(authState.user.role as UserRole);
    return <Navigate to={redirectPath} replace />;
  }

  // Handle authentication requirement
  if (config.requireAuth && !authState.isAuthenticated) {
    const isAdminRoute = config.allowedRoles?.includes("admin");
    const loginPath = isAdminRoute ? "/admin/login" : "/login";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Handle verification requirement
  if (
    config.requireVerified &&
    authState.isAuthenticated &&
    authState.user &&
    !authState.user.isVerified &&
    // Skip verification check for these roles
    !["admin", "restaurant"].includes(authState.user.role) &&
    // Don't redirect if already on verification pending page
    location.pathname !== "/verify-email-pending"
  ) {
    return (
      <Navigate
        to="/verify-email-pending"
        state={{
          email: authState.user.email,
          role: authState.user.role,
        }}
        replace
      />
    );
  }

  // Handle role-based access
  if (
    authState.isAuthenticated &&
    authState.user &&
    config.allowedRoles?.length
  ) {
    if (!config.allowedRoles.includes(authState.user.role as UserRole)) {
      return (
        <Navigate
          to={getRedirectPath(authState.user.role as UserRole)}
          replace
        />
      );
    }
  }

  // Render the route content
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      }
    >
      {config.element}
    </Suspense>
  );
};

export default RouteWrapper;
