export interface MonthlyData {
    month: string;
    subscriptionIncome: number;
    premiumPackageIncome: number;
    totalIncome: number;
  }
  
  export interface IncomeStats {
    totalRevenue: number;
    monthlyGrowth: number;
    projectedIncome: number;
    activeSubscriptions: number;
    premiumPackages: number;
  }
  
  export interface Transaction {
    id: string;
    date: string;
    restaurant: string;
    type: 'subscription' | 'premium_package';
    amount: number;
    status: 'completed' | 'pending' | 'failed';
    packageType?: string;
  }
  
  export interface IncomeData {
    monthlyData: MonthlyData[];
    stats: IncomeStats;
    transactions: Transaction[];
  }
  
  export interface IncomeResponse {
    status: 'success' | 'error';
    message: string;
    data: IncomeData;
  }