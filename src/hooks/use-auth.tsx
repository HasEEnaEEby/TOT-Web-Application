import { useCallback, useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../api/authapi";
import { AuthContext } from "../context/AuthContext";
import type {
  AuthResponse,
  LoginCredentials,
  ProfileUpdateData,
  RegisterData,
  VerificationResendRequest,
} from "../types/auth";

interface APIError {
  response?: {
    data?: {
      message?: string;
      status?: string;
    };
    status?: number;
  };
  message?: string;
  status?: string;
  name?: string;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { state, dispatch } = context;

  const handleAuthError = (error: unknown, defaultMessage: string): never => {
    const apiError = error as APIError;
    const errorMessage =
      apiError.response?.data?.message || apiError.message || defaultMessage;
    toast.error(errorMessage);
    throw error;
  };

  // Login handler
  const login = async (
    credentials: LoginCredentials
  ): Promise<AuthResponse> => {
    try {
      const response = await authApi.login(credentials);

      if (response.status !== "success" || !response.data) {
        throw new Error(response.message || "Login failed");
      }

      // Update auth state
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: response.data.user,
          token: response.data.token,
        },
      });

      // Handle navigation based on role
      if (credentials.role === "restaurant") {
        if (response.data.user.status === "approved") {
          navigate("/restaurant/dashboard", { replace: true });
        } else {
          throw new Error(
            "Your restaurant account is in pending wait for the TOT approval"
          );
        }
      } else {
        // For customers, check email verification
        if (!response.data.user.isVerified) {
          navigate("/verify-email-pending", {
            state: {
              email: response.data.user.email,
              role: "customer",
            },
          });
        } else {
          navigate("/customer-dashboard", { replace: true });
        }
      }

      return response;
    } catch (error) {
      console.error("Login Error:", error);
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Login failed",
        data: null,
      };
    }
  };

  // Register handler
  const register = async (data: RegisterData): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const response = await authApi.register({
        email: data.email,
        password: data.password,
        role: "role" in data ? data.role : "customer",
        username: "username" in data ? data.username : undefined,
        restaurantName:
          "restaurantName" in data ? data.restaurantName : undefined,
        location: "location" in data ? data.location : undefined,
        contactNumber: "contactNumber" in data ? data.contactNumber : undefined,
        quote: "quote" in data ? data.quote : undefined,
      });

      if (response.status === "success") {
        if ("role" in data && data.role === "restaurant") {
          toast.success(
            "Registration successful! Please wait for admin approval."
          );
          navigate("/login");
        } else {
          navigate("/verify-email-pending", {
            state: {
              email: data.email,
              role: "role" in data ? data.role : "customer",
            },
          });
        }

        return response;
      }

      throw new Error(response.message || "Registration failed");
    } catch (error: unknown) {
      return handleAuthError(error, "Registration failed") as AuthResponse;
    } finally {
      setLoading(false);
    }
  };

  // Email verification handlers
  const resendVerification = async (
    request: VerificationResendRequest
  ): Promise<void> => {
    setLoading(true);
    try {
      await authApi.resendVerification(request);
      toast.success("Verification email sent successfully!");
    } catch (error: unknown) {
      handleAuthError(error, "Failed to resend verification");
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (
    token: string,
    signal?: AbortSignal
  ): Promise<void> => {
    setLoading(true);
    try {
      const response = await authApi.verifyEmail(token, signal);

      if (response.status === "success") {
        dispatch({
          type: "VERIFICATION_SUCCESS",
          payload: { isVerified: true },
        });
        toast.success("Email verified successfully!");
        navigate("/login");
      }
    } catch (error: unknown) {
      if ((error as Error).name !== "AbortError") {
        handleAuthError(error, "Verification failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // Profile management
  const updateProfile = async (data: ProfileUpdateData): Promise<void> => {
    setLoading(true);
    try {
      const response = await authApi.updateProfile(data);

      if (response.status === "success" && response.data?.user) {
        dispatch({
          type: "UPDATE_USER",
          payload: response.data.user,
        });
        toast.success("Profile updated successfully!");
      }
    } catch (error: unknown) {
      handleAuthError(error, "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await authApi.logout();
      dispatch({ type: "LOGOUT" });
      navigate("/login", { replace: true });
      toast.success("Logged out successfully");
    } catch (error: unknown) {
      handleAuthError(error, "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, [dispatch]);

  return {
    authState: state,
    loading,
    login,
    register,
    logout,
    verifyEmail,
    resendVerification,
    updateProfile,
    clearError,
  };
};

export default useAuth;
