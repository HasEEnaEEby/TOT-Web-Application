// src/api/authapi.ts
import { toast } from 'react-hot-toast';
import api from '../services/api';
import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  RestaurantVerificationRequest,
  VerificationResendRequest,
  VerificationResponse
} from '../types/auth';

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

      // Only set auth data if verification is not required
      if (response.data.data?.token && !response.data.data?.requiresVerification) {
        this.handleAuthResponse(response.data);
        toast.success('Registration successful! Please check your email for verification.');
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

      if (!response.data.data?.user.isVerified) {
        throw new Error('Please verify your email before logging in.');
      }

      if (response.data.data?.token) {
        this.handleAuthResponse(response.data);
        toast.success('Login successful!');
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
      toast.success('Email verified successfully');
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
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message);
    }
    throw new Error('An unexpected error occurred');
  }
}

export const authApi = new AuthAPI();
export type { AuthResponse, LoginCredentials, RegisterData };
