// src/components/admin/RestaurantRequests.tsx
import { Check, ChevronDown, ChevronUp, Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import DataTable, { Column } from './DataTable';

interface RestaurantRequest {
  id: string;
  restaurantName: string;
  username: string;
  email: string;
  location: string;
  contactNumber: string;
  quote: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function RestaurantRequests() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [restaurants, setRestaurants] = useState<RestaurantRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/v1/admin/restaurants/pending');
      const data = await response.json();

      if (data.status === 'success') {
        setRestaurants(data.data.map((restaurant: any) => ({
          id: restaurant._id,
          restaurantName: restaurant.restaurantName,
          username: restaurant.username,
          email: restaurant.email,
          location: restaurant.location,
          contactNumber: restaurant.contactNumber,
          quote: restaurant.quote,
          status: restaurant.status,
          createdAt: restaurant.createdAt
        })));
      }
    } catch (error) {
      toast.error('Failed to fetch restaurant requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/admin/restaurants/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('Restaurant approved successfully');
        fetchRestaurants();
      } else {
        throw new Error('Failed to approve restaurant');
      }
    } catch (error) {
      toast.error('Failed to approve restaurant');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/admin/restaurants/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('Restaurant rejected successfully');
        fetchRestaurants();
      } else {
        throw new Error('Failed to reject restaurant');
      }
    } catch (error) {
      toast.error('Failed to reject restaurant');
    }
  };

  const toggleExpandRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleBulkApprove = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/v1/admin/restaurants/bulk-approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ids: selectedRequests })
      });

      if (response.ok) {
        toast.success('Selected restaurants approved successfully');
        setSelectedRequests([]);
        fetchRestaurants();
      }
    } catch (error) {
      toast.error('Failed to approve selected restaurants');
    }
  };

  const handleBulkReject = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/v1/admin/restaurants/bulk-reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ids: selectedRequests })
      });

      if (response.ok) {
        toast.success('Selected restaurants rejected successfully');
        setSelectedRequests([]);
        fetchRestaurants();
      }
    } catch (error) {
      toast.error('Failed to reject selected restaurants');
    }
  };

  const columns: Column<RestaurantRequest>[] = [
    { key: 'restaurantName', label: 'Restaurant Name' },
    { key: 'username', label: 'Owner Name' },
    { key: 'location', label: 'Location' },
    { 
      key: 'createdAt', 
      label: 'Requested Date',
      render: (value) => new Date(value as string).toLocaleDateString()
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-sm ${
          value === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          value === 'approved' ? 'bg-green-100 text-green-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleApprove(row.id);
            }}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
            disabled={row.status !== 'pending'}
          >
            <Check className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReject(row.id);
            }}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            disabled={row.status !== 'pending'}
          >
            <X className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpandRow(row.id);
            }}
            className="p-1 text-gray-600 hover:bg-gray-50 rounded"
          >
            {expandedRow === row.id ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      ),
    },
  ];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !selectedLocation || restaurant.location.includes(selectedLocation);
    return matchesSearch && matchesLocation;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Restaurant Requests</h1>
        <div className="flex gap-3">
          <button
            onClick={handleBulkApprove}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={selectedRequests.length === 0}
          >
            Approve Selected ({selectedRequests.length})
          </button>
          <button
            onClick={handleBulkReject}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={selectedRequests.length === 0}
          >
            Reject Selected ({selectedRequests.length})
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border rounded-lg w-64"
            />
            <select 
              className="px-3 py-2 border rounded-lg"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              {[...new Set(restaurants.map(r => r.location))].map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>

        <DataTable<RestaurantRequest>
          columns={columns}
          data={filteredRestaurants}
          onRowClick={(row) => toggleExpandRow(row.id)}
        />
      </div>

      {expandedRow && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Restaurant Details</h3>
          {expandedRow && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Contact Number</p>
                <p className="font-medium">{restaurants.find(r => r.id === expandedRow)?.contactNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{restaurants.find(r => r.id === expandedRow)?.email}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Quote</p>
                <p className="font-medium">{restaurants.find(r => r.id === expandedRow)?.quote}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}