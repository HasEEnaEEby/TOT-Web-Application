import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff, Loader2, Mail, User } from 'lucide-react';
import React, { useState } from 'react';
import RoleSelector from '../RoleSelector';

interface SignUpFormProps {
  role?: 'customer' | 'restaurant';
  onSignInClick?: () => void;
}

export default function SignUpForm({ role = 'customer', onSignInClick }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    restaurantName: '',
    location: '',
    quote: '',
    contactNumber: '',
  });

  const [selectedRole, setSelectedRole] = useState<'customer' | 'restaurant'>('customer');

  const validateForm = () => {
    if (selectedRole === 'customer') {
      if (!formData.username.trim()) {
        setError('Username is required');
        return false;
      }
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (selectedRole === 'restaurant') {
      if (!formData.restaurantName.trim()) {
        setError('Restaurant name is required');
        return false;
      }
      if (!formData.location.trim()) {
        setError('Location is required');
        return false;
      }
      if (!formData.contactNumber.trim()) {
        setError('Contact number is required');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Sign up successful:', { ...formData, role: selectedRole });
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg relative overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-orange-500/10 to-yellow-500/10 rounded-full blur-3xl" />

      <div className="text-center space-y-2 relative">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-500 dark:to-orange-500"
        >
          {selectedRole === 'customer' ? "Join the TOT Family!" : "Join TOT as a Restaurant Partner!"}
        </motion.h2>
        <p className="text-gray-600 dark:text-gray-400">
          {selectedRole === 'customer' ? 
            "Save your favorite orders and enjoy a personalized experience." :
            "Connect with more customers and streamline your orders."
          }
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

        {/* Dynamic Form Fields */}
        {selectedRole === 'customer' ? (
          <>
            {/* Username Field */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  value={formData.username}
                  onChange={(e) => {
                    setFormData({ ...formData, username: e.target.value });
                    setError('');
                  }}
                  className="block w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  required
                />
                <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Restaurant Name Field */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Restaurant Name
              </label>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  value={formData.restaurantName}
                  onChange={(e) => {
                    setFormData({ ...formData, restaurantName: e.target.value });
                    setError('');
                  }}
                  className="block w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  required
                />
                <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Location Field */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Location
              </label>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  value={formData.location}
                  onChange={(e) => {
                    setFormData({ ...formData, location: e.target.value });
                    setError('');
                  }}
                  className="block w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  required
                />
                <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Quote Field */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Quote (Optional)
              </label>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  value={formData.quote}
                  onChange={(e) => {
                    setFormData({ ...formData, quote: e.target.value });
                    setError('');
                  }}
                  className="block w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                />
                <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Contact Number Field */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contact Number
              </label>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  value={formData.contactNumber}
                  onChange={(e) => {
                    setFormData({ ...formData, contactNumber: e.target.value });
                    setError('');
                  }}
                  className="block w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  required
                />
                <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
          </>
        )}

        {/* Common Fields (Email, Password, Confirm Password) */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
          <div className="relative">
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setError('');
              }}
              className="block w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              required
            />
            <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        {/* Password and Confirm Password */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <div className="relative">
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                setError('');
              }}
              className="block w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              required
            />
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" onClick={() => setShowPassword(!showPassword)} />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" onClick={() => setShowPassword(!showPassword)} />
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
          <div className="relative">
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                setError('');
              }}
              className="block w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              required
            />
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" onClick={() => setShowPassword(!showPassword)} />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" onClick={() => setShowPassword(!showPassword)} />
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-all duration-200"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
            ) : (
              'Sign Up'
            )}
          </motion.button>
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <button
              onClick={onSignInClick}
              className="font-medium text-red-600 dark:text-orange-400 hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>

        {/* Psychological Nudge */}
        {selectedRole === 'customer' && (
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6">
            Guest mode is limited to 3 hours per day. Create an account for a seamless experience!
          </p>
        )}
        {selectedRole === 'restaurant' && (
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6">
            Approved restaurants receive exclusive tools to manage their menus and track orders.
          </p>
        )}
      </form>
    </motion.div>
  );
}
