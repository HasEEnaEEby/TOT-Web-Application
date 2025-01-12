import { Edit, ExternalLink, Trash2 } from 'lucide-react';
import DataTable, { Column } from './DataTable';

interface Restaurant {
  id: string;
  name: string;
  location: string;
  subscriptionPlan: string;
  status: string;
  ordersPerWeek: number;
  rating: number;
}

export default function Restaurants() {
  const mockRestaurants: Restaurant[] = [
    {
      id: '1',
      name: 'Italian Bistro',
      location: 'New York, NY',
      subscriptionPlan: 'premium',
      status: 'active',
      ordersPerWeek: 145,
      rating: 4.5,
    },
    // Add more mock data
  ];

  const columns: Column<Restaurant>[] = [
    { key: 'name', label: 'Name' },
    { key: 'location', label: 'Location' },
    { key: 'subscriptionPlan', label: 'Plan' },
    { key: 'status', label: 'Status' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Restaurant) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row.id)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleViewDetails(row.id)}
            className="p-1 text-gray-600 hover:bg-gray-50 rounded"
          >
            <ExternalLink className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = (id: string) => {
    // Implement edit logic
    console.log('Editing restaurant:', id);
  };

  const handleDelete = (id: string) => {
    // Implement delete logic
    console.log('Deleting restaurant:', id);
  };

  const handleViewDetails = (id: string) => {
    // Implement view details logic
    console.log('Viewing details:', id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Restaurants</h1>
        <div className="flex gap-3">
          <select className="px-3 py-2 border rounded-lg">
            <option value="">All Plans</option>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
          </select>
          <select className="px-3 py-2 border rounded-lg">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <DataTable
          columns={columns}
          data={mockRestaurants}
        />
      </div>
    </div>
  );
}
