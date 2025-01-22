import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Sidebar from '../Sidebar';

export default function Layout() {
  const [sidebarWidth, setSidebarWidth] = useState(256);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50">
      <Sidebar onWidthChange={setSidebarWidth} />
      <Header sidebarWidth={sidebarWidth} />

      <main className="transition-all duration-300" style={{ paddingLeft: sidebarWidth }}>
        <div className="p-20">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
