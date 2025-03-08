// src/routes/ProtectedRoutes.tsx
import { Navigate, useLocation } from "react-router-dom";
import AdminDashboard from "../components/admin/AdminDashboard";
import { useAuth } from "../context/AuthContext";
import CustomerForm from "../pages/Customer_form/CustomerWelcomeform";
import RestaurantDashboard from "../pages/Restaurant_form/RestaurantDahboard";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  requireVerified?: boolean;
}

// Component Props Interface
interface ComponentProps {
  [key: string]: unknown;
}

// Main Protected Route Component
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
    const loginPath = allowedRoles.includes("admin")
      ? "/admin/login"
      : "/login";
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

// Route helper function
export function getRedirectPath(role: string): string {
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
}

// Higher-order component for role-based protection
export const withRoleProtection = (
  WrappedComponent: React.ComponentType<ComponentProps>,
  allowedRoles: string[],
  requireVerified = true
) => {
  // Renamed to avoid ESLint warnings about fast refresh
  const ProtectedWrapper = (props: ComponentProps) => {
    return (
      <ProtectedRoute
        allowedRoles={allowedRoles}
        requireVerified={requireVerified}
      >
        <WrappedComponent {...props} />
      </ProtectedRoute>
    );
  };

  return ProtectedWrapper;
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
  },
];

// Custom hook for easy protection checks
export function checkRouteAccess(
  state: { isAuthenticated: boolean; user: any | null },
  allowedRoles: string[],
  requireVerified = true
): {
  hasAccess: boolean;
  redirectPath: string | null;
} {
  if (!state.isAuthenticated) {
    const loginPath = allowedRoles.includes("admin")
      ? "/admin/login"
      : "/login";
    return { hasAccess: false, redirectPath: loginPath };
  }

  if (requireVerified && state.user && !state.user.isVerified) {
    return { hasAccess: false, redirectPath: "/verify-email-pending" };
  }

  if (state.user && !allowedRoles.includes(state.user.role)) {
    return {
      hasAccess: false,
      redirectPath: getRedirectPath(state.user.role),
    };
  }

  return { hasAccess: true, redirectPath: null };
}

// Renamed hook function to avoid ESLint warnings about fast refresh
export function useRouteAccess(allowedRoles: string[], requireVerified = true) {
  const { state } = useAuth();
  const location = useLocation();

  return {
    checkAccess: () => checkRouteAccess(state, allowedRoles, requireVerified),
    location,
  };
}

// Maintain backward compatibility
export const useRouteProtection = useRouteAccess;
