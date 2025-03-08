import { DollarSign, Download, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { incomeApi } from "../../api/incomeApi";
import { useToast } from "../../hooks/use-toast";
import type { IncomeData } from "../../types/income";
import StatsCard from "./StatsCard";

const Income = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<IncomeData | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const incomeData = await incomeApi.getIncomeData();
      setData(incomeData);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch income data";
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">Loading...</div>
    );
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!data) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary-900 mb-2">
          Income Overview
        </h1>
        <p className="text-gray-600">
          Track your revenue and financial metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(data.stats.totalRevenue)}
          trend={data.stats.monthlyGrowth}
          icon={DollarSign}
          color="primary"
          description="vs. last month"
        />
        <StatsCard
          title="Monthly Growth"
          value={`${data.stats.monthlyGrowth}%`}
          icon={TrendingUp}
          color="success"
          description="Month over month"
        />
        <StatsCard
          title="Active Subscriptions"
          value={data.stats.activeSubscriptions.toString()}
          icon={Users}
          color="info"
          description="Basic package"
        />
        <StatsCard
          title="Premium Packages"
          value={data.stats.premiumPackages.toString()}
          icon={Users}
          color="warning"
          description="Premium restaurants"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Income Trends</h2>
          <button
            onClick={() => incomeApi.generateReport()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.monthlyData}>
              <defs>
                <linearGradient
                  id="colorSubscription"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#ed1515" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#ed1515" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-gray-200"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                className="text-gray-600"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                className="text-gray-600"
                tickFormatter={formatCurrency}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ed1515",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value: number) => [formatCurrency(value)]}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="subscriptionIncome"
                name="Basic Subscriptions"
                stroke="#ed1515"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSubscription)"
              />
              <Area
                type="monotone"
                dataKey="premiumPackageIncome"
                name="Premium Packages"
                stroke="#0ea5e9"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPremium)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Restaurant
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{transaction.restaurant}</td>
                  <td className="px-6 py-4">
                    {transaction.type === "premium_package"
                      ? "Premium Package"
                      : "Basic Subscription"}
                  </td>
                  <td className="px-6 py-4">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 ${
                        transaction.status === "completed"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      } rounded-full text-sm`}
                    >
                      {transaction.status.charAt(0).toUpperCase() +
                        transaction.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Income;
