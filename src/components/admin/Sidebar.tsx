import clsx from "clsx";
import {
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CreditCard,
  DollarSign,
  Home,
  Store,
} from "lucide-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

interface NavItem {
  icon: React.ElementType;
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

export default function Sidebar({
  onWidthChange,
}: {
  onWidthChange: (width: number) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = () => {
    setCollapsed(!collapsed);
    onWidthChange(collapsed ? 256 : 64);
  };

  return (
    <div
      className={clsx(
        "bg-white h-screen border-r border-gray-200 fixed left-0 top-0 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div
        className={clsx(
          "p-6 flex items-center",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        {!collapsed && (
          <h1 className="text-2xl font-bold text-primary-600">TOT Admin</h1>
        )}
        <button
          onClick={handleCollapse}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
      <nav className="mt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                "flex items-center py-3 transition-colors relative group",
                collapsed ? "justify-center px-3" : "px-6",
                isActive
                  ? "bg-primary-50 text-primary-600 border-r-4 border-primary-600"
                  : "text-gray-600 hover:bg-gray-50"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {!collapsed && (
              <span className="font-medium ml-3">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
