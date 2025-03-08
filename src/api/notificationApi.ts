// api/notificationApi.ts
import type { Notification } from '../hooks/useNotifications';
import axios from './axiosConfig';

interface NotificationResponse {
  status: string;
  results?: number;
  data: {
    notifications: Notification[];
  };
}

interface NotificationQueryParams {
  limit?: number;
  page?: number;
  onlyUnread?: boolean;
}

export const notificationApi = {
  /**
   * Get user notifications
   * @param params - Query parameters for filtering notifications
   * @returns Promise with notification data
   */
  getNotifications: async (params: NotificationQueryParams = {}) => {
    const { 
      limit = 10, 
      page = 1, 
      onlyUnread = false 
    } = params;

    const response = await axios.get<NotificationResponse>('/notifications', {
      params: {
        limit,
        page,
        onlyUnread
      }
    });

    return response.data;
  },

  /**
   * Mark notifications as read
   * @param notificationIds - Optional array of notification IDs to mark as read
   * @returns Promise with update result
   */
  markNotificationsRead: async (notificationIds?: string[]) => {
    const response = await axios.patch('/notifications/read', { 
      notificationIds 
    });

    return response.data;
  },

  /**
   * Delete old notifications
   * @param options - Options for deleting notifications
   * @returns Promise with deletion result
   */
  deleteNotifications: async (options: { 
    olderThan?: number, 
    type?: string 
  } = {}) => {
    const { 
      olderThan = 30, 
      type 
    } = options;

    const response = await axios.delete('/notifications', {
      params: {
        olderThan,
        type
      }
    });

    return response.data;
  }
};

export default notificationApi;