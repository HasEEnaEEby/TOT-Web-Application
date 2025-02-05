import React from 'react';
import { Camera, MapPin, Clock, Phone, Mail } from 'lucide-react';

export default function RestaurantProfile() {
  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <div className="relative h-64 rounded-lg bg-gray-200 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
          alt="Restaurant cover"
          className="w-full h-full object-cover"
        />
        <button className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg">
          <Camera className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Restaurant Info */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900">La Belle Cuisine</h3>
            <p className="mt-1 text-gray-500">Fine French Dining</p>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2" />
                <span>123 Gourmet Street, Foodie City, FC 12345</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2" />
                <span>Mon-Sat: 11:00 AM - 10:00 PM</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="w-5 h-5 mr-2" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="w-5 h-5 mr-2" />
                <span>contact@labellecuisine.com</span>
              </div>
            </div>
          </div>
          
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900">Today's Orders</h4>
          <p className="mt-2 text-3xl font-bold text-red-600">24</p>
          <p className="text-sm text-gray-500">+12% from yesterday</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900">Active Tables</h4>
          <p className="mt-2 text-3xl font-bold text-red-600">8/12</p>
          <p className="text-sm text-gray-500">4 tables available</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900">Today's Revenue</h4>
          <p className="mt-2 text-3xl font-bold text-red-600">$1,234</p>
          <p className="text-sm text-gray-500">+8% from yesterday</p>
        </div>
      </div>
    </div>
  );
}