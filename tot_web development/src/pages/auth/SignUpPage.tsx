import { motion } from 'framer-motion';
import SignUpForm from '../../components/auth/logging/SignUpForm';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import '../../styles/animations.css';

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-white dark:bg-gray-900 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]">
        <div className="absolute inset-0 bg-grid-gray-900/[0.04] dark:bg-grid-white/[0.02] bg-[size:32px] pointer-events-none" />
      </div>

      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="relative">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center"
          >
            <SignUpForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;