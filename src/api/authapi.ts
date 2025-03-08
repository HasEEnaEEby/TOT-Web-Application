import {
  AdminLoginData,
  AdminRegisterData,
  VerificationResendRequest
} from '@/types/auth';
import { toast } from 'react-hot-toast';
import api from '../services/api';
export interface User {
  isVerified: boolean;
  status: string;
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
    adminDetails: null;
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

export interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

class AuthAPI {
  private static readonly AUTH_ENDPOINTS = {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    ADMIN_LOGIN: '/auth/admin/login',
    ADMIN_REGISTER: '/auth/admin/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    VERIFY_EMAIL: '/auth/verify-email',
    VERIFY_RESTAURANT: '/auth/verify-restaurant',
    RESEND_VERIFICATION: '/auth/resend-verification',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  };

  private sanitizeData<T extends object>(data: T): Partial<T> {
    const sanitized: Partial<T> = {};
    
    (Object.keys(data) as Array<keyof T>).forEach(key => {
      const value = data[key];
      if (
        value !== undefined && 
        value !== null && 
        value !== ''
      ) {
        sanitized[key] = value;
      }
    });

    return sanitized;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      if (!data.email || !data.password) {
        throw new Error('Email and password are required');
      }

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

      if (response.data?.status === 'success') {
        localStorage.setItem('pendingVerificationEmail', data.email);
        localStorage.setItem('pendingVerificationRole', data.role);
        toast.success('Registration successful! Please check your email for verification.');
      }

      return response.data;
    } catch (error) {
      return this.handleError(error as ApiError);
    }
  }

  async adminLogin(credentials: AdminLoginData): Promise<AuthResponse> {
    try {
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      const response = await api.post<AuthResponse>(
        AuthAPI.AUTH_ENDPOINTS.ADMIN_LOGIN,
        this.sanitizeData({ ...credentials, role: 'admin' })
      );

      if (response.data?.status === 'success' && response.data?.data?.token) {
        this.handleAuthResponse(response.data);
      }

      return response.data;
    } catch (error) {
      return this.handleError(error as ApiError);
    }
  }

  async adminRegister(data: AdminRegisterData): Promise<AuthResponse> {
    try {
      if (!data.email || !data.password || !data.confirmPassword) {
        throw new Error('All fields are required');
      }

      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const response = await api.post<AuthResponse>(
        AuthAPI.AUTH_ENDPOINTS.ADMIN_REGISTER,
        this.sanitizeData({
          email: data.email,
          password: data.password,
          role: 'admin'
        })
      );

      if (response.data?.status === 'success') {
        toast.success('Admin registration successful! Please log in.');
      }

      return response.data;
    } catch (error) {
      return this.handleError(error as ApiError);
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }
  
      const response = await api.post<AuthResponse>(
        AuthAPI.AUTH_ENDPOINTS.LOGIN,
        this.sanitizeData(credentials)
      );
  
      if (response.data?.status === 'success' && response.data?.data?.token) {
        if (response.data.data.user) {
          response.data.data.user = {
            ...response.data.data.user,
            isVerified: response.data.data.user.isEmailVerified
          };
        }
        
        this.handleAuthResponse(response.data);
      }
  
      return response.data;
    } catch (error) {
      return this.handleError(error as ApiError);
    }
  }

  async verifyEmail(token: string, signal?: AbortSignal): Promise<VerificationResponse> {
    try {
      if (!token) {
        throw new Error('Verification token is required');
      }

      if (import.meta.env.DEV) {
        console.log('Attempting email verification:', {
          tokenPreview: token.substring(0, 10) + '...'
        });
      }

      const response = await api.get<VerificationResponse>(
        `${AuthAPI.AUTH_ENDPOINTS.VERIFY_EMAIL}/${token}`,
        { signal }
      );

      if (response.data?.status === 'success') {
        // Update user verification status in localStorage if exists
        const currentUser = localStorage.getItem('user');
        if (currentUser) {
          const updatedUser = {
            ...JSON.parse(currentUser),
            isEmailVerified: true
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        // Clear pending verification data
        localStorage.removeItem('pendingVerificationEmail');
        localStorage.removeItem('pendingVerificationRole');
      }

      return response.data;
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        throw error;
      }
      return this.handleError(error as ApiError);
    }
  }

  async resendVerification(data: VerificationResendRequest): Promise<VerificationResponse> {
    try {
      if (!data.email || !data.role) {
        throw new Error('Email and role are required for verification');
      }

      const response = await api.post<VerificationResponse>(
        AuthAPI.AUTH_ENDPOINTS.RESEND_VERIFICATION,
        this.sanitizeData(data)
      );

      if (response.data?.status === 'success') {
        localStorage.setItem('pendingVerificationEmail', data.email);
        localStorage.setItem('pendingVerificationRole', data.role);
        
        toast.success(
          data.role === 'restaurant'
            ? 'New verification code sent to your email!'
            : 'New verification link sent to your email!'
        );
      }

      return response.data;
    } catch (error) {
      return this.handleError(error as ApiError);
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post(AuthAPI.AUTH_ENDPOINTS.LOGOUT);
      this.clearAuthData();
    } catch (error) {
      this.handleError(error as ApiError);
    }
  }

  async updateProfile(data: Partial<RegisterData>): Promise<AuthResponse> {
    try {
      const response = await api.patch<AuthResponse>(
        AuthAPI.AUTH_ENDPOINTS.PROFILE,
        this.sanitizeData(data)
      );
      
      if (response.data?.status === 'success') {
        toast.success('Profile updated successfully');
        
        if (response.data.data?.user) {
          localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
      }
      
      return response.data;
    } catch (error) {
      return this.handleError(error as ApiError);
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      await api.post(AuthAPI.AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      this.handleError(error as ApiError);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      if (!token || !newPassword) {
        throw new Error('Token and new password are required');
      }

      await api.post(AuthAPI.AUTH_ENDPOINTS.RESET_PASSWORD, { 
        token, 
        newPassword 
      });
      toast.success('Password reset successful');
    } catch (error) {
      this.handleError(error as ApiError);
    }
  }

  private handleAuthResponse(response: AuthResponse): void {
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
    }
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('pendingVerificationEmail');
    localStorage.removeItem('pendingVerificationRole');
  }

  private handleError(error: ApiError): never {
    console.error('Auth API Error:', error);
    
    let errorMessage = 'An unexpected error occurred';

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    if (!errorMessage.toLowerCase().includes('verification') && error.name !== 'AbortError') {
      toast.error(errorMessage);
    }

    throw new Error(errorMessage);
  }
}

export const authApi = new AuthAPI();
export default authApi;