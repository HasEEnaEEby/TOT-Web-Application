import { motion } from "framer-motion";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ThemeToggle } from "../../components/common/ThemeToggle";
import { useAuth } from "../../hooks/use-auth";

export default function VerifyEmail() {
  const { token } = useParams<{ token: string }>();
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState("");
  const verificationAttempted = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      if (verificationAttempted.current) return;
      verificationAttempted.current = true;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      if (!token) {
        setStatus("error");
        setError("Invalid verification link");
        return;
      }

      try {
        await verifyEmail(token);
        setStatus("success");

        const redirectTimeout = setTimeout(() => {
          navigate("/login", {
            replace: true,
            state: {
              message: "Email verified successfully! Please log in.",
              verified: true,
            },
          });
        }, 2000);

        return () => clearTimeout(redirectTimeout);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setStatus("error");
          let errorMessage = "Verification failed. Please try again.";

          if (err.message.includes("Invalid or expired")) {
            errorMessage =
              "Your verification link has expired. Please request a new one.";
          } else if (err.message.includes("already verified")) {
            errorMessage =
              "This email is already verified. Please proceed to login.";
          }

          setError(errorMessage);
        }
      }
    };

    verifyToken();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [token, verifyEmail, navigate]);

  const handleResendVerification = () => {
    const email = localStorage.getItem("pendingVerificationEmail");
    if (email) {
      navigate("/verify-email-pending", {
        state: { email, resend: true },
      });
    } else {
      navigate("/login", {
        state: {
          message: "Please login to request a new verification email.",
        },
      });
    }
  };

  const handleGoToLogin = () => {
    navigate("/login", {
      replace: true,
      state: {
        message:
          status === "error"
            ? "Please try logging in or request a new verification email."
            : undefined,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25 bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 to-gray-100/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative min-h-screen flex flex-col items-center justify-center p-4"
      >
        <div className="w-full max-w-md space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
          {status === "loading" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Verifying your email...
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait a moment while we verify your email address
              </p>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="space-y-4"
            >
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Email Verified Successfully!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Redirecting you to login...
              </p>
              <motion.div
                className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2 }}
              />
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="space-y-4"
            >
              <XCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Verification Failed
              </h2>
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <div className="space-y-2 mt-4">
                <button
                  onClick={handleGoToLogin}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 
                    hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 
                    focus:ring-offset-2 focus:ring-blue-500 transition-colors
                    dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Go to Login
                </button>
                <button
                  onClick={handleResendVerification}
                  className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 
                    hover:bg-blue-100 rounded-md focus:outline-none focus:ring-2 
                    focus:ring-offset-2 focus:ring-blue-500 transition-colors
                    dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                >
                  Resend Verification Email
                </button>
              </div>
            </motion.div>
          )}

          {/* Additional help text for error state */}
          {status === "error" && (
            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              <p>
                If you continue to experience issues, please contact our support
                team at{" "}
                <a
                  href="mailto:support@tot-app.com"
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  support@tot-app.com
                </a>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
