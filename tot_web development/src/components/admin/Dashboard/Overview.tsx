import { StatCard } from '../../common/StatCard';
import { Building2, Users, DollarSign, ShoppingBag } from 'lucide-react';

export function Overview() {
  return (
    <div className="mb-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-accent">Dashboard Overview</h1>
        <p className="text-base-dark">Welcome back, Admin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Restaurants"
          value="248"
          icon={Building2}
          trend="+12% from last month"
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
          title="Total Revenue"
          value="$48,592"
          icon={DollarSign}
          trend="+8% from last month"
          trendUp={true}
        />
        <StatCard
          title="Total Orders"
          value="1,429"
          icon={ShoppingBag}
          trend="-3% from last month"
          trendUp={false}
        />
      </div>
    </div>
  );
}