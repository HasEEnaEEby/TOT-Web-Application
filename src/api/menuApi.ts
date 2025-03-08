import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import type {
  Category,
  CreateMenuItemData,
  MenuItem,
  MenuResponse
} from '../types/menuTypes';


class MenuAPI {
  private static readonly BASE_PATH = '/restaurants';
  private static readonly ENDPOINTS = {
    MENU: `${MenuAPI.BASE_PATH}/menu`,
    MENU_ITEM: (id: string) => `${MenuAPI.BASE_PATH}/menu/${id}`,
    TOGGLE_AVAILABILITY: (id: string) => `${MenuAPI.BASE_PATH}/menu/${id}/toggle-availability`,
    CATEGORY: (category: string) => `${MenuAPI.BASE_PATH}/menu/category/${category}`
  };

  private validateImage(image: File): boolean {
    if (!image) {
      toast.error('Image is required');
      return false;
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; 
    if (image.size > MAX_FILE_SIZE) {
      toast.error('Image must be smaller than 5MB');
      return false;
    }

    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    if (!ALLOWED_TYPES.includes(image.type)) {
      toast.error('Only JPEG, PNG, and WebP images are allowed');
      return false;
    }

    return true;
  }


  async getMenuItems(): Promise<MenuItem[]> {
    try {
      const response = await api.get<MenuResponse>(MenuAPI.ENDPOINTS.MENU);
      
      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'Failed to fetch menu items');
      }
      
      const menuItems = response.data.data?.menuItems ?? [];
      return menuItems;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }


  async createMenuItem(data: CreateMenuItemData): Promise<MenuItem> {
    try {
      // Validate image (compulsory)
      if (!data.image || !(data.image instanceof File)) {
        throw new Error('Image is required for creating a menu item');
      }

      // Additional image validation
      if (!this.validateImage(data.image)) {
        throw new Error('Invalid image');
      }

      // Validate required fields with more robust checks
      const validationErrors = [];

      if (!data.name || data.name.trim() === '') {
        validationErrors.push('Name is required');
      }

      if (!data.description || data.description.trim() === '') {
        validationErrors.push('Description is required');
      }

      if (data.price === undefined || data.price === null || isNaN(Number(data.price))) {
        validationErrors.push('Price must be a valid number');
      }

      if (!data.category) {
        validationErrors.push('Category is required');
      }

      // If there are validation errors, throw them
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const formData = new FormData();
      
      // Ensure all fields are added with proper conversion
      formData.append('name', data.name.trim());
      formData.append('description', data.description.trim());
      formData.append('price', Number(data.price).toString());
      formData.append('category', data.category);
      
      // Boolean fields
      formData.append('isVegetarian', data.isVegetarian ? 'true' : 'false');
      formData.append('isAvailable', data.isAvailable ? 'true' : 'false');

      // Optional fields
      if (data.spicyLevel) {
        formData.append('spicyLevel', data.spicyLevel);
      }

      if (data.preparationTime !== undefined) {
        formData.append('preparationTime', Number(data.preparationTime).toString());
      }

      // Handle compulsory image
      formData.append('image', data.image);

      // Handle allergens
      if (data.allergens && data.allergens.length > 0) {
        data.allergens.forEach(allergen => {
          formData.append('allergens[]', allergen);
        });
      }

      // Handle nutritional info
      if (data.nutritionalInfo) {
        formData.append('nutritionalInfo', JSON.stringify({
          calories: Number(data.nutritionalInfo.calories) || 0,
          protein: Number(data.nutritionalInfo.protein) || 0,
          carbohydrates: Number(data.nutritionalInfo.carbohydrates) || 0,
          fats: Number(data.nutritionalInfo.fats) || 0
        }));
      }

      // Log form data in development
      if (import.meta.env.DEV) {
        console.log('Creating menu item with data:', Object.fromEntries(formData.entries()));
      }

      const response = await api.post<MenuResponse>(
        MenuAPI.ENDPOINTS.MENU,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'Failed to create menu item');
      }

      // Safely handle potentially undefined menuItem
      const menuItem = response.data.data?.menuItem;
      if (!menuItem) {
        throw new Error('No menu item returned from the server');
      }

      toast.success('Menu item created successfully');
      return menuItem;
    } catch (error) {
      // Enhanced error logging
      console.error('Menu creation error:', error);
      
      const message = error instanceof Error 
        ? error.message 
        : 'Failed to create menu item';
      
      toast.error(message);
      throw error;
    }
  }

  async updateMenuItem(id: string, data: Partial<CreateMenuItemData>): Promise<MenuItem> {
    try {
      const formData = new FormData();
      
      // Validate image if provided
      if (data.image) {
        if (!(data.image instanceof File)) {
          throw new Error('Image must be a File object');
        }
        
        if (!this.validateImage(data.image)) {
          throw new Error('Invalid image');
        }
        
        formData.append('image', data.image);
      }

      // Add other fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && key !== 'image' && key !== 'nutritionalInfo' && key !== 'allergens') {
          formData.append(key, value.toString());
        }
      });

      if (data.allergens?.length) {
        data.allergens.forEach(allergen => {
          formData.append('allergens[]', allergen);
        });
      }

      if (data.nutritionalInfo) {
        formData.append('nutritionalInfo', JSON.stringify(data.nutritionalInfo));
      }

      const response = await api.put<MenuResponse>(
        MenuAPI.ENDPOINTS.MENU_ITEM(id),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'Failed to update menu item');
      }

      // Safely handle potentially undefined menuItem
      const menuItem = response.data.data?.menuItem;
      if (!menuItem) {
        throw new Error('No updated menu item returned from the server');
      }

      toast.success('Menu item updated successfully');
      return menuItem;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async deleteMenuItem(id: string): Promise<void> {
    try {
      const response = await api.delete<MenuResponse>(MenuAPI.ENDPOINTS.MENU_ITEM(id));
      
      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'Failed to delete menu item');
      }

      toast.success('Menu item deleted successfully');
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async toggleAvailability(id: string): Promise<MenuItem> {
    try {
      const response = await api.patch<MenuResponse>(MenuAPI.ENDPOINTS.TOGGLE_AVAILABILITY(id));
      
      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'Failed to toggle availability');
      }

      // Safely handle potentially undefined menuItem
      const menuItem = response.data.data?.menuItem;
      if (!menuItem) {
        throw new Error('No updated menu item returned from the server');
      }
      
      toast.success(`Item ${menuItem.isAvailable ? 'enabled' : 'disabled'}`);
      return menuItem;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getMenuItemsByCategory(category: Category): Promise<MenuItem[]> {
    try {
      const response = await api.get<MenuResponse>(MenuAPI.ENDPOINTS.CATEGORY(category));
      
      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'Failed to fetch menu items by category');
      }
      
      // Safely handle potentially undefined data
      const menuItems = response.data.data?.menuItems ?? [];
      return menuItems;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: unknown): void {
    let message = 'An unexpected error occurred';

    if (error instanceof AxiosError) {
      message = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'object' && error !== null && 'response' in error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      message = apiError.response?.data?.message || message;
    }

    toast.error(message);
  }
}

export const menuApi = new MenuAPI();
export default menuApi;