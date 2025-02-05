// src/components/admin/Header.tsx
import clsx from "clsx";
import { Bell, LogOut, Search, Settings, User, UserCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "../../components/common/ThemeToggle";
import { useAuth } from "../../hooks/use-auth"; // Updated import path

export default function Header({ sidebarWidth }: { sidebarWidth: number }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const { authState, logout } = useAuth();

  // Get admin profile from auth state
  const adminProfile =
    authState.user?.role === "admin"
      ? {
          name: authState.user.username,
          email: authState.user.email,
          avatar: undefined, // Add avatar if you have it in your user type
        }
      : null;

  const notifications = [
    { id: 1, title: "New Restaurant Application", time: "5 min ago" },
    { id: 2, title: "Payment Overdue", time: "1 hour ago" },
    { id: 3, title: "System Update", time: "2 hours ago" },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node) &&
        !profileButtonRef.current?.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header
      className={clsx(
        "h-16 bg-white border-b border-gray-200 fixed top-0 right-0 z-10 transition-all duration-300",
        "dark:bg-gray-900 dark:border-gray-700"
      )}
      style={{ left: `${sidebarWidth}px` }}
    >
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

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full animate-pulse" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {notification.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {notification.time}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              ref={profileButtonRef}
              onClick={handleProfileClick}
              className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {adminProfile?.avatar ? (
                  <img
                    src={adminProfile.avatar}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <User className="w-5 h-5 text-gray-600 dark:text-white" />
                )}
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm text-gray-700 dark:text-white">
                  {adminProfile?.name || "Admin"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Administrator
                </span>
              </div>
            </button>

            {showProfileMenu && (
              <div
                ref={profileMenuRef}
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2"
              >
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Signed in as
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {adminProfile?.email}
                  </p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate("/admin/profile");
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <UserCircle className="w-4 h-4" />
                    Your Profile
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate("/admin/settings");
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
