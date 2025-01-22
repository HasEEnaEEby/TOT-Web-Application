import React from 'react';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmailInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const EmailInput: React.FC<EmailInputProps> = ({ label, error, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor={props.id}>
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Mail size={20} />
        </div>
        <input
          {...props}
          type="email"
          className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
            error
              ? 'border-red-500'
              : 'border-gray-300 dark:border-gray-600'
          } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200`}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-1 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};