import { 
  LayoutDashboard, 
  Store, 
  BarChart2, 
  CreditCard, 
  Settings,
  LogOut
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
  { icon: Store, label: 'Restaurants', to: '/restaurants' },
  { icon: BarChart2, label: 'Analytics', to: '/analytics' },
  { icon: CreditCard, label: 'Payments', to: '/payments' },
  { icon: Settings, label: 'Settings', to: '/settings' },
];

export function Sidebar() {
  return (
    <div className="bg-secondary-indigo h-screen w-64 flex flex-col">
      <div className="p-6 border-b border-base/10">
        <h1 className="text-2xl font-bold">TOT Admin</h1>
        <p className="text-base/70">Touch. Order. Taste.</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                  ${isActive ? 'bg-primary/10 text-primary-pink' : 'text-base hover:bg-primary/10'}
                `}
              >
                <item.icon className={`w-5 h-5 ${
                  'group-hover:text-primary text-secondary-gold'
                }`} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-base/10">
        <button className="flex items-center space-x-3 text-base hover:text-primary-red w-full px-4 py-2 transition-colors group">
          <LogOut className="w-5 h-5 group-hover:text-primary-red" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}