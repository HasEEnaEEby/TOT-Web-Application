import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Coffee,
  Filter,
  MapPin,
  MoreVertical,
  RefreshCw,
  Timer,
  User,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import orderApi from "../../api/orderApi";
import BillGenerator from "../../components/restaurant_Dashboard/BillGenerator";
import useAuth from "../../hooks/use-auth";
import { useRestaurantOrders } from "../../hooks/use-restaurant-orders";

// Local Order interface for UI representation
interface OrderItem {
  name: string;
  quantity: number;
  notes?: string;
  specialRequests?: string[];
  price?: number;
}

interface Order {
  id: string;
  customer: string;
  items: OrderItem[];
  total: number;
  status: "new" | "preparing" | "ready" | "completed" | "cancelled";
  priority: "urgent" | "standard";
  time: string;
  table: string;
  assignedTo?: string;
  estimatedTime?: string;
  actualTime?: string;
  createdAt: string;
}

export default function OrderManagement() {
  const { authState } = useAuth();
  const restaurantId = authState.user?.restaurant || authState.user?.id || "";

  // Bill generation state
  const [showBillForOrder, setShowBillForOrder] = useState<string | null>(null);

  // Track last order count to check for new orders
  const [previousOrderCount, setPreviousOrderCount] = useState(0);

  // Track newly arrived orders to highlight them
  const [newOrderIds, setNewOrderIds] = useState<string[]>([]);

  // Internal refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasAutoRefreshedRef = useRef(false);

  // Use our enhanced restaurant orders hook
  const {
    orders: apiOrders,
    loading,
    error,
    isRealTime,
    refreshOrders,
  } = useRestaurantOrders(restaurantId);

  // Map API orders to UI orders
  const orders: Order[] = useMemo(() => {
    return apiOrders.map((apiOrder) => ({
      id: apiOrder._id,
      customer: apiOrder.customer,
      items: apiOrder.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        notes: item.specialInstructions,
        specialRequests: item.specialInstructions
          ? [item.specialInstructions]
          : [],
        price: item.price,
      })),
      total: apiOrder.totalAmount,
      status:
        apiOrder.status === "active"
          ? "new"
          : apiOrder.status === "preparing"
          ? "preparing"
          : apiOrder.status === "ready"
          ? "ready"
          : apiOrder.status === "completed"
          ? "completed"
          : apiOrder.status === "cancelled"
          ? "cancelled"
          : "new",
      priority: "standard", // Default priority, adjust as needed
      time: `${Math.floor(
        (Date.now() - new Date(apiOrder.createdAt).getTime()) / (1000 * 60)
      )} mins ago`,
      table: apiOrder.table,
      estimatedTime: "20 mins",
      createdAt: apiOrder.createdAt,
    }));
  }, [apiOrders]);

  // Silently refresh orders
  const silentRefresh = useCallback(() => {
    setIsRefreshing(true);
    refreshOrders();

    // Set a timeout to ensure we exit refreshing state even if there's an error
    setTimeout(() => {
      setIsRefreshing(false);
    }, 3000);
  }, [refreshOrders]);

  // Auto-retry if connection failed or no orders were returned
  useEffect(() => {
    // If we got an error and haven't auto-refreshed yet, try once more
    if (error && !hasAutoRefreshedRef.current) {
      hasAutoRefreshedRef.current = true;
      const timer = setTimeout(() => {
        silentRefresh();
      }, 2000);

      return () => clearTimeout(timer);
    }

    // Reset the flag when error is cleared
    if (!error) {
      hasAutoRefreshedRef.current = false;
    }
  }, [error, silentRefresh]);

  // Check for newly arrived orders to highlight them
  useEffect(() => {
    if (orders.length > previousOrderCount) {
      // Find new active orders (ones that just came in)
      const activeNewOrders = orders
        .filter((order) => order.status === "new")
        .filter((order) => !newOrderIds.includes(order.id))
        .map((order) => order.id);

      if (activeNewOrders.length > 0) {
        // Add to highlighted orders
        setNewOrderIds((prev) => [...prev, ...activeNewOrders]);

        // Play notification sound for new orders
        try {
          const audio = new Audio("/sounds/new-order.mp3");
          audio.play();
        } catch (error) {
          console.error("Failed to play notification sound", error);
        }
      }
    }

    // Update previous count for next comparison
    setPreviousOrderCount(orders.length);

    // Clear highlighted new orders after 10 seconds
    const timer = setTimeout(() => {
      setNewOrderIds([]);
    }, 10000);

    return () => clearTimeout(timer);
  }, [orders, previousOrderCount, newOrderIds]);

  // Polling fallback when not in real-time mode
  useEffect(() => {
    if (isRealTime) {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
      return;
    }

    // Set up polling every 15 seconds when not in real-time mode
    refreshTimerRef.current = setInterval(() => {
      silentRefresh();
    }, 15000);

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [isRealTime, silentRefresh]);

  // State management
  const [activeStatus, setActiveStatus] = useState<string>("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const updateOrderStatus = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    try {
      // Convert local status back to API status
      const apiStatus =
        newStatus === "new"
          ? "active"
          : newStatus === "preparing"
          ? "preparing"
          : newStatus === "ready"
          ? "ready"
          : newStatus === "completed"
          ? "completed"
          : newStatus === "cancelled"
          ? "cancelled"
          : "active";

      // Update status via API
      await orderApi.updateOrderStatus(orderId, apiStatus);

      // Close expanded view
      setExpandedOrder(null);

      toast.success(`Order status updated to ${newStatus}`);

      // If order is completed, show bill generation modal
      if (newStatus === "completed") {
        setShowBillForOrder(orderId);
      }
    } catch (error) {
      console.error("Failed to update order status", error);
      toast.error("Failed to update order status");
    }
  };

  // Status color helpers
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-yellow-100 text-yellow-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: Order["priority"]) => {
    return priority === "urgent"
      ? "bg-red-100 text-red-800 border border-red-200"
      : "bg-gray-100 text-gray-600 border border-gray-200";
  };

  const getTimeColor = (time: string) => {
    const minutes = parseInt(time);
    if (minutes > 30) return "text-red-600";
    if (minutes > 20) return "text-yellow-600";
    return "text-green-600";
  };

  // Calculate elapsed time
  const getTimeLabel = (createdAt: string) => {
    const orderTime = new Date(createdAt);
    const now = new Date();
    const diffMinutes = Math.floor(
      (now.getTime() - orderTime.getTime()) / (1000 * 60)
    );

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes === 1) return "1 min ago";
    return `${diffMinutes} mins ago`;
  };

  // Filtering orders
  const filteredOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        (activeStatus === "all" || order.status === activeStatus) &&
        (searchTerm === "" ||
          order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          ))
    );
  }, [orders, activeStatus, searchTerm]);

  // Order status options
  const orderStatuses = [
    { value: "all", label: "All Orders" },
    { value: "new", label: "New" },
    { value: "preparing", label: "Preparing" },
    { value: "ready", label: "Ready" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  // Order statistics
  const orderStats = {
    all: orders.length,
    new: orders.filter((o) => o.status === "new").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  // Render loading state
  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Coffee className="w-16 h-16 mx-auto text-primary-500 animate-pulse mb-4" />
          <p className="text-gray-600 text-lg">Loading orders...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error && !loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-8 p-6 bg-red-50 rounded-lg max-w-md mx-auto">
        <p className="text-red-600 mb-2">
          Connection failed. Using REST API fallback.
        </p>

        <div className="flex space-x-4 mt-4">
          <button
            onClick={silentRefresh}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50"
          >
            Reload Page
          </button>
        </div>

        <p className="mt-8 text-gray-600 text-sm">
          Connection issues may occur if your authentication token is invalid or
          expired.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        <div className="flex items-center">
          {isRealTime ? (
            <div className="flex items-center text-green-600 text-sm">
              <Wifi className="w-4 h-4 mr-1" />
              <span>Real-time</span>
            </div>
          ) : (
            <div className="flex items-center text-gray-600 text-sm">
              <WifiOff className="w-4 h-4 mr-1" />
              <span>Standard mode</span>
            </div>
          )}
          {!isRealTime && (
            <div className="ml-4 text-xs text-gray-500">
              Auto-refreshing every 15s
            </div>
          )}
        </div>
      </div>

      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {orderStats.all - orderStats.completed - orderStats.cancelled}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Coffee className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Preparing</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {orderStats.preparing}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Timer className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ready to Serve</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {orderStats.ready}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. Prep Time</p>
              <p className="text-2xl font-bold text-primary-600 mt-1">18m</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <Clock className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Bill Generator Modal */}
      {showBillForOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold">Order Bill</h2>
              <button
                onClick={() => setShowBillForOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <div className="p-4">
              <BillGenerator
                orderId={showBillForOrder}
                onClose={() => setShowBillForOrder(null)}
                onBillGenerated={(bill) => {
                  // Optional: You can add additional logic here if needed
                  console.log("Bill generated:", bill);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {orderStatuses.map((status) => (
            <button
              key={status.value}
              onClick={() => setActiveStatus(status.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeStatus === status.value
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {status.label}
              {status.value !== "all" && (
                <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-white bg-opacity-30">
                  {status.value === "new"
                    ? orderStats.new
                    : status.value === "preparing"
                    ? orderStats.preparing
                    : status.value === "ready"
                    ? orderStats.ready
                    : status.value === "completed"
                    ? orderStats.completed
                    : orderStats.cancelled}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm w-full sm:w-auto"
          />
          <button
            onClick={silentRefresh}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
            title="Refresh Orders"
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`w-5 h-5 text-gray-600 ${
                isRefreshing || loading ? "animate-spin" : ""
              }`}
            />
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-5 h-5 mr-2 text-gray-600" />
            <span className="text-gray-600">Filter</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="text-lg font-medium mb-4">Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Type
              </label>
              <select className="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="all">All Types</option>
                <option value="dine-in">Dine In</option>
                <option value="takeaway">Takeaway</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Range
              </label>
              <select className="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">This Week</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <Coffee className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600">
              No orders{" "}
              {activeStatus !== "all" ? `in ${activeStatus} status` : ""}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {searchTerm
                ? "Try a different search term"
                : "New orders will appear here automatically"}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${
                expandedOrder === order.id
                  ? "ring-2 ring-primary-500"
                  : newOrderIds.includes(order.id)
                  ? "ring-2 ring-blue-500 animate-pulse"
                  : "hover:shadow-md"
              }`}
            >
              {/* Order Header */}
              <div
                className="p-4 cursor-pointer"
                onClick={() =>
                  setExpandedOrder(expandedOrder === order.id ? null : order.id)
                }
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          #{order.id.substring(0, 8)}
                        </h4>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(
                            order.priority
                          )}`}
                        >
                          {order.priority}
                        </span>
                        {newOrderIds.includes(order.id) && (
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 animate-pulse">
                            New
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        <span className="font-medium">{order.customer}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-600">
                        ${order.total.toFixed(2)}
                      </p>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className={getTimeColor(order.time)}>
                          {getTimeLabel(order.createdAt)}
                        </span>
                      </div>
                    </div>
                    {expandedOrder === order.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Basic Order Info */}
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Table {order.table}
                  </div>
                  {order.assignedTo && (
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {order.assignedTo}
                    </div>
                  )}
                  {order.estimatedTime && (
                    <div className="flex items-center">
                      <Timer className="w-4 h-4 mr-1" />
                      Est. {order.estimatedTime}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Coffee className="w-4 h-4 mr-1" />
                    {order.items.length} items
                  </div>
                </div>
              </div>

              {/* Expanded Order Details */}
              {expandedOrder === order.id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                        Order Items
                      </h5>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start justify-between bg-white p-3 rounded-lg"
                          >
                            <div>
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-900">
                                  {item.name}
                                </span>
                                <span className="ml-2 text-sm text-gray-500">
                                  ×{item.quantity}
                                </span>
                              </div>
                              {item.notes && (
                                <p className="mt-1 text-sm text-gray-500">
                                  {item.notes}
                                </p>
                              )}
                              {item.specialRequests &&
                                item.specialRequests.length > 0 && (
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {item.specialRequests.map(
                                      (request, idx) => (
                                        <span
                                          key={idx}
                                          className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full"
                                        >
                                          {request}
                                        </span>
                                      )
                                    )}
                                  </div>
                                )}
                            </div>
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900 mr-2">
                                $
                                {((item.price || 0) * item.quantity).toFixed(2)}
                              </div>
                              <button className="p-1 hover:bg-gray-100 rounded-full">
                                <MoreVertical className="w-4 h-4 text-gray-400" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      {order.status !== "completed" &&
                        order.status !== "cancelled" && (
                          <>
                            {order.status === "new" && (
                              <button
                                onClick={() =>
                                  updateOrderStatus(order.id, "preparing")
                                }
                                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                              >
                                Start Preparing
                              </button>
                            )}
                            {order.status === "preparing" && (
                              <button
                                onClick={() =>
                                  updateOrderStatus(order.id, "ready")
                                }
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                Mark as Ready
                              </button>
                            )}
                            {order.status === "ready" && (
                              <button
                                onClick={() =>
                                  updateOrderStatus(order.id, "completed")
                                }
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                Complete Order
                              </button>
                            )}
                            <button
                              onClick={() =>
                                updateOrderStatus(order.id, "cancelled")
                              }
                              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              Cancel Order
                            </button>
                            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                              Add Note
                            </button>
                          </>
                        )}

                      {(order.status === "completed" ||
                        order.status === "cancelled") && (
                        <p className="text-sm text-gray-500 italic">
                          This order is {order.status} and cannot be modified
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Refresh Indicator */}
      {(isRefreshing || loading) && !error && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-50 px-3 py-1.5 rounded-full shadow-lg text-xs text-white flex items-center space-x-1 animate-fadeIn">
          <RefreshCw className="w-3 h-3 animate-spin mr-1" />
          <span>Updating...</span>
        </div>
      )}
    </div>
  );
}
