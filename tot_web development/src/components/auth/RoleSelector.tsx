import React from 'react';
import { ChefHat, Users } from 'lucide-react';
import { UserRole } from '../../store/auth';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onChange: (role: UserRole) => void;
}

export default function RoleSelector({ selectedRole, onChange }: RoleSelectorProps) {
  const roles: { id: UserRole; title: string; icon: React.ReactNode; description: string }[] = [
    {
      id: 'customer',
      title: 'Customer',
      icon: <Users className="h-8 w-8" />,
      description: 'Order food from your favorite restaurants'
    },
    {
      id: 'restaurant',
      title: 'Restaurant',
      icon: <ChefHat className="h-8 w-8" />,
      description: 'Manage your restaurant and orders'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {roles.map(({ id, title, icon, description }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`p-6 rounded-xl border-2 transition-all duration-200 ${
            selectedRole === id
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
          }`}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className={`${
              selectedRole === id ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400'
            }`}>
              {icon}
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}