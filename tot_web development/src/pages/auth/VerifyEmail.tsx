import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/use-auth';
import { ThemeToggle } from '../../components/common/ThemeToggle';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const { verifyEmail } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      toast.error('Invalid verification link');
      navigate('/login');
      return;
    }

    const verifyToken = async () => {
      try {
        await verifyEmail(token);
        setVerifying(false);
        toast.success('Email verified successfully! Please login.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (error) {
        setVerifying(false);
        toast.error('Verification failed. Please try again.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    };

    verifyToken();
  }, [searchParams, verifyEmail, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25 bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 to-gray-100/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative min-h-screen flex flex-col items-center justify-center p-4"
      >
        <div className="text-center">
          {verifying ? (
            <>
              <div className="w-16 h-16 mx-auto mb-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Verifying your email...
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we verify your email address
              </p>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center"
              >
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Email Verified Successfully!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Redirecting to login page...
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;