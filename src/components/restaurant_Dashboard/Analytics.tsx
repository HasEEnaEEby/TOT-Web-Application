import {
  DollarSign,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAnalytics } from "../../hooks/use-analytics";
import { useAuth } from "../../hooks/use-auth";

export default function Analytics() {
  // Get the current restaurant ID from auth context
  const auth = useAuth();
  console.log("Auth context:", auth); // Log the entire auth object to see its structure

  // Try to extract restaurant ID from auth context
  // If not available, use a temporary hardcoded ID for testing
  // Replace RESTAURANT_ID_HERE with an actual restaurant ID from your database
  const [restaurantId, setRestaurantId] = useState("");

  useEffect(() => {
    // Try to get from auth context first
    let id = "";
    if (
      auth &&
      auth.authState &&
      auth.authState.user &&
      auth.authState.user.restaurant
    ) {
      id = auth.authState.user.restaurant;
    }

    // If we don't have a restaurant ID yet, check localStorage
    if (!id) {
      id = localStorage.getItem("restaurantId") || "";
    }

    // If we still don't have an ID, use a hardcoded one for testing
    // IMPORTANT: Replace this with a real restaurant ID from your database for testing
    if (!id) {
      id = "67a3e252575b84b823bb08bd"; // Replace with a real restaurant ID
    }

    console.log("Using restaurant ID:", id);
    setRestaurantId(id);
  }, [auth]);

  // Time period filter for analytics
  const [period, setPeriod] = useState<"day" | "week" | "month" | "year">(
    "month"
  );

  // Use our custom hook to fetch and process analytics data
  const { analyticsData, loading, error, refreshData } = useAnalytics(
    restaurantId,
    period
  );

  // Handle period change
  const handlePeriodChange = (newPeriod: "day" | "week" | "month" | "year") => {
    setPeriod(newPeriod);
  };

  // Handle refresh button click
  const handleRefresh = () => {
    refreshData();
  };

  // Debug message if restaurant ID is still missing
  if (!restaurantId) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-yellow-800">
          Authentication Issue
        </h3>
        <p className="mt-2 text-yellow-700">
          Unable to get restaurant ID from your user profile. Please make sure
          you're logged in with a restaurant account.
        </p>
        <div className="mt-4 p-4 bg-gray-100 rounded text-sm font-mono overflow-auto">
          <pre>Auth context: {JSON.stringify(auth, null, 2)}</pre>
        </div>
      </div>
    );
  }

  // Display loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-red-800">
          Error Loading Analytics
        </h3>
        <p className="mt-2 text-red-700">{error}</p>
        <button
          onClick={handleRefresh}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Debug info */}
      <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700">
        Using restaurant ID: {restaurantId}
      </div>

      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Analytics Dashboard
        </h2>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                ₹{analyticsData.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp
              className={`w-4 h-4 ${
                analyticsData.revenueGrowth >= 0
                  ? "text-green-500"
                  : "text-red-500"
              } mr-1`}
            />
            <span
              className={
                analyticsData.revenueGrowth >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {analyticsData.revenueGrowth >= 0 ? "+" : ""}
              {analyticsData.revenueGrowth}%
            </span>
            <span className="ml-2 text-gray-500">from last {period}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {analyticsData.totalOrders}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp
              className={`w-4 h-4 ${
                analyticsData.ordersGrowth >= 0
                  ? "text-green-500"
                  : "text-red-500"
              } mr-1`}
            />
            <span
              className={
                analyticsData.ordersGrowth >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {analyticsData.ordersGrowth >= 0 ? "+" : ""}
              {analyticsData.ordersGrowth}%
            </span>
            <span className="ml-2 text-gray-500">from last {period}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Customers</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {analyticsData.totalCustomers}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp
              className={`w-4 h-4 ${
                analyticsData.customersGrowth >= 0
                  ? "text-green-500"
                  : "text-red-500"
              } mr-1`}
            />
            <span
              className={
                analyticsData.customersGrowth >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {analyticsData.customersGrowth >= 0 ? "+" : ""}
              {analyticsData.customersGrowth}%
            </span>
            <span className="ml-2 text-gray-500">from last {period}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. Order Value</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                ₹{analyticsData.avgOrderValue}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp
              className={`w-4 h-4 ${
                analyticsData.avgOrderGrowth >= 0
                  ? "text-green-500"
                  : "text-red-500"
              } mr-1`}
            />
            <span
              className={
                analyticsData.avgOrderGrowth >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {analyticsData.avgOrderGrowth >= 0 ? "+" : ""}
              {analyticsData.avgOrderGrowth}%
            </span>
            <span className="ml-2 text-gray-500">from last {period}</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">
            Revenue Overview
          </h3>

          {/* Time period filter */}
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => handlePeriodChange("day")}
              className={`px-3 py-1 text-sm rounded-full ${
                period === "day"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Day
            </button>
            <button
              onClick={() => handlePeriodChange("week")}
              className={`px-3 py-1 text-sm rounded-full ${
                period === "week"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => handlePeriodChange("month")}
              className={`px-3 py-1 text-sm rounded-full ${
                period === "month"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => handlePeriodChange("year")}
              className={`px-3 py-1 text-sm rounded-full ${
                period === "year"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Year
            </button>
          </div>

          <div className="mt-4 h-64">
            {analyticsData.monthlyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">
                  No revenue data available for this period
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Popular Items</h3>
          <div className="mt-4 space-y-4">
            {analyticsData.popularItems.length > 0 ? (
              analyticsData.popularItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg mr-4 flex items-center justify-center">
                      {/* Placeholder for item image or icon */}
                      <span className="text-xl font-bold text-gray-500">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.count} orders this {period}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900">
                    ₹{item.revenue.toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500">No popular items data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <div className="mt-4 space-y-4">
          {analyticsData.recentActivity.length > 0 ? (
            analyticsData.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <p className="text-gray-700">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            ))
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
