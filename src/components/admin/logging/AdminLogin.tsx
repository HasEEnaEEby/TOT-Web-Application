import { ChefHat, Loader2, UtensilsCrossed } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../../hooks/use-adminauth";

type AuthMode = "login" | "signup";
interface AdminLoginProps {
  mode?: AuthMode;
}
type FormData = {
  email: string;
  password: string;
  confirmPassword?: string;
};

export default function AdminLogin({
  mode: initialMode = "login",
}: AdminLoginProps) {
  const { handleAdminLogin, handleAdminRegister, isLoading, error, setError } =
    useAdminAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
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

    if (initialMode === "signup") {
      if (formData.password !== formData.confirmPassword) {
        setError("The passwords don't match! Let's try that again.");
        return;
      }

      await handleAdminRegister({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword || "",
      });
    } else {
      await handleAdminLogin({
        email: formData.email,
        password: formData.password,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -rotate-12 -left-20 top-20 text-orange-200/30">
          <UtensilsCrossed size={200} />
        </div>
        <div className="absolute rotate-12 -right-20 bottom-20 text-red-200/30">
          <ChefHat size={200} />
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 relative overflow-hidden">
          {/* Header */}
          <div className="text-center space-y-2 animate-fade-in">
            <ChefHat className="mx-auto h-16 w-16 text-orange-500 animate-bounce-slow" />
            <h1 className="text-3xl font-bold text-gray-800 font-display">
              Welcome to the TOT Family!
            </h1>
            <p className="text-gray-600">
              {initialMode === "login"
                ? "Let's get you started, Admin! Please log in below to manage the TOT experience."
                : "New here? Don't worry, we're excited to have you onboard!"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {initialMode === "signup" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
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
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                initialMode === "login"
                  ? "bg-orange-500 hover:bg-orange-600 focus:ring-orange-500"
                  : "bg-green-500 hover:bg-green-600 focus:ring-green-500"
              }`}
            >
              {isLoading ? (
                <Loader2 className="animate-spin mx-auto h-5 w-5" />
              ) : initialMode === "login" ? (
                "Let's Go!"
              ) : (
                "Join the Team!"
              )}
            </button>
          </form>

          {/* Mode toggle with navigation */}
          <div className="text-center">
            <button
              onClick={() =>
                navigate(
                  initialMode === "login" ? "/admin/register" : "/admin/login"
                )
              }
              className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              {initialMode === "login"
                ? "New here? Create your admin account!"
                : "Already a member? Log in!"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
