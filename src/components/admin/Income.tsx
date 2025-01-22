import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Download } from 'lucide-react';
import StatsCard from './StatsCard';

const monthlyData = [
  { month: 'Jan', income: 12400 },
  { month: 'Feb', income: 15600 },
  { month: 'Mar', income: 18200 },
  { month: 'Apr', income: 16800 },
  { month: 'May', income: 19500 },
  { month: 'Jun', income: 22000 },
];

export default function Income() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary-900 mb-2">Income Overview</h1>
        <p className="text-gray-600">Track your revenue and financial metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Revenue"
          value="$104,450"
          trend={12}
          icon={DollarSign}
          color="primary"
          description="vs. last month"
        />
        <StatsCard
          title="Monthly Growth"
          value="15%"
          icon={TrendingUp}
          color="success"
          description="Month over month"
        />
        <StatsCard
          title="Projected Income"
          value="$125,000"
          icon={DollarSign}
          color="secondary"
          description="Next month"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Income Trends</h2>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ed1515" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#ed1515" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-200" />
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
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ed1515',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Income']}
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#ed1515"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorIncome)"
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
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Restaurant</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">Mar 15, 2024</td>
                <td className="px-6 py-4">Gourmet Haven</td>
                <td className="px-6 py-4">Subscription</td>
                <td className="px-6 py-4">$99.00</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-success/10 text-success rounded-full text-sm">Completed</span>
                </td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}