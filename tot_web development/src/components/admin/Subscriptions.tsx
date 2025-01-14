import { AlertCircle, RefreshCw } from 'lucide-react';
import DataTable, { Column } from './DataTable';
import MetricCard from './MetricCard';

interface Subscription {
  id: string;
  restaurantName: string;
  planType: string;
  startDate: string;
  expiryDate: string;
  paymentStatus: string;
}

export default function Subscriptions() {
  const mockSubscriptions: Subscription[] = [
    {
      id: '1',
      restaurantName: 'Italian Bistro',
      planType: 'premium',
      startDate: '2024-01-15',
      expiryDate: '2025-01-15',
      paymentStatus: 'paid',
    },
    // Add more mock data
  ];

  const columns: Column<Subscription>[] = [
    { key: 'restaurantName', label: 'Restaurant' },
    { key: 'planType', label: 'Plan' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'expiryDate', label: 'Expiry Date' },
    { key: 'paymentStatus', label: 'Payment Status' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Subscription) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleRenew(row.id)}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  const handleRenew = (id: string) => {
    // Implement renewal logic
    console.log('Renewing subscription:', id);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Subscriptions</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Active Subscriptions"
          value="134"
          icon={RefreshCw}
          trend={{ value: 5, isPositive: true }}
        />
        <MetricCard
          title="Expiring Soon"
          value="8"
          icon={AlertCircle}
        />
        <MetricCard
          title="Monthly Revenue"
          value="$15,600"
          icon={RefreshCw}
          trend={{ value: 12, isPositive: true }}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-4">
            <select className="px-3 py-2 border rounded-lg">
              <option value="">All Plans</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
            </select>
            <select className="px-3 py-2 border rounded-lg">
              <option value="">All Payment Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
        
        <DataTable
          columns={columns}
          data={mockSubscriptions}
        />
      </div>
    </div>
  );
}
