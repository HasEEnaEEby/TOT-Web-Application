import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import {
  AuthAction,
  AuthContextState,
  AuthProviderProps,
  LoginCredentials,
  ProfileUpdateData,
  RegisterData,
  User,
} from "../types/auth";

const initialState: AuthContextState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

function authReducer(
  state: AuthContextState,
  action: AuthAction
): AuthContextState {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "VERIFICATION_SUCCESS":
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              isVerified: true,
            }
          : null,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    case "ADMIN_LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
}

// Interface for AuthContext
interface AuthContextType {
  state: AuthContextState;
  dispatch: React.Dispatch<AuthAction>;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: (email: string, role: string) => Promise<void>;
  clearError: () => void;
}

// Create AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// AuthProvider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
          const user = JSON.parse(storedUser) as User;
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: { user, token },
          });
        }
      } catch (error) {
        console.error("Error restoring auth state:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    };

    checkAuth();
  }, []);

  // Login method
  const login = useCallback(async (credentials: LoginCredentials) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const { user, token, refreshToken } = data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        dispatch({
          type: "ADMIN_LOGIN_SUCCESS",
          payload: { user, token },
        });
      } else {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user, token },
        });
      }
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error instanceof Error ? error.message : "Login failed",
      });
      throw error;
    }
  }, []);

  // Register method
  const register = useCallback(async (data: RegisterData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Registration failed");
      }

      const { user } = responseData.data;

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user,
          token: user.token || "", // Ensure token is a string or empty string
        },
      });

      return responseData;
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error instanceof Error ? error.message : "Registration failed",
      });
      throw error;
    }
  }, []);

  // Logout method
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  }, []);

  // Update Profile method
  // Update Profile method
  const updateProfile = useCallback(async (data: ProfileUpdateData) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token");

    const response = await fetch("/api/v1/auth/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Profile update failed");
    }

    const { user } = responseData.data;
    localStorage.setItem("user", JSON.stringify(user));

    dispatch({
      type: "UPDATE_USER",
      payload: user,
    });
  }, []);

  // Verify Email method
  // Verify Email method
  const verifyEmail = useCallback(async (token: string) => {
    const response = await fetch(`/api/v1/auth/verify-email/${token}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Email verification failed");
    }

    // Update user in local storage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      user.isEmailVerified = true;
      localStorage.setItem("user", JSON.stringify(user));
    }

    dispatch({
      type: "VERIFICATION_SUCCESS",
      payload: { isVerified: true },
    });

    return data;
  }, []);

  // Resend Verification method
  // Resend Verification method
  const resendVerification = useCallback(
    async (email: string, role: string) => {
      const response = await fetch("/api/v1/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend verification");
      }

      return data;
    },
    []
  );

  // Clear Error method
  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  // Context value
  const value = {
    state,
    dispatch,
    login,
    register,
    logout,
    updateProfile,
    verifyEmail,
    resendVerification,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
