import { AnalyticsIcon, OrderIcon, RestaurantIcon, RevenueIcon } from '../../components/common/ui/CustomIcons';
import RestaurantTable from '../admin/RestaurantTable';
import RevenueChart from '../admin/RevenueChart';
import StatsCard from '../admin/StatsCard';

export default function Dashboard() {
  return (
    <>
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Welcome back, Admin</h1>
        <p className="text-gray-600">Here's what's happening with your restaurants today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Revenue"
          value="$124,500"
          trend={12}
          icon={RevenueIcon}
          color="primary"
          description="vs. last month"
        />
        <StatsCard
          title="Active Restaurants"
          value="45"
          trend={8}
          icon={RestaurantIcon}
          color="primary"
          description="new this week"
        />
        <StatsCard
          title="Total Orders"
          value="1,240"
          trend={15}
          icon={OrderIcon}
          color="primary"
          description="vs. yesterday"
        />
        <StatsCard
          title="Analytics Overview"
          value="5,200"
          trend={5}
          icon={AnalyticsIcon}
          color="primary"
          description="active users"
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <RevenueChart />
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 backdrop-blur-sm bg-white/50">
            <h2 className="text-lg font-bold mb-4 text-primary-800">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2">
                <RestaurantIcon />
                <span>Add New Restaurant</span>
              </button>
              <button className="w-full py-3 px-4 bg-white text-primary-700 rounded-lg hover:bg-primary-50 transition-all duration-300 shadow-sm hover:shadow-md border border-primary-200 flex items-center justify-center gap-2">
                <AnalyticsIcon  />
                <span>View Reports</span>
              </button>
              <button className="w-full py-3 px-4 bg-white text-primary-700 rounded-lg hover:bg-primary-50 transition-all duration-300 shadow-sm hover:shadow-md border border-primary-200 flex items-center justify-center gap-2">
                <OrderIcon />
                <span>Manage Orders</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 backdrop-blur-sm bg-white/50">
            <h2 className="text-lg font-bold mb-4 text-primary-800">System Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Server Status</span>
                <span className="px-2 py-1 bg-success/10 text-success rounded-full text-sm">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Health</span>
                <span className="px-2 py-1 bg-success/10 text-success rounded-full text-sm">98% Uptime</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Backup</span>
                <span className="text-sm text-gray-600">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <RestaurantTable />
      </div>
    </>
  );
}