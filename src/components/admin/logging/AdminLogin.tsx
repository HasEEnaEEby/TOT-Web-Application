import { ChefHat, Loader2, Moon, Sun, UtensilsCrossed } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../../hooks/use-adminauth";
import { useTheme } from "../../../hooks/use-theme";

type AuthMode = "login" | "signup";

export default function AdminLogin({ mode = "login" }: { mode?: AuthMode }) {
  const { handleAdminLogin, handleAdminRegister, isLoading, error, setError } =
    useAdminAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError(
        "Oops! Something's missing. Let's make sure everything's filled in correctly!"
      );
      return;
    }

    if (mode === "signup") {
      if (formData.password !== formData.confirmPassword) {
        setError("The passwords don't match! Let's try that again.");
        return;
      }

      await handleAdminRegister(formData);
    } else {
      await handleAdminLogin(formData);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 transition-all duration-300 
        ${
          theme === "dark"
            ? "bg-gray-900 text-white"
            : "bg-gradient-to-br from-orange-50 to-red-50 text-gray-900"
        }
    `}
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -rotate-12 -left-20 top-20 text-orange-200/30 dark:text-gray-700/30">
          <UtensilsCrossed size={200} />
        </div>
        <div className="absolute rotate-12 -right-20 bottom-20 text-red-200/30 dark:text-gray-700/30">
          <ChefHat size={200} />
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6 overflow-hidden transition-all">
          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-white shadow-md hover:scale-110 transition"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Header */}
          <div className="text-center space-y-2 animate-fade-in">
            <ChefHat className="mx-auto h-16 w-16 text-orange-500 dark:text-gray-200 animate-bounce-slow" />
            <h1 className="text-3xl font-bold dark:text-white">
              Welcome to the TOT Family!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {mode === "login"
                ? "Let's get you started, Admin! Please log in below to manage the TOT experience."
                : "New here? Don't worry, we're excited to have you onboard!"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {mode === "signup" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            {error && (
              <div className="text-red-500 dark:text-red-400 text-sm bg-red-50 dark:bg-gray-800 p-3 rounded-lg animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg text-white font-medium transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 
                ${
                  mode === "login"
                    ? "bg-orange-500 hover:bg-orange-600 focus:ring-orange-500"
                    : "bg-green-500 hover:bg-green-600 focus:ring-green-500"
                }`}
            >
              {isLoading ? (
                <Loader2 className="animate-spin mx-auto h-5 w-5" />
              ) : mode === "login" ? (
                "Let's Go!"
              ) : (
                "Join the Team!"
              )}
            </button>
          </form>

          {/* Mode Toggle Navigation */}
          <div className="text-center">
            <button
              onClick={() =>
                navigate(mode === "login" ? "/admin/register" : "/admin/login")
              }
              className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium transition-colors"
            >
              {mode === "login"
                ? "New here? Create your admin account!"
                : "Already a member? Log in!"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
