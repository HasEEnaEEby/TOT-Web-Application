import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, Users, Coffee } from 'lucide-react';

interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  position: { x: number; y: number };
}

export default function TableManagement() {
  const [tables, setTables] = useState<Table[]>([
    { id: '1', number: 1, capacity: 4, status: 'available', position: { x: 0, y: 0 } },
    { id: '2', number: 2, capacity: 2, status: 'occupied', position: { x: 1, y: 0 } },
    { id: '3', number: 3, capacity: 6, status: 'reserved', position: { x: 2, y: 0 } },
  ]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [newTable, setNewTable] = useState<Omit<Table, 'id' | 'position'>>({
    number: tables.length + 1,
    capacity: 4,
    status: 'available',
  });

  const handleAddTable = () => {
    const table: Table = {
      id: Date.now().toString(),
      ...newTable,
      position: { x: tables.length % 3, y: Math.floor(tables.length / 3) },
    };
    setTables([...tables, table]);
    setIsAddModalOpen(false);
    setNewTable({ number: tables.length + 2, capacity: 4, status: 'available' });
  };

  const handleEditTable = (table: Table) => {
    const updatedTables = tables.map((t) => (t.id === table.id ? table : t));
    setTables(updatedTables);
    setEditingTable(null);
  };

  const handleDeleteTable = (tableId: string) => {
    setTables(tables.filter((t) => t.id !== tableId));
  };

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'occupied':
        return 'bg-primary-100 text-primary-800 border border-primary-200';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm">
        <div>
          <h3 className="text-2xl font-display font-semibold text-secondary-900">Your Dining Canvas</h3>
          <p className="text-secondary-600 mt-1">Design the perfect space for your guests</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 hover:shadow-lg hover-pulse"
          >
            <Plus className="w-5 h-5 mr-2" />
            Set New Table
          </button>
          <button className="flex items-center px-4 py-2 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-all duration-200 hover:border-secondary-300">
            <Save className="w-5 h-5 mr-2 text-secondary-600" />
            Save Layout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-600">Ready to Serve</p>
              <p className="text-3xl font-display font-semibold text-green-600 mt-1">
                {tables.filter(t => t.status === 'available').length}
              </p>
              <p className="text-sm text-secondary-500 mt-1">Tables awaiting guests</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Coffee className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-600">Total Capacity</p>
              <p className="text-3xl font-display font-semibold text-primary-600 mt-1">
                {tables.reduce((sum, table) => sum + table.capacity, 0)}
              </p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-600">Reserved Tables</p>
              <p className="text-3xl font-display font-semibold text-yellow-600 mt-1">
                {tables.filter(t => t.status === 'reserved').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Coffee className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Floor Plan */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="grid grid-cols-3 gap-6">
          {tables.map((table) => (
            <div
              key={table.id}
              className="relative p-6 border-2 border-secondary-200 rounded-xl hover:border-primary-500 transition-all duration-200 hover:shadow-lg bg-white animate-fade-in hover-pulse"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-display font-semibold text-secondary-900">
                  Table {table.number}
                </span>
                <span className={`px-3 py-1.5 text-sm rounded-full ${getStatusColor(table.status)}`}>
                  {table.status}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-secondary-600">
                  <Users className="w-5 h-5 mr-2" />
                  <span>Capacity: {table.capacity} people</span>
                </div>
                <div className="flex space-x-2 pt-4">
                  <button
                    onClick={() => setEditingTable(table)}
                    className="flex items-center px-4 py-2 text-sm bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors flex-1"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTable(table.id)}
                    className="flex items-center px-4 py-2 text-sm bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Table Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-[32rem] animate-fade-in">
            <h4 className="text-2xl font-display font-semibold text-secondary-900 mb-6">
              Let's Set Up a New Table
            </h4>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Table Number
                </label>
                <input
                  type="number"
                  value={newTable.number}
                  onChange={(e) => setNewTable({ ...newTable, number: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Capacity
                </label>
                <input
                  type="number"
                  value={newTable.capacity}
                  onChange={(e) => setNewTable({ ...newTable, capacity: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Status
                </label>
                <select
                  value={newTable.status}
                  onChange={(e) => setNewTable({ ...newTable, status: e.target.value as Table['status'] })}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="available">Ready for Guests</option>
                  <option value="occupied">Currently Dining</option>
                  <option value="reserved">Reserved</option>
                </select>
              </div>
            </div>
            <div className="mt-8 flex justify-end space-x-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-6 py-3 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-all duration-200 text-secondary-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTable}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 hover:shadow-lg"
              >
                Add Table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Table Modal */}
      {editingTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-[32rem] animate-fade-in">
            <h4 className="text-2xl font-display font-semibold text-secondary-900 mb-6">
              Edit Table {editingTable.number}
            </h4>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Table Number
                </label>
                <input
                  type="number"
                  value={editingTable.number}
                  onChange={(e) =>
                    setEditingTable({ ...editingTable, number: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Capacity
                </label>
                <input
                  type="number"
                  value={editingTable.capacity}
                  onChange={(e) =>
                    setEditingTable({ ...editingTable, capacity: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Status
                </label>
                <select
                  value={editingTable.status}
                  onChange={(e) =>
                    setEditingTable({
                      ...editingTable,
                      status: e.target.value as Table['status'],
                    })
                  }
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="available">Ready for Guests</option>
                  <option value="occupied">Currently Dining</option>
                  <option value="reserved">Reserved</option>
                </select>
              </div>
            </div>
            <div className="mt-8 flex justify-end space-x-3">
              <button
                onClick={() => setEditingTable(null)}
                className="px-6 py-3 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-all duration-200 text-secondary-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleEditTable(editingTable)}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 hover:shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}