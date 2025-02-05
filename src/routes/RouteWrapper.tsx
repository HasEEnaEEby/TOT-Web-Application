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
    // Get the appropriate redirect path based on user role
    const redirectPath = getRedirectPath(authState.user.role as UserRole);
    return <Navigate to={redirectPath} replace />;
  }

  // Handle authentication requirement
  if (config.requireAuth && !authState.isAuthenticated) {
    const isAdminRoute = config.allowedRoles?.includes("admin");
    const loginPath = isAdminRoute ? "/admin/login" : "/login";
    // Save the attempted location for redirect after login
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Handle verification requirement - Skip for restaurant role
  if (
    config.requireVerified &&
    authState.user &&
    !authState.user.isVerified &&
    authState.user.role !== "restaurant"
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

  // Handle restaurant-specific access
  if (
    authState.user?.role === "restaurant" &&
    config.allowedRoles?.includes("restaurant")
  ) {
    // Check restaurant approval status
    const status =
      authState.user.status || authState.user.restaurantDetails?.status;

    if (status !== "approved") {
      return (
        <Navigate
          to="/login"
          state={{
            message: "Your restaurant account is pending approval",
          }}
          replace
        />
      );
    }
  }

  // Handle role-based access for all roles
  if (config.allowedRoles?.length && authState.user) {
    if (!config.allowedRoles.includes(authState.user.role as UserRole)) {
      // Redirect to appropriate dashboard based on user's role
      return (
        <Navigate
          to={getRedirectPath(authState.user.role as UserRole)}
          replace
        />
      );
    }
  }

  // If all checks pass, render the protected route
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
