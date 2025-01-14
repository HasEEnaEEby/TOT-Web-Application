import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/logging/LoginForm';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { useAuth } from '../../hooks/use-auth';

const LoginPage = () => {
  const { authState } = useAuth();
  const { isAuthenticated, user } = authState;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if user is authenticated and not already on /login
    if (isAuthenticated && user && location.pathname !== '/login') {
      const from = location.state?.from?.pathname;
      
      // Only redirect if there's a specific 'from' location
      if (from) {
        const redirectTimer = setTimeout(() => {
          navigate(from, { replace: true });
        }, 100);

        return () => clearTimeout(redirectTimer);
      }
    }
  }, [isAuthenticated, user, navigate, location]);

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  // Only show loading state when actually redirecting
  if (isAuthenticated && user && location.state?.from?.pathname) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
    >
      {/* Theme Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Background Styles */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25 bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 to-gray-100/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm" />

      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
        
        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-4 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          <p>&copy; {new Date().getFullYear()} TOT. All rights reserved.</p>
        </motion.footer>
      </div>
    </motion.div>
  );
};

export default LoginPage;