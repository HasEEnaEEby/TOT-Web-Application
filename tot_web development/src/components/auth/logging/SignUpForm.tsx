import { ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { UserRole } from '../../../store/auth';
import Confetti from '../../ui/Confetti';
import PasswordStrengthMeter from '../PasswordStrengthMeter';
import RoleSelector from '../RoleSelector';

const steps = ['Role Selection', 'Personal Info', 'Account Details'];

export default function SignUpForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer' as UserRole,
    phoneNumber: '',
    acceptTerms: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <>
      {showConfetti && <Confetti />}
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="relative pt-1 mb-8">
          <div className="flex mb-2 justify-between">
            {steps.map((step, idx) => (
              <span
                key={step}
                className={`text-xs font-semibold inline-block ${
                  idx <= currentStep
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            ))}
          </div>
          <div className="flex h-2 mb-4 overflow-hidden bg-gray-200 rounded">
            <div
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              className="bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 0 && (
            <RoleSelector
              selectedRole={formData.role}
              onChange={(role) => setFormData({ ...formData, role })}
            />
          )}

          {currentStep === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 hover-scale input-highlight"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 hover-scale input-highlight"
                />
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 hover-scale input-highlight"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 hover-scale input-highlight"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <PasswordStrengthMeter password={formData.password} />
              </div>
            </>
          )}

          <div className="flex justify-between space-x-4">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 hover-scale"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 hover-scale"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 hover-scale"
              >
                Create Account
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}