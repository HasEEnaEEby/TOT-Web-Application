// src/hooks/useRestaurantManagement.ts
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { restaurantApi } from '../api/restaurantApi';
import type { Restaurant, RestaurantFilters } from '../types/restaurant';

interface UseRestaurantManagementReturn {
  restaurants: Restaurant[];
  loading: boolean;
  error: Error | null;
  fetchRestaurants: (filters?: RestaurantFilters) => Promise<void>;
  deleteRestaurant: (id: string) => Promise<void>;
  updateRestaurantStatus: (id: string, status: Restaurant['status']) => Promise<void>;
  subscribeRestaurant: (id: string, amount: number) => Promise<void>;
}

export const useRestaurantManagement = (): UseRestaurantManagementReturn => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRestaurants = useCallback(async (filters?: RestaurantFilters) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedRestaurants = await restaurantApi.getRestaurants(filters);
      setRestaurants(fetchedRestaurants);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch restaurants'));
      toast.error('Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRestaurant = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await restaurantApi.deleteRestaurant(id);
      setRestaurants(prev => prev.filter(restaurant => restaurant._id !== id));
      toast.success('Restaurant deleted successfully');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete restaurant'));
      toast.error('Failed to delete restaurant');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRestaurantStatus = useCallback(async (id: string, status: Restaurant['status']) => {
    setLoading(true);
    setError(null);
    try {
      await restaurantApi.updateStatus(id, status);
      setRestaurants(prev => prev.map(restaurant => 
        restaurant._id === id ? { ...restaurant, status } : restaurant
      ));
      toast.success('Restaurant status updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update restaurant status'));
      toast.error('Failed to update restaurant status');
    } finally {
      setLoading(false);
    }
  }, []);

  const subscribeRestaurant = useCallback(async (id: string, amount: number) => {
    setLoading(true);
    setError(null);
    try {
      const updatedRestaurant = await restaurantApi.subscribeRestaurant(id, amount);
      setRestaurants(prev => prev.map(restaurant => 
        restaurant._id === id ? updatedRestaurant : restaurant
      ));
      toast.success('Subscription updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update subscription'));
      toast.error('Failed to update subscription');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    restaurants,
    loading,
    error,
    fetchRestaurants,
    deleteRestaurant,
    updateRestaurantStatus,
    subscribeRestaurant
  };
};