import { BarChart2, TrendingUp, Users } from 'lucide-react';
import { StatCard } from '../../common/StatCard';

export function Analytics() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-secondary-indigo mb-8">Analytics Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Monthly Revenue"
            value="$48,592"
            icon={TrendingUp}
            trend="+8% from last month"
            trendUp={true}
          />
          <StatCard
            title="Active Users"
            value="15.8k"
            icon={Users}
            trend="+18% from last month"
            trendUp={true}
          />
          <StatCard
            title="Average Order Value"
            value="$32.50"
            icon={BarChart2}
            trend="+5% from last month"
            trendUp={true}
          />
        </div>
      </div>
    </main>
  );
}