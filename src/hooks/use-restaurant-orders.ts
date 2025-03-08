// src/hooks/use-restaurant-orders.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import orderApi, { Order } from '../api/orderApi';

// WebSocket connection configuration
const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:4000';

export const useRestaurantOrders = (restaurantId: string) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const pollingIntervalRef = useRef<number | null>(null);
  const retryCountRef = useRef(0);

  // Function to fetch orders using REST API as fallback
  const fetchOrdersViaAPI = useCallback(async () => {
    if (!restaurantId) return;
    
    try {
      setLoading(true);
      console.log("🔄 Fetching orders via REST API");
      
      const fetchedOrders = await orderApi.getRestaurantOrders();
      
      console.log(`✅ API: Received ${fetchedOrders.length} orders`);
      setOrders(fetchedOrders);
      setError(null);
    } catch (err) {
      console.error('❌ API Error:', err);
      setError('Failed to load orders. Please try again.');
      // Important: Set orders to empty array
      setOrders([]);
    } finally {
      // Always set loading to false
      setLoading(false);
    }
  }, [restaurantId]);

  // Set up polling as a fallback
  const setupPolling = useCallback(() => {
    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    
    // If WebSocket is connected, don't use polling
    if (isWebSocketConnected) return;
    
    console.log('🔄 Setting up order polling (every 15s)');
    
    // Poll every 15 seconds
    pollingIntervalRef.current = window.setInterval(() => {
      console.log('🔄 Auto-polling for orders');
      fetchOrdersViaAPI();
    }, 15000);
  }, [isWebSocketConnected, fetchOrdersViaAPI]);

  // WebSocket connection setup
  const setupWebSocket = useCallback(() => {
    if (!restaurantId) return;
    
    try {
      // Clear any existing reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      // Close existing connection if any
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
        socketRef.current = null;
      }

      // Get authentication token
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("❌ No authentication token available for WebSocket");
        setError('Authentication token is missing. Please log in again.');
        throw new Error("Authentication token required for WebSocket connection");
      }

      console.log("🔌 Establishing WebSocket connection...");
      
      // Include token in WebSocket URL for authentication
      const wsUrl = `${WS_BASE_URL}/orders?restaurantId=${restaurantId}&token=${encodeURIComponent(token)}`;
      console.log("🔌 WebSocket URL (token hidden):", wsUrl.replace(/token=([^&]+)/, 'token=***'));
      
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log("✅ WebSocket connected");
        setIsWebSocketConnected(true);
        setError(null);
        retryCountRef.current = 0; // Reset retry counter on successful connection
        
        // Clear polling interval now that WebSocket is connected
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        
        // Request initial orders from the WebSocket server
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify({
            type: 'REFRESH_ORDERS',
            restaurantId
          }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("📩 WebSocket message:", data.type);
          
          switch (data.type) {
            case 'INITIAL_ORDERS':
              console.log(`📋 Received ${data.orders?.length || 0} initial orders from WebSocket`);
              // Only replace our orders if we actually get orders back
              if (Array.isArray(data.orders) && data.orders.length > 0) {
                setOrders(data.orders);
              }
              setLoading(false);
              break;
              
            case 'ORDER_CREATED':
              console.log("🆕 New order received:", data.order?._id);
              if (data.order && data.order._id) {
                setOrders(prev => {
                  // Check if order already exists (prevent duplicates)
                  const exists = prev.some(order => order._id === data.order._id);
                  if (exists) return prev;
                  return [...prev, data.order];
                });
                toast.success('New order received!');
                
                // Play sound notification if needed
                playOrderSound('new');
              }
              break;
              
            case 'ORDER_UPDATED':
              console.log("🔄 Order updated:", data.order?._id);
              if (data.order && data.order._id) {
                setOrders(prev =>
                  prev.map(order => order._id === data.order._id ? data.order : order)
                );
                toast.success(`Order ${data.order._id.substring(0, 6)} updated`);
              }
              break;
              
            case 'ORDER_DELETED':
              console.log("🗑️ Order deleted:", data.orderId);
              if (data.orderId) {
                setOrders(prev => prev.filter(order => order._id !== data.orderId));
                toast.success('Order removed');
              }
              break;
              
            case 'ERROR':
              console.error("⚠️ WebSocket error from server:", data.message);
              toast.error(data.message || 'Error from server');
              break;
              
            default:
              console.log("⚠️ Unknown message type:", data.type);
          }
        } catch (err) {
          console.error('❌ Error parsing WebSocket message:', err);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setIsWebSocketConnected(false);
        setError('Connection failed. Using REST API fallback.');
        
        // Set up polling as a fallback
        setupPolling();
      };

      ws.onclose = (event) => {
        console.log(`🔌 WebSocket closed with code ${event.code}, reason: ${event.reason || 'No reason provided'}`);
        setIsWebSocketConnected(false);
        
        // Set up polling as a fallback
        setupPolling();
        
        // Attempt to reconnect after a delay with exponential backoff
        const retryDelay = Math.min(3000 * Math.pow(1.5, retryCountRef.current), 30000);
        retryCountRef.current++;
        console.log(`🔄 Will attempt to reconnect in ${retryDelay}ms (attempt #${retryCountRef.current})`);
        
        reconnectTimeoutRef.current = window.setTimeout(() => {
          console.log(`🔄 Attempting to reconnect WebSocket (attempt #${retryCountRef.current})`);
          setupWebSocket();
        }, retryDelay);
      };

      return ws;
    } catch (error) {
      console.error('❌ Error setting up WebSocket:', error);
      setError('Failed to establish real-time connection');
      setIsWebSocketConnected(false);
      
      // Set up polling as a fallback
      setupPolling();
      
      return null;
    }
  }, [restaurantId, setupPolling]);

  // Listen for order notifications from the notification system
  useEffect(() => {
    const handleOrderNotification = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('📣 Received order notification:', customEvent.detail);
      
      // If we're not using WebSockets, refresh orders
      if (!isWebSocketConnected) {
        console.log('🔄 Refreshing orders due to notification');
        fetchOrdersViaAPI();
      }
      // If using WebSockets, the server should push updates automatically
    };
    
    window.addEventListener('order-notification', handleOrderNotification);
    
    return () => {
      window.removeEventListener('order-notification', handleOrderNotification);
    };
  }, [isWebSocketConnected, fetchOrdersViaAPI]);

  // Initial fetch and WebSocket setup
  useEffect(() => {
    if (!restaurantId) return;
    
    // Always fetch orders via REST API first for immediate display
    fetchOrdersViaAPI();
    
    // Then set up WebSocket for real-time updates
    
    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      
      if (socketRef.current) {
        if (socketRef.current.readyState === WebSocket.OPEN || 
            socketRef.current.readyState === WebSocket.CONNECTING) {
          socketRef.current.close();
        }
        socketRef.current = null;
      }
    };
  }, [restaurantId, setupWebSocket, fetchOrdersViaAPI]);


  const updateOrderStatus = useCallback(async (orderId: string, newStatus: Order['status']) => {
    try {
      // If WebSocket is connected, send update through it
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        console.log(`🔄 Updating order ${orderId} to ${newStatus} via WebSocket`);
        socketRef.current.send(JSON.stringify({
          type: 'UPDATE_ORDER_STATUS',
          orderId,
          status: newStatus,
          restaurantId
        }));
        
        // Update local state optimistically
        setOrders(prev => 
          prev.map(order => order._id === orderId 
            ? { ...order, status: newStatus } 
            : order
          )
        );
        
        toast.success(`Order status updated to ${newStatus}`);
        
        // Return an object with the same structure expected by the component
        return {
          status: 'success',
          data: {
            order: { 
              _id: orderId, 
              status: newStatus 
            } as Order
          }
        };
      } else {
        // Fallback to REST API
        console.log(`🔄 Updating order ${orderId} to ${newStatus} via API`);
        const response = await orderApi.updateOrderStatus(orderId, newStatus);
        
        // Update local state with just the order
        setOrders(prev => 
          prev.map(order => order._id === orderId 
            ? response.data.order
            : order
          )
        );
        
        toast.success(`Order status updated to ${newStatus}`);
        return response;
      }
    } catch (err) {
      console.error('❌ Failed to update order status:', err);
      toast.error('Failed to update order status');
      throw err;
    }
  }, [restaurantId]);

  // Manual refresh - tries WebSocket first, falls back to API
  const refreshOrders = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log("🔄 Refreshing orders via WebSocket");
      socketRef.current.send(JSON.stringify({
        type: 'REFRESH_ORDERS',
        restaurantId
      }));
      // State will be updated when server responds with a message
    } else {
      console.log("🔄 Refreshing orders via API (WebSocket not available)");
      fetchOrdersViaAPI();
    }
  }, [restaurantId, fetchOrdersViaAPI]);

  // Filter orders by status
  const getOrdersByStatus = useCallback((status: Order['status'] | 'all') => {
    if (status === 'all') return orders;
    return orders.filter(order => order.status === status);
  }, [orders]);

  // Calculate order statistics
  const getOrderStats = useCallback(() => {
    const stats = {
      all: orders.length,
      active: 0,
      preparing: 0,
      ready: 0,
      completed: 0,
      cancelled: 0,
      billing: 0
    };

    orders.forEach(order => {
      if (order.status && stats[order.status] !== undefined) {
        stats[order.status]++;
      }
    });

    return stats;
  }, [orders]);

  // Play sound for new or updated orders
  const playOrderSound = (type: 'new' | 'update') => {
    try {
      const audio = new Audio(
        type === 'new' 
          ? '/sounds/new-order.mp3' 
          : '/sounds/update-order.mp3'
      );
      audio.play().catch(err => {
        console.error('Failed to play sound:', err);
      });
    } catch (error) {
      console.error('Failed to play order sound:', error);
      // Non-critical error, so we'll just log it
    }
  };

  return {
    orders,
    loading,
    error,
    isRealTime: isWebSocketConnected,
    updateOrderStatus,
    getOrdersByStatus,
    getOrderStats,
    refreshOrders
  };
};