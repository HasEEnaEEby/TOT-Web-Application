export type UserRole = 'customer' | 'restaurant';
export type RestaurantStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  restaurantDetails?: RestaurantDetails | null;
  isVerified?: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RestaurantDetails {
  id: string;
  name: string;
  location: string;
  status: RestaurantStatus;
  contactNumber?: string;
  quote?: string;
  openingHours?: string;
  cuisineType?: string[];
  rating?: number;
  totalOrders?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
  adminCode?: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  restaurantName?: string;
  location?: string;
  contactNumber?: string;
  quote?: string;
  adminCode?: string;
}

export interface AuthResponse {
  status: 'success' | 'error';
  data: {
    user: User;
    token: string;
    refreshToken?: string;
    restaurantDetails?: RestaurantDetails | null;
    requiresVerification?: boolean;
  };
  message?: string;
}

// Login specific types
export type LoginError = {
  status: 'error';
  message: string;
  code?: 'INVALID_CREDENTIALS' | 'ACCOUNT_NOT_VERIFIED' | 'ACCOUNT_DISABLED' | 'PENDING_APPROVAL';
};

export interface LoginResponse extends AuthResponse {
  data: {
    user: User & { isVerified: boolean };
    token: string;
    refreshToken?: string;
    restaurantDetails?: RestaurantDetails;
  };
}

export type LoginResult = LoginResponse | ErrorResponse;

export interface ErrorResponse {
  status: 'error';
  message: string;
  code?: string;
}

// Profile Update Interface
export interface ProfileUpdateData {
  username?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
  restaurantName?: string;
  location?: string;
  contactNumber?: string;
  quote?: string;
}

// Password Related Interfaces
export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

// Verification Related Interfaces
export interface EmailVerificationRequest {
  token: string;
}

export interface RestaurantVerificationRequest {
  email: string;
  code: string;
}

export interface VerificationResendRequest {
  email: string;
  role: UserRole;
}

export interface VerificationResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    email: string;
    role: UserRole;
    isVerified: boolean;
    verificationSent?: boolean;
    restaurantDetails?: RestaurantDetails;
  };
}

// Auth Context Types
export interface AuthContextState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading?: boolean;
  error?: string | null;
}

export interface AuthContextType {
  authState: AuthContextState;
  setAuthState: (state: AuthContextState) => void;
}

// Auth Action Types
export type AuthAction = 
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'VERIFICATION_SUCCESS'; payload: { isVerified: boolean } }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'CLEAR_ERROR' };

// Navigation State Types
export interface LocationState {
  from?: {
    pathname: string;
  };
  message?: string;
  email?: string;
  role?: UserRole;
}

// Verification State Types
export interface VerificationState {
  email: string;
  role: UserRole;
  token?: string;
  code?: string;
  isResending: boolean;
  error?: string;
  success?: string;
}

// Auth Provider Props
export interface AuthProviderProps {
  children: React.ReactNode;
}