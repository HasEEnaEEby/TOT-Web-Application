import { Check, ChevronDown, ChevronUp, Loader2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import DataTable, { Column } from "./DataTable";

interface RestaurantRequest {
  id: string;
  restaurantName: string;
  username: string;
  email: string;
  location: string;
  contactNumber: string;
  quote: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface ApiResponse {
  status: string;
  data: Array<{
    _id?: string;
    restaurantName?: string;
    username?: string;
    email?: string;
    location?: string;
    contactNumber?: string;
    quote?: string;
    status?: "pending" | "approved" | "rejected";
    createdAt?: string;
  }>;
}

const extractId = (id: string | undefined): string => {
  if (!id) return "";
  const match = id.match(/ObjectId\(['"](.+)['"]\)/);
  return match ? match[1] : id;
};

export default function RestaurantRequests() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<RestaurantRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      const response = await fetch(
        "http://localhost:4000/api/v1/admin/restaurants/pending",
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

      const data: ApiResponse = await response.json();
      console.log("API Response:", data);

      if (data.status === "success") {
        const mappedData: RestaurantRequest[] = data.data.map((restaurant) => ({
          id: extractId(restaurant._id),
          restaurantName: restaurant.restaurantName || "",
          username: restaurant.username || "",
          email: restaurant.email || "",
          location: restaurant.location || "",
          contactNumber: restaurant.contactNumber || "",
          quote: restaurant.quote || "",
          status: restaurant.status || "pending",
          createdAt: restaurant.createdAt || new Date().toISOString(),
        }));

        console.log("Mapped restaurants:", mappedData);
        setRestaurants(mappedData);
      }
    } catch (error) {
      console.error("Fetch restaurants error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to fetch restaurant requests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleApprove = async (restaurant: RestaurantRequest) => {
    try {
      if (!restaurant.email || processingId) {
        return;
      }

      setProcessingId(restaurant.email);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("No authentication token found");
        return;
      }
      setRestaurants((prev) =>
        prev.map((r) =>
          r.email === restaurant.email ? { ...r, status: "approved" } : r
        )
      );

      const response = await fetch(
        `http://localhost:4000/api/v1/admin/restaurants/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: restaurant.email }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        setRestaurants((prev) =>
          prev.map((r) =>
            r.email === restaurant.email ? { ...r, status: "pending" } : r
          )
        );
        throw new Error(responseData.message || "Failed to approve restaurant");
      }

      toast.success("Restaurant approved successfully");
      await fetchRestaurants();
    } catch (error) {
      console.error("Approve restaurant error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to approve restaurant"
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (restaurant: RestaurantRequest) => {
    try {
      if (!restaurant.email || processingId) {
        return;
      }

      const reason = prompt(
        "Please enter a reason for rejecting the restaurant:"
      );
      if (!reason?.trim()) {
        toast.error("Reason is required for rejection");
        return;
      }

      setProcessingId(restaurant.email);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("No authentication token found");
        return;
      }
      setRestaurants((prev) =>
        prev.map((r) =>
          r.email === restaurant.email ? { ...r, status: "rejected" } : r
        )
      );

      const response = await fetch(
        `http://localhost:4000/api/v1/admin/restaurants/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: restaurant.email,
            reason: reason.trim(),
          }),
        }
      );

      if (!response.ok) {
        setRestaurants((prev) =>
          prev.map((r) =>
            r.email === restaurant.email ? { ...r, status: "pending" } : r
          )
        );
        throw new Error("Failed to reject restaurant");
      }
      toast.success("Restaurant rejected successfully");
      await fetchRestaurants();
    } catch (error) {
      console.error("Reject restaurant error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to reject restaurant"
      );
    } finally {
      setProcessingId(null);
    }
  };

  const toggleExpandRow = (email: string) => {
    setExpandedRow(expandedRow === email ? null : email);
  };

  const columns: Column<RestaurantRequest>[] = [
    { key: "restaurantName", label: "Restaurant Name" },
    { key: "username", label: "Owner Name" },
    { key: "location", label: "Location" },
    {
      key: "createdAt",
      label: "Requested Date",
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            value === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : value === "approved"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleApprove(row);
            }}
            className="p-1 text-green-600 hover:bg-green-50 rounded disabled:opacity-50"
            disabled={row.status !== "pending" || processingId === row.email}
          >
            {processingId === row.email ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Check className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleReject(row);
            }}
            className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
            disabled={row.status !== "pending" || processingId === row.email}
          >
            {processingId === row.email ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <X className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleExpandRow(row.email);
            }}
            className="p-1 text-gray-600 hover:bg-gray-50 rounded"
          >
            {expandedRow === row.email ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      ),
    },
  ];

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const matchesSearch =
        restaurant.restaurantName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        restaurant.username.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation =
        !selectedLocation || restaurant.location.includes(selectedLocation);
      return matchesSearch && matchesLocation;
    });
  }, [restaurants, searchTerm, selectedLocation]);

  const locationOptions = useMemo(() => {
    return [...new Set(restaurants.map((r) => r.location))];
  }, [restaurants]);

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
        <h1 className="text-2xl font-semibold">Restaurant Requests</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border rounded-lg w-64"
            />
            <select
              className="px-3 py-2 border rounded-lg"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              {locationOptions.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        <DataTable<RestaurantRequest>
          columns={columns}
          data={filteredRestaurants}
          onRowClick={(row) => toggleExpandRow(row.email)}
        />
      </div>

      {expandedRow && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Restaurant Details</h3>
          {expandedRow && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Contact Number</p>
                <p className="font-medium">
                  {
                    restaurants.find((r) => r.email === expandedRow)
                      ?.contactNumber
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">
                  {restaurants.find((r) => r.email === expandedRow)?.email}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Quote</p>
                <p className="font-medium">
                  {restaurants.find((r) => r.email === expandedRow)?.quote}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
