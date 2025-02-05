import clsx from "clsx";
import { ChevronDown, ChevronUp, Filter, MoreVertical } from "lucide-react";
import React, { useState } from "react";
import type { Restaurant } from "../../types/dashboard";

const statusColors = {
  active: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  inactive: "bg-danger/10 text-danger",
};

const headerToKey: Record<string, keyof Restaurant | "actions"> = {
  Name: "name",
  Status: "status",
  Revenue: "revenue",
  Orders: "orders",
  Rating: "rating",
  "Last Payment": "lastPayment",
  Actions: "actions",
};

const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Gourmet Haven",
    status: "active",
    revenue: 15420,
    orders: 142,
    rating: 4.8,
    lastPayment: "2024-02-15",
  },
  {
    id: "2",
    name: "Spice Garden",
    status: "pending",
    revenue: 0,
    orders: 0,
    rating: 0,
    lastPayment: "-",
  },
  {
    id: "3",
    name: "Urban Bites",
    status: "inactive",
    revenue: 8750,
    orders: 89,
    rating: 4.2,
    lastPayment: "2024-01-20",
  },
];

export default function RestaurantManagement() {
  const [sortField, setSortField] = useState<keyof Restaurant>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof Restaurant) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary-900">
          Restaurant Management
        </h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Add New Restaurant
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold">Active Restaurants</h2>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {[
                  "Name",
                  "Status",
                  "Revenue",
                  "Orders",
                  "Rating",
                  "Last Payment",
                ].map((header) => (
                  <th
                    key={header}
                    onClick={() => {
                      const field = headerToKey[header];
                      if (field !== "actions") handleSort(field);
                    }}
                    className={clsx(
                      "px-6 py-3 text-left text-sm font-medium text-gray-500",
                      header.toLowerCase().replace(" ", "") !== "actions" &&
                        "cursor-pointer hover:bg-gray-100"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {header}
                      {header.toLowerCase().replace(" ", "") === sortField &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        ))}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedRestaurants.map((restaurant) => (
                <React.Fragment key={restaurant.id}>
                  <tr className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="font-medium">{restaurant.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={clsx(
                          "px-3 py-1 rounded-full text-sm font-medium",
                          statusColors[restaurant.status]
                        )}
                      >
                        {restaurant.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      ${restaurant.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">{restaurant.orders}</td>
                    <td className="px-6 py-4">{restaurant.rating || "-"}</td>
                    <td className="px-6 py-4">{restaurant.lastPayment}</td>
                    <td className="px-6 py-4">
                      <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
