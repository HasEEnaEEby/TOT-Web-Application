import clsx from "clsx";
import {
  ChevronDown,
  ChevronUp,
  DollarSign,
  Eye,
  Filter,
  Loader2,
  Trash2,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Alert } from "../common/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../common/ui/dialog";

interface Restaurant {
  _id: string;
  restaurantName: string;
  status: "pending" | "approved" | "rejected";
  revenue: number;
  orders: number;
  rating: number;
  lastPayment?: string;
}

interface DialogState {
  open: boolean;
  restaurant: Restaurant | null;
}

const statusColors: Record<Restaurant["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

interface SubscriptionDialogProps {
  restaurant: Restaurant;
  onClose: () => void;
  onSubscribe: () => void;
}

// Subscription Dialog Component
const SubscriptionDialog: React.FC<SubscriptionDialogProps> = ({
  restaurant,
  onClose,
  onSubscribe,
}) => {
  const [amount] = useState(16000);

  const handleSubscribe = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/v1/management/restaurants/${restaurant._id}/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount }),
        }
      );

      if (!response.ok) throw new Error("Subscription update failed");

      toast.success(`Subscription updated for ${restaurant.restaurantName}`);
      onSubscribe();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update subscription");
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Subscription</DialogTitle>
        <DialogDescription>
          Add pro subscription for {restaurant.restaurantName}
          <div className="mt-4">
            <p className="font-semibold">Subscription Details:</p>
            <p>Amount: ₹{amount.toLocaleString()}</p>
            <p>Duration: 1 Month</p>
          </div>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <button
          onClick={onClose}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubscribe}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Confirm Subscription
        </button>
      </DialogFooter>
    </DialogContent>
  );
};

const RestaurantManagement: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] =
    useState<keyof Restaurant>("restaurantName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState({
    status: "approved" as Restaurant["status"],
    search: "",
  });
  const [deleteDialog, setDeleteDialog] = useState<DialogState>({
    open: false,
    restaurant: null,
  });
  const [subscriptionDialog, setSubscriptionDialog] = useState<DialogState>({
    open: false,
    restaurant: null,
  });

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      const response = await fetch(
        "http://localhost:4000/api/v1/admin/restaurants",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      if (data.status === "success") {
        setRestaurants(data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch restaurant data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleSort = (field: keyof Restaurant) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDeleteRestaurant = async () => {
    if (!deleteDialog.restaurant) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/v1/admin/restaurants/${deleteDialog.restaurant._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete restaurant");

      toast.success(
        `${deleteDialog.restaurant.restaurantName} deleted successfully`
      );
      fetchRestaurants();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete restaurant");
    } finally {
      setDeleteDialog({ open: false, restaurant: null });
    }
  };

  const handleRowAction = (
    action: "view" | "edit" | "delete" | "subscribe",
    restaurant: Restaurant
  ) => {
    switch (action) {
      case "view":
        toast.success(`Viewing details for ${restaurant.restaurantName}`);
        break;
      case "delete":
        setDeleteDialog({ open: true, restaurant });
        break;
      case "subscribe":
        setSubscriptionDialog({ open: true, restaurant });
        break;
      default:
        toast.error("Invalid action");
    }
  };

  const processedRestaurants = useMemo(() => {
    let result = [...restaurants];

    if (filters.status) {
      result = result.filter((r) => r.status === filters.status);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter((r) =>
        r.restaurantName.toLowerCase().includes(searchTerm)
      );
    }

    return result.sort((a, b) => {
      // Safe sorting with type guards
      const valueA = a[sortField];
      const valueB = b[sortField];

      // Handle potential undefined or different types
      if (valueA === undefined || valueB === undefined) return 0;

      // String comparison for restaurantName
      if (sortField === "restaurantName") {
        return sortDirection === "asc"
          ? (valueA as string).localeCompare(valueA as string)
          : (valueB as string).localeCompare(valueB as string);
      }

      // Numeric comparison for other fields
      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      }

      // Fallback for other types
      return 0;
    });
  }, [restaurants, sortField, sortDirection, filters]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Restaurant Management
        </h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search restaurants..."
            className="px-4 py-2 border rounded-lg"
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg border"
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                status: prev.status === "approved" ? "pending" : "approved",
              }))
            }
          >
            <Filter className="w-4 h-4" />
            {filters.status === "approved" ? "Show All" : "Show Approved"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {[
                  { key: "restaurantName", label: "Name" },
                  { key: "status", label: "Status" },
                  { key: "revenue", label: "Revenue" },
                  { key: "orders", label: "Orders" },
                  { key: "rating", label: "Rating" },
                  { key: "lastPayment", label: "Last Payment" },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key as keyof Restaurant)}
                    className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      {label}
                      {sortField === key &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        ))}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {processedRestaurants.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium">{r.restaurantName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={clsx(
                        "px-3 py-1 rounded-full text-sm font-medium",
                        statusColors[r.status]
                      )}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">${r.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4">{r.orders}</td>
                  <td className="px-6 py-4">
                    {r.rating ? r.rating.toFixed(1) : "-"}
                  </td>
                  <td className="px-6 py-4">{r.lastPayment || "-"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRowAction("view", r)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5 text-black-500" />
                      </button>
                      <button
                        onClick={() => handleRowAction("subscribe", r)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                        title="Add Subscription"
                      >
                        <DollarSign className="w-5 h-5 text-black-100" />
                      </button>
                      <button
                        onClick={() => handleRowAction("delete", r)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                        title="Delete Restaurant"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {processedRestaurants.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No restaurants found
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Restaurant</DialogTitle>
            <DialogDescription>
              {deleteDialog.restaurant && (
                <Alert>
                  Are you sure you want to delete{" "}
                  {deleteDialog.restaurant.restaurantName}? This action cannot
                  be undone.
                </Alert>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setDeleteDialog({ open: false, restaurant: null })}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteRestaurant}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Subscription Dialog */}
      <Dialog
        open={subscriptionDialog.open}
        onOpenChange={(open) =>
          setSubscriptionDialog((prev) => ({ ...prev, open }))
        }
      >
        {subscriptionDialog.restaurant && (
          <SubscriptionDialog
            restaurant={subscriptionDialog.restaurant}
            onClose={() =>
              setSubscriptionDialog({ open: false, restaurant: null })
            }
            onSubscribe={fetchRestaurants}
          />
        )}
      </Dialog>
    </div>
  );
};

export default RestaurantManagement;
