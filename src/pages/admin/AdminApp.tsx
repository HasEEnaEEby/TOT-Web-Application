import { Route, Routes } from 'react-router-dom';
import Dashboard from '../../components/admin/AdminDashboard';
import Layout from '../../components/admin/AdminPageLayout/layout';
import AdminIncome from '../../components/admin/Income';
import RestaurantManagement from '../../components/admin/RestaurantManagement';
import RestaurantRequests from '../../components/admin/RestaurantRequest';
import Subscriptions from '../../components/admin/Subscriptions';
import Tasks from '../../components/admin/Tasks';

function AdminApp() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="requests" element={<RestaurantRequests />} />
        <Route path="restaurants" element={<RestaurantManagement />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="income" element={<AdminIncome />} />
        <Route path="tasks" element={<Tasks />} />
      </Route>
    </Routes>
  );
}

export default AdminApp;
