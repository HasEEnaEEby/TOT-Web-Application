import { Camera, Clock, Mail, MapPin, Phone, Save, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "../../api/axiosConfig";
import { useAuth } from "../../hooks/use-auth";
import {
  RestaurantData,
  RestaurantFormData,
  RestaurantStatsData,
} from "../../types/restaurant";

export default function RestaurantProfile(): JSX.Element {
  const { authState } = useAuth();
  const [restaurantData, setRestaurantData] = useState<RestaurantData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<RestaurantFormData>({
    restaurantName: "",
    location: "",
    contactNumber: "",
    quote: "",
    hours: "Mon-Sat: 11:00 AM - 10:00 PM",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [stats, setStats] = useState<RestaurantStatsData>({
    todayOrders: 24,
    activeTables: 8,
    totalTables: 12,
    todayRevenue: 1234,
  });

  // Key to force re-render image when needed
  const [imageKey, setImageKey] = useState<number>(Date.now());

  // Fetch restaurant data when component mounts
  useEffect(() => {
    const fetchRestaurantData = async (): Promise<void> => {
      try {
        setLoading(true);

        // Use restaurants/profile endpoint
        const profileResponse = await axios.get("/api/v1/restaurants/profile");

        if (profileResponse.data.status === "success") {
          const userData = profileResponse.data.data.restaurant;
          console.log("API Response - Restaurant data:", userData);

          setRestaurantData({
            _id: userData._id,
            restaurantName: userData.restaurantName || "",
            location: userData.location || "",
            contactNumber: userData.contactNumber || "",
            quote: userData.quote || "",
            email: userData.email || "",
            image: userData.image || null,
            hours: userData.hours || "Mon-Sat: 11:00 AM - 10:00 PM",
          });

          // Initialize form with fetched data
          setFormData({
            restaurantName: userData.restaurantName || "",
            location: userData.location || "",
            contactNumber: userData.contactNumber || "",
            quote: userData.quote || "",
            hours: userData.hours || "Mon-Sat: 11:00 AM - 10:00 PM",
          });
        }

        // Try to fetch management statistics if available
        try {
          const statsResponse = await axios.get(
            "/api/v1/management/statistics"
          );
          if (statsResponse.data.status === "success") {
            setStats({
              todayOrders: statsResponse.data.data.metrics?.todayOrders || 24,
              activeTables: statsResponse.data.data.metrics?.activeTables || 8,
              totalTables: statsResponse.data.data.metrics?.totalTables || 12,
              todayRevenue:
                statsResponse.data.data.metrics?.revenue?.today || 1234,
            });
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          console.warn("Could not fetch statistics, using default values");
          // Continue with default stats values
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching restaurant data:", err);
        toast.error("Failed to load restaurant data");
        setError("Failed to load restaurant data. Please try again.");
        setLoading(false);
      }
    };

    if (authState.isAuthenticated) {
      fetchRestaurantData();
    }
  }, [authState.isAuthenticated]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPEG, PNG, and WebP images are allowed");
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImagePreview(reader.result.toString());
          console.log("Image preview set from file");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const refreshProfileData = async (): Promise<void> => {
    try {
      const refreshedResponse = await axios.get("/api/v1/restaurants/profile");
      if (refreshedResponse.data.status === "success") {
        const refreshedData = refreshedResponse.data.data.restaurant;
        console.log("Refreshed data:", refreshedData);

        setRestaurantData({
          _id: refreshedData._id,
          restaurantName: refreshedData.restaurantName || "",
          location: refreshedData.location || "",
          contactNumber: refreshedData.contactNumber || "",
          quote: refreshedData.quote || "",
          email: refreshedData.email || "",
          image: refreshedData.image || null,
          hours: refreshedData.hours || "Mon-Sat: 11:00 AM - 10:00 PM",
        });

        // Force image refresh
        setImageKey(Date.now());
      }
    } catch (err) {
      console.error("Error refreshing profile data:", err);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      setLoading(true);
      toast.loading("Updating profile...");

      console.log("Submitting profile update with hours:", formData.hours);

      // 1. Update profile data first - include hours in this request
      const profileResponse = await axios.patch("/api/v1/restaurants/profile", {
        restaurantName: formData.restaurantName,
        location: formData.location,
        contactNumber: formData.contactNumber,
        quote: formData.quote,
        hours: formData.hours, // Include hours in the main update
      });

      console.log("Profile update response:", profileResponse.data);

      // 2. Handle image upload if there's a new image
      if (selectedImage) {
        console.log("Uploading new image...");
        const imageFormData = new FormData();
        imageFormData.append("image", selectedImage);
        imageFormData.append("type", "profile");

        try {
          const imageResponse = await axios.post(
            "/api/v1/restaurants/image",
            imageFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: (progressEvent: {
                loaded: number;
                total?: number;
              }) => {
                if (progressEvent.total) {
                  const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                  );
                  setUploadProgress(percentCompleted);
                }
              },
            }
          );

          console.log("Image upload response:", imageResponse.data);

          // Update local state with the new image URL
          if (imageResponse.data.data.restaurant.image) {
            setRestaurantData((prev) => {
              if (!prev) return null;
              return {
                ...prev,
                image: imageResponse.data.data.restaurant.image,
              };
            });
          }

          // Clear image states
          setSelectedImage(null);
          setImagePreview(null);
          setUploadProgress(0);

          // Force image refresh
          setImageKey(Date.now());
        } catch (imageError) {
          console.error("Error uploading image:", imageError);
          toast.error("Failed to upload image, but profile was updated");
        }
      }

      // Refresh data from server
      await refreshProfileData();

      toast.dismiss();
      toast.success("Profile updated successfully!");

      setLoading(false);
      setIsEditing(false);
    } catch (err) {
      toast.dismiss();
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile. Please try again.");
      setError("Failed to update profile. Please try again.");
      setLoading(false);
    }
  };

  // Show loading spinner while initial data is being fetched
  if (loading && !restaurantData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Show error message if initial data fetch failed
  if (error && !restaurantData) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p>{error}</p>
        <button
          className="mt-2 text-sm text-red-600 underline"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Generate a unique URL to prevent image caching
  const getImageUrl = () => {
    if (imagePreview) {
      return imagePreview;
    }

    if (restaurantData?.image) {
      // Add a timestamp to bust the cache
      return `${restaurantData.image}?t=${imageKey}`;
    }

    return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80";
  };

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <div className="relative h-64 rounded-lg bg-gray-200 overflow-hidden">
        <img
          src={getImageUrl()}
          alt="Restaurant cover"
          className="w-full h-full object-cover"
          key={imageKey} // Use the key to force re-render when image changes
          onError={(e) => {
            console.error("Image failed to load:", e);
            console.log(
              "Current image source:",
              (e.target as HTMLImageElement).src
            );

            // Fall back to default image if needed
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80";
          }}
        />

        {isEditing ? (
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <label
              htmlFor="cover-image-upload"
              className="bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-100"
            >
              <Camera className="w-5 h-5 text-gray-600" />
              <input
                id="cover-image-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        ) : (
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button
              className="bg-white p-2 rounded-full shadow-lg"
              onClick={() => setIsEditing(true)}
            >
              <Camera className="w-5 h-5 text-gray-600" />
            </button>

            {/* Add a manual reload button */}
            <button
              className="bg-white p-2 rounded-full shadow-lg"
              onClick={async () => {
                toast.loading("Refreshing data...");
                await refreshProfileData();
                toast.dismiss();
                toast.success("Data refreshed!");
              }}
              title="Refresh data from server"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-600"
              >
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.67 2.21" />
                <path d="M21 3v9h-9" />
              </svg>
            </button>
          </div>
        )}

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gray-200 h-1">
            <div
              className="bg-primary-600 h-1"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Restaurant Info */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tagline/Quote
                </label>
                <input
                  type="text"
                  name="quote"
                  value={formData.quote}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Hours
                </label>
                <input
                  type="text"
                  name="hours"
                  value={formData.hours}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setImagePreview(null);
                    setSelectedImage(null);
                    if (restaurantData) {
                      setFormData({
                        restaurantName: restaurantData.restaurantName || "",
                        location: restaurantData.location || "",
                        contactNumber: restaurantData.contactNumber || "",
                        quote: restaurantData.quote || "",
                        hours:
                          restaurantData.hours ||
                          "Mon-Sat: 11:00 AM - 10:00 PM",
                      });
                    }
                  }}
                  className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  {loading ? (
                    <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></span>
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900">
                {restaurantData?.restaurantName || "Your Restaurant"}
              </h3>
              <p className="mt-1 text-gray-500">
                {restaurantData?.quote || "Add a tagline for your restaurant"}
              </p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{restaurantData?.location || "Add your location"}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{restaurantData?.hours || formData.hours}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-5 h-5 mr-2" />
                  <span>
                    {restaurantData?.contactNumber || "Add your contact number"}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-2" />
                  <span>
                    {restaurantData?.email ||
                      authState.user?.email ||
                      "Add your email"}
                  </span>
                </div>
              </div>
            </div>

            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* Debug Info - Uncomment to help with debugging
      <div className="bg-gray-100 p-4 rounded mt-4 mb-6 text-xs">
        <h5 className="font-medium mb-2">Debug Information:</h5>
        <p>Image URL: {restaurantData?.image || "None"}</p>
        <p>Image Key: {imageKey}</p>
        <p>Hours: {restaurantData?.hours || "Default hours"}</p>
        <button
          onClick={async () => {
            toast.loading("Forcing data refresh...");
            await refreshProfileData();
            toast.dismiss();
            toast.success("Data refreshed!");
          }}
          className="text-blue-600 underline mt-2"
        >
          Force Data Refresh
        </button>
      </div> */}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900">
            Today's Orders
          </h4>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {stats.todayOrders}
          </p>
          <p className="text-sm text-gray-500">
            {stats.todayOrders > 0
              ? "+12% from yesterday"
              : "No orders yet today"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900">Active Tables</h4>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {stats.activeTables}/{stats.totalTables}
          </p>
          <p className="text-sm text-gray-500">
            {stats.totalTables - stats.activeTables} tables available
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900">
            Today's Revenue
          </h4>
          <p className="mt-2 text-3xl font-bold text-red-600">
            ${stats.todayRevenue.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            {stats.todayRevenue > 0
              ? "+8% from yesterday"
              : "Waiting for sales"}
          </p>
        </div>
      </div>
    </div>
  );
}
