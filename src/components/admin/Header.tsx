import clsx from 'clsx';
import { Bell, Search, User } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '../../components/common/ThemeToggle';

export default function Header({ sidebarWidth }: { sidebarWidth: number }) {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'New Restaurant Application', time: '5 min ago' },
    { id: 2, title: 'Payment Overdue', time: '1 hour ago' },
    { id: 3, title: 'System Update', time: '2 hours ago' },
  ];

  return (
    <header className={clsx(
      "h-16 bg-white border-b border-gray-200 fixed top-0 right-0 z-10 transition-all duration-300",
      "dark:bg-gray-900 dark:border-gray-700"
    )}
    style={{ left: `${sidebarWidth}px` }}>
      <div className="h-full px-6 flex items-center justify-between">
        <div className="relative w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search restaurants, orders..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg transition-colors bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle /> 
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-50 rounded-full transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full animate-pulse" />
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                {notifications.map(notification => (
                  <div key={notification.id} className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{notification.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{notification.time}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <User className="w-5 h-5 text-gray-600 dark:text-white" />
            <span className="font-medium text-gray-700 dark:text-white">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
}
