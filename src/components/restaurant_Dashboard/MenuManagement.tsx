import React, { useState } from 'react';
import { Plus, Search, Filter, ChevronRight, X, Camera, Tag, Star, Clock, Edit2, Eye, EyeOff } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  status: 'available' | 'hidden';
  description: string;
  images: string[];
  badges: string[];
  preparationTime: string;
}

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: 1,
      name: 'Coq au Vin',
      category: 'Main Course',
      price: 28.99,
      status: 'available',
      description: 'Classic French chicken braised with wine, mushrooms, and pearl onions',
      images: [
        'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80'
      ],
      badges: ['Best Seller', 'Chef\'s Special'],
      preparationTime: '25 mins'
    },
    {
      id: 2,
      name: 'Ratatouille',
      category: 'Main Course',
      price: 24.99,
      status: 'available',
      description: 'Provençal vegetable stew with eggplant, zucchini, tomatoes, and herbs',
      images: [
        'https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80'
      ],
      badges: ['Vegetarian', 'Seasonal'],
      preparationTime: '30 mins'
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    status: 'available',
    images: [],
    badges: []
  });

  const categories = ['All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages'];
  const badges = ['New', 'Best Seller', 'Chef\'s Special', 'Seasonal', 'Vegetarian', 'Spicy'];

  const handleAddItem = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Add the new item
      setMenuItems([...menuItems, { ...newItem, id: Date.now() } as MenuItem]);
      setIsAddModalOpen(false);
      setCurrentStep(1);
      setNewItem({ status: 'available', images: [], badges: [] });
    }
  };

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const toggleItemStatus = (id: number) => {
    setMenuItems(menuItems.map(item => 
      item.id === id 
        ? { ...item, status: item.status === 'available' ? 'hidden' : 'available' }
        : item
    ));
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilters = activeFilters.length === 0 || 
                          activeFilters.includes(item.category) ||
                          item.badges.some(badge => activeFilters.includes(badge));
    return matchesSearch && matchesFilters;
  });

  return (
    <div className="space-y-6 animate-fade-in">
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="ml-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center group hover:shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2 transform group-hover:rotate-90 transition-transform" />
          Add New Dish
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.concat(badges).map((filter) => (
          <button
            key={filter}
            onClick={() => toggleFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeFilters.includes(filter)
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="relative h-48">
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                {item.badges.map((badge, index) => (
                  <span key={index} className="px-2 py-1 text-sm rounded-full bg-black bg-opacity-50 text-white backdrop-blur-sm">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
                <span className="text-lg font-bold text-primary-600">${item.price}</span>
              </div>
              <p className="mt-1 text-sm text-gray-500">{item.description}</p>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {item.preparationTime}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className={`px-2 py-1 text-sm rounded-full ${
                  item.status === 'available'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {item.status === 'available' ? 'Available' : 'Hidden'}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleItemStatus(item.id)}
                    className="p-2 text-gray-500 hover:text-primary-600 transition-colors rounded-full hover:bg-gray-100"
                  >
                    {item.status === 'available' ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <button className="p-2 text-gray-500 hover:text-primary-600 transition-colors rounded-full hover:bg-gray-100">
                    <Edit2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[32rem] max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Add New Dish</h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="mt-2">
                <div className="flex items-center space-x-4">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step === currentStep
                          ? 'bg-primary-600 text-white'
                          : step < currentStep
                          ? 'bg-primary-100 text-primary-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {step}
                      </div>
                      {step < 3 && (
                        <ChevronRight className={`w-5 h-5 ${
                          step < currentStep ? 'text-primary-600' : 'text-gray-300'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dish Name
                    </label>
                    <input
                      type="text"
                      value={newItem.name || ''}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter dish name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newItem.description || ''}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={3}
                      placeholder="Describe your dish"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={newItem.category || ''}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select category</option>
                        {categories.slice(1).map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price
                      </label>
                      <input
                        type="number"
                        value={newItem.price || ''}
                        onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Images
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-500 transition-colors cursor-pointer">
                      <div className="space-y-1 text-center">
                        <Camera className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500">
                            <span>Upload images</span>
                            <input type="file" className="sr-only" multiple accept="image/*" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preparation Time
                    </label>
                    <input
                      type="text"
                      value={newItem.preparationTime || ''}
                      onChange={(e) => setNewItem({ ...newItem, preparationTime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., 25 mins"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Badges
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {badges.map((badge) => (
                        <button
                          key={badge}
                          onClick={() => {
                            const currentBadges = newItem.badges || [];
                            setNewItem({
                              ...newItem,
                              badges: currentBadges.includes(badge)
                                ? currentBadges.filter(b => b !== badge)
                                : [...currentBadges, badge]
                            });
                          }}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                            (newItem.badges || []).includes(badge)
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {badge}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-between">
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleAddItem}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors ml-auto"
              >
                {currentStep === 3 ? 'Add Dish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}