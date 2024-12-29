import React from 'react';
import { MoreVertical, Check, X } from 'lucide-react';

const restaurants = [
  {
    id: 1,
    name: "Bella Italia",
    status: "active",
    subscription: "Premium",
    revenue: "$2,400",
    lastPayment: "2024-03-10"
  },
  {
    id: 2,
    name: "Sushi Master",
    status: "pending",
    subscription: "Basic",
    revenue: "$1,800",
    lastPayment: "2024-03-08"
  },
  {
    id: 3,
    name: "Burger House",
    status: "inactive",
    subscription: "Premium",
    revenue: "$3,200",
    lastPayment: "2024-03-05"
  }
];

export function RestaurantTable() {
  return (
    <div className="bg-base rounded-lg shadow-sm border border-primary/10">
      <div className="p-6 border-b border-primary/10">
        <h2 className="text-lg font-semibold text-secondary-indigo">Recent Restaurants</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary/5">
              <th className="px-6 py-3 text-left text-xs font-medium text-base-dark uppercase tracking-wider">
                Restaurant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-dark uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-dark uppercase tracking-wider">
                Subscription
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-dark uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-dark uppercase tracking-wider">
                Last Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-dark uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/10">
            {restaurants.map((restaurant) => (
              <tr key={restaurant.id} className="hover:bg-primary/5">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-secondary-indigo">{restaurant.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${restaurant.status === 'active' ? 'bg-secondary/20 text-secondary' : 
                      restaurant.status === 'pending' ? 'bg-secondary-gold/20 text-secondary-gold' : 
                      'bg-primary-red/20 text-primary-red'}`}>
                    {restaurant.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-base-dark">
                  {restaurant.subscription}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-base-dark">
                  {restaurant.revenue}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-base-dark">
                  {restaurant.lastPayment}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-base-dark">
                  <div className="flex space-x-2">
                    <button className="p-1 hover:bg-secondary/20 rounded-full">
                      <Check className="w-4 h-4 text-secondary" />
                    </button>
                    <button className="p-1 hover:bg-primary-red/20 rounded-full">
                      <X className="w-4 h-4 text-primary-red" />
                    </button>
                    <button className="p-1 hover:bg-base-dark/10 rounded-full">
                      <MoreVertical className="w-4 h-4 text-base-dark" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}