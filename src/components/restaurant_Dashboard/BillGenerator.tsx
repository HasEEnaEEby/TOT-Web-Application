import { Download, Printer, Share } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import orderApi, { Bill as ApiBill } from "../../api/orderApi";

// Define custom error type since we can't import AxiosError
interface CustomError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
}

// Align the local Bill interface with the API Bill interface
export interface Bill extends ApiBill {
  restaurant: {
    _id: string;
    name: string;
    logo?: string;
    address: string;
    contactNumber: string;
    bankQRCode?: string;
  };
}

// Enhanced BillGenerator Component
const BillGenerator: React.FC<{
  orderId: string;
  onClose?: () => void;
  onBillGenerated?: (bill: Bill) => void;
}> = ({ orderId, onClose, onBillGenerated }) => {
  // State Management
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Fetch Bill Method with useCallback to resolve dependency warning
  const fetchBill = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const billData = await orderApi.getBillForOrder(orderId);

      if (billData) {
        // Transform the bill to match our local interface
        const transformedBill: Bill = {
          ...billData,
          restaurant: {
            ...billData.restaurant,
            logo: undefined, // Add logo if needed
            contactNumber: "", // You might want to add this in your API
          },
        };

        setBill(transformedBill);
        onBillGenerated?.(transformedBill);
      } else {
        setError("No bill found. Click below to generate.");
      }
    } catch (err) {
      const error = err as CustomError;
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Could not load the bill. Please try again.";

      console.error("Bill Fetch Error:", error);
      setError(errorMessage);

      // Contextual Error Toasts
      if (error.response?.status === 404) {
        toast.error("Bill not found. You may need to generate it.");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please contact support.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [orderId, onBillGenerated]);

  // Generate Bill Method
  const generateBill = async () => {
    if (isGenerating) return;

    try {
      setIsGenerating(true);
      setError(null);

      const generatedBill = await orderApi.generateBillForOrder(orderId);

      if (generatedBill) {
        // Transform the bill to match our local interface
        const transformedBill: Bill = {
          ...generatedBill,
          restaurant: {
            ...generatedBill.restaurant,
            logo: undefined, // Add logo if needed
            contactNumber: "", // You might want to add this in your API
          },
        };

        setBill(transformedBill);
        onBillGenerated?.(transformedBill);
        toast.success("Bill generated successfully");
      } else {
        throw new Error("No bill data returned");
      }
    } catch (err) {
      const error = err as CustomError;
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Could not generate bill. Please try again.";

      console.error("Bill Generation Error:", error);
      setError(errorMessage);

      // Detailed Error Handling
      if (error.response?.status === 404) {
        toast.error("Order not found. Please check the order details.");
      } else if (error.response?.status === 500) {
        toast.error("Server error generating bill. Please contact support.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Initial Bill Fetch
  useEffect(() => {
    fetchBill();
  }, [fetchBill]);

  // Print Bill Method
  const handlePrint = () => {
    window.print();
  };

  // Download Bill Method
  const handleDownload = async () => {
    if (!bill?._id || isDownloading) return;

    try {
      setIsDownloading(true);
      await orderApi.downloadBill(bill._id);
      toast.success("Bill downloaded successfully");
    } catch (error) {
      console.error("Failed to download bill:", error);
      toast.error("Failed to download bill");
    } finally {
      setIsDownloading(false);
    }
  };

  // Share Bill (Placeholder)
  const handleShare = () => {
    toast.success("Bill sharing feature coming soon");
  };

  // Render Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Render Generating State
  if (isGenerating) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600">Generating bill...</p>
      </div>
    );
  }

  // Render Error State
  if (error && !bill) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        <p>{error}</p>
        <div className="flex space-x-4 mt-4">
          <button
            onClick={generateBill}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Generate Bill
          </button>
          <button
            onClick={fetchBill}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No Bill Found State
  if (!bill) {
    return (
      <div className="bg-yellow-50 text-yellow-600 p-4 rounded-lg">
        <p>No bill available for this order yet.</p>
        <button
          onClick={generateBill}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Generate Bill
        </button>
      </div>
    );
  }

  // Bill Rendering
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg print:shadow-none">
      {/* Restaurant Header */}
      <div className="text-center mb-6">
        {bill.restaurant.logo && (
          <img
            src={bill.restaurant.logo}
            alt="Restaurant Logo"
            className="h-16 mx-auto mb-2"
          />
        )}
        <h1 className="text-2xl font-bold">{bill.restaurant.name}</h1>
        <p className="text-gray-600">{bill.restaurant.address}</p>
        <p className="text-gray-600">
          {bill.restaurant.contactNumber || "N/A"}
        </p>
      </div>

      {/* Bill Details */}
      <div className="flex justify-between mb-6">
        <div>
          <p className="font-semibold">Bill No: {bill.billNumber}</p>
          <p>Date: {new Date(bill.createdAt).toLocaleDateString()}</p>
          <p>Time: {new Date(bill.createdAt).toLocaleTimeString()}</p>
        </div>
        <div className="text-right">
          <p>Table: {bill.table.tableNumber}</p>
          <p>Order ID: #{orderId.substring(0, 8)}</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Item</th>
              <th className="border p-2 text-right">Quantity</th>
              <th className="border p-2 text-right">Price</th>
              <th className="border p-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((item, index) => (
              <tr key={index}>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2 text-right">{item.quantity}</td>
                <td className="border p-2 text-right">
                  ₹{item.price.toFixed(2)}
                </td>
                <td className="border p-2 text-right">
                  ₹{item.subtotal.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bill Totals */}
      <div className="text-right mb-6">
        <p>Subtotal: ₹{bill.subtotal.toFixed(2)}</p>
        <p>Tax (13%): ₹{bill.tax.toFixed(2)}</p>
        <p>Service Charge (10%): ₹{bill.serviceCharge.toFixed(2)}</p>
        {bill.discount > 0 && (
          <p className="text-green-600">
            Discount: ₹{bill.discount.toFixed(2)}
          </p>
        )}
        <p className="font-bold text-xl mt-2">
          Total: ₹{bill.totalAmount.toFixed(2)}
        </p>
      </div>

      {/* Payment Status */}
      <div className="text-center mb-6">
        <p
          className={`font-semibold ${
            bill.paymentStatus === "paid"
              ? "text-green-600"
              : bill.paymentStatus === "failed"
              ? "text-red-600"
              : "text-yellow-600"
          }`}
        >
          Payment Status: {bill.paymentStatus?.toUpperCase() || "PENDING"}
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-center space-x-4 mt-6 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Printer className="w-4 h-4 mr-2" /> Print
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" /> Download
        </button>
        <button
          onClick={handleShare}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Share className="w-4 h-4 mr-2" /> Share
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default BillGenerator;
