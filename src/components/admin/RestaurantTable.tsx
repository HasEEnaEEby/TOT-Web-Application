import clsx from 'clsx';
import { Check, ChevronDown, ChevronUp, Filter, MoreVertical, X } from 'lucide-react';
import React, { useState } from 'react';
import type { Restaurant } from '../../types/dashboard';

const statusColors = {
  active: 'bg-success/10 text-success',
  pending: 'bg-warning/10 text-warning',
  inactive: 'bg-danger/10 text-danger',
};

const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Gourmet Haven',
    status: 'active',
    revenue: 15420,
    orders: 142,
    rating: 4.8,
    lastPayment: '2024-02-15',
  },
  {
    id: '2',
    name: 'Spice Garden',
    status: 'pending',
    revenue: 0,
    orders: 0,
    rating: 0,
    lastPayment: '-',
  },
  {
    id: '3',
    name: 'Urban Bites',
    status: 'inactive',
    revenue: 8750,
    orders: 89,
    rating: 4.2,
    lastPayment: '2024-01-20',
  },
];

const validFields: (keyof Restaurant)[] = ['name', 'status', 'revenue', 'orders', 'rating', 'lastPayment'];

export default function RestaurantTable() {
  const [sortField, setSortField] = useState<keyof Restaurant>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleSort = (field: keyof Restaurant) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-bold">Restaurants</h2>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
            {['Name', 'Status', 'Revenue', 'Orders', 'Rating', 'Last Payment', 'Actions'].map((header) => {
            const field = header.toLowerCase().replace(' ', '') as keyof Restaurant;

            const isSortable = validFields.includes(field);

            return (
                <th
                key={header}
                onClick={() => {
                    if (isSortable) {
                    handleSort(field);
                    }
                }}
                className={clsx(
                    "px-6 py-3 text-left text-sm font-medium text-gray-500",
                    isSortable && "cursor-pointer hover:bg-gray-100"
                )}
                >
                <div className="flex items-center gap-2">
                    {header}
                    {isSortable && field === sortField && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                </div>
                </th>
            );
            })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedRestaurants.map((restaurant) => (
              <React.Fragment key={restaurant.id}>
                <tr 
                  className={clsx(
                    "hover:bg-gray-50 transition-colors cursor-pointer",
                    expandedRow === restaurant.id && "bg-gray-50"
                  )}
                  onClick={() => setExpandedRow(expandedRow === restaurant.id ? null : restaurant.id)}
                >
                  <td className="px-6 py-4">
                    <div className="font-medium">{restaurant.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx('px-3 py-1 rounded-full text-sm font-medium', statusColors[restaurant.status])}>
                      {restaurant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">${restaurant.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4">{restaurant.orders}</td>
                  <td className="px-6 py-4">{restaurant.rating || '-'}</td>
                  <td className="px-6 py-4">{restaurant.lastPayment}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {restaurant.status === 'pending' && (
                        <>
                          <button className="p-1 hover:bg-success/10 rounded-full text-success transition-colors">
                            <Check className="w-5 h-5" />
                          </button>
                          <button className="p-1 hover:bg-danger/10 rounded-full text-danger transition-colors">
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedRow === restaurant.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={7} className="px-6 py-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900">Contact Information</h4>
                          <p className="text-sm text-gray-600 mt-1">Email: contact@{restaurant.name.toLowerCase().replace(' ', '')}.com</p>
                          <p className="text-sm text-gray-600">Phone: (555) 123-4567</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Address</h4>
                          <p className="text-sm text-gray-600 mt-1">123 Restaurant St.</p>
                          <p className="text-sm text-gray-600">New York, NY 10001</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Subscription</h4>
                          <p className="text-sm text-gray-600 mt-1">Plan: Premium</p>
                          <p className="text-sm text-gray-600">Renewal: March 2024</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}