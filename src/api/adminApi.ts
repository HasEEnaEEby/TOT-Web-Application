import axios, { AxiosError } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

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

interface ErrorResponse {
  message?: string;
}

class AdminAPI {
  private static instance: AdminAPI;
  private token: string | null;

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
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  private handleAxiosError(error: unknown, defaultMessage: string): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || defaultMessage;
      console.error(`Error: ${errorMessage}`, error);
      throw new Error(errorMessage);
    }
    console.error(defaultMessage, error);
    throw new Error(defaultMessage);
  }

  async getPendingRestaurants(): Promise<RestaurantRequest[]> {
    try {
      const response = await axios.get(`${BASE_URL}/admin/restaurants/pending`, {
        headers: this.getHeaders()
      });
      return response.data.data;
    } catch (error) {
      return this.handleAxiosError(error, 'Failed to fetch restaurants');
    }
  }

  async approveRestaurant(id: string): Promise<void> {
    try {
      await axios.post(
        `${BASE_URL}/admin/restaurants/${id}/approve`,
        {},
        { headers: this.getHeaders() }
      );
    } catch (error) {
      this.handleAxiosError(error, 'Failed to approve restaurant');
    }
  }

  async rejectRestaurant(id: string): Promise<void> {
    try {
      await axios.post(
        `${BASE_URL}/admin/restaurants/${id}/reject`,
        {},
        { headers: this.getHeaders() }
      );
    } catch (error) {
      this.handleAxiosError(error, 'Failed to reject restaurant');
    }
  }

  async bulkApprove(ids: string[]): Promise<void> {
    try {
      await axios.post(
        `${BASE_URL}/admin/restaurants/bulk-approve`,
        { ids },
        { headers: this.getHeaders() }
      );
    } catch (error) {
      this.handleAxiosError(error, 'Failed to approve restaurants');
    }
  }

  async bulkReject(ids: string[]): Promise<void> {
    try {
      await axios.post(
        `${BASE_URL}/admin/restaurants/bulk-reject`,
        { ids },
        { headers: this.getHeaders() }
      );
    } catch (error) {
      this.handleAxiosError(error, 'Failed to reject restaurants');
    }
  }

  updateToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }
}

export const adminApi = AdminAPI.getInstance();
export default adminApi;