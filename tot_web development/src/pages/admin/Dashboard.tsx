import { Overview } from '../../components/admin/Dashboard/Overview';
import { RestaurantTable } from '../../components/admin/Dashboard/RestaurantTable';

export function Dashboard() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-8">
        <Overview />
        <RestaurantTable />
      </div>
    </main>
  );
}