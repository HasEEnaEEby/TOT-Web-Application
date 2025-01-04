import React, { useMemo } from 'react';
import { Coffee, Sun, Moon, Sunset } from 'lucide-react';

export default function WelcomeMessage({ name = 'Guest' }: { name?: string }) {
  const { greeting, icon: Icon } = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return { greeting: 'Good Morning', icon: Sun };
    if (hour < 17) return { greeting: 'Good Afternoon', icon: Sunset };
    if (hour < 21) return { greeting: 'Good Evening', icon: Coffee };
    return { greeting: 'Good Night', icon: Moon };
  }, []);

  return (
    <div className="flex items-center space-x-2 text-lg font-medium text-gray-700 dark:text-gray-300">
      <Icon className="h-5 w-5 text-primary-500" />
      <span>{greeting}, {name}!</span>
    </div>
  );
}