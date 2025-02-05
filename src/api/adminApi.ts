// import api from '../services/api';

// // Types and Interfaces
// export interface RestaurantRequest {
//   _id: string; // MongoDB ObjectId as string
//   email: string;
//   restaurantName: string;
//   username: string;
//   location: string;
//   contactNumber: string;
//   quote: string;
//   status: 'pending' | 'approved' | 'rejected';
//   createdAt: string;
//   adminCode?: string;
//   isEmailVerified?: boolean;
// }

// export interface BulkActionResponse {
//   successful: string[];
//   failed: Array<{
//     id: string;
//     reason: string;
//   }>;
// }

// interface ApiResponse<T> {
//   code: string | undefined;
//   status: string;
//   message?: string;
//   data: T;
// }

// export interface AdminStats {
//   totalRestaurants: number;
//   pendingRequests: number;
//   approvedRestaurants: number;
//   rejectedRestaurants: number;
// }

// export class ApiError extends Error {
//   constructor(
//     message: string,
//     public statusCode?: number,
//     public code?: string
//   ) {
//     super(message);
//     this.name = 'ApiError';
//   }
// }

// class AdminAPI {
//   private static instance: AdminAPI;
//   private static readonly BASE_URL = '/admin/restaurants';
//   private static readonly REQUEST_TIMEOUT = 30000; // 30 seconds

//   private constructor() {}

//   static getInstance(): AdminAPI {
//     if (!AdminAPI.instance) {
//       AdminAPI.instance = new AdminAPI();
//     }
//     return AdminAPI.instance;
//   }

//   // Extract ID from various formats (ObjectId, string, object)
//   private extractId = (id: any): string => {
//     if (typeof id === 'string') {
//       // Extract ID from ObjectId format if present
//       const match = id.match(/ObjectId\('([0-9a-fA-F]{24})'\)/);
//       return match ? match[1] : id;
//     }
//     if (id && typeof id === 'object' && id.toString) {
//       return id.toString();
//     }
//     return id;
//   };

//   // Validate MongoDB ObjectId
//   private validateId(id: string | undefined): string {
//     if (!id) {
//       throw new ApiError('Restaurant ID is required', 400, 'MISSING_ID');
//     }

//     const cleanId = this.extractId(id);
//     if (!cleanId || typeof cleanId !== 'string') {
//       throw new ApiError('Invalid restaurant ID', 400, 'INVALID_ID');
//     }

//     const trimmedId = cleanId.trim();
//     if (trimmedId === '') {
//       throw new ApiError('Restaurant ID cannot be empty', 400, 'EMPTY_ID');
//     }

//     // Validate MongoDB ObjectId format (24 character hex string)
//     if (!/^[0-9a-fA-F]{24}$/.test(trimmedId)) {
//       throw new ApiError('Invalid MongoDB ObjectId format', 400, 'INVALID_ID_FORMAT');
//     }

//     return trimmedId;
//   }

//   // Validate multiple IDs
//   private validateIds(ids: string[]): string[] {
//     if (!Array.isArray(ids)) {
//       throw new ApiError('IDs must be provided as an array', 400, 'INVALID_IDS_FORMAT');
//     }

//     if (ids.length === 0) {
//       throw new ApiError('At least one ID must be provided', 400, 'EMPTY_IDS');
//     }

//     return ids.map(id => this.validateId(id));
//   }

//   // Generic request method with error handling
//   private async makeRequest<T>(
//     method: string,
//     endpoint: string,
//     data?: any,
//     timeout: number = AdminAPI.REQUEST_TIMEOUT
//   ): Promise<T> {
//     try {
//       const response = await api.request<ApiResponse<T>>({
//         method,
//         url: `${AdminAPI.BASE_URL}${endpoint}`,
//         data,
//         timeout,
//         validateStatus: (status) => status < 500
//       });

//       if (response.status >= 400) {
//         throw new ApiError(
//           response.data?.message || 'Request failed',
//           response.status,
//           response.data?.code
//         );
//       }

//       if (!response.data || response.data.status !== 'success') {
//         throw new ApiError('Invalid response format from server', 500);
//       }

//       return response.data.data;
//     } catch (error: any) {
//       if (error instanceof ApiError) {
//         throw error;
//       }

//       if (error.response) {
//         throw new ApiError(
//           error.response.data?.message || 'Request failed',
//           error.response.status,
//           error.response.data?.code
//         );
//       }

//       if (error.code === 'ECONNABORTED') {
//         throw new ApiError('Request timed out', 408, 'REQUEST_TIMEOUT');
//       }

//       throw new ApiError('Network error', 503, 'NETWORK_ERROR');
//     }
//   }

//   // Get all pending restaurant requests
//   async getPendingRestaurants(): Promise<RestaurantRequest[]> {
//     const data = await this.makeRequest<RestaurantRequest[]>('GET', '/pending');
//     return data.map(restaurant => ({
//       ...restaurant,
//       _id: this.extractId(restaurant._id)
//     }));
//   }

//   // Get restaurant details by ID
//   async getRestaurantDetails(id: string): Promise<RestaurantRequest> {
//     const validId = this.validateId(id);
//     const data = await this.makeRequest<RestaurantRequest>('GET', `/${validId}`);
//     return {
//       ...data,
//       _id: this.extractId(data._id)
//     };
//   }

//   // Approve a single restaurant
//   async approveRestaurant(id: string): Promise<void> {
//     const validId = this.validateId(id);
//     await this.makeRequest('POST', `/${validId}/approve`);
//   }

//   // Reject a single restaurant
//   async rejectRestaurant(id: string, reason?: string): Promise<void> {
//     const validId = this.validateId(id);
//     await this.makeRequest('POST', `/${validId}/reject`, { reason });
//   }

//   // Bulk approve restaurants
//   async bulkApprove(ids: string[]): Promise<BulkActionResponse> {
//     const validIds = this.validateIds(ids);
//     return this.makeRequest<BulkActionResponse>('POST', '/bulk-approve', { ids: validIds });
//   }

//   // Bulk reject restaurants
//   async bulkReject(ids: string[], reason?: string): Promise<BulkActionResponse> {
//     const validIds = this.validateIds(ids);
//     return this.makeRequest<BulkActionResponse>('POST', '/bulk-reject', { ids: validIds, reason });
//   }

//   // Verify if a restaurant exists
//   async verifyRestaurantExists(id: string): Promise<boolean> {
//     try {
//       const validId = this.validateId(id);
//       await this.makeRequest('GET', `/${validId}/verify`);
//       return true;
//     } catch (error) {
//       if (error instanceof ApiError && error.statusCode === 404) {
//         return false;
//       }
//       throw error;
//     }
//   }

//   // Reset restaurant's admin code
//   async resetAdminCode(id: string): Promise<{ adminCode: string }> {
//     const validId = this.validateId(id);
//     return this.makeRequest<{ adminCode: string }>('POST', `/${validId}/reset-admin-code`);
//   }

//   // Get admin dashboard statistics
//   async getAdminStats(): Promise<AdminStats> {
//     return this.makeRequest<AdminStats>('GET', '/stats');
//   }

//   // Get restaurants by status
//   async getRestaurantsByStatus(status: RestaurantRequest['status']): Promise<RestaurantRequest[]> {
//     const data = await this.makeRequest<RestaurantRequest[]>('GET', `/status/${status}`);
//     return data.map(restaurant => ({
//       ...restaurant,
//       _id: this.extractId(restaurant._id)
//     }));
//   }

//   // Get all restaurants (with optional pagination)
//   async getAllRestaurants(page: number = 1, limit: number = 10): Promise<{
//     restaurants: RestaurantRequest[];
//     total: number;
//     pages: number;
//   }> {
//     const data = await this.makeRequest<{
//       restaurants: RestaurantRequest[];
//       total: number;
//       pages: number;
//     }>('GET', `?page=${page}&limit=${limit}`);

//     return {
//       ...data,
//       restaurants: data.restaurants.map(restaurant => ({
//         ...restaurant,
//         _id: this.extractId(restaurant._id)
//       }))
//     };
//   }

//   // Search restaurants
//   async searchRestaurants(query: string): Promise<RestaurantRequest[]> {
//     if (!query.trim()) {
//       throw new ApiError('Search query cannot be empty', 400, 'EMPTY_SEARCH');
//     }
//     const data = await this.makeRequest<RestaurantRequest[]>('GET', `/search?q=${encodeURIComponent(query.trim())}`);
//     return data.map(restaurant => ({
//       ...restaurant,
//       _id: this.extractId(restaurant._id)
//     }));
//   }

//   // Update restaurant details
//   async updateRestaurantDetails(
//     id: string,
//     updates: Partial<Omit<RestaurantRequest, '_id' | 'status' | 'createdAt'>>
//   ): Promise<RestaurantRequest> {
//     const validId = this.validateId(id);
//     const data = await this.makeRequest<RestaurantRequest>('PATCH', `/${validId}`, updates);
//     return {
//       ...data,
//       _id: this.extractId(data._id)
//     };
//   }
// }

// export const adminApi = AdminAPI.getInstance();
// export default adminApi;


// src/api/adminApi.ts
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

  // Utility method to update token
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