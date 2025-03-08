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

  // Function to fetch orders using REST API as fallback
  const fetchOrdersViaAPI = useCallback(async () => {
    try {
      setLoading(true);
      console.log("🔄 Fallback: Fetching orders via REST API");
      const fetchedOrders = await orderApi.getRestaurantOrders();
      
      console.log(`✅ API: Received ${fetchedOrders.length} orders`);
      setOrders(fetchedOrders);
      setError(null);
    } catch (err) {
      console.error('❌ API Error:', err);
      setError('Failed to load orders. Please try again.');
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  // WebSocket connection setup
  const setupWebSocket = useCallback(() => {
    if (!restaurantId) return;
    
    try {
      // Clear any existing reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      // Close existing connection if any
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }

      console.log("🔌 Establishing WebSocket connection...");
      const ws = new WebSocket(`${WS_BASE_URL}/orders?restaurantId=${restaurantId}`);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log("✅ WebSocket connected");
        setIsWebSocketConnected(true);
        setError(null);
        
        // Request initial orders from the WebSocket server
        // but don't set loading state since we already have orders from the API
        socketRef.current.send(JSON.stringify({
          type: 'REFRESH_ORDERS',
          restaurantId
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("📩 WebSocket message:", data.type);
          
          switch (data.type) {
            case 'INITIAL_ORDERS':
              console.log(`📋 Received ${data.orders.length} initial orders from WebSocket`);
              // Only replace our orders if we actually get orders back
              if (Array.isArray(data.orders) && data.orders.length > 0) {
                setOrders(data.orders);
              }
              setLoading(false);
              break;
              
            case 'ORDER_CREATED':
              console.log("🆕 New order received:", data.order._id);
              setOrders(prev => [...prev, data.order]);
              toast.success('New order received!');
              // Play sound notification if needed
              break;
              
            case 'ORDER_UPDATED':
              console.log("🔄 Order updated:", data.order._id);
              setOrders(prev =>
                prev.map(order => order._id === data.order._id ? data.order : order)
              );
              toast.success(`Order ${data.order._id.substring(0, 6)} updated`);
              break;
              
            case 'ORDER_DELETED':
              console.log("🗑️ Order deleted:", data.orderId);
              setOrders(prev => prev.filter(order => order._id !== data.orderId));
              toast.success('Order removed');
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
        
        // Fallback to REST API when WebSocket fails
        fetchOrdersViaAPI();
      };

      ws.onclose = (event) => {
        console.log(`🔌 WebSocket closed with code ${event.code}`);
        setIsWebSocketConnected(false);
        
        // Attempt to reconnect after a delay (with exponential backoff if needed)
        reconnectTimeoutRef.current = window.setTimeout(() => {
          console.log("🔄 Attempting to reconnect WebSocket...");
          setupWebSocket();
        }, 3000);
      };

      return ws;
    } catch (error) {
      console.error('❌ Error setting up WebSocket:', error);
      setError('Failed to establish real-time connection');
      setIsWebSocketConnected(false);
      
      // Fallback to REST API
      fetchOrdersViaAPI();
      return null;
    }
  }, [restaurantId, fetchOrdersViaAPI]);

  // Initial fetch on hook mount using REST API
  useEffect(() => {
    if (!restaurantId) return;
    
    // Always fetch orders via REST API first for immediate display
    fetchOrdersViaAPI();
    
    // Then set up WebSocket for real-time updates
    const ws = setupWebSocket();
    
    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [restaurantId, setupWebSocket, fetchOrdersViaAPI]);

  // Update order status - tries WebSocket first, falls back to API
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
        
        // Return success, actual state update will happen via WebSocket message
        return true;
      } else {
        // Fallback to REST API
        console.log(`🔄 Updating order ${orderId} to ${newStatus} via API`);
        const updatedOrder = await orderApi.updateOrderStatus(orderId, newStatus);
        
        // Update local state since WebSocket won't do it
        setOrders(prev => 
          prev.map(order => order._id === orderId ? updatedOrder : order)
        );
        
        toast.success(`Order status updated to ${newStatus}`);
        return true;
      }
    } catch (err) {
      console.error('❌ Failed to update order status:', err);
      toast.error('Failed to update order status');
      return false;
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
      if (stats[order.status] !== undefined) {
        stats[order.status]++;
      }
    });

    return stats;
  }, [orders]);

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