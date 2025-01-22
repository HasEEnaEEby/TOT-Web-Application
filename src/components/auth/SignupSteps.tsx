import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import React from 'react';

interface SignupStepsProps {
  currentStep: number;
  totalSteps: number;
}

export const SignupSteps: React.FC<SignupStepsProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex justify-between items-center w-full mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <motion.div className="flex flex-col items-center">
            <motion.div
              initial={false}
              animate={{
                backgroundColor: index <= currentStep ? '#f97316' : '#e5e7eb',
                borderColor: index <= currentStep ? '#f97316' : '#e5e7eb',
              }}
              className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
            >
              {index < currentStep ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <span className={`text-sm ${index <= currentStep ? 'text-white' : 'text-gray-500'}`}>
                  {index + 1}
                </span>
              )}
            </motion.div>
            <motion.div
              initial={false}
              animate={{
                color: index <= currentStep ? '#f97316' : '#9ca3af',
              }}
              className="text-xs mt-2 font-medium"
            >
              Step {index + 1}
            </motion.div>
          </motion.div>
          {index < totalSteps - 1 && (
            <motion.div
              initial={false}
              animate={{
                backgroundColor: index < currentStep ? '#f97316' : '#e5e7eb',
              }}
              className="flex-1 h-0.5 mx-2"
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};