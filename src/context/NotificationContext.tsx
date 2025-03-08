// src/context/NotificationContext.tsx
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { io, Socket } from "socket.io-client";
import { notificationApi } from "../api/notificationApi";
import { useAuth } from "../hooks/use-auth";

// Notification interface
export interface Notification {
  _id: string;
  recipient: string;
  sender: string;
  type:
    | "order_placed"
    | "order_updated"
    | "order_status_change"
    | "bill_requested";
  content: string;
  isRead: boolean;
  createdAt: string;
  relatedOrder?: {
    _id: string;
    table: string;
    totalAmount: number;
  };
  metadata?: Record<string, unknown>;
}

// Context type
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  socket: Socket | null;
  isLoading: boolean;
  markAsRead: (notificationIds?: string[]) => Promise<void>;
  fetchMoreNotifications: (page: number) => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

// Create context
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// Provider component
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { authState } = useAuth();

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    if (!authState.user) return;

    setIsLoading(true);
    try {
      const response = await notificationApi.getNotifications({
        limit: 10,
        onlyUnread: true,
      });

      if (response.status === "success") {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.notifications.length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
      toast.error("Could not load notifications");
    } finally {
      setIsLoading(false);
    }
  }, [authState.user]);

  // Setup socket connection
  const setupSocketConnection = useCallback(() => {
    // Only connect if user is logged in and has a token
    const token = localStorage.getItem("token");
    if (!authState.user || !token) return null;

    // Create socket connection
    const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection success handler
    newSocket.on("connect", () => {
      console.log("Socket connected successfully");
    });

    // Connection error handler
    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error", error);
      toast.error("Failed to connect to real-time updates");
    });

    // Listen for new notifications
    newSocket.on("newNotification", (notification: Notification) => {
      // Update notifications list
      setNotifications((prev) => [notification, ...prev]);

      // Increment unread count
      setUnreadCount((prev) => prev + 1);

      // Show toast notification
      toast.success(notification.content, {
        position: "top-right",
        duration: 4000,
      });
    });

    return newSocket;
  }, [authState.user]);

  // Mark notifications as read
  const markAsRead = useCallback(async (notificationIds?: string[]) => {
    try {
      await notificationApi.markNotificationsRead(notificationIds);

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          !notificationIds || notificationIds.includes(notification._id)
            ? { ...notification, isRead: true }
            : notification
        )
      );

      // Reset unread count
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark notifications as read", error);
      toast.error("Failed to mark notifications as read");
    }
  }, []);

  // Fetch more notifications
  const fetchMoreNotifications = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const response = await notificationApi.getNotifications({
        limit: 10,
        page,
      });

      if (response.status === "success") {
        setNotifications((prev) => [...prev, ...response.data.notifications]);
      }
    } catch (error) {
      console.error("Failed to fetch more notifications", error);
      toast.error("Could not load more notifications");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect to manage socket connection
  useEffect(() => {
    // Setup socket connection
    const newSocket = setupSocketConnection();

    // Set socket state
    setSocket(newSocket);

    // Fetch initial notifications
    fetchNotifications();

    // Cleanup on unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [setupSocketConnection, fetchNotifications]);

  // Context value
  const contextValue = {
    notifications,
    unreadCount,
    socket,
    isLoading,
    markAsRead,
    fetchMoreNotifications,
    fetchNotifications,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
