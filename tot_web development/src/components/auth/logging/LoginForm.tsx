import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Key, Loader2, Lock, Mail } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/use-auth';
import RoleSelector from '../RoleSelector';

interface LoginFormProps {
  onSignUpClick?: () => void;
}

export default function LoginForm({}: LoginFormProps) {
  const { login, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'customer' | 'restaurant'>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    adminCode: '',
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Clear messages when role changes
    setError('');
    setSuccessMessage('');
  }, [selectedRole]);

  const handleRoleChange = (role: 'customer' | 'restaurant') => {
    setSelectedRole(role);
    setError('');
    setSuccessMessage('');
    // Clear admin code when switching to customer
    if (role === 'customer') {
      setFormData(prev => ({ ...prev, adminCode: '' }));
    }
  };

  const validateForm = () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      setError('Email is required');
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Password validation
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    // Admin code validation for restaurants
    if (selectedRole === 'restaurant' && !formData.adminCode) {
      setError('Admin code is required for restaurant login');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
  
    if (!validateForm()) return;
  
    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
        role: selectedRole,
        ...(selectedRole === 'restaurant' && { adminCode: formData.adminCode })
      });
  
      if (response.status === 'success') {
        // Check if user is verified
        if (!response.data.user.isVerified) {
          setError('Please verify your email before logging in. Check your inbox for the verification link.');
          return;
        }
  
        // For restaurants, check their status
        if (selectedRole === 'restaurant' && response.data.restaurantDetails) {
          const { status } = response.data.restaurantDetails;
          
          if (status === 'pending') {
            setError('Your restaurant account is still pending approval.');
            return;
          }
  
          if (status === 'rejected') {
            setError('Your restaurant account application has been rejected.');
            return;
          }
        }
  
        // If all checks pass, proceed with login
        setSuccessMessage('Login successful! Redirecting...');
        
        setTimeout(() => {
          const defaultPath = selectedRole === 'restaurant' 
            ? '/restaurant/dashboard' 
            : '/customer-dashboard';
          const redirectPath = location.state?.from?.pathname || defaultPath;
          navigate(redirectPath, { replace: true });
        }, 1500);
  
      } else {
        setError(response.message || 'Login failed. Please try again.');
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'An unexpected error occurred';
      setError(errorMessage);
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    setError('');
    setSuccessMessage('');
  };

  const isRestaurant = selectedRole === 'restaurant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl p-8 space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-orange-500/10 to-yellow-500/10 rounded-full blur-3xl" />

      {/* Header */}
      <div className="text-center space-y-2 relative">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800"
        >
          {isRestaurant ? 'Restaurant Partner Login' : 'Welcome Back, Foodie!'}
        </motion.h2>
        <p className="text-gray-600 dark:text-gray-400">
          {isRestaurant
            ? 'Access your restaurant dashboard and manage your orders efficiently.'
            : 'Sign in to your personalized dining experience'}
        </p>
      </div>

      <RoleSelector 
        selectedRole={selectedRole} 
        onChange={handleRoleChange}
        disabled={loading} 
      />

      <form onSubmit={handleSubmit} className="space-y-6 relative">
        {/* Error/Success Messages */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 rounded-md bg-red-50 dark:bg-red-900/30"
            >
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 rounded-md bg-green-50 dark:bg-green-900/30"
            >
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <p className="text-sm font-medium">{successMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Email Field */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {isRestaurant ? 'Restaurant Email' : 'Email'}
            </label>
            <div className="relative">
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                placeholder={isRestaurant ? 'Enter your restaurant email' : 'Enter your email'}
                className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                required
                disabled={loading}
              />
              <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                placeholder="Enter your password"
                className="block w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                required
                disabled={loading}
              />
              <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Admin Code Field (For Restaurant Role Only) */}
          {isRestaurant && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Admin Code
              </label>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  value={formData.adminCode}
                  onChange={handleInputChange('adminCode')}
                  placeholder="Enter Admin Code"
                  className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  required
                  disabled={loading}
                />
                <Key className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-md text-sm font-medium focus:outline-none disabled:bg-gray-400 transition-all duration-200 hover:from-red-600 hover:to-orange-600"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
          ) : (
            'Log In'
          )}
        </button>

        {/* Additional Links */}
        <div className="space-y-4">
          <div className="text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
            >
              Forgot your password?
            </Link>
          </div>

          <div className="text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
                  Or
                </span>
              </div>
            </div>
            
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Don't have an account?{' '}
              </span>
              <Link
                to="/signup"
                className="font-semibold text-red-500 hover:text-red-600 dark:text-orange-400 dark:hover:text-orange-500 transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>

          {/* Terms and Privacy */}
          <div className="text-xs text-center text-gray-400 dark:text-gray-500">
            By continuing, you agree to our{' '}
            <Link 
              to="/terms" 
              className="text-red-500 hover:text-red-600 dark:text-orange-400 dark:hover:text-orange-500"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link 
              to="/privacy" 
              className="text-red-500 hover:text-red-600 dark:text-orange-400 dark:hover:text-orange-500"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </form>
    </motion.div>
  );
}