import { DollarSign, ShoppingBag, TrendingUp, Users } from "lucide-react";

export default function Analytics() {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">$12,345</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500">+12%</span>
            <span className="ml-2 text-gray-500">from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">1,234</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500">+8%</span>
            <span className="ml-2 text-gray-500">from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Customers</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">856</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500">+15%</span>
            <span className="ml-2 text-gray-500">from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. Order Value</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">$42</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500">+6%</span>
            <span className="ml-2 text-gray-500">from last month</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">
            Revenue Overview
          </h3>
          <div className="mt-4 h-64 flex items-center justify-center border border-gray-200 rounded-lg">
            <p className="text-gray-500">
              Revenue chart will be implemented here
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Popular Items</h3>
          <div className="mt-4 space-y-4">
            {["Coq au Vin", "Ratatouille", "French Onion Soup"].map(
              (item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg mr-4"></div>
                    <div>
                      <p className="font-medium text-gray-900">{item}</p>
                      <p className="text-sm text-gray-500">
                        142 orders this month
                      </p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900">
                    ${(28.99 - index * 2).toFixed(2)}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <div className="mt-4 space-y-4">
          {[
            { action: "New order received", time: "2 minutes ago" },
            { action: "Table 7 completed payment", time: "15 minutes ago" },
            { action: "New customer registration", time: "1 hour ago" },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <p className="text-gray-600">{activity.action}</p>
              <p className="text-sm text-gray-500">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
