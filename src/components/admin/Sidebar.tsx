import {
  CheckSquare,
  ClipboardList,
  CreditCard,
  DollarSign,
  Home,
  LifeBuoy,
  LucideIcon,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../../hooks/use-theme";

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Dashboard", path: "/admin" },
  {
    icon: ClipboardList,
    label: "Restaurant Requests",
    path: "/admin/requests",
  },
  { icon: Store, label: "Restaurant Management", path: "/admin/restaurants" },
  { icon: CreditCard, label: "Subscriptions", path: "/admin/subscriptions" },
  { icon: DollarSign, label: "Admin Income", path: "/admin/income" },
  { icon: CheckSquare, label: "Tasks", path: "/admin/tasks" },
];

interface SidebarProps {
  onWidthChange: (width: number) => void;
  defaultCollapsed?: boolean;
  mobileBreakpoint?: number;
}

const EXPANDED_WIDTH = 300;
const COLLAPSED_WIDTH = 64;

export default function Sidebar({
  onWidthChange,
  defaultCollapsed = false,
  mobileBreakpoint = 768,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const updateSidebarWidth = () => {
      const mobile = window.innerWidth < mobileBreakpoint;
      setIsMobile(mobile);
      setCollapsed(mobile);
      onWidthChange(mobile ? COLLAPSED_WIDTH : EXPANDED_WIDTH);
    };

    updateSidebarWidth();

    window.addEventListener("resize", updateSidebarWidth);
    return () => window.removeEventListener("resize", updateSidebarWidth);
  }, [mobileBreakpoint, onWidthChange]);

  const handleResize = useCallback(() => {
    const mobile = window.innerWidth < mobileBreakpoint;
    setIsMobile(mobile);
    if (mobile !== isMobile) {
      setCollapsed(mobile);
      onWidthChange(mobile ? COLLAPSED_WIDTH : EXPANDED_WIDTH);
    }
  }, [isMobile, mobileBreakpoint, onWidthChange]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };
    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [handleResize]);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen border-r transition-all duration-300 shadow-xl flex flex-col 
        ${collapsed ? "w-16" : "w-72"}
        ${
          theme === "dark"
            ? "bg-gray-900 border-gray-700 text-white"
            : "bg-white border-gray-200 text-primary-900"
        }
       `}
      aria-expanded={!collapsed}
    >
      {/* Sidebar Header (Logo) */}
      <div className="p-4 flex flex-col items-center border-b border-gray-300 dark:border-gray-700 rounded-tr-[50px]">
        <UtensilsCrossed className="w-10 h-10 text-primary-900 dark:text-white" />
        {!collapsed && (
          <div className="text-center mt-2">
            <h1 className="text-2xl font-bold tracking-wide text-primary-900 dark:text-white">
              TOT Admin
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Powering Your Business
            </p>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="mt-4 flex-1" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              `flex items-center py-3 px-4 transition-colors relative group rounded-md mx-2 
              ${collapsed ? "justify-center px-3" : "px-4"}
              ${
                isActive
                  ? theme === "dark"
                    ? "bg-gray-800 text-white font-bold"
                    : "bg-primary-100 text-primary-900 font-bold"
                  : theme === "dark"
                  ? "text-white hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            <item.icon className="w-5 h-5" aria-hidden="true" />
            {!collapsed && (
              <span className="font-medium ml-3 truncate">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Help Center Section */}
      <div className="w-full p-4 border-t border-gray-300 dark:border-gray-700 flex flex-col items-center">
        <NavLink
          to="/help-center"
          className="flex items-center py-3 px-4 w-full rounded-md transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <LifeBuoy className="w-5 h-5" aria-hidden="true" />
          {!collapsed && <span className="ml-3 font-medium">Help Center</span>}
        </NavLink>
      </div>
    </aside>
  );
}
