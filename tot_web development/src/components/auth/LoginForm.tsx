import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import { EmailInput } from '../auth/EmailInput';
import { PasswordInput } from '../auth/PasswordInput';
import { AuthButton } from '../auth/AuthButton';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4"
    >
      <div className="w-full max-w-md">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          <div className="flex flex-col items-center mb-8">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-orange-400 to-orange-600 p-3 rounded-full mb-4 shadow-lg"
            >
              <ChefHat className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to your TOT account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <EmailInput
              label="Email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />

            <PasswordInput
              label="Password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-orange-500 hover:text-orange-600 hover:underline transition-all duration-200"
              >
                Forgot password?
              </Link>
            </div>

            <AuthButton type="submit" isLoading={isLoading}>
              Sign In
            </AuthButton>
          </form>

          <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-orange-500 hover:text-orange-600 font-semibold"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};