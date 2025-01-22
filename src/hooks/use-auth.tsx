// src/hooks/use-auth.tsx
import { useCallback, useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../api/authapi";
import { AuthContext } from "../context/AuthContext";
import type {
  LocationState,
  LoginCredentials,
  ProfileUpdateData,
  RegisterData,
  User,
  UserRole,
  VerificationResendRequest,
} from "../types/auth";

type APIUser = {
  _id: string;
  username: string;
  email: string;
  role: "customer" | "restaurant" | "admin";
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

type APIAuthResponse = {
  status: "success" | "error";
  data?: {
    user: APIUser;
    token: string;
    refreshToken?: string;
    restaurantDetails?: {
      status: "pending" | "approved" | "rejected";
    };
    requiresVerification?: boolean;
  };
  message?: string;
};

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authState, setAuthState } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const getRedirectPath = useCallback(
    (role: UserRole | "admin"): string => {
      const state = location.state as LocationState;
      const from = state?.from?.pathname;

      if (from && from !== "/login" && from !== "/register") {
        return from;
      }

      switch (role) {
        case "restaurant":
          return "/restaurant/dashboard";
        case "customer":
          return "/customer-dashboard";
        case "admin":
          return "/admin/dashboard";
        default:
          return "/";
      }
    },
    [location]
  );

  const mapAPIUserToAuthUser = useCallback((apiUser: APIUser) => {
    if (apiUser.role === "admin") {
      return {
        id: apiUser._id,
        username: apiUser.username,
        email: apiUser.email,
        role: "admin" as const,
      };
    }

    return {
      id: apiUser._id,
      username: apiUser.username,
      email: apiUser.email,
      role: apiUser.role as UserRole,
      isVerified: apiUser.isEmailVerified,
      createdAt: new Date(apiUser.createdAt),
      updatedAt: new Date(apiUser.updatedAt),
    } as User;
  }, []);

  const handleAuthSuccess = useCallback(
    (response: APIAuthResponse) => {
      if (!response.data) return;

      const { user: apiUser, token } = response.data;
      const mappedUser = mapAPIUserToAuthUser(apiUser);

      setAuthState({
        user: mappedUser,
        token,
        isAuthenticated: true,
      });

      const redirectPath = getRedirectPath(apiUser.role);
      navigate(redirectPath, { replace: true });
    },
    [setAuthState, navigate, getRedirectPath, mapAPIUserToAuthUser]
  );

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setLoading(true);
    try {
      const response = await authApi.login(credentials) as APIAuthResponse;
  
      if (response.status === 'success' && response.data) {
        // Check email verification
        if (!response.data.user.isEmailVerified) {
          throw new Error('Please verify your email before logging in');
        }
  
        // Check restaurant approval status
        if (credentials.role === 'restaurant' && 
            response.data.restaurantDetails?.status !== 'approved') {
          const status = response.data.restaurantDetails?.status;
          throw new Error(
            status === 'pending'
              ? 'Your restaurant account is pending approval'
              : 'Your restaurant account has been rejected'
          );
        }
  
        // Set auth state and handle success
        setAuthState({
          user: mapAPIUserToAuthUser(response.data.user),
          token: response.data.token,
          isAuthenticated: true
        });
  
        // Navigate to appropriate dashboard
        const redirectPath = getRedirectPath(response.data.user.role);
        navigate(redirectPath, { replace: true });
  
        toast.success('Welcome back!');
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };


  const register = async (data: RegisterData): Promise<APIAuthResponse> => {
    setLoading(true);
    try {
      const response = await authApi.register(data) as APIAuthResponse;
  
      if (response.status === "success") {
        toast.success("Registration successful! Please check your email for verification.");
        
        navigate("/verify-email-pending", {
          state: { email: data.email, role: data.role }
        });
      }

      return response;
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Registration failed";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (token: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await authApi.verifyEmail(token);

      if (response.status === "success") {
        toast.success("Email verified successfully! Please log in.");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Verification failed";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async (
    data: VerificationResendRequest
  ): Promise<void> => {
    setLoading(true);
    try {
      await authApi.resendVerification(data);
      toast.success("Verification email sent! Please check your inbox.");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to resend verification";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: ProfileUpdateData): Promise<void> => {
    setLoading(true);
    try {
      const response = (await authApi.updateProfile(data)) as APIAuthResponse;

      if (response.status === "success" && response.data?.user) {
        const mappedUser = mapAPIUserToAuthUser(response.data.user);

        setAuthState((prev) => ({
          ...prev,
          user: mappedUser,
        }));
        toast.success("Profile updated successfully");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || "Update failed";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await authApi.logout();
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
      });
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || "Logout failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    authState,
    loading,
    login,
    register,
    logout,
    verifyEmail,
    resendVerification,
    updateProfile,
  };
};

export default useAuth;
