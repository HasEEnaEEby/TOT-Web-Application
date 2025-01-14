import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, Loader2, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import { UserRole } from "../../types/auth";
import { ThemeToggle } from "../common/ThemeToggle";

interface LocationState {
  email: string;
  role: UserRole;
}

export default function VerificationPending() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resendVerification } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const { email, role } = location.state as LocationState;

  useEffect(() => {
    if (!email) {
      navigate("/signup");
      return;
    }
  }, [email, navigate]);
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((prev) => prev - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendCountdown]);

  const handleResendVerification = async () => {
    if (isResending || resendCountdown > 0) return;

    setIsResending(true);
    try {
      await resendVerification({ email, role });
      toast.success("Verification email sent! Please check your inbox.");
      setResendCountdown(60);
    } catch (error) {
      toast.error("Failed to resend verification email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Link
        to="/login"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 text-gray-600 
          hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Login</span>
      </Link>
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25 bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 to-gray-100/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative min-h-screen flex flex-col items-center justify-center p-4"
      >
        <div className="w-full max-w-md space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900 rounded-full 
                flex items-center justify-center"
            >
              <Mail className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Verify Your Email
            </h2>

            <p className="mt-2 text-gray-600 dark:text-gray-400">
              We've sent a verification email to:
            </p>
            <p className="mt-1 text-lg font-medium text-blue-600 dark:text-blue-400">
              {email}
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <p>
                    Please check your email and click the verification link to
                    activate your account.
                  </p>
                  <p className="mt-1">
                    If you don't see the email, check your spam folder.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleResendVerification}
              disabled={isResending || resendCountdown > 0}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 
                hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 
                focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 
                disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isResending ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Sending...
                </>
              ) : resendCountdown > 0 ? (
                `Resend in ${resendCountdown}s`
              ) : (
                "Resend Verification Email"
              )}
            </button>

            <div className="text-center">
              <Link
                to="/contact-support"
                className="text-sm text-gray-500 hover:text-gray-700 
                  dark:text-gray-400 dark:hover:text-gray-300"
              >
                Need help? Contact support
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
