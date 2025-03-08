import { Edit, Plus, QrCode, Trash2, Users } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import tableApi from "../../api/tableApi";
import restaurantTableImage from "../../assets/images/restauranttable.png";
import { TableData } from "../../types/tableTypes";
import QRCodeModal from "./QRCodeModel";

const TABLE_STATUS = {
  available: {
    label: "Available",
    color: "bg-green-500",
    dotColor: "bg-green-500",
  },
  reserved: {
    label: "Reserved",
    color: "bg-yellow-500",
    dotColor: "bg-yellow-500",
  },
  occupied: {
    label: "Occupied",
    color: "bg-red-500",
    dotColor: "bg-red-500",
  },
  unavailable: {
    label: "Unavailable",
    color: "bg-gray-400",
    dotColor: "bg-gray-400",
  },
} as const;

interface TableManagementState {
  tables: TableData[];
  loading: boolean;
  editingTable: TableData | null;
  confirmDeleteId: string | null;
  bulkTableCount: number;
  isBulkAddMode: boolean;
  statusFilter: keyof typeof TABLE_STATUS | "all";
  qrCodeTable: TableData | null;
}

const initialState: TableManagementState = {
  tables: [],
  loading: true,
  editingTable: null,
  confirmDeleteId: null,
  bulkTableCount: 1,
  isBulkAddMode: false,
  statusFilter: "all",
  qrCodeTable: null,
};

export default function TableManagement() {
  const [state, setState] = useState<TableManagementState>(initialState);
  const fetchInProgress = useRef(false);

  const fetchTables = useCallback(async () => {
    if (fetchInProgress.current) return;

    try {
      fetchInProgress.current = true;
      setState((prev) => ({ ...prev, loading: true }));

      const fetchedTables = await tableApi.getAllTables();
      const sortedTables = fetchedTables.sort((a, b) => a.number - b.number);

      setState((prev) => ({
        ...prev,
        tables: sortedTables,
        loading: false,
      }));
    } catch (error) {
      console.error("Error fetching tables:", error);
      toast.error("Failed to load tables");
      setState((prev) => ({ ...prev, loading: false }));
    } finally {
      fetchInProgress.current = false;
    }
  }, []);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const handleBulkAdd = async () => {
    try {
      const existingNumbers = state.tables.map((t) => t.number);
      const startingNumber = Math.max(0, ...existingNumbers) + 1;

      const newTables = await Promise.all(
        Array.from({ length: state.bulkTableCount }, (_, index) => {
          const tableData = {
            number: startingNumber + index,
            capacity: 4,
            position: {
              x: state.tables.length + index,
              y: Math.floor((state.tables.length + index) / 4),
            },
          };
          return tableApi.createTable(tableData);
        })
      );

      setState((prev) => ({
        ...prev,
        tables: [...prev.tables, ...newTables],
        isBulkAddMode: false,
        bulkTableCount: 1,
      }));

      toast.success(`${state.bulkTableCount} tables added successfully`);
    } catch (error) {
      console.error("Error adding tables:", error);
      toast.error("Failed to add tables");
    }
  };

  const handleUpdateTable = async () => {
    if (!state.editingTable) return;

    try {
      const tableId = state.editingTable._id || state.editingTable.id || "";
      const updatedTable = await tableApi.updateTable(tableId, {
        number: state.editingTable.number,
        capacity: state.editingTable.capacity,
        status: state.editingTable.status,
      });

      setState((prev) => ({
        ...prev,
        tables: prev.tables.map((t) =>
          (t._id || t.id) === tableId ? updatedTable : t
        ),
        editingTable: null,
      }));

      toast.success("Table updated successfully");
    } catch (error) {
      console.error("Error updating table:", error);
      toast.error("Failed to update table");
    }
  };

  const handleDeleteTable = async (tableId: string) => {
    try {
      await tableApi.deleteTable(tableId);
      setState((prev) => ({
        ...prev,
        tables: prev.tables.filter((t) => (t._id || t.id) !== tableId),
        confirmDeleteId: null,
      }));
      toast.success("Table deleted successfully");
    } catch (error) {
      console.error("Error deleting table:", error);
      toast.error("Failed to delete table");
    }
  };

  const handleStatusChange = async (
    tableId: string,
    newStatus: keyof typeof TABLE_STATUS
  ) => {
    try {
      const updatedTable = await tableApi.updateTableStatus(tableId, newStatus);
      setState((prev) => ({
        ...prev,
        tables: prev.tables.map((t) =>
          (t._id || t.id) === tableId ? updatedTable : t
        ),
      }));
      toast.success(`Table status updated to ${TABLE_STATUS[newStatus].label}`);
    } catch (error) {
      console.error("Error updating table status:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update table status"
      );
    }
  };

  const renderTableCard = (table: TableData) => {
    const status = (table.status as keyof typeof TABLE_STATUS) || "available";

    return (
      <div key={table._id || table.id} className="relative">
        <div className="w-full bg-white rounded-xl shadow-sm hover:shadow transition-shadow duration-200 group">
          {/* Status Indicator */}
          <div className="absolute -top-1 -left-1 z-10">
            <div
              className={`w-3 h-3 rounded-full ${TABLE_STATUS[status].dotColor} ring-2 ring-white`}
            />
          </div>

          {/* Table Number */}
          <div className="absolute -top-1 -right-1 z-10">
            <div className="bg-red-600 text-white text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center ring-2 ring-white">
              {table.number}
            </div>
          </div>

          <div className="p-4">
            <div className="relative mb-2 flex justify-center">
              <img
                src={restaurantTableImage}
                alt={`Table ${table.number}`}
                className="w-24 h-24 object-contain"
              />
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="text-sm">{table.capacity} Seats</span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {TABLE_STATUS[status].label}
              </span>
            </div>

            {/* Hover Actions */}
            <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-xl">
              <div className="flex flex-col gap-3">
                <div className="flex justify-center gap-2">
                  {Object.entries(TABLE_STATUS).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() =>
                        handleStatusChange(
                          table._id || table.id || "",
                          key as keyof typeof TABLE_STATUS
                        )
                      }
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                        ${
                          status === key
                            ? value.color + " text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      title={value.label}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          status === key ? "bg-white" : value.dotColor
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setState((prev) => ({ ...prev, qrCodeTable: table }))
                    }
                    className="inline-flex items-center px-3 py-1 bg-green-50 text-green-600 rounded-md hover:bg-green-100"
                  >
                    <QrCode className="w-4 h-4 mr-1" />
                    QR Code
                  </button>
                  <button
                    onClick={() =>
                      setState((prev) => ({ ...prev, editingTable: table }))
                    }
                    className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        confirmDeleteId: table._id || table.id || "",
                      }))
                    }
                    className="inline-flex items-center px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const filteredTables = state.tables.filter((table) =>
    state.statusFilter === "all" ? true : table.status === state.statusFilter
  );

  if (state.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Table Management</h2>

          {/* Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() =>
                setState((prev) => ({ ...prev, statusFilter: "all" }))
              }
              className={`px-3 py-1.5 rounded-full text-sm transition-colors
                ${
                  state.statusFilter === "all"
                    ? "bg-gray-200 text-gray-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              All
            </button>
            {Object.entries(TABLE_STATUS).map(([key, value]) => (
              <button
                key={key}
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    statusFilter:
                      prev.statusFilter === key
                        ? "all"
                        : (key as keyof typeof TABLE_STATUS),
                  }))
                }
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors
                  ${
                    state.statusFilter === key
                      ? value.color + " text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    state.statusFilter === key ? "bg-white" : value.dotColor
                  }`}
                />
                {value.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setState((prev) => ({ ...prev, isBulkAddMode: true }))}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors self-start"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Tables
        </button>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {filteredTables.map(renderTableCard)}
      </div>

      {/* Empty State */}
      {filteredTables.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {state.tables.length === 0
              ? "No tables added yet. Click 'Add Tables' to get started."
              : "No tables match the selected filter."}
          </p>
        </div>
      )}

      {/* Add Tables Modal */}
      {state.isBulkAddMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-[90vw]">
            <h3 className="text-xl font-semibold mb-6">Add New Tables</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Tables
                </label>
                <input
                  type="number"
                  min="1"
                  value={state.bulkTableCount}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      bulkTableCount: Math.max(
                        1,
                        parseInt(e.target.value) || 1
                      ),
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Default capacity will be 4 seats per table
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    isBulkAddMode: false,
                    bulkTableCount: 1,
                  }))
                }
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkAdd}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Add Tables
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Table Modal */}
      {state.editingTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-[90vw]">
            <h3 className="text-xl font-semibold mb-6">
              Edit Table {state.editingTable.number}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Table Number
                </label>
                <input
                  type="number"
                  min="1"
                  value={state.editingTable.number}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      editingTable: {
                        ...prev.editingTable!,
                        number: parseInt(e.target.value),
                      },
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  min="1"
                  value={state.editingTable.capacity}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      editingTable: {
                        ...prev.editingTable!,
                        capacity: parseInt(e.target.value),
                      },
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={state.editingTable.status || "available"}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      editingTable: {
                        ...prev.editingTable!,
                        status: e.target.value as keyof typeof TABLE_STATUS,
                      },
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  {Object.entries(TABLE_STATUS).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() =>
                  setState((prev) => ({ ...prev, editingTable: null }))
                }
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTable}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {state.confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-[90vw]">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this table? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setState((prev) => ({ ...prev, confirmDeleteId: null }))
                }
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTable(state.confirmDeleteId!)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {state.qrCodeTable && (
        <QRCodeModal
          table={state.qrCodeTable}
          onClose={() => setState((prev) => ({ ...prev, qrCodeTable: null }))}
        />
      )}

      {/* Status Legend - Mobile Only */}
      <div className="mt-8 p-4 bg-white rounded-lg shadow-sm sm:hidden">
        <h4 className="font-medium mb-3">Table Status Guide</h4>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(TABLE_STATUS).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${value.dotColor}`} />
              <span className="text-sm text-gray-600">{value.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table Count Summary */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-600">Total Tables</span>
            <span className="text-2xl font-semibold">
              {state.tables.length}
            </span>
          </div>
          {Object.entries(TABLE_STATUS).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <span className="text-sm text-gray-600">{value.label}</span>
              <span className="text-2xl font-semibold">
                {state.tables.filter((t) => t.status === key).length}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
