// src/hooks/use-adminauth.ts
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authapi';
import { AdminLoginData, AdminRegisterData, LocationState } from '../types/auth';
import { useAuth } from './use-auth';

export const useAdminAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdminLogin = async (credentials: AdminLoginData) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!credentials.email || !credentials.password) {
        throw new Error('Please fill in all fields');
      }

      const loginData = {
        ...credentials,
        role: 'admin' as const
      };

      await login(loginData);

      const state = location.state as LocationState;
      const from = state?.from?.pathname || '/admin/dashboard';
      
      toast.success('Login successful!');
      navigate(from, { replace: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminRegister = async (data: AdminRegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!data.email || !data.password || !data.confirmPassword) {
        throw new Error('Please fill in all fields');
      }

      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (data.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      await authApi.adminRegister(data);

      toast.success('Registration successful! Please log in.');
      navigate('/admin/login', { replace: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (mode: 'login' | 'register') => {
    setError(null);
    navigate(mode === 'login' ? '/admin/login' : '/admin/register');
  };

  const clearError = () => {
    setError(null);
  };

  return {
    handleAdminLogin,
    handleAdminRegister,
    switchMode,
    clearError,
    isLoading,
    error,
    setError
  };
};