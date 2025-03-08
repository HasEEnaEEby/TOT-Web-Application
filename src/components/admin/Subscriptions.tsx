import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import DataTable, { Column } from "./DataTable";
import MetricCard from "./MetricCard";

interface Subscription {
  id: string;
  restaurantName: string;
  planType: string;
  startDate: string;
  expiryDate: string;
  paymentStatus: string;
  monthlyFee: number;
}

// Define the shape of the API response
interface ApiResponse {
  status: string;
  data: Array<{
    _id?: string;
    restaurantName?: string;
    planType?: string;
    startDate?: string;
    expiryDate?: string;
    paymentStatus?: string;
    monthlyFee?: number;
  }>;
}

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }

      const response = await fetch(
        "http://localhost:4000/api/v1/admin/subscriptions",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.status === "success") {
        const mappedData: Subscription[] = data.data.map((subscription) => ({
          id: subscription._id || "",
          restaurantName: subscription.restaurantName || "",
          planType: subscription.planType || "",
          startDate: subscription.startDate || "",
          expiryDate: subscription.expiryDate || "",
          paymentStatus: subscription.paymentStatus || "",
          monthlyFee: subscription.monthlyFee || 0,
        }));

        setSubscriptions(mappedData);
      }
    } catch (error) {
      console.error("Fetch subscriptions error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch subscriptions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
    // Set up interval to check for expired subscriptions
    const interval = setInterval(fetchSubscriptions, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Calculate metrics
  const metrics = useMemo(() => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(
      now.getTime() + 30 * 24 * 60 * 60 * 1000
    );

    const active = subscriptions.filter(
      (sub) => new Date(sub.expiryDate) > now
    );
    const expiringSoon = subscriptions.filter((sub) => {
      const expiryDate = new Date(sub.expiryDate);
      return expiryDate > now && expiryDate <= thirtyDaysFromNow;
    });
    const monthlyRevenue = subscriptions.reduce((sum, sub) => {
      return sub.paymentStatus === "paid" ? sum + sub.monthlyFee : sum;
    }, 0);

    return {
      activeCount: active.length,
      expiringSoonCount: expiringSoon.length,
      monthlyRevenue,
    };
  }, [subscriptions]);

  const handleRenew = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      const response = await fetch(
        `http://localhost:4000/api/v1/admin/subscriptions/${id}/renew`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to renew subscription");
      }

      toast.success("Subscription renewed successfully");
      await fetchSubscriptions();
    } catch (error) {
      console.error("Error renewing subscription:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to renew subscription"
      );
    }
  };

  const columns: Column<Subscription>[] = [
    {
      key: "restaurantName",
      label: "Restaurant",
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: "planType",
      label: "Plan",
      render: (value) => (
        <span
          className={`capitalize ${
            value === "premium" ? "text-purple-600" : "text-blue-600"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "startDate",
      label: "Start Date",
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
    {
      key: "expiryDate",
      label: "Expiry Date",
      render: (value) => {
        const expiryDate = new Date(value as string);
        const now = new Date();
        const daysUntilExpiry = Math.ceil(
          (expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24)
        );

        return (
          <div className="flex items-center gap-2">
            <span>{expiryDate.toLocaleDateString()}</span>
            {daysUntilExpiry <= 30 && daysUntilExpiry > 0 && (
              <span className="text-sm text-amber-600">
                ({daysUntilExpiry} days left)
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "paymentStatus",
      label: "Payment Status",
      render: (value) => (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${
            value === "paid"
              ? "bg-green-50 text-green-700"
              : "bg-amber-50 text-amber-700"
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
            onClick={() => handleRenew(row.id)}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
            title="Renew subscription"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  // Filter subscriptions based on selected filters
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      const matchesPlan = !selectedPlan || sub.planType === selectedPlan;
      const matchesStatus =
        !selectedPaymentStatus || sub.paymentStatus === selectedPaymentStatus;
      return matchesPlan && matchesStatus;
    });
  }, [subscriptions, selectedPlan, selectedPaymentStatus]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Subscriptions</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Active Subscriptions"
          value={metrics.activeCount.toString()}
          icon={RefreshCw}
          trend={{ value: 5, isPositive: true }}
        />
        <MetricCard
          title="Expiring Soon"
          value={metrics.expiringSoonCount.toString()}
          icon={AlertCircle}
          variant={metrics.expiringSoonCount > 0 ? "warning" : "default"}
        />
        <MetricCard
          title="Monthly Revenue"
          value={`$${metrics.monthlyRevenue.toLocaleString()}`}
          icon={RefreshCw}
          trend={{ value: 12, isPositive: true }}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-4">
            <select
              className="px-3 py-2 border rounded-lg"
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
            >
              <option value="">All Plans</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
            </select>
            <select
              className="px-3 py-2 border rounded-lg"
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
            >
              <option value="">All Payment Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredSubscriptions}
          emptyMessage="No subscriptions found"
        />
      </div>
    </div>
  );
}
