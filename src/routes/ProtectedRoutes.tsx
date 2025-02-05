// src/routes/ProtectedRoutes.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminDashboard from "../components/admin/AdminDashboard";
import CustomerForm from "../pages/Customer_form/CustomerWelcomeform";
import RestaurantDashboard from "../pages/Restaurant_form/RestaurantDahboard";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  requireVerified?: boolean;
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
  requireVerified = true,
}: ProtectedRouteProps) => {
  const { state } = useAuth();
  const location = useLocation();

  // Step 1: Check if user is authenticated
  if (!state.isAuthenticated) {
    // Determine correct login path based on role requirements
    const loginPath = allowedRoles.includes("admin") ? "/admin/login" : "/login";
    // Save attempted location for redirect after login
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Step 2: Check verification status if required
  if (requireVerified && state.user && !state.user.isVerified) {
    return (
      <Navigate 
        to="/verify-email-pending" 
        state={{ email: state.user.email }} 
        replace 
      />
    );
  }

  // Step 3: Check role permissions
  if (state.user && !allowedRoles.includes(state.user.role)) {
    // Redirect to appropriate dashboard based on user's actual role
    const redirectPath = getRedirectPath(state.user.role);
    return <Navigate to={redirectPath} replace />;
  }

  // All checks passed, render the protected content
  return <>{children}</>;
};

// Helper function to determine redirect path based on role
const getRedirectPath = (role: string): string => {
  switch (role) {
    case "admin":
      return "/admin";
    case "customer":
      return "/customer-dashboard";
    case "restaurant":
      return "/restaurant/dashboard";
    default:
      return "/";
  }
};

// Higher-order component for role-based protection
export const withRoleProtection = (
  WrappedComponent: React.ComponentType,
  allowedRoles: string[],
  requireVerified: boolean = true
) => {
  return function ProtectedComponent(props: any) {
    return (
      <ProtectedRoute allowedRoles={allowedRoles} requireVerified={requireVerified}>
        <WrappedComponent {...props} />
      </ProtectedRoute>
    );
  };
};

// Export protected routes configuration
export const protectedRoutes = [
  {
    path: "/admin/*",
    element: withRoleProtection(AdminDashboard, ["admin"], true),
  },
  {
    path: "/customer-dashboard",
    element: withRoleProtection(CustomerForm, ["customer"], true),
  },
  {
    path: "/restaurant/dashboard",
    element: withRoleProtection(RestaurantDashboard, ["restaurant"], true),
  }
];

// Custom hook for easy protection checks
export const useRouteProtection = (
  allowedRoles: string[],
  requireVerified: boolean = true
) => {
  const { state } = useAuth();
  const location = useLocation();

  const checkAccess = (): {
    hasAccess: boolean;
    redirectPath: string | null;
  } => {
    if (!state.isAuthenticated) {
      const loginPath = allowedRoles.includes("admin") ? "/admin/login" : "/login";
      return { hasAccess: false, redirectPath: loginPath };
    }

    if (requireVerified && state.user && !state.user.isVerified) {
      return { hasAccess: false, redirectPath: "/verify-email-pending" };
    }

    if (state.user && !allowedRoles.includes(state.user.role)) {
      return { hasAccess: false, redirectPath: getRedirectPath(state.user.role) };
    }

    return { hasAccess: true, redirectPath: null };
  };

  return { checkAccess, location };
};