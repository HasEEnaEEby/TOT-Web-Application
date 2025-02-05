import api from '../services/api';
import type { Restaurant, RestaurantFilters, RestaurantResponse } from '../types/restaurant';

class RestaurantAPI {
  private static readonly ENDPOINTS = {
    BASE: '/api/v1/admin/restaurants'
  };

  async getRestaurants(filters?: RestaurantFilters): Promise<Restaurant[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    try {
      const response = await api.get<RestaurantResponse>(
        `${RestaurantAPI.ENDPOINTS.BASE}?${params.toString()}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
      throw error;
    }
  }

  async updateStatus(id: string, status: Restaurant['status']): Promise<void> {
    try {
      await api.patch(`${RestaurantAPI.ENDPOINTS.BASE}/${id}/status`, { status });
    } catch (error) {
      console.error('Failed to update restaurant status:', error);
      throw error;
    }
  }

  async deleteRestaurant(id: string): Promise<void> {
    try {
      await api.delete(`${RestaurantAPI.ENDPOINTS.BASE}/${id}`);
    } catch (error) {
      console.error('Failed to delete restaurant:', error);
      throw error;
    }
  }
}

export const restaurantApi = new RestaurantAPI();