// src/components/auth/VerificationPending.tsx
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';

export default function VerificationPending() {
  const location = useLocation();
  const { email, role } = location.state || {};
  const { resendVerification } = useAuth();
  const [isResending, setIsResending] = useState(false);

  if (!email) {
    return <Navigate to="/signup" replace />;
  }

  const handleResendVerification = async () => {
    try {
      setIsResending(true);
      await resendVerification({ email, role });
      toast.success('Verification email resent successfully!');
    } catch (error) {
      toast.error('Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4"
    >
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
            {role === 'restaurant' ? 'Check your email for verification code' : 'Check your email'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            We've sent a {role === 'restaurant' ? 'verification code' : 'verification link'} to:
          </p>
          <p className="mt-1 text-lg font-medium text-gray-800 dark:text-gray-200">
            {email}
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {role === 'restaurant' 
              ? 'Please enter the 6-digit verification code to verify your restaurant account.'
              : 'Please click the verification link in your email to activate your account.'}
          </p>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already verified your email?
            </p>
            <Link
              to="/login"
              className="mt-2 w-full flex items-center justify-center px-4 py-2 
                border border-transparent rounded-md shadow-sm text-sm font-medium 
                text-white bg-red-600 hover:bg-red-700 focus:outline-none"
            >
              Go to Login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
            <p>Didn't receive the {role === 'restaurant' ? 'code' : 'email'}?</p>
            <button
              onClick={handleResendVerification}
              disabled={isResending}
              className="mt-1 text-red-600 hover:text-red-500 dark:text-red-400 
                dark:hover:text-red-300 font-medium flex items-center justify-center w-full gap-2"
            >
              {isResending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Resending...
                </>
              ) : (
                'Click here to resend'
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}