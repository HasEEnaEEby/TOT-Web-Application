import { Camera, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useMenu } from "../../hooks/use-Menu";
import api from "../../services/api";
import {
  Allergen,
  Category,
  CreateMenuItemData,
  MenuItem,
  NutritionalInfo,
  SpicyLevel,
} from "../../types/menuTypes";

const CATEGORIES: Category[] = [
  "appetizer",
  "main course",
  "dessert",
  "beverage",
  "special",
];

const SPICY_LEVELS: SpicyLevel[] = ["mild", "medium", "hot", "extra hot"];

const ALLERGENS: Allergen[] = [
  "nuts",
  "dairy",
  "gluten",
  "soy",
  "shellfish",
  "eggs",
];

const initialFormState: CreateMenuItemData = {
  name: "",
  description: "",
  price: 0,
  category: "main course",
  isVegetarian: false,
  isAvailable: true,
  spicyLevel: "medium",
  preparationTime: 15,
  allergens: [],
  nutritionalInfo: {
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fats: 0,
  },
};

interface MenuFormProps {
  editItem?: MenuItem;
  onSuccess?: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const MenuForm: React.FC<MenuFormProps> = ({
  editItem,
  onSuccess,
  onCancel,
}) => {
  useMenu();
  const [formData, setFormData] = useState<CreateMenuItemData>(
    editItem
      ? {
          ...editItem,
          image: undefined,
          nutritionalInfo:
            editItem.nutritionalInfo || initialFormState.nutritionalInfo,
        }
      : initialFormState
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    editItem?.image || ""
  );
  const [localSubmitting, setLocalSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checkbox.checked }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "price" ? parseFloat(value) : parseInt(value, 10),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNutritionalInfoChange = (
    key: keyof NutritionalInfo,
    value: string
  ) => {
    setFormData((prev) => {
      const updatedNutritionalInfo: NutritionalInfo = {
        calories: prev.nutritionalInfo?.calories ?? 0,
        protein: prev.nutritionalInfo?.protein ?? 0,
        carbohydrates: prev.nutritionalInfo?.carbohydrates ?? 0,
        fats: prev.nutritionalInfo?.fats ?? 0,
        [key]: parseFloat(value) || 0,
      };
      return {
        ...prev,
        nutritionalInfo: updatedNutritionalInfo,
      };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalSubmitting(true);

    try {
      const formDataObj = new FormData();

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "image") {
          if (typeof value === "object") {
            formDataObj.append(key, JSON.stringify(value));
          } else {
            formDataObj.append(key, String(value));
          }
        }
      });

      // Add image if exists
      if (imageFile) {
        formDataObj.append("image", imageFile);
      }

      if (editItem) {
        await api.putForm(`/restaurants/menu/${editItem._id}`, formDataObj);
      } else {
        await api.postForm("/restaurants/menu", formDataObj);
      }

      toast.success(
        `Menu item ${editItem ? "updated" : "created"} successfully`
      );
      onSuccess?.();
      onCancel();
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${editItem ? "update" : "create"} menu item`
      );
    } finally {
      setLocalSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {editItem ? "Edit Menu Item" : "Create New Menu Item"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image
              </label>
              <div className="mt-1 border-2 border-dashed rounded-lg p-6 text-center">
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-40 mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview("");
                        setImageFile(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Camera className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <label className="cursor-pointer text-primary-600">
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Spicy Level
              </label>
              <select
                name="spicyLevel"
                value={formData.spicyLevel}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                {SPICY_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preparation Time (mins)
              </label>
              <input
                type="number"
                name="preparationTime"
                value={formData.preparationTime}
                onChange={handleInputChange}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex space-x-4 items-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isVegetarian"
              checked={formData.isVegetarian}
              onChange={handleInputChange}
              className="mr-2"
            />
            Vegetarian
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleInputChange}
              className="mr-2"
            />
            Available
          </label>
        </div>

        {/* Allergens */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Allergens
          </label>
          <div className="flex flex-wrap gap-2">
            {ALLERGENS.map((allergen) => (
              <button
                key={allergen}
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    allergens: prev.allergens.includes(allergen)
                      ? prev.allergens.filter((a) => a !== allergen)
                      : [...prev.allergens, allergen],
                  }));
                }}
                className={`px-3 py-1 rounded-full text-sm 
                  ${
                    formData.allergens.includes(allergen)
                      ? "bg-primary-600 text-white"
                      : "bg-gray-200"
                  }`}
              >
                {allergen}
              </button>
            ))}
          </div>
        </div>

        {/* Nutritional Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nutritional Information
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(formData.nutritionalInfo || {}).map(
              ([key, value]) => (
                <div key={key}>
                  <label className="block text-xs text-gray-600">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    {key !== "calories" && " (g)"}
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      handleNutritionalInfoChange(
                        key as keyof NutritionalInfo,
                        e.target.value
                      )
                    }
                    min="0"
                    step="0.1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
              )
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            disabled={localSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={localSubmitting}
            className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm 
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {localSubmitting
              ? editItem
                ? "Updating..."
                : "Creating..."
              : editItem
              ? "Update Item"
              : "Create Item"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MenuForm;
