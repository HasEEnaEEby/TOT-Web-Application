import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Users } from 'lucide-react';

type UserRole = 'customer' | 'restaurant';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onChange: (role: UserRole) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onChange }) => {
  const roles = [
    {
      id: 'customer' as UserRole,
      title: 'Customer',
      icon: <Users className="h-8 w-8" />,
      description: 'Access your favorite orders and preferences',
    },
    {
      id: 'restaurant' as UserRole,
      title: 'Restaurant',
      icon: <ChefHat className="h-8 w-8" />,
      description: 'Manage your restaurant dashboard',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {roles.map(({ id, title, icon, description }) => (
        <motion.button
          key={id}
          onClick={() => onChange(id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`relative group overflow-hidden rounded-xl transition-all duration-300 ${
            selectedRole === id ? 'ring-2 ring-red-500' : ''
          }`}
        >
          <div
            className={`absolute inset-0 ${
              selectedRole === id
                ? 'bg-gradient-to-br from-red-500 to-orange-500 opacity-100'
                : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700'
            } transition-all duration-300`}
          />
          <div className="relative p-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <motion.div
                className={`p-3 rounded-full ${
                  selectedRole === id ? 'bg-white/20' : 'bg-white dark:bg-gray-800'
                } transition-colors duration-300`}
                animate={{
                  scale: selectedRole === id ? [1, 1.1, 1] : 1,
                  rotate: selectedRole === id ? [0, 5, -5, 0] : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <div className={selectedRole === id ? 'text-white' : 'text-red-500'}>{icon}</div>
              </motion.div>
              <div className="space-y-1">
                <h3
                  className={`font-medium ${
                    selectedRole === id ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {title}
                </h3>
                <p
                  className={`text-sm ${
                    selectedRole === id ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {description}
                </p>
              </div>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default RoleSelector;
