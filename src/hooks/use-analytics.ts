import { useEffect, useState } from 'react';
import { AnalyticsData, MenuItem, Order, restaurantApi } from '../api/analyticsApi';

const initialAnalyticsData: AnalyticsData = {
  totalRevenue: 0,
  totalOrders: 0,
  totalCustomers: 0,
  avgOrderValue: 0,
  revenueGrowth: 0,
  ordersGrowth: 0,
  customersGrowth: 0,
  avgOrderGrowth: 0,
  popularItems: [],
  recentActivity: [],
  monthlyRevenue: []
};

interface UseAnalyticsReturn {
  analyticsData: AnalyticsData;
  loading: boolean;
  error: string | null;
  refreshData: () => void;
}

export const useAnalytics = (restaurantId: string, period: 'day' | 'week' | 'month' | 'year' = 'month'): UseAnalyticsReturn => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(initialAnalyticsData);
  


const fetchData = async () => {
  if (!restaurantId) {
    setError('Restaurant ID is required');
    setLoading(false);
    return;
  }
  
  try {
    setLoading(true);
    setError(null);
    
    console.group('Analytics Data Fetching');
    console.log('Restaurant ID:', restaurantId);
    console.log('Current Period:', period);
    
    // Fallback: Calculate analytics on the client side by fetching orders and menu items
    const [ordersResponse, menuResponse] = await Promise.all([
      restaurantApi.getOrders(restaurantId),
      restaurantApi.getMenuItems(restaurantId)
    ]);
    
    console.log('Orders Response:', ordersResponse);
    console.log('Menu Response:', menuResponse);
    
    const orders: Order[] = ordersResponse.data || [];
    const menuItems: MenuItem[] = menuResponse.data || [];
    
    console.log('Total Orders:', orders.length);
    console.log('Total Menu Items:', menuItems.length);
    
    // Process analytics data
    const analytics = processAnalyticsData(orders, menuItems);
    
    console.log('Processed Analytics:', analytics);
    console.groupEnd();
    
    setAnalyticsData(analytics);
  } catch (err) {
    console.error("Error fetching analytics data:", err);
    setError("Failed to load analytics data. Please try again later.");
  } finally {
    setLoading(false);
  }
};

  
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId, period]);
  
  const refreshData = () => {
    fetchData();
  };
  
  const processAnalyticsData = (orders: Order[], menuItems: MenuItem[]): AnalyticsData => {
    // Current date and time
    const now = new Date();
    
    // Filter orders based on period
    let startDate: Date;
    
    switch (period) {
      case 'day':
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - now.getDay());
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'month':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    
    // Current period orders
    const currentPeriodOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= now;
    });
    
    // Calculate previous period dates
    let prevPeriodStartDate: Date;
    let prevPeriodEndDate: Date;
    
    switch (period) {
      case 'day':
        prevPeriodStartDate = new Date(startDate);
        prevPeriodStartDate.setDate(prevPeriodStartDate.getDate() - 1);
        prevPeriodEndDate = new Date(startDate);
        prevPeriodEndDate.setMilliseconds(-1);
        break;
      case 'week':
        prevPeriodStartDate = new Date(startDate);
        prevPeriodStartDate.setDate(prevPeriodStartDate.getDate() - 7);
        prevPeriodEndDate = new Date(startDate);
        prevPeriodEndDate.setMilliseconds(-1);
        break;
      case 'year':
        prevPeriodStartDate = new Date(startDate);
        prevPeriodStartDate.setFullYear(prevPeriodStartDate.getFullYear() - 1);
        prevPeriodEndDate = new Date(startDate);
        prevPeriodEndDate.setMilliseconds(-1);
        break;
      case 'month':
      default:
        prevPeriodStartDate = new Date(startDate);
        prevPeriodStartDate.setMonth(prevPeriodStartDate.getMonth() - 1);
        prevPeriodEndDate = new Date(startDate);
        prevPeriodEndDate.setMilliseconds(-1);
    }
    
    // Previous period orders
    const prevPeriodOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= prevPeriodStartDate && orderDate <= prevPeriodEndDate;
    });
    
    // Calculate total revenue
    const totalRevenue = currentPeriodOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const prevTotalRevenue = prevPeriodOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Calculate revenue growth
    const revenueGrowth = prevTotalRevenue ? 
      Math.round(((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100) : 0;
    
    // Calculate total orders
    const totalOrders = currentPeriodOrders.length;
    const prevTotalOrders = prevPeriodOrders.length;
    
    // Calculate orders growth
    const ordersGrowth = prevTotalOrders ? 
      Math.round(((totalOrders - prevTotalOrders) / prevTotalOrders) * 100) : 0;
    
    // Get unique customers
    const customerIds = currentPeriodOrders.map(order => order.customer);
    const prevCustomerIds = prevPeriodOrders.map(order => order.customer);
    const totalCustomers = new Set(customerIds).size;
    const prevTotalCustomers = new Set(prevCustomerIds).size;
    
    // Calculate customers growth
    const customersGrowth = prevTotalCustomers ? 
      Math.round(((totalCustomers - prevTotalCustomers) / prevTotalCustomers) * 100) : 0;
    
    // Calculate average order value
    const avgOrderValue = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;
    const prevAvgOrderValue = prevTotalOrders ? Math.round(prevTotalRevenue / prevTotalOrders) : 0;
    
    // Calculate avg order growth
    const avgOrderGrowth = prevAvgOrderValue ? 
      Math.round(((avgOrderValue - prevAvgOrderValue) / prevAvgOrderValue) * 100) : 0;
    
    // Find popular items with consolidated counts
    const itemCounts: Record<string, {count: number; revenue: number}> = {};
    
    currentPeriodOrders.forEach(order => {
      order.items.forEach((item) => {
        // Safely extract menu item ID
        const menuItemId = item.menuItem;
        
        // Skip if no menu item ID
        if (!menuItemId) return;
        
        // Find corresponding menu item to get price
        const menuItem = menuItems.find(mi => mi._id === menuItemId);
        
        // Initialize the counter if needed
        if (!itemCounts[menuItemId]) {
          itemCounts[menuItemId] = { count: 0, revenue: 0 };
        }
        
        // Increment the count
        const quantity = item.quantity || 1;
        itemCounts[menuItemId].count += quantity;
        
        // Add revenue from this item
        itemCounts[menuItemId].revenue += (menuItem ? menuItem.price : 0) * quantity;
      });
    });
    
    // Convert to array and sort by count
    const popularItems = Object.entries(itemCounts)
      .map(([menuItemId, data]) => {
        const menuItem = menuItems.find(item => item._id === menuItemId);
        return {
          name: menuItem ? menuItem.name : 'Unknown Item',
          count: data.count,
          revenue: data.revenue
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
    
    // Generate recent activity
    const recentActivity = orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
      .map(order => {
        const orderTime = new Date(order.createdAt);
        const timeDiff = Math.floor((now.getTime() - orderTime.getTime()) / 1000 / 60); // in minutes
        
        let timeString;
        if (timeDiff < 60) {
          timeString = `${timeDiff} minute${timeDiff !== 1 ? 's' : ''} ago`;
        } else if (timeDiff < 24 * 60) {
          const hours = Math.floor(timeDiff / 60);
          timeString = `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        } else {
          const days = Math.floor(timeDiff / (24 * 60));
          timeString = `${days} day${days !== 1 ? 's' : ''} ago`;
        }
        
        return {
          action: `New order #${order._id.slice(-6)} received - ₹${order.totalAmount}`,
          time: timeString
        };
      });
    
    // Generate monthly revenue data for the chart
    const monthlyRevenue: Array<{name: string; revenue: number}> = [];
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    for (let i = 5; i >= 0; i--) {
      const month = (currentMonth - i + 12) % 12;
      const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
      
      const monthStartDate = new Date(year, month, 1);
      const monthEndDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
      
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= monthStartDate && orderDate <= monthEndDate;
      });
      
      const monthRevenue = monthOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      monthlyRevenue.push({
        name: `${monthNames[month]}`,
        revenue: monthRevenue
      });
    }
    
    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      avgOrderValue,
      revenueGrowth,
      ordersGrowth,
      customersGrowth,
      avgOrderGrowth,
      popularItems,
      recentActivity,
      monthlyRevenue
    };
  };
  
  return {
    analyticsData,
    loading,
    error,
    refreshData
  };
};