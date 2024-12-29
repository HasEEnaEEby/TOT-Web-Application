import { RestaurantTable } from '../../components/admin/Dashboard/RestaurantTable';

export function Restaurants() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-secondary-indigo mb-8">Restaurant Management</h1>
        <RestaurantTable />
      </div>
    </main>
  );
}