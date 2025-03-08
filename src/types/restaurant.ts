// src/types/restaurant.ts

// Existing Restaurant interface
export interface Restaurant {
  _id: string;
  restaurantName: string;
  email: string;
  location: string;
  contactNumber: string;
  quote: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  revenue: number;
  orders: number;
  rating: number;
  lastPayment: string;
  cuisine: string;
  image: string;
  tags: string[];
  subscriptionStatus?: 'active' | 'inactive' | 'expired';
  subscriptionPro?: boolean;
  subscriptionAmount?: number;
  subscriptionEndDate?: string;

}

// New interfaces for profile management
export interface RestaurantData {
  _id: string;
  restaurantName: string;
  location: string;
  contactNumber: string;
  quote: string;
  email: string;
  image?: string;
  hours?: string;
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branch: string;
  };
}

export interface RestaurantFormData {
  restaurantName: string;
  location: string;
  contactNumber: string;
  quote: string;
  hours: string;
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branch: string;
  };
}

export interface RestaurantStatsData {
  todayOrders: number;
  activeTables: number;
  totalTables: number;
  todayRevenue: number;
}

// Existing filter interface
export interface RestaurantFilters {
  status?: Restaurant['status'];
  search?: string;
  cuisine?: string;
  rating?: number;
  subscriptionStatus?: Restaurant['subscriptionStatus'];
  tags?: string[];
}

// API response interfaces
export interface RestaurantResponse {
  status: 'success' | 'error';
  data: Restaurant[];
  message?: string;
  totalCount?: number;
  page?: number;
  limit?: number;
}

export interface RestaurantProfileResponse {
  status: 'success' | 'error';
  data: {
    restaurant: RestaurantData;
  };
  message?: string;
}

export interface RestaurantStatsResponse {
  status: 'success' | 'error';
  data: RestaurantStatsData & {
    revenue?: {
      today: number;
      weekly: number;
      monthly: number;
    }
  };
  message?: string;
}

export interface RestaurantImageResponse {
  status: 'success' | 'error';
  data: {
    imageUrl: string;
    publicId: string;
    type: string;
  };
  message?: string;
}

// Dialog and UI state interfaces
export interface DialogState {
  open: boolean;
  restaurant: Restaurant | null;
}

export interface SubscriptionDialogProps {
  restaurant: Restaurant;
  onClose: () => void;
  onSubscribe: () => void;
}

export interface SubscriptionRequest {
  restaurantId: string;
  amount: number;
  duration: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'active' | 'expired';
}

export interface SubscriptionResponse {
  status: 'success' | 'error';
  data: {
    subscriptionId: string;
    restaurant: Restaurant;
    amount: number;
    duration: string;
    startDate: string;
    endDate: string;
    status: 'pending' | 'active' | 'expired';
    createdAt: string;
    updatedAt: string;
  };
  message?: string;
}

export interface RestaurantStats {
  totalRevenue: number;
  totalOrders: number;
  averageRating: number;
  activeSubscriptions: number;
  pendingApprovals: number;
}

export interface RestaurantError {
  status: 'error';
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface RestaurantSortOptions {
  field: keyof Restaurant;
  direction: 'asc' | 'desc';
}