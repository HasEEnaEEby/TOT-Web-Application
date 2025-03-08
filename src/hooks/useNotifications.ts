// src/hooks/useNotifications.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';
import { notificationApi } from '../api/notificationApi';
import useAuth from './use-auth';

export interface Notification {
  _id: string;
  recipient: string;
  sender: string;
  type: 'order_placed' | 'order_updated' | 'order_status_change' | 'bill_requested';
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

export const useNotifications = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const { authState } = useAuth();
  const pollingIntervalRef = useRef<number | null>(null);

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    if (!authState.user) return;

    setIsLoading(true);
    try {
      console.log('📣 Fetching notifications via REST API');
      const response = await notificationApi.getNotifications({
        limit: 10,
        onlyUnread: true
      });

      if (response.status === 'success') {
        console.log(`✅ Received ${response.data.notifications.length} notifications`);
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.notifications.filter(n => !n.isRead).length);
      }
    } catch (error) {
      console.error('❌ Failed to fetch notifications', error);
      toast.error('Could not load notifications');
    } finally {
      setIsLoading(false);
    }
  }, [authState.user]);

  // Setup polling as fallback for when socket isn't working
  const setupPolling = useCallback(() => {
    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    
    // If socket is connected, don't use polling
    if (socketConnected) return;
    
    console.log('🔄 Setting up notification polling (every 30s)');
    
    // Poll every 30 seconds
    pollingIntervalRef.current = window.setInterval(() => {
      console.log('🔄 Polling for notifications');
      fetchNotifications();
    }, 30000);
    
  }, [socketConnected, fetchNotifications]);

  // Socket connection setup
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!authState.user || !token) return;
  
    console.log('🔌 Initializing notification socket connection');
    
    // Create socket connection with more robust options
    const newSocket = io(import.meta.env.VITE_API_URL, {
      auth: { 
        token: token 
      },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
      transports: ['websocket', 'polling'],
      forceNew: true,
      withCredentials: true,
      extraHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  
    // Connection status handling
    newSocket.on('connect', () => {
      console.log('✅ Notification socket connected', {
        id: newSocket.id,
        connected: newSocket.connected
      });
      setSocketConnected(true);
      // Silent toast to avoid too many notifications
      if (authState.user.role === 'restaurant_admin') {
        toast.success('Real-time notifications connected', {
          duration: 2000
        });
      }
    });
  
    newSocket.on('disconnect', () => {
      console.log('🔌 Notification socket disconnected');
      setSocketConnected(false);
      // Set up polling as fallback
      setupPolling();
    });
    
    newSocket.on('connect_error', (error) => {
      console.error('❌ Notification socket connection error:', {
        error: error.message,
        name: error.name,
        stack: error.stack
      });
      setSocketConnected(false);
      
      // Set up polling as fallback
      setupPolling();
    });
  
    newSocket.on('reconnect', (attemptNumber) => {
      console.log(`✅ Reconnected to notification socket after ${attemptNumber} attempts`);
      setSocketConnected(true);
      
      // Clear polling now that socket is connected
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    });
  
    // Listen for new notifications
    newSocket.on('newNotification', (notification: Notification) => {
      console.log('📣 Received new notification:', notification);
      
      // Update notifications list
      setNotifications(prev => {
        // Prevent duplicate notifications
        const isExisting = prev.some(n => n._id === notification._id);
        if (isExisting) return prev;
        
        return [notification, ...prev];
      });
      
      // Increment unread count
      setUnreadCount(prev => prev + 1);
  
      // Show toast notification
      toast.success(notification.content, {
        position: 'top-right',
        duration: 4000
      });
      
      // If this is an order notification, refresh orders
      if (
        notification.type === 'order_placed' || 
        notification.type === 'order_updated' || 
        notification.type === 'order_status_change'
      ) {
        // Dispatch a custom event that the order hook can listen for
        window.dispatchEvent(new CustomEvent('order-notification', { 
          detail: { type: notification.type, orderId: notification.relatedOrder?._id }
        }));
      }
    });
  
    setSocket(newSocket);
  
    // Fetch initial notifications
    fetchNotifications();
    
    // Set up polling as fallback if needed
    if (!socketConnected) {
      setupPolling();
    }
  
    // Cleanup on unmount
    return () => {
      if (newSocket) {
        console.log('🔌 Disconnecting notification socket');
        newSocket.disconnect();
      }
      
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [authState.user, fetchNotifications, setupPolling, socketConnected]);

  // Mark notifications as read
  const markAsRead = useCallback(async (notificationIds?: string[]) => {
    try {
      await notificationApi.markNotificationsRead(notificationIds);

      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          (!notificationIds || notificationIds.includes(notification._id))
            ? { ...notification, isRead: true }
            : notification
        )
      );

      // Update unread count
      const unreadNotifications = notifications.filter(
        notification => !notification.isRead && 
        (!notificationIds || !notificationIds.includes(notification._id))
      );
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error('Failed to mark notifications as read', error);
      toast.error('Failed to mark notifications as read');
    }
  }, [notifications]);

  // Fetch more notifications
  const fetchMoreNotifications = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const response = await notificationApi.getNotifications({
        limit: 10,
        page
      });

      if (response.status === 'success') {
        setNotifications(prev => [...prev, ...response.data.notifications]);
      }
    } catch (error) {
      console.error('Failed to fetch more notifications', error);
      toast.error('Could not load more notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Force refresh notifications
  const refreshNotifications = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    socketConnected,
    socket,
    markAsRead,
    fetchMoreNotifications,
    refreshNotifications,
    isLoading
  };
};

export default useNotifications;