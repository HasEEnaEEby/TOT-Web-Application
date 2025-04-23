import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useTheme } from "../../../hooks/use-theme";
import Header from "../Header";
import Sidebar from "../Sidebar";

export default function Layout() {
  const { theme } = useTheme();
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isMobile, setIsMobile] = useState(false);
  const [, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobileView = window.innerWidth < 768;
      setIsMobile(mobileView);
      setSidebarCollapsed(mobileView);
      setSidebarWidth(mobileView ? 64 : 256);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      className={`min-h-screen flex transition-all duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <Sidebar
        onWidthChange={(width) => {
          setSidebarWidth(width);
          setSidebarCollapsed(width === 64);
        }}
      />

      {/* Main Content */}
      <div
        className="flex flex-col flex-1 transition-all duration-300"
        style={{
          marginLeft: isMobile ? "0px" : `${sidebarWidth}px`,
        }}
      >
        {/* Header */}
        <div className=" gap-4 ">
          <Header />
        </div>
        {/* Main Page Content */}
        <main className="transition-all duration-300 flex-1 overflow-auto">
          <div className="p-6 md:p-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
