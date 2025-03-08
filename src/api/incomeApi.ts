import api from '../services/api';
import type { IncomeData, IncomeResponse } from '../types/income';

class IncomeAPI {
  private static readonly ENDPOINTS = {
    BASE: 'admin/income', 
  };

  async getIncomeData(): Promise<IncomeData> {
    try {
      const response = await api.get<IncomeResponse>(IncomeAPI.ENDPOINTS.BASE);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch income data:', error);
      throw error;
    }
  }

  async generateReport(): Promise<Blob> {
    try {
      const response = await api.post(
        `${IncomeAPI.ENDPOINTS.BASE}/report`,
        {},
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to generate report:', error);
      throw error;
    }
  }
}

export const incomeApi = new IncomeAPI();
export default incomeApi;