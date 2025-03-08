import orderApi, { Order } from '@/api/orderApi';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      console.log("🔵 Fetching orders from API...");
      
      const fetchedOrders = await orderApi.getRestaurantOrders();
  
      console.log("✅ Orders fetched:", fetchedOrders); // Debug output
  
      if (!Array.isArray(fetchedOrders) || fetchedOrders.length === 0) {
        console.warn("⚠️ No orders found!");
      }
  
      setOrders(fetchedOrders);
      setLoading(false);
    } catch (err) {
      console.error('❌ Error fetching restaurant orders:', err);
      setError('Failed to fetch orders');
      setLoading(false);
      toast.error('Unable to load orders');
    }
  }, []);
  
 

  // Update order status
  const updateOrderStatus = useCallback(async (orderId: string, newStatus: Order['status']) => {
    try {
      const updatedOrder = await orderApi.updateOrderStatus(orderId, newStatus);
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? updatedOrder 
            : order
        )
      );
      
      toast.success(`Order status updated to ${newStatus}`);
      return updatedOrder;
    } catch (err) {
      console.error('Failed to update order status', err);
      toast.error('Failed to update order status');
      throw err;
    }
  }, []);

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
      cancelled: 0
    };

    orders.forEach(order => {
      switch (order.status) {
        case 'active':
          stats.active++;
          break;
        case 'preparing':
          stats.preparing++;
          break;
        case 'ready':
          stats.ready++;
          break;
        case 'completed':
          stats.completed++;
          break;
        case 'cancelled':
          stats.cancelled++;
          break;
      }
    });

    return stats;
  }, [orders]);

  // Refresh orders manually
  const refreshOrders = useCallback(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Initial fetch on hook mount
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    updateOrderStatus,
    getOrdersByStatus,
    getOrderStats,
    refreshOrders
  };
};