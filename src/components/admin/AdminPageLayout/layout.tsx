import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useTheme } from "../../../hooks/use-theme";
import Header from "../Header";
import Sidebar from "../Sidebar";

export default function Layout() {
  const { theme } = useTheme();
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      className={`min-h-screen transition-all duration-300 flex flex-col ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Sidebar onWidthChange={setSidebarWidth} />
      <div
        className="flex-1 flex flex-col"
        style={{ marginTop: 64, marginLeft: isMobile ? 0 : sidebarWidth }}
      >
        <Header sidebarWidth={sidebarWidth} />
        <main className="transition-all duration-300 flex-1 overflow-auto">
          <div className="p-6 md:p-20">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
