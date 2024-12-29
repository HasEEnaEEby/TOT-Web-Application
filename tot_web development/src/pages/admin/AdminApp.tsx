import { BrowserRouter as Router } from 'react-router-dom';
import { Sidebar } from '../../components/common/Sidebar';
import AppRoutes from '../../routes/AppRoutes';

export default function AdminApp() {
  return (
    <Router>
      <div className="flex h-screen bg-base bg-wave-pattern">
        <Sidebar />
        <AppRoutes />
      </div>
    </Router>
  );
}
