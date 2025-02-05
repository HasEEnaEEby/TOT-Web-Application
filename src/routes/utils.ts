import { RestaurantDetails } from "../types/auth";
import { UserRole } from "./types";

export const getRedirectPath = (
  role: UserRole, 
  restaurantStatus?: RestaurantDetails['status']
): string => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'customer':
      return '/customer-dashboard';
    case 'restaurant':
      // Check restaurant status for restaurants
      if (restaurantStatus === 'pending') {
        return '/login';
      }
      return '/restaurant/dashboard';
    default:
      return '/';
  }
};