// components/common/Notifications.tsx
import { formatDistanceToNow } from "date-fns";
import { Bell, Loader2, X } from "lucide-react";
import React, { useState } from "react";
import { useNotifications } from "../../hooks/useNotifications";

import { Button } from "../common/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../common/ui/dropdown_menu";

// Helper function to get notification icon and style based on type
const getNotificationStyle = (type: string) => {
  switch (type) {
    case "order_placed":
      return {
        icon: "🍽️",
        color: "bg-primary-500",
        label: "New Order",
      };
    case "order_status_change":
      return {
        icon: "🔄",
        color: "bg-secondary-500",
        label: "Order Update",
      };
    case "order_updated":
      return {
        icon: "➕",
        color: "bg-green-500",
        label: "Order Modified",
      };
    case "bill_requested":
      return {
        icon: "💸",
        color: "bg-blue-500",
        label: "Bill Request",
      };
    default:
      return {
        icon: "🔔",
        color: "bg-gray-500",
        label: "Notification",
      };
  }
};

export const Notifications: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    fetchMoreNotifications,
    isLoading,
  } = useNotifications();

  // Limit notifications to last 5
  const displayNotifications = notifications.slice(0, 5);

  const handleMarkAllAsRead = () => {
    markAsRead();
    setIsOpen(false);
  };

  const handleNotificationClick = (notificationId: string) => {
    // You can add more specific logic here, such as:
    // - Navigate to order details
    // - Open a modal with more information
    markAsRead([notificationId]);
  };

  const handleLoadMore = () => {
    // Fetch next page of notifications
    fetchMoreNotifications(Math.ceil(notifications.length / 10) + 1);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div className="relative cursor-pointer">
          <Bell className="w-6 h-6 text-secondary-600 hover:text-primary-600 transition-colors" />
          {unreadCount > 0 && (
            <span
              className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center 
              bg-primary-500 text-white rounded-full text-xs"
            >
              {unreadCount}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center p-3 border-b">
          <DropdownMenuLabel className="text-sm font-semibold text-secondary-900">
            Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs text-primary-600 hover:text-primary-700"
            >
              Mark all as read
            </Button>
          )}
        </div>

        {displayNotifications.length === 0 ? (
          <div className="text-center text-secondary-500 p-4">
            {isLoading ? "Loading notifications..." : "No notifications"}
          </div>
        ) : (
          <>
            {displayNotifications.map((notification) => {
              const { color, label } = getNotificationStyle(notification.type);

              return (
                <DropdownMenuItem
                  key={notification._id}
                  className={`flex items-start space-x-3 p-3 
                    ${!notification.isRead ? "bg-primary-50" : ""}
                    hover:bg-secondary-100 cursor-pointer group`}
                  onClick={() => handleNotificationClick(notification._id)}
                >
                  <div className="flex-shrink-0 flex items-center">
                    <div className={`w-2 h-2 rounded-full ${color}`}></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-secondary-800">
                        {label}
                      </span>
                      <span className="text-xs text-secondary-500 ml-2">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-secondary-600 mt-1">
                      {notification.content}
                    </p>
                    {notification.relatedOrder && (
                      <div className="text-xs text-secondary-500 mt-1">
                        Order Total: $
                        {notification.relatedOrder.totalAmount.toFixed(2)}
                      </div>
                    )}
                  </div>
                  {!notification.isRead && (
                    <div
                      className="opacity-0 group-hover:opacity-100 transition-opacity 
                      text-secondary-400 hover:text-secondary-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead([notification._id]);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </div>
                  )}
                </DropdownMenuItem>
              );
            })}

            {notifications.length > 5 && (
              <div className="p-3 text-center border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="text-primary-600 hover:text-primary-700 flex items-center justify-center w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More Notifications"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
