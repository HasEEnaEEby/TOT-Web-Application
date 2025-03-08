// import {
//   Camera,
//   Clock,
//   Edit2,
//   Eye,
//   EyeOff,
//   Plus,
//   Search,
//   Trash2,
//   X,
// } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { toast } from "react-hot-toast";
// import { useMenu } from "../../hooks/use-Menu";
// import type {
//   Allergen,
//   Category,
//   CreateMenuItemData,
//   MenuItem,
//   SpicyLevel,
// } from "../../types/menuTypes";

// const CATEGORIES: Category[] = [
//   "appetizer",
//   "main course",
//   "dessert",
//   "beverage",
//   "special",
// ];

// const SPICY_LEVELS: SpicyLevel[] = ["mild", "medium", "hot"];
// const ALLERGENS: Allergen[] = [
//   "nuts",
//   "dairy",
//   "gluten",
//   "soy",
//   "shellfish",
//   "eggs",
// ];

// const initialMenuItemState: CreateMenuItemData = {
//   name: "",
//   description: "",
//   price: 0,
//   category: "main course",
//   isAvailable: true,
//   isVegetarian: false,
//   spicyLevel: "medium",
//   preparationTime: 0,
//   allergens: [],
//   nutritionalInfo: {
//     calories: 0,
//     protein: 0,
//     carbohydrates: 0,
//     fats: 0,
//   },
// };

// export default function MenuManagement() {
//   const {
//     menuItems,
//     loading,
//     error,
//     fetchMenuItems,
//     createMenuItem,
//     updateMenuItem,
//     deleteMenuItem,
//     toggleAvailability,
//   } = useMenu();

//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [activeFilters, setActiveFilters] = useState<string[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentStep, setCurrentStep] = useState(1);
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [newItem, setNewItem] =
//     useState<CreateMenuItemData>(initialMenuItemState);
//   const [editingItemId, setEditingItemId] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     fetchMenuItems();
//   }, [fetchMenuItems]);

//   const handleFieldChange = (
//     field: keyof CreateMenuItemData,
//     value: string | number | boolean
//   ) => {
//     setNewItem((prev) => {
//       const updated = { ...prev } as CreateMenuItemData;
//       if (field === "price" || field === "preparationTime") {
//         (updated[field] as number) = Number(value) || 0;
//       } else if (field === "isVegetarian" || field === "isAvailable") {
//         (updated[field] as boolean) = Boolean(value);
//       } else if (field === "allergens") {
//         (updated[field] as Allergen[]) = [];
//       } else if (field === "nutritionalInfo") {
//         (updated[field] as typeof initialMenuItemState.nutritionalInfo) = {
//           ...initialMenuItemState.nutritionalInfo,
//         };
//       } else {
//         (updated[field] as string) = String(value);
//       }
//       return updated;
//     });
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("Image size must be less than 5MB");
//         return;
//       }
//       if (!file.type.startsWith("image/")) {
//         toast.error("Please upload an image file");
//         return;
//       }
//       setSelectedImage(file);
//     }
//   };

//   const resetForm = () => {
//     setNewItem(initialMenuItemState);
//     setSelectedImage(null);
//     setCurrentStep(1);
//     setIsAddModalOpen(false);
//     setEditingItemId(null);
//     setIsSubmitting(false);
//   };

//   const validateForm = () => {
//     const errors = [];

//     if (!newItem.name?.trim()) errors.push("Name is required");
//     if (!newItem.description?.trim()) errors.push("Description is required");
//     if (!newItem.category) errors.push("Category is required");
//     if (!newItem.price || newItem.price <= 0) {
//       errors.push("Price must be greater than 0");
//     }

//     if (errors.length > 0) {
//       errors.forEach((error) => toast.error(error));
//       return false;
//     }

//     return true;
//   };

//   const createFormData = (): FormData => {
//     const formData = new FormData();

//     // Basic fields with validation
//     const name = String(newItem.name).trim();
//     const description = String(newItem.description).trim();
//     const price = Number(newItem.price);
//     const category = String(newItem.category);

//     if (!name || !description || !price || !category) {
//       throw new Error("Required fields are missing");
//     }

//     // Append basic fields
//     formData.append("name", name);
//     formData.append("description", description);
//     formData.append("price", price.toString());
//     formData.append("category", category);

//     // Boolean fields
//     formData.append("isVegetarian", String(Boolean(newItem.isVegetarian)));
//     formData.append("isAvailable", String(Boolean(newItem.isAvailable)));

//     // Optional fields
//     if (newItem.spicyLevel) {
//       formData.append("spicyLevel", newItem.spicyLevel);
//     }

//     if (newItem.preparationTime) {
//       formData.append("preparationTime", String(newItem.preparationTime));
//     }

//     // Arrays and objects
//     if (newItem.allergens?.length) {
//       newItem.allergens.forEach((allergen) => {
//         formData.append("allergens[]", allergen);
//       });
//     }

//     if (newItem.nutritionalInfo) {
//       formData.append(
//         "nutritionalInfo",
//         JSON.stringify({
//           calories: Number(newItem.nutritionalInfo.calories) || 0,
//           protein: Number(newItem.nutritionalInfo.protein) || 0,
//           carbohydrates: Number(newItem.nutritionalInfo.carbohydrates) || 0,
//           fats: Number(newItem.nutritionalInfo.fats) || 0,
//         })
//       );
//     }

//     // Image
//     if (selectedImage instanceof File) {
//       formData.append("image", selectedImage);
//     }

//     // Debug logs
//     console.log("FormData contents:", Object.fromEntries(formData.entries()));

//     return formData;
//   };

//   const handleSubmit = async () => {
//     if (currentStep < 3) {
//       setCurrentStep(currentStep + 1);
//       return;
//     }

//     if (!validateForm()) {
//       return;
//     }

//     try {
//       setIsSubmitting(true);

//       const formData = createFormData();

//       if (editingItemId) {
//         await updateMenuItem(editingItemId, formData);
//         toast.success("Menu item updated successfully");
//       } else {
//         await createMenuItem(formData);
//         toast.success("Menu item created successfully");
//       }

//       resetForm();
//       await fetchMenuItems();
//     } catch (error) {
//       console.error("Form submission error:", error);
//       const message =
//         error instanceof Error ? error.message : "Failed to save menu item";
//       toast.error(message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleStartEdit = (item: MenuItem) => {
//     setNewItem({
//       name: item.name,
//       description: item.description,
//       price: item.price,
//       category: item.category,
//       isAvailable: item.isAvailable,
//       isVegetarian: item.isVegetarian,
//       spicyLevel: item.spicyLevel,
//       preparationTime: item.preparationTime,
//       allergens: item.allergens,
//       nutritionalInfo: item.nutritionalInfo,
//     });
//     setEditingItemId(item._id);
//     setIsAddModalOpen(true);
//   };

//   const handleDelete = async (itemId: string) => {
//     if (!window.confirm("Are you sure you want to delete this item?")) {
//       return;
//     }

//     try {
//       setIsSubmitting(true);
//       await deleteMenuItem(itemId);
//       await fetchMenuItems();
//       toast.success("Item deleted successfully");
//     } catch (error) {
//       toast.error(
//         error instanceof Error ? error.message : "Failed to delete item"
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleToggleAvailability = async (itemId: string) => {
//     try {
//       setIsSubmitting(true);
//       await toggleAvailability(itemId);
//       await fetchMenuItems();
//     } catch (error) {
//       toast.error(
//         error instanceof Error ? error.message : "Failed to update availability"
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const filteredItems = menuItems.filter((item) => {
//     const searchTerm = searchQuery.toLowerCase();
//     const matchesSearch =
//       item.name.toLowerCase().includes(searchTerm) ||
//       item.description.toLowerCase().includes(searchTerm);

//     const matchesFilters =
//       activeFilters.length === 0 ||
//       activeFilters.includes(item.category) ||
//       (item.isVegetarian && activeFilters.includes("vegetarian")) ||
//       (item.spicyLevel && activeFilters.includes(item.spicyLevel));

//     return matchesSearch && matchesFilters;
//   });

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[200px]">
//         <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center text-red-600 p-4">
//         <p>Error: {error}</p>
//         <button
//           onClick={() => fetchMenuItems()}
//           disabled={isSubmitting}
//           className={`mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg transition-colors ${
//             isSubmitting
//               ? "opacity-50 cursor-not-allowed"
//               : "hover:bg-primary-700"
//           }`}
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header Actions */}
//       <div className="flex items-center justify-between">
//         <div className="flex-1 max-w-2xl">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <input
//               type="text"
//               placeholder="Search menu items..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//             />
//           </div>
//         </div>
//         <button
//           onClick={() => setIsAddModalOpen(true)}
//           disabled={isSubmitting}
//           className={`ml-4 px-4 py-2 bg-primary-600 text-white rounded-lg transition-colors flex items-center ${
//             isSubmitting
//               ? "opacity-50 cursor-not-allowed"
//               : "hover:bg-primary-700"
//           }`}
//         >
//           <Plus className="w-5 h-5 mr-2" />
//           Add New Item
//         </button>
//       </div>

//       {/* Category Filters */}
//       <div className="flex flex-wrap gap-2">
//         {CATEGORIES.map((category) => (
//           <button
//             key={category}
//             onClick={() => {
//               setActiveFilters((prev) =>
//                 prev.includes(category)
//                   ? prev.filter((f) => f !== category)
//                   : [...prev, category]
//               );
//             }}
//             disabled={isSubmitting}
//             className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//               activeFilters.includes(category)
//                 ? "bg-primary-600 text-white"
//                 : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//             } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
//           >
//             {category}
//           </button>
//         ))}
//       </div>

//       {/* Menu Items Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredItems.map((item) => (
//           <div
//             key={item._id}
//             className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
//           >
//             {item.image?.url && (
//               <div className="relative h-48">
//                 <img
//                   src={item.image.url}
//                   alt={item.name}
//                   className="w-full h-full object-cover rounded-t-xl"
//                 />
//               </div>
//             )}
//             <div className="p-4">
//               <div className="flex items-center justify-between">
//                 <h4 className="text-lg font-semibold text-gray-900">
//                   {item.name}
//                 </h4>
//                 <span className="text-lg font-bold text-primary-600">
//                   ${item.price.toFixed(2)}
//                 </span>
//               </div>
//               <p className="mt-1 text-sm text-gray-500">{item.description}</p>
//               {item.preparationTime && (
//                 <div className="mt-2 flex items-center text-sm text-gray-500">
//                   <Clock className="w-4 h-4 mr-1" />
//                   {item.preparationTime} mins
//                 </div>
//               )}
//               <div className="mt-2 flex flex-wrap gap-2">
//                 {item.isVegetarian && (
//                   <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
//                     Vegetarian
//                   </span>
//                 )}
//                 {item.spicyLevel && (
//                   <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
//                     {item.spicyLevel}
//                   </span>
//                 )}
//               </div>
//               <div className="mt-4 flex items-center justify-between">
//                 <span
//                   className={`px-2 py-1 text-sm rounded-full ${
//                     item.isAvailable
//                       ? "bg-green-100 text-green-800"
//                       : "bg-gray-100 text-gray-800"
//                   }`}
//                 >
//                   {item.isAvailable ? "Available" : "Hidden"}
//                 </span>
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => handleToggleAvailability(item._id)}
//                     disabled={isSubmitting}
//                     className={`p-2 transition-colors rounded-full ${
//                       isSubmitting
//                         ? "opacity-50 cursor-not-allowed"
//                         : "text-gray-500 hover:text-primary-600 hover:bg-gray-100"
//                     }`}
//                   >
//                     {item.isAvailable ? (
//                       <EyeOff className="w-5 h-5" />
//                     ) : (
//                       <Eye className="w-5 h-5" />
//                     )}
//                   </button>
//                   <button
//                     onClick={() => handleStartEdit(item)}
//                     disabled={isSubmitting}
//                     className={`p-2 transition-colors rounded-full ${
//                       isSubmitting
//                         ? "opacity-50 cursor-not-allowed"
//                         : "text-gray-500 hover:text-primary-600 hover:bg-gray-100"
//                     }`}
//                   >
//                     <Edit2 className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(item._id)}
//                     disabled={isSubmitting}
//                     className={`p-2 transition-colors rounded-full ${
//                       isSubmitting
//                         ? "opacity-50 cursor-not-allowed"
//                         : "text-gray-500 hover:text-red-600 hover:bg-gray-100"
//                     }`}
//                   >
//                     <Trash2 className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Add/Edit Modal */}
//       {isAddModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
//             {/* Loading Overlay */}
//             {isSubmitting && (
//               <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
//                 <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
//               </div>
//             )}

//             <div className="p-6 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-xl font-semibold text-gray-900">
//                   {editingItemId ? "Edit Menu Item" : "Add New Menu Item"}
//                 </h3>
//                 <button
//                   onClick={() => resetForm()}
//                   disabled={isSubmitting}
//                   className={`text-gray-400 transition-colors ${
//                     isSubmitting
//                       ? "opacity-50 cursor-not-allowed"
//                       : "hover:text-gray-500"
//                   }`}
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>
//             </div>

//             <div className="p-6">
//               {currentStep === 1 && (
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Name *
//                     </label>
//                     <input
//                       name="name"
//                       type="text"
//                       value={newItem.name || ""}
//                       onChange={(e) =>
//                         handleFieldChange(
//                           e.target.name as keyof CreateMenuItemData,
//                           e.target.value
//                         )
//                       }
//                       disabled={isSubmitting}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Description *
//                     </label>
//                     <textarea
//                       name="description"
//                       value={newItem.description}
//                       onChange={(e) =>
//                         handleFieldChange("description", e.target.value)
//                       }
//                       disabled={isSubmitting}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                       rows={3}
//                       required
//                     />
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Category *
//                       </label>
//                       <select
//                         name="category"
//                         value={newItem.category}
//                         onChange={(e) => {
//                           const category = e.target.value as Category;
//                           setNewItem({ ...newItem, category });
//                           console.log("Category updated:", category);
//                         }}
//                         disabled={isSubmitting}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                         required
//                       >
//                         {CATEGORIES.map((category) => (
//                           <option key={category} value={category}>
//                             {category}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Price *
//                       </label>
//                       <input
//                         name="price"
//                         type="number"
//                         value={newItem.price || 0}
//                         onChange={(e) =>
//                           handleFieldChange(
//                             e.target.name as keyof CreateMenuItemData,
//                             e.target.value
//                           )
//                         }
//                         disabled={isSubmitting}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                         min="0"
//                         step="0.01"
//                         required
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {currentStep === 2 && (
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Image
//                     </label>
//                     <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
//                       <div className="space-y-1 text-center">
//                         <Camera className="mx-auto h-12 w-12 text-gray-400" />
//                         <div className="flex text-sm text-gray-600">
//                           <label
//                             className={`relative cursor-pointer rounded-md font-medium text-primary-600 ${
//                               isSubmitting
//                                 ? "opacity-50 cursor-not-allowed"
//                                 : "hover:text-primary-500"
//                             }`}
//                           >
//                             <span>Upload image</span>
//                             <input
//                               type="file"
//                               className="sr-only"
//                               accept="image/*"
//                               onChange={handleImageChange}
//                               disabled={isSubmitting}
//                             />
//                           </label>
//                         </div>
//                         {selectedImage && (
//                           <p className="text-sm text-gray-500">
//                             Selected: {selectedImage.name}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Preparation Time (mins)
//                       </label>
//                       <input
//                         type="number"
//                         value={newItem.preparationTime || ""}
//                         onChange={(e) =>
//                           handleFieldChange("preparationTime", e.target.value)
//                         }
//                         disabled={isSubmitting}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                         min="0"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Spicy Level
//                       </label>
//                       <select
//                         value={newItem.spicyLevel}
//                         onChange={(e) =>
//                           setNewItem({
//                             ...newItem,
//                             spicyLevel: e.target.value as SpicyLevel,
//                           })
//                         }
//                         disabled={isSubmitting}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         {SPICY_LEVELS.map((level) => (
//                           <option key={level} value={level}>
//                             {level}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   <div className="flex items-center space-x-2">
//                     <input
//                       type="checkbox"
//                       id="isVegetarian"
//                       name="isVegetarian"
//                       checked={newItem.isVegetarian}
//                       onChange={(e) =>
//                         handleFieldChange("isVegetarian", e.target.checked)
//                       }
//                       disabled={isSubmitting}
//                       className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                     />
//                     <label
//                       htmlFor="isVegetarian"
//                       className="text-sm font-medium text-gray-700"
//                     >
//                       Vegetarian
//                     </label>
//                   </div>
//                 </div>
//               )}

//               {currentStep === 3 && (
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Allergens
//                     </label>
//                     <div className="flex flex-wrap gap-2">
//                       {ALLERGENS.map((allergen) => (
//                         <button
//                           key={allergen}
//                           type="button"
//                           onClick={() => {
//                             const currentAllergens = newItem.allergens || [];
//                             setNewItem({
//                               ...newItem,
//                               allergens: currentAllergens.includes(allergen)
//                                 ? currentAllergens.filter((a) => a !== allergen)
//                                 : [...currentAllergens, allergen],
//                             });
//                           }}
//                           disabled={isSubmitting}
//                           className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
//                             (newItem.allergens || []).includes(allergen)
//                               ? "bg-primary-600 text-white"
//                               : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                           } ${
//                             isSubmitting ? "opacity-50 cursor-not-allowed" : ""
//                           }`}
//                         >
//                           {allergen}
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Nutritional Information
//                     </label>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm text-gray-600 mb-1">
//                           Calories
//                         </label>
//                         <input
//                           name="calories"
//                           type="number"
//                           value={newItem.nutritionalInfo?.calories || ""}
//                           onChange={(e) => {
//                             const value = Number(e.target.value);
//                             setNewItem((prev) => ({
//                               ...prev,
//                               nutritionalInfo: {
//                                 ...(prev.nutritionalInfo || {}),
//                                 calories: value || 0,
//                               },
//                             }));
//                           }}
//                           disabled={isSubmitting}
//                           className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                           min="0"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm text-gray-600 mb-1">
//                           Protein (g)
//                         </label>
//                         <input
//                           type="number"
//                           value={newItem.nutritionalInfo?.protein || ""}
//                           onChange={(e) => {
//                             const value = Number(e.target.value) || 0;
//                             setNewItem((prev) => ({
//                               ...prev,
//                               nutritionalInfo: {
//                                 ...prev.nutritionalInfo,
//                                 [e.target.name]: value,
//                               },
//                             }));
//                           }}
//                           disabled={isSubmitting}
//                           className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                           min="0"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm text-gray-600 mb-1">
//                           Carbohydrates (g)
//                         </label>
//                         <input
//                           type="number"
//                           value={newItem.nutritionalInfo?.carbohydrates || ""}
//                           onChange={(e) => {
//                             const value = Number(e.target.value) || 0;
//                             setNewItem((prev) => ({
//                               ...prev,
//                               nutritionalInfo: {
//                                 ...prev.nutritionalInfo,
//                                 [e.target.name]: value,
//                               },
//                             }));
//                           }}
//                           disabled={isSubmitting}
//                           className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                           min="0"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm text-gray-600 mb-1">
//                           Fats (g)
//                         </label>
//                         <input
//                           type="number"
//                           value={newItem.nutritionalInfo?.fats || ""}
//                           onChange={(e) => {
//                             const value = Number(e.target.value) || 0;
//                             setNewItem((prev) => ({
//                               ...prev,
//                               nutritionalInfo: {
//                                 ...prev.nutritionalInfo,
//                                 [e.target.name]: value,
//                               },
//                             }));
//                           }}
//                           disabled={isSubmitting}
//                           className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                           min="0"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex items-center space-x-2">
//                     <input
//                       type="checkbox"
//                       id="isAvailable"
//                       checked={newItem.isAvailable}
//                       onChange={(e) =>
//                         setNewItem({
//                           ...newItem,
//                           isAvailable: e.target.checked,
//                         })
//                       }
//                       disabled={isSubmitting}
//                       className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                     />
//                     <label
//                       htmlFor="isAvailable"
//                       className="text-sm font-medium text-gray-700"
//                     >
//                       Make item available immediately
//                     </label>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="p-6 border-t border-gray-200 flex justify-between">
//               {currentStep > 1 && (
//                 <button
//                   onClick={() => setCurrentStep(currentStep - 1)}
//                   disabled={isSubmitting}
//                   className={`px-4 py-2 border border-gray-300 rounded-lg transition-colors ${
//                     isSubmitting
//                       ? "opacity-50 cursor-not-allowed"
//                       : "text-gray-700 hover:bg-gray-50"
//                   }`}
//                 >
//                   Back
//                 </button>
//               )}
//               <button
//                 onClick={handleSubmit}
//                 disabled={isSubmitting}
//                 className={`px-4 py-2 bg-primary-600 text-white rounded-lg transition-colors ml-auto ${
//                   isSubmitting
//                     ? "opacity-50 cursor-not-allowed"
//                     : "hover:bg-primary-700"
//                 }`}
//               >
//                 {isSubmitting
//                   ? "Saving..."
//                   : currentStep === 3
//                   ? editingItemId
//                     ? "Update Item"
//                     : "Add Item"
//                   : "Next"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { Clock, Edit2, Eye, EyeOff, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useMenu } from "../../hooks/use-Menu";
import type { Category, MenuItem } from "../../types/menuTypes";
import MenuFormModal from "./MenuFormModel";

const CATEGORIES: Category[] = [
  "appetizer",
  "main course",
  "dessert",
  "beverage",
  "special",
];

export default function MenuManagement() {
  const {
    menuItems,
    loading,
    error,
    fetchMenuItems,
    deleteMenuItem,
    toggleAvailability,
  } = useMenu();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  const handleStartEdit = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (itemId: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      setIsSubmitting(true);
      await deleteMenuItem(itemId);
      await fetchMenuItems();
      toast.success("Item deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete item"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAvailability = async (itemId: string) => {
    try {
      setIsSubmitting(true);
      await toggleAvailability(itemId);
      await fetchMenuItems();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update availability"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNew = () => {
    setSelectedItem(undefined);
    setIsModalOpen(true);
  };

  const handleModalSuccess = async () => {
    await fetchMenuItems();
  };

  const filteredItems = menuItems.filter((item) => {
    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm);

    const matchesFilters =
      activeFilters.length === 0 ||
      activeFilters.includes(item.category) ||
      (item.isVegetarian && activeFilters.includes("vegetarian")) ||
      (item.spicyLevel && activeFilters.includes(item.spicyLevel));

    return matchesSearch && matchesFilters;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Error: {error}</p>
        <button
          onClick={() => fetchMenuItems()}
          disabled={isSubmitting}
          className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg transition-colors disabled:opacity-50 hover:bg-primary-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        <button
          onClick={handleAddNew}
          disabled={isSubmitting}
          className="ml-4 px-4 py-2 bg-primary-600 text-white rounded-lg transition-colors flex items-center disabled:opacity-50 hover:bg-primary-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Item
        </button>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => {
              setActiveFilters((prev) =>
                prev.includes(category)
                  ? prev.filter((f) => f !== category)
                  : [...prev, category]
              );
            }}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all 
              ${
                activeFilters.includes(category)
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
          >
            {item.image && (
              <div className="relative h-48">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-t-xl"
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">
                  {item.name}
                </h4>
                <span className="text-lg font-bold text-primary-600">
                  ${item.price.toFixed(2)}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">{item.description}</p>
              {item.preparationTime && (
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {item.preparationTime} mins
                </div>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                {item.isVegetarian && (
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    Vegetarian
                  </span>
                )}
                {item.spicyLevel && (
                  <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                    {item.spicyLevel}
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`px-2 py-1 text-sm rounded-full 
                    ${
                      item.isAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {item.isAvailable ? "Available" : "Hidden"}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleAvailability(item._id)}
                    disabled={isSubmitting}
                    className="p-2 transition-colors rounded-full text-gray-500 hover:text-primary-600 hover:bg-gray-100 disabled:opacity-50"
                  >
                    {item.isAvailable ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleStartEdit(item)}
                    disabled={isSubmitting}
                    className="p-2 transition-colors rounded-full text-gray-500 hover:text-primary-600 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={isSubmitting}
                    className="p-2 transition-colors rounded-full text-gray-500 hover:text-red-600 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <MenuFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editItem={selectedItem}
        onSuccess={handleModalSuccess}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
