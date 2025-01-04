import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff, Key, Loader2, Lock, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleSelector from '../RoleSelector';

interface LoginFormProps {
  onSignUpClick?: () => void;
}

type UserRole = 'customer' | 'restaurant';

export default function LoginForm({ }: LoginFormProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    adminCode: '',
  });

  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.email) {
      setError('Email is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (selectedRole === 'restaurant' && !formData.adminCode) {
      setError('Admin code is required for restaurant login');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Login successful:', { ...formData, role: selectedRole });
    } catch (err) {
      setError('Invalid login credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const isRestaurant = selectedRole === 'restaurant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl p-8 space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg relative overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-orange-500/10 to-yellow-500/10 rounded-full blur-3xl" />

      <div className="text-center space-y-2 relative">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600"
        >
          {isRestaurant ? 'Restaurant Partner Login' : 'Welcome Back, Foodie!'}
        </motion.h2>
        <p className="text-gray-600 dark:text-gray-400">
          {isRestaurant
            ? 'Access your restaurant dashboard and manage your orders efficiently.'
            : 'Sign in to your personalized dining experience'}
        </p>
      </div>

      {/* Role Selector */}
      <RoleSelector selectedRole={selectedRole} onChange={setSelectedRole} />

      <form onSubmit={handleSubmit} className="space-y-6 relative">
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
        </AnimatePresence>

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
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setError('');
              }}
              placeholder={isRestaurant ? 'Enter your restaurant email' : 'Enter your email'}
              className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              required
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
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                setError('');
              }}
              placeholder="Enter your password"
              className="block w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              required
            />
            <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Admin Code Field (For Restaurants Only) */}
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
                onChange={(e) => {
                  setFormData({ ...formData, adminCode: e.target.value });
                  setError('');
                }}
                placeholder="Enter the admin code sent to your email"
                className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                required
              />
              <Key className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This code is provided by the TOT admin upon approval.
            </p>
          </div>
        )}

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
        </motion.button>

        {/* Sign Up Link */}
        <div className="text-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <motion.button
              type="button"
              onClick={() => navigate('/signup')}
              className="font-medium text-red-600 hover:text-red-700 dark:text-orange-400 dark:hover:text-orange-500"
            >
              Sign Up
            </motion.button>
          </span>
        </div>

        {isRestaurant && (
          <motion.a
            whileHover={{ scale: 1.05 }}
            href="#support"
            className="block text-sm text-center text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 transition-all duration-200"
          >
            Need help? Contact Admin
          </motion.a>
        )}
      </form>
    </motion.div>
  );
}
