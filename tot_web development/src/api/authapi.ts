// src/api/authApi.ts
import { toast } from 'react-hot-toast';
import api from '../services/api';

// Types
export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'customer' | 'restaurant' | 'admin';
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantDetails {
  status: 'pending' | 'approved' | 'rejected';
  restaurantName: string;
  location: string;
  contactNumber: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: 'customer' | 'restaurant' | 'admin';
}

export interface RegisterData extends LoginCredentials {
  username: string;
  restaurantName?: string;
  location?: string;
  contactNumber?: string;
}

export interface AuthResponse {
  status: 'success' | 'error';
  message?: string;
  data?: {
    user: User;
    token: string;
    refreshToken?: string;
    restaurantDetails?: RestaurantDetails;
    requiresVerification?: boolean;
  };
}

export interface VerificationResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    user: User;
  };
}

export interface ErrorResponse {
  status: 'error';
  message: string;
  code?: string;
}

export interface RestaurantVerificationRequest {
  token: string;
  restaurantDetails: Omit<RestaurantDetails, 'status'>;
}

export interface VerificationResendRequest {
  email: string;
  role: 'customer' | 'restaurant';
}

class AuthAPI {
  private static readonly AUTH_ENDPOINTS = {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    VERIFY_EMAIL: '/auth/verify-email',
    VERIFY_RESTAURANT: '/auth/verify-restaurant',
    RESEND_VERIFICATION: '/auth/resend-verification',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  };

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      if (import.meta.env.DEV) {
        console.log('Registration attempt:', {
          ...data,
          password: '[REDACTED]'
        });
      }
  
      const cleanedData = this.sanitizeData(data);
      const response = await api.post<AuthResponse>(
        AuthAPI.AUTH_ENDPOINTS.SIGNUP,
        cleanedData
      );
  
      if (response.data.status === 'success') {
        // Redirect to verification pending page with email info
        toast.success('Registration successful! Please check your email for verification.');
        window.location.href = `/verification-pending?email=${encodeURIComponent(data.email)}&role=${data.role}`;
      }
  
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(
        AuthAPI.AUTH_ENDPOINTS.LOGIN,
        this.sanitizeData(credentials)
      );

      if (response.data.status === 'success' && response.data.data?.token) {
        this.handleAuthResponse(response.data);
      }

      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async verifyEmail(token: string): Promise<VerificationResponse> {
    try {
      const response = await api.get<VerificationResponse>(
        `${AuthAPI.AUTH_ENDPOINTS.VERIFY_EMAIL}/${token}`
      );
  
      if (response.data.status === 'success') {
        toast.success('Email verified successfully! Please log in.');
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
  
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async verifyRestaurant(data: RestaurantVerificationRequest): Promise<VerificationResponse> {
    try {
      const response = await api.post<VerificationResponse>(
        AuthAPI.AUTH_ENDPOINTS.VERIFY_RESTAURANT,
        this.sanitizeData(data)
      );
      toast.success('Restaurant verification successful! Please wait for admin approval.');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async resendVerification(data: VerificationResendRequest): Promise<VerificationResponse> {
    try {
      const response = await api.post<VerificationResponse>(
        AuthAPI.AUTH_ENDPOINTS.RESEND_VERIFICATION,
        this.sanitizeData(data)
      );
      toast.success(
        data.role === 'restaurant'
          ? 'New verification code sent to your email!'
          : 'New verification link sent to your email!'
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post(AuthAPI.AUTH_ENDPOINTS.LOGOUT);
      this.clearAuthData();
      toast.success('Logged out successfully');
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getProfile(): Promise<AuthResponse> {
    try {
      const response = await api.get<AuthResponse>(AuthAPI.AUTH_ENDPOINTS.PROFILE);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updateProfile(data: Partial<RegisterData>): Promise<AuthResponse> {
    try {
      const response = await api.patch<AuthResponse>(
        AuthAPI.AUTH_ENDPOINTS.PROFILE,
        this.sanitizeData(data)
      );
      toast.success('Profile updated successfully');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post(AuthAPI.AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post(AuthAPI.AUTH_ENDPOINTS.RESET_PASSWORD, { token, newPassword });
      toast.success('Password reset successful');
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleAuthResponse(response: AuthResponse): void {
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  private sanitizeData<T extends Record<string, any>>(data: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(data).filter(([_, value]) => 
        value !== undefined && 
        value !== null && 
        value !== ''
      )
    ) as Partial<T>;
  }

  private handleError(error: any): void {
    console.error('Auth API Error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
}

export const authApi = new AuthAPI();