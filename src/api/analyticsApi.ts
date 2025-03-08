// src/api/analyticsApi.ts
import api from './axiosConfig';

// Types
export interface AnalyticsResponse {
  status: string;
  data: AnalyticsData;
}

export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  avgOrderValue: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  avgOrderGrowth: number;
  popularItems: Array<{name: string; count: number; revenue: number}>;
  recentActivity: Array<{action: string; time: string}>;
  monthlyRevenue: Array<{name: string; revenue: number}>;
}

export interface OrderItem {
  item?: string | { _id: string; price?: number };
  _id?: string;
  quantity?: number;
  menuItem: string;
}

export interface Order {
  _id: string;
  customer: string;
  restaurant: string;
  table: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  isAvailable: boolean;
  restaurant: string;
  image?: string;
}

// Restaurant analytics endpoints
export const restaurantApi = {
  // Get restaurant analytics from dedicated endpoint
  getAnalytics: async (restaurantId: string, period: string = 'month') => {
    try {
      const response = await api.get<AnalyticsResponse>(
        `/analytics/restaurants/${restaurantId}/analytics?period=${period}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurant analytics:', error);
      throw error;
    }
  },

  // Get restaurant orders - using the new endpoint we added
  getOrders: async (restaurantId: string) => {
    try {
      console.log(`Fetching orders for restaurant: ${restaurantId}`);
      const response = await api.get<{status: string; data: Order[]}>(`/orders/restaurant/${restaurantId}`);
      console.log('Order response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurant orders:', error);
      return { status: 'error', data: [] };
    }
  },

  getMenuItems: async (restaurantId: string) => {
    try {
      console.log(`Fetching menu items for restaurant: ${restaurantId}`);
      
      // Use the restaurants/menuitems/:restaurantId endpoint that we just added
      const response = await api.get<{status: string; data: MenuItem[]}>(`/restaurants/menuitems/${restaurantId}`);
      
      console.log('Menu items response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurant menu items:', error);
      // Return empty array instead of throwing to allow the component to render
      return { status: 'error', data: [] };
    }
  },
  
  // Get dashboard summary
  getDashboardSummary: async (restaurantId: string) => {
    try {
      const response = await api.get(`/analytics/restaurants/${restaurantId}/dashboard`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  }
};

export default restaurantApi;