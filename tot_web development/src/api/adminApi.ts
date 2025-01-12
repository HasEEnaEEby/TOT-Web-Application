// src/api/adminApi.ts
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1/admin';

interface RestaurantRequest {
  id: string;
  username: string;
  email: string;
  restaurantName: string;
  location: string;
  contactNumber: string;
  quote: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

class AdminAPI {
  private static instance: AdminAPI;
  private token: string | null = null;

  private constructor() {
    this.token = localStorage.getItem('token');
  }

  static getInstance(): AdminAPI {
    if (!AdminAPI.instance) {
      AdminAPI.instance = new AdminAPI();
    }
    return AdminAPI.instance;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  }

  async getPendingRestaurants(): Promise<RestaurantRequest[]> {
    try {
      const response = await axios.get(`${BASE_URL}/restaurants/pending`, {
        headers: this.getHeaders()
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch restaurants');
    }
  }

  async approveRestaurant(id: string): Promise<void> {
    try {
      await axios.post(
        `${BASE_URL}/restaurants/${id}/approve`,
        {},
        { headers: this.getHeaders() }
      );
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to approve restaurant');
    }
  }

  async rejectRestaurant(id: string): Promise<void> {
    try {
      await axios.post(
        `${BASE_URL}/restaurants/${id}/reject`,
        {},
        { headers: this.getHeaders() }
      );
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reject restaurant');
    }
  }

  async bulkApprove(ids: string[]): Promise<void> {
    try {
      await axios.post(
        `${BASE_URL}/restaurants/bulk-approve`,
        { ids },
        { headers: this.getHeaders() }
      );
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to approve restaurants');
    }
  }

  async bulkReject(ids: string[]): Promise<void> {
    try {
      await axios.post(
        `${BASE_URL}/restaurants/bulk-reject`,
        { ids },
        { headers: this.getHeaders() }
      );
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reject restaurants');
    }
  }

  // Utility method to update token
  updateToken(token: string | null) {
    this.token = token;
  }
}

export const adminApi = AdminAPI.getInstance();
export default adminApi;