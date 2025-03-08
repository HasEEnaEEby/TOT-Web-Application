import { Edit, Plus, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useMenu } from "../../hooks/use-Menu";
import { MenuItem } from "../../types/menuTypes";
import MenuFormModal from "./MenuFormModal";

const MenuList: React.FC = () => {
  const { menuItems, deleteMenuItem, toggleAvailability } = useMenu();
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      try {
        await deleteMenuItem(id);
        toast.success("Menu item deleted successfully");
      } catch (error) {
        toast.error("Failed to delete menu item");
      }
    }
  };

  const handleToggleAvailability = async (id: string) => {
    try {
      await toggleAvailability(id);
    } catch (error) {
      toast.error("Failed to toggle availability");
    }
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Menu</h1>

      <MenuFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        editItem={editingItem}
        isSubmitting={isSubmitting}
        onSuccess={() => {
          setIsSubmitting(false);
          handleModalClose();
        }}
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-xl"
          >
            {item.image && (
              <div className="relative h-48">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-4">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    item.isAvailable
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>

              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {item.description}
              </p>

              <div className="mt-4 flex justify-between items-center">
                <span className="text-primary-600 font-bold">
                  {item.formattedPrice || `₹${item.price.toFixed(2)}`}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleAvailability(item._id)}
                    className="text-gray-500 hover:text-primary-600"
                    title="Toggle Availability"
                  >
                    {item.isAvailable ? <ToggleRight /> : <ToggleLeft />}
                  </button>

                  <button
                    onClick={() => openEditModal(item)}
                    className="text-gray-500 hover:text-primary-600"
                    title="Edit Item"
                  >
                    <Edit />
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete Item"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Item Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={openCreateModal}
          className="bg-primary-600 text-white rounded-full p-4 shadow-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
        >
          <Plus className="w-6 h-6 mr-2" /> Add Menu Item
        </button>
      </div>
    </div>
  );
};

export default MenuList;
