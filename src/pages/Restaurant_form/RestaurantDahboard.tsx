import {
  Bell,
  ChevronLeft,
  ClipboardList,
  Home,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Menu,
  Settings,
} from "lucide-react";
import { useState } from "react";
import Analytics from "../../components/restaurant_Dashboard/Analytics";
import MenuManagement from "../../components/restaurant_Dashboard/MenuManagement";
import OrderManagement from "../../components/restaurant_Dashboard/OrderManagement";
import RestaurantProfile from "../../components/restaurant_Dashboard/RestaurantProfile";
import TableManagement from "../../components/restaurant_Dashboard/TableManagement";

function RestaurantDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const restaurantName = "La Belle Cuisine";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Collapsible Sidebar */}
      <div
        className={`${
          isSidebarCollapsed ? "w-20" : "w-64"
        } bg-white shadow-lg transition-all duration-300 ease-in-out relative`}
      >
        <div className={`p-6 ${isSidebarCollapsed ? "px-4" : ""}`}>
          <h1
            className={`font-display font-bold text-primary-600 transition-all duration-300 ${
              isSidebarCollapsed ? "text-xl text-center" : "text-2xl"
            }`}
          >
            {isSidebarCollapsed ? "LBC" : restaurantName}
          </h1>
          {!isSidebarCollapsed && (
            <p className="text-sm text-secondary-500 mt-1 transition-opacity duration-300">
              {getGreeting()}, Chef!
            </p>
          )}
        </div>

        <nav className="mt-6">
          <div
            className={`flex items-center px-6 py-3 cursor-pointer group ${
              activeTab === "dashboard"
                ? "bg-primary-50 text-primary-600"
                : "text-secondary-600 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <Home
              className={`w-5 h-5 ${isSidebarCollapsed ? "mx-auto" : "mr-3"}`}
            />
            <span
              className={`${
                isSidebarCollapsed ? "hidden" : "block"
              } transition-all duration-300`}
            >
              Home Base
            </span>
            {isSidebarCollapsed && (
              <div className="absolute left-full ml-2 py-1 px-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                Home Base
              </div>
            )}
          </div>

          <div
            className={`flex items-center px-6 py-3 cursor-pointer group ${
              activeTab === "menu"
                ? "bg-primary-50 text-primary-600"
                : "text-secondary-600 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("menu")}
          >
            <Menu
              className={`w-5 h-5 ${isSidebarCollapsed ? "mx-auto" : "mr-3"}`}
            />
            <span
              className={`${
                isSidebarCollapsed ? "hidden" : "block"
              } transition-all duration-300`}
            >
              Craft Menu
            </span>
            {isSidebarCollapsed && (
              <div className="absolute left-full ml-2 py-1 px-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                Craft Menu
              </div>
            )}
          </div>

          <div
            className={`flex items-center px-6 py-3 cursor-pointer group ${
              activeTab === "orders"
                ? "bg-primary-50 text-primary-600"
                : "text-secondary-600 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            <ClipboardList
              className={`w-5 h-5 ${isSidebarCollapsed ? "mx-auto" : "mr-3"}`}
            />
            <span
              className={`${
                isSidebarCollapsed ? "hidden" : "block"
              } transition-all duration-300`}
            >
              Kitchen Orders
            </span>
            {isSidebarCollapsed && (
              <div className="absolute left-full ml-2 py-1 px-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                Kitchen Orders
              </div>
            )}
          </div>

          <div
            className={`flex items-center px-6 py-3 cursor-pointer group ${
              activeTab === "tables"
                ? "bg-primary-50 text-primary-600"
                : "text-secondary-600 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("tables")}
          >
            <LayoutGrid
              className={`w-5 h-5 ${isSidebarCollapsed ? "mx-auto" : "mr-3"}`}
            />
            <span
              className={`${
                isSidebarCollapsed ? "hidden" : "block"
              } transition-all duration-300`}
            >
              Dining Space
            </span>
            {isSidebarCollapsed && (
              <div className="absolute left-full ml-2 py-1 px-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                Dining Space
              </div>
            )}
          </div>

          <div
            className={`flex items-center px-6 py-3 cursor-pointer group ${
              activeTab === "analytics"
                ? "bg-primary-50 text-primary-600"
                : "text-secondary-600 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("analytics")}
          >
            <LayoutDashboard
              className={`w-5 h-5 ${isSidebarCollapsed ? "mx-auto" : "mr-3"}`}
            />
            <span
              className={`${
                isSidebarCollapsed ? "hidden" : "block"
              } transition-all duration-300`}
            >
              Insights
            </span>
            {isSidebarCollapsed && (
              <div className="absolute left-full ml-2 py-1 px-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                Insights
              </div>
            )}
          </div>
        </nav>

        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft
            className={`w-4 h-4 text-secondary-600 transition-transform duration-300 ${
              isSidebarCollapsed ? "rotate-180" : ""
            }`}
          />
        </button>

        <div
          className={`absolute bottom-0 w-full p-6 ${
            isSidebarCollapsed ? "px-4" : ""
          }`}
        >
          <div className="flex items-center justify-between text-secondary-600">
            <div className="flex items-center group">
              <Settings
                className={`w-5 h-5 ${isSidebarCollapsed ? "mx-auto" : "mr-3"}`}
              />
              <span
                className={`${
                  isSidebarCollapsed ? "hidden" : "block"
                } transition-all duration-300`}
              >
                Customize
              </span>
              {isSidebarCollapsed && (
                <div className="absolute left-full ml-2 py-1 px-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  Customize
                </div>
              )}
            </div>
            <div className="relative">
              <Bell className="w-5 h-5 cursor-pointer hover:text-primary-600 transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
            </div>
          </div>
          <div
            className={`flex items-center mt-4 text-secondary-600 cursor-pointer hover:text-primary-600 transition-colors group ${
              isSidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className={`w-5 h-5 ${isSidebarCollapsed ? "" : "mr-3"}`} />
            <span
              className={`${
                isSidebarCollapsed ? "hidden" : "block"
              } transition-all duration-300`}
            >
              Sign Out
            </span>
            {isSidebarCollapsed && (
              <div className="absolute left-full ml-2 py-1 px-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                Sign Out
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-display font-semibold text-secondary-900">
                  {activeTab === "dashboard" && "Welcome to Your Kitchen"}
                  {activeTab === "menu" && "Craft Your Perfect Menu"}
                  {activeTab === "orders" && "What's Cooking?"}
                  {activeTab === "tables" && "Arrange Your Dining Space"}
                  {activeTab === "analytics" && "Your Restaurant's Story"}
                </h2>
                <p className="text-secondary-600 mt-1">
                  {activeTab === "dashboard" &&
                    "Let's make today special for your guests"}
                  {activeTab === "menu" &&
                    "Create and manage your culinary offerings"}
                  {activeTab === "orders" &&
                    "Keep track of all your kitchen's activities"}
                  {activeTab === "tables" &&
                    "Design the perfect dining experience"}
                  {activeTab === "analytics" &&
                    "Discover insights about your restaurant"}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <Bell className="w-6 h-6 text-secondary-600 cursor-pointer hover:text-primary-600 transition-colors" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-secondary-900">
                        Recent Notifications
                      </h3>
                      <div className="mt-2 space-y-2">
                        <p className="text-sm text-secondary-600">
                          New order received - Table 5
                        </p>
                        <p className="text-sm text-secondary-600">
                          Kitchen stock running low
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center hover:bg-primary-200 transition-colors cursor-pointer group">
                  <span className="text-primary-600 font-display font-semibold">
                    JD
                  </span>
                  <div className="absolute right-0 mt-12 w-48 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-secondary-900">
                        John Doe
                      </h3>
                      <p className="text-sm text-secondary-600 mt-1">
                        Head Chef
                      </p>
                      <hr className="my-2" />
                      <button className="text-sm text-secondary-600 hover:text-primary-600 transition-colors">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">
          {activeTab === "dashboard" && <RestaurantProfile />}
          {activeTab === "menu" && <MenuManagement />}
          {activeTab === "orders" && <OrderManagement />}
          {activeTab === "tables" && <TableManagement />}
          {activeTab === "analytics" && <Analytics />}
        </main>
      </div>
    </div>
  );
}

export default RestaurantDashboard;
