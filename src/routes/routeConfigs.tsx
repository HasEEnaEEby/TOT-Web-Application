// src/routes/routeConfigs.tsx
import { lazy } from "react";
import { RouteConfig } from "./types";

// Lazy load components
const HomePage = lazy(() => import("../pages/home/HomePage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const SignUpPage = lazy(() => import("../pages/auth/SignUpPage"));
const AdminLogin = lazy(() => import("../components/admin/logging/AdminLogin"));
const VerificationPending = lazy(
  () => import("../components/auth/VerificationPending")
);
const VerifyEmail = lazy(() => import("../pages/auth/VerifyEmail"));
const AdminApp = lazy(() => import("../pages/admin/AdminApp"));
const CustomerWelcomeForm = lazy(
  () => import("../pages/Customer_form/CustomerWelcomeform")
);
const RestaurantDashboard = lazy(
  () => import("../pages/Restaurant_form/RestaurantDahboard")
);
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

export const routeConfigs: RouteConfig[] = [
  // Public routes - accessible without authentication
  {
    path: "/",
    element: <HomePage />,
    isPublic: true,
  },

  // Authentication routes
  {
    path: "/login",
    element: <LoginPage />,
    isPublic: true,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
    isPublic: true,
  },

  // Admin authentication routes
  {
    path: "/admin/login",
    element: <AdminLogin mode="login" />,
    isPublic: true,
  },
  {
    path: "/admin/register",
    element: <AdminLogin mode="signup" />,
    isPublic: true,
  },

  // Email verification routes
  {
    path: "/verify-email-pending",
    element: <VerificationPending />,
    requireAuth: true,
    requireVerified: false,
  },
  {
    path: "/verify-email/:token",
    element: <VerifyEmail />,
    requireAuth: false,
  },

  // Protected routes - requires authentication and verification
  {
    path: "/admin/*",
    element: <AdminApp />,
    requireAuth: true,
    requireVerified: true,
    allowedRoles: ["admin"],
  },
  {
    path: "/customer-dashboard",
    element: <CustomerWelcomeForm />,
    requireAuth: true,
    requireVerified: true,
    allowedRoles: ["customer"],
  },
  {
    path: "/restaurant/dashboard",
    element: <RestaurantDashboard />,
    requireAuth: true,
    requireVerified: true,
    allowedRoles: ["restaurant"],
  },

  // Error/Not Found route
  {
    path: "*",
    element: <NotFoundPage />,
    isPublic: true,
  },
];

export default routeConfigs;
