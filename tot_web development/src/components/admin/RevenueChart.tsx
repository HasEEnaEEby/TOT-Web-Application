import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { name: 'Jan', value: 12400 },
  { name: 'Feb', value: 15600 },
  { name: 'Mar', value: 18200 },
  { name: 'Apr', value: 16800 },
  { name: 'May', value: 19500 },
  { name: 'Jun', value: 22000 },
];

export default function RevenueChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 backdrop-blur-sm bg-white/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-primary-800">Revenue Overview</h2>
        <div className="flex gap-2">
          <select className="px-3 py-1 rounded-lg border border-gray-200 text-sm">
            <option>Last 6 months</option>
            <option>Last year</option>
            <option>All time</option>
          </select>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ed1515" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#ed1515" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-200" />
            <XAxis 
              dataKey="name" 
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
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#ed1515"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}