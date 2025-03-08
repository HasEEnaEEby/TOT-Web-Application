import { Download, RefreshCw, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import tableApi from "../../api/tableApi";
import { QRCodeResponse, TableData } from "../../types/tableTypes";

interface QRCodeModalProps {
  table: TableData;
  onClose: () => void;
}

export default function QRCodeModal({ table, onClose }: QRCodeModalProps) {
  const [qrData, setQrData] = useState<QRCodeResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Use useCallback to memoize the generateQRCode function
  const generateQRCode = useCallback(async () => {
    try {
      setLoading(true);
      const tableId = table._id || table.id || "";
      if (!tableId) {
        toast.error("Invalid table ID");
        return;
      }

      const data = await tableApi.generateQRCode(tableId, "dataurl");
      setQrData(data);
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Failed to generate QR code");
    } finally {
      setLoading(false);
    }
  }, [table]);

  useEffect(() => {
    generateQRCode();
  }, [generateQRCode]);

  const handleRefreshQR = async () => {
    try {
      setRefreshing(true);
      const tableId = table._id || table.id || "";
      if (!tableId) {
        toast.error("Invalid table ID");
        return;
      }

      await tableApi.refreshQRCode(tableId);
      await generateQRCode();
      toast.success("QR code refreshed successfully");
    } catch (error) {
      console.error("Error refreshing QR code:", error);
      toast.error("Failed to refresh QR code");
    } finally {
      setRefreshing(false);
    }
  };
  const handleDownloadQR = async () => {
    try {
      const tableId = table._id || table.id || "";
      if (!tableId || !qrData?.dataURL) {
        toast.error("QR code not available");
        return;
      }

      // Create a link element
      const link = document.createElement("a");
      link.href = qrData.dataURL;
      link.download = `table_${table.number}_qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast.error("Failed to download QR code");
    }
  };

  const formatExpiryDate = (dateString?: string) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-w-[90vw]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            Table {table.number} QR Code
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
          ) : qrData?.dataURL ? (
            <div className="flex flex-col items-center">
              <img
                src={qrData.dataURL}
                alt={`QR Code for Table ${table.number}`}
                className="w-48 h-48 object-contain border p-2 bg-white"
              />
              {qrData.expiresAt && (
                <p className="text-sm text-gray-500 mt-2">
                  Expires: {formatExpiryDate(qrData.expiresAt)}
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No QR code available</p>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Customers can scan this QR code to validate their presence at this
          table before placing orders.
        </p>

        <div className="flex justify-between gap-2">
          <button
            onClick={handleRefreshQR}
            disabled={refreshing}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {refreshing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh QR
              </>
            )}
          </button>
          <button
            onClick={handleDownloadQR}
            disabled={!qrData?.dataURL}
            className="flex items-center px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
