import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import {
  Allergen,
  CreateMenuItemData,
  MenuItem,
  MenuResponse,
} from '../types/menuTypes';

export const useMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const safeAppend = (formData: FormData, key: string, value: unknown) => {
    if (value === undefined || value === null) return;

    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      // Handle arrays (like allergens)
      value.forEach((item) => {
        formData.append(`${key}[]`, String(item));
      });
    } else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else {
      // Handle primitive values
      formData.append(key, String(value));
    }
  };

  const fetchMenuItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<MenuResponse>('/restaurants/menu');
      
      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'Failed to fetch menu items');
      }

      setMenuItems(response.data.data?.menuItems || []);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch menu items';
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createMenuItem = useCallback(async (data: CreateMenuItemData) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Required fields
      const requiredFields: (keyof CreateMenuItemData)[] = [
        'name', 'description', 'price', 'category'
      ];

      requiredFields.forEach(field => {
        const value = data[field];
        if (value === undefined || value === null) {
          throw new Error(`${field} is required`);
        }
        safeAppend(formData, field, value);
      });

      // Optional fields
      const optionalFields: (keyof CreateMenuItemData)[] = [
        'isVegetarian', 
        'isAvailable', 
        'spicyLevel', 
        'preparationTime'
      ];

      optionalFields.forEach(field => {
        const value = data[field];
        if (value !== undefined) {
          safeAppend(formData, field, value);
        }
      });

      // Handle allergens
      if (data.allergens?.length > 0) {
        data.allergens.forEach(allergen => {
          formData.append('allergens[]', allergen);
        });
      }

      // Handle nutritional info
      if (data.nutritionalInfo) {
        safeAppend(formData, 'nutritionalInfo', data.nutritionalInfo);
      }

      // Handle image
      if (data.image instanceof File) {
        safeAppend(formData, 'image', data.image);
      }

      const response = await api.postForm<MenuResponse>('/restaurants/menu', formData);

      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'Failed to create menu item');
      }

      const newMenuItem = response.data.data?.menuItem;
      if (newMenuItem) {
        setMenuItems(prev => [...prev, newMenuItem]);
        toast.success('Menu item created successfully');
      }

      return newMenuItem;
    } catch (error) {
      console.error('Create Menu Item Error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create menu item';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMenuItem = useCallback(async (id: string, data: Partial<CreateMenuItemData>) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Handle all fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'allergens' && Array.isArray(value)) {
          value.forEach((allergen: Allergen) => {
            formData.append('allergens[]', allergen);
          });
        } else if (key === 'nutritionalInfo' && value) {
          safeAppend(formData, key, value);
        } else if (key === 'image' && value instanceof File) {
          safeAppend(formData, key, value);
        } else if (value !== undefined && value !== null) {
          safeAppend(formData, key, value);
        }
      });

      const response = await api.putForm<MenuResponse>(`/restaurants/menu/${id}`, formData);

      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'Failed to update menu item');
      }

      const updatedMenuItem = response.data.data?.menuItem;
      if (updatedMenuItem) {
        setMenuItems(prev => 
          prev.map(item => item._id === id ? updatedMenuItem : item)
        );
        toast.success('Menu item updated successfully');
      }

      return updatedMenuItem;
    } catch (error) {
      console.error('Update Menu Item Error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to update menu item';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMenuItem = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await api.delete(`/restaurants/menu/${id}`);
      setMenuItems(prev => prev.filter(item => item._id !== id));
      toast.success('Menu item deleted successfully');
    } catch (error) {
      toast.error('Failed to delete menu item');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleAvailability = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await api.patch<MenuResponse>(`/restaurants/menu/${id}/toggle-availability`);
      const updatedMenuItem = response.data.data?.menuItem;
      
      if (updatedMenuItem) {
        setMenuItems(prev => 
          prev.map(item => item._id === id ? updatedMenuItem : item)
        );
        toast.success(`Item ${updatedMenuItem.isAvailable ? 'enabled' : 'disabled'}`);
      }
    } catch (error) {
      toast.error('Failed to toggle availability');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  return {
    menuItems,
    loading,
    error,
    fetchMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability
  };
};