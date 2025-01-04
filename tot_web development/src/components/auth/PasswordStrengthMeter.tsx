import React from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const calculateStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = calculateStrength(password);
  const getStrengthLabel = (strength: number): string => {
    if (strength === 0) return 'Very Weak';
    if (strength === 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    if (strength === 4) return 'Strong';
    return 'Very Strong';
  };

  const getStrengthColor = (strength: number): string => {
    if (strength <= 1) return 'bg-red-500';
    if (strength === 2) return 'bg-orange-500';
    if (strength === 3) return 'bg-yellow-500';
    if (strength === 4) return 'bg-green-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="mt-2">
      <div className="flex h-2 overflow-hidden rounded bg-gray-200">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className={`flex-1 ${
              index < strength ? getStrengthColor(strength) : 'bg-gray-300'
            } ${index > 0 ? 'ml-1' : ''}`}
          />
        ))}
      </div>
      <p
        className={`mt-1 text-sm ${
          strength <= 1
            ? 'text-red-500'
            : strength === 2
            ? 'text-orange-500'
            : strength === 3
            ? 'text-yellow-600'
            : strength === 4
            ? 'text-green-500'
            : 'text-emerald-500'
        }`}
      >
        {password && getStrengthLabel(strength)}
      </p>
    </div>
  );
}