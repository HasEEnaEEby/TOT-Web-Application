import { toast } from 'react-hot-toast';
import axios from './axiosConfig';

// Interfaces for Order-related types
export interface MenuItem {
  menuItem?: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  data: any;
  _id: string;
  customer: string;
  restaurant: string;
  table: string;
  items: MenuItem[];
  totalAmount: number;
  status: 'active' | 'preparing' | 'ready' | 'completed' | 'cancelled' | 'billing';
  specialInstructions?: string;
  createdAt: string;
}

export interface OrderResponse {
  status: 'success' | 'error';
  data: {
    orders?: Order[];
    order?: Order;
  };
  message?: string;
}

export interface BillItem {
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Bill {
  _id: string;
  billNumber: string;
  order: string;
  restaurant: {
    _id: string;
    name: string;
    address: string;
    bankQRCode?: string;
  };
  table: {
    _id: string;
    tableNumber: string;
  };
  items: BillItem[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  totalAmount: number;
  paymentMethod?: 'cash' | 'card' | 'online';
  paymentStatus?: 'pending' | 'paid' | 'failed';
  qrCodeUrl?: string;
  notes?: string;
  createdAt: string;
}

interface BillResponse {
  status: 'success' | 'error';
  data: { bill: Bill };
  message?: string;
}

class OrderAPI {
  /**
   * Fetch restaurant's active orders.
   */
  async getRestaurantOrders(): Promise<Order[]> {
    try {
      const response = await axios.get<OrderResponse>('/orders/restaurant');

      if (response.data.status === 'success' && response.data.data.orders) {
        return response.data.data.orders;
      }

      throw new Error(response.data.message || 'No active orders found');
    } catch (error) {
      console.error('❌ Error fetching restaurant orders:', error);
      toast.error('Failed to load restaurant orders');
      return [];
    }
  }

  /**
   * Fetch bill details for a given order.
   */
  async getBillForOrder(orderId: string): Promise<Bill | null> {
    try {
      const response = await axios.get<BillResponse>(`/orders/${orderId}/bill`);

      if (response.data.status === 'success') {
        return response.data.data.bill;
      }

      throw new Error(response.data.message || 'Bill not found');
    } catch (error) {
      console.error('❌ Error fetching bill:', error);
      toast.error('Failed to load bill');
      return null;
    }
  }

  /**
   * Generate bill for an order.
   */
  async generateBillForOrder(orderId: string): Promise<Bill> {
    try {
      const response = await axios.post<BillResponse>(`/orders/${orderId}/generate-bill`);

      if (response.data.status === 'success') {
        toast.success('Bill generated successfully');
        return response.data.data.bill;
      }

      throw new Error(response.data.message || 'Failed to generate bill');
    } catch (error) {
      console.error('❌ Error generating bill:', error);
      toast.error('Failed to generate bill');
      throw error;
    }
  }

  /**
   * Download bill PDF.
   */
  async downloadBill(billId: string): Promise<void> {
    try {
      const response = await axios.get(`/bills/${billId}/download`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bill-${billId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Bill downloaded successfully');
    } catch (error) {
      console.error('❌ Error downloading bill:', error);
      toast.error('Failed to download bill');
    }
  }

  /**
   * Upload QR code for a bill.
   */
  async uploadBillQrCode(billId: string, file: File): Promise<Bill> {
    try {
      const formData = new FormData();
      formData.append('qrCode', file);

      const response = await axios.post<BillResponse>(
        `/orders/bills/${billId}/upload-qr`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      if (response.data.status === 'success') {
        toast.success('QR code uploaded successfully');
        return response.data.data.bill;
      }

      throw new Error(response.data.message || 'Failed to upload QR code');
    } catch (error) {
      console.error('❌ Error uploading QR code:', error);
      toast.error('Failed to upload QR code');
      throw error;
    }
  }

  /**
   * Update the status of an order.
   */
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    try {
      const response = await axios.patch<OrderResponse>(
        `/orders/${orderId}/status`,
        { status }
      );

      if (response.data.status === 'success' && response.data.data.order) {
        toast.success('Order status updated successfully');
        return response.data.data.order;
      }

      throw new Error(response.data.message || 'Failed to update order status');
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      toast.error('Failed to update order status');
      throw error;
    }
  }

  /**
   * Request a bill for an order.
   */
  async requestBill(orderId: string): Promise<{ order: Order; billAmount: number }> {
    try {
      const response = await axios.patch<{
        message: string; status: string; data: { order: Order; billAmount: number } 
}>(
        `/orders/${orderId}/request-bill`
      );

      if (response.data.status === 'success') {
        toast.success('Bill requested successfully');
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to request bill');
    } catch (error) {
      console.error('❌ Error requesting bill:', error);
      toast.error('Failed to request bill');
      throw error;
    }
  }

  /**
   * Fetch a customer's order history.
   */
  async getOrderHistory(): Promise<Order[]> {
    try {
      const response = await axios.get<OrderResponse>('/orders/history');

      if (response.data.status === 'success' && response.data.data.orders) {
        return response.data.data.orders;
      }

      throw new Error(response.data.message || 'No order history found');
    } catch (error) {
      console.error('❌ Error fetching order history:', error);
      toast.error('Failed to load order history');
      return [];
    }
  }
}

export const orderApi = new OrderAPI();
export default orderApi;
