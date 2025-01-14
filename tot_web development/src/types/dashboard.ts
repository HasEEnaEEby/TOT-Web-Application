export interface Restaurant {
    id: string;
    name: string;
    status: 'active' | 'pending' | 'inactive';
    revenue: number;
    orders: number;
    rating: number;
    lastPayment: string;
  }
  
  export interface DashboardStats {
    totalRevenue: number;
    activeRestaurants: number;
    pendingApprovals: number;
    totalOrders: number;
  }
  
  export interface ChartData {
    name: string;
    value: number;
  }