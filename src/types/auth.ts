// src/types/auth.ts

export type UserRole = 'customer' | 'restaurant' | 'admin';
export type RestaurantStatus = 'pending' | 'approved' | 'rejected';

// Permissions
export type AdminPermission =
  | 'manage_users'
  | 'manage_restaurants'
  | 'view_reports'
  | 'manage_settings';

// User and Details Interfaces
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

export interface AdminDetails {
  id: string;
  permissions: AdminPermission[];
  lastActive?: Date;
  managedRestaurants?: string[];
}

export interface User {
  id: string;
  username?: string;
  email: string;
  role: UserRole;
  restaurantDetails?: RestaurantDetails | null;
  adminDetails?: AdminDetails | null;
  isVerified: boolean; 
  restaurant?: string;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// API User Interface (for mapping from backend)
export interface APIUser {
  _id: string;
  username: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  status?: RestaurantStatus;
  restaurantName?: string;
  location?: string;
  contactNumber?: string;
  quote?: string;
  adminCode?: string;
}

// Base Credential Interfaces
export interface BaseLoginCredentials {
  email: string;
  password: string;
}

export interface BaseRegisterData {
  email: string;
  password: string;
  username?: string; 
  role: UserRole;
}

// Login Interfaces
export interface LoginCredentials extends BaseLoginCredentials {
  role: UserRole;
  adminCode?: string;
}

export type AdminLoginData = BaseLoginCredentials;

export interface AdminRegisterData extends BaseLoginCredentials {
  confirmPassword: string;
}

// Register Data Interfaces
export interface CustomerRegisterData extends BaseRegisterData {
  role: 'customer';
  username: string;
}

export interface RestaurantRegisterData extends BaseRegisterData {
  role: 'restaurant';
  restaurantName: string;
  location: string;
  contactNumber: string;
  quote?: string;
}

export type RegisterData = 
  | CustomerRegisterData 
  | RestaurantRegisterData 
  | AdminRegisterData;

// Update Interfaces
export interface AdminUpdateData {
  email?: string;
  password?: string;
  currentPassword?: string;
  permissions?: string[];
}

export interface ProfileUpdateData {
  username?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
  restaurantName?: string;
  location?: string;
  contactNumber?: string;
  quote?: string;
  adminPermissions?: string[];
}

// Base Response Interface
export interface AuthResponse {
  status: 'success' | 'error';
  data: {
    message?: string;
    user: User;
    token: string;
    refreshToken?: string;
    restaurantDetails?: RestaurantDetails | null;
    adminDetails?: AdminDetails | null;
    requiresVerification?: boolean;
  };
  message?: string;
}

export interface APIAuthResponse {
  status: 'success' | 'error';
  data: {
    user: APIUser;
    token: string;
    refreshToken?: string;
    restaurantDetails?: RestaurantDetails;
    adminDetails?: AdminDetails;
  };
  message?: string;
}

// Made message optional to fix interface extension errors
export interface AdminLoginResponse extends AuthResponse {
  data: {
    message?: string;
    user: User;
    token: string;
    refreshToken?: string;
    adminDetails: AdminDetails;
    restaurantDetails?: RestaurantDetails | null;
    requiresVerification?: boolean;
  };
}

// Error Interfaces
export type LoginErrorCode = 
  | 'INVALID_CREDENTIALS' 
  | 'ACCOUNT_NOT_VERIFIED' 
  | 'ACCOUNT_DISABLED' 
  | 'PENDING_APPROVAL' 
  | 'INVALID_ADMIN_CODE';

export interface LoginError {
  status: 'error';
  message: string;
  code?: LoginErrorCode;
}

// Made message optional to fix interface extension errors
export interface LoginResponse extends AuthResponse {
  data: {
    message?: string;
    user: User;
    token: string;
    refreshToken?: string;
    restaurantDetails?: RestaurantDetails;
    adminDetails?: AdminDetails;
    requiresVerification?: boolean;
  };
}

export type LoginResult = LoginResponse | LoginError;

// Verification Interfaces
export interface EmailVerificationRequest {
  token: string;
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
    adminDetails?: AdminDetails;
  };
}

// Context & State Interfaces
export interface AuthContextState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading?: boolean;
  error?: string | null;
}

export type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'VERIFICATION_SUCCESS'; payload: { isVerified: boolean } }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'CLEAR_ERROR' }
  | { type: 'ADMIN_LOGIN_SUCCESS'; payload: { user: User; token: string } };

export interface LocationState {
  from?: {
    pathname: string;
  };
  message?: string;
  email?: string;
  role?: UserRole;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}