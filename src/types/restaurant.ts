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
}

export interface RestaurantFilters {
  status?: Restaurant['status'];
  search?: string;
}

export interface RestaurantResponse {
  status: 'success' | 'error';
  data: Restaurant[];
  message?: string;
}