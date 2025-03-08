import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import api from "../services/api";
import {
  QRCodeResponse,
  QRValidationRequest,
  QRValidationResponse,
  TableCreateRequest,
  TableData,
  TableStatus,
  TableUpdateRequest
} from "../types/tableTypes";

class TableAPI {
  private static readonly BASE_PATH = "/restaurants";
  private static readonly ENDPOINTS = {
    TABLES: `${TableAPI.BASE_PATH}/tables`,
    TABLE: (id: string) => `${TableAPI.BASE_PATH}/tables/${id}`,
    TABLE_STATUS: (id: string) => `${TableAPI.BASE_PATH}/tables/${id}/status`,
    TABLE_QR: (id: string) => `${TableAPI.BASE_PATH}/tables/${id}/qrcode`,
    REFRESH_QR: (id: string) => `${TableAPI.BASE_PATH}/tables/${id}/refresh-qrcode`,
    VALIDATE_QR: `${TableAPI.BASE_PATH}/tables/validate-qr`,
  };

  // Validate table existence
  private async validateTableExists(id: string): Promise<boolean> {
    try {
      const tables = await this.getAllTables();
      return tables.some(table => (table._id === id || table.id === id));
    } catch (error) {
      console.error("Error validating table:", error);
      return false;
    }
  }

  // Validate table data before sending to server
  private validateTableData(data: TableCreateRequest): void {
    const validationErrors: string[] = [];

    if (!data.number || data.number < 1) {
      validationErrors.push('Table number must be positive');
    }

    if (!data.capacity || data.capacity < 1) {
      validationErrors.push('Capacity must be positive');
    }

    if (!data.position || typeof data.position.x !== 'number' || typeof data.position.y !== 'number') {
      validationErrors.push('Position coordinates are required');
    }

    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }
  }

  async getAllTables(): Promise<TableData[]> {
    try {
      // Get user data from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const restaurantId = user._id;
  
      const response = await api.get<{ status: string; data: { tables: TableData[] } }>(
        TableAPI.ENDPOINTS.TABLES,
        {
          params: { restaurantId }  // Add restaurantId as query parameter
        }
      );
  
      // Check if response has the expected structure
      if (!response.data?.data?.tables) {
        throw new Error("Invalid response format");
      }
  
      // Return the tables array
      return response.data.data.tables;
    } catch (error) {
      console.error('Error in getAllTables:', error);
      // Add more detailed error logging
      if (error instanceof AxiosError) {
        console.error('API Error Details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      throw error;
    }
  }

  async createTable(data: TableCreateRequest): Promise<TableData> {
    try {
      // Validate data before sending request
      this.validateTableData(data);

      const response = await api.post<{ status: string; data: { table: TableData } }>(
        TableAPI.ENDPOINTS.TABLES,
        data
      );

      if (!response.data?.data?.table) {
        throw new Error("Invalid response format");
      }
      return response.data.data.table;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || 'Failed to create table';
        toast.error(message);
      }
      throw error;
    }
  }

  async updateTable(id: string, data: TableUpdateRequest): Promise<TableData> {
    try {
      // Validate table exists
      const exists = await this.validateTableExists(id);
      if (!exists) {
        throw new Error('Table not found');
      }

      // Validate update data
      if (Object.keys(data).length === 0) {
        throw new Error('No update data provided');
      }

      const response = await api.put<{ status: string; data: { table: TableData } }>(
        TableAPI.ENDPOINTS.TABLE(id),
        data
      );

      if (!response.data?.data?.table) {
        throw new Error("Invalid response format");
      }
      return response.data.data.table;
    } catch (error) {
      if (error instanceof AxiosError) {
        switch (error.response?.status) {
          case 403:
            toast.error('You do not have permission to update this table');
            break;
          case 404:
            toast.error('Table not found');
            break;
          default:
            toast.error(error.response?.data?.message || 'Failed to update table');
        }
      }
      throw error;
    }
  }

  async deleteTable(id: string): Promise<void> {
    try {
      // Validate table exists
      const exists = await this.validateTableExists(id);
      if (!exists) {
        throw new Error('Table not found');
      }

      await api.delete(TableAPI.ENDPOINTS.TABLE(id));
    } catch (error) {
      if (error instanceof AxiosError) {
        switch (error.response?.status) {
          case 403:
            toast.error('You do not have permission to delete this table');
            break;
          case 404:
            toast.error('Table not found');
            break;
          default:
            toast.error(error.response?.data?.message || 'Failed to delete table');
        }
      }
      throw error;
    }
  }

  async updateTableStatus(id: string, status: TableStatus): Promise<TableData> {
    try {
      // Validate table exists
      const exists = await this.validateTableExists(id);
      if (!exists) {
        throw new Error('Table not found');
      }

      // Validate status
      if (!['available', 'occupied', 'reserved', 'unavailable'].includes(status)) {
        throw new Error('Invalid table status');
      }

      const response = await api.patch<{ status: string; data: { table: TableData } }>(
        TableAPI.ENDPOINTS.TABLE_STATUS(id),
        { status }
      );

      if (!response.data?.data?.table) {
        throw new Error("Invalid response format");
      }

      toast.success(`Table status updated to ${status}`);
      return response.data.data.table;
    } catch (error) {
      if (error instanceof AxiosError) {
        switch (error.response?.status) {
          case 403:
            toast.error('You do not have permission to update this table');
            break;
          case 404:
            toast.error('Table not found');
            break;
          default:
            toast.error(error.response?.data?.message || 'Failed to update table status');
        }
      }
      throw error;
    }
  }

  // Generate QR code for a table
  async generateQRCode(tableId: string, format: 'png' | 'dataurl' | 'json' = 'dataurl'): Promise<QRCodeResponse> {
    try {
      // Validate table exists
      const exists = await this.validateTableExists(tableId);
      if (!exists) {
        throw new Error('Table not found');
      }

      const response = await api.get<{ status: string; data: QRCodeResponse }>(
        TableAPI.ENDPOINTS.TABLE_QR(tableId),
        {
          params: { format },
          responseType: format === 'png' ? 'blob' : 'json'
        }
      );

      if (!response.data) {
        throw new Error("Invalid response format");
      }

      // If PNG format was requested, create an object URL
      if (format === 'png' && response.data instanceof Blob) {
        const url = URL.createObjectURL(response.data);
        return {
          tableId,
          tableNumber: 0, // This will be set properly in the UI
          restaurantId: '',
          dataURL: url
        };
      }

      return response.data.data;
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
      throw error;
    }
  }

  // Refresh QR code for a table
  async refreshQRCode(tableId: string): Promise<QRCodeResponse> {
    try {
      // Validate table exists
      const exists = await this.validateTableExists(tableId);
      if (!exists) {
        throw new Error('Table not found');
      }

      const response = await api.post<{ status: string; data: QRCodeResponse }>(
        TableAPI.ENDPOINTS.REFRESH_QR(tableId)
      );

      if (!response.data?.data) {
        throw new Error("Invalid response format");
      }

      toast.success('QR code refreshed successfully');
      return response.data.data;
    } catch (error) {
      console.error('Error refreshing QR code:', error);
      toast.error('Failed to refresh QR code');
      throw error;
    }
  }

  // Validate a QR code (typically used by the customer app)
  async validateQRCode(qrData: QRValidationRequest['qrData']): Promise<QRValidationResponse> {
    try {
      const response = await api.post<{ status: string; data: QRValidationResponse }>(
        TableAPI.ENDPOINTS.VALIDATE_QR,
        { qrData }
      );

      if (!response.data?.data) {
        throw new Error("Invalid response format");
      }

      return response.data.data;
    } catch (error) {
      console.error('Error validating QR code:', error);
      toast.error('Failed to validate QR code');
      throw error;
    }
  }
}

export const tableApi = new TableAPI();
export default tableApi;