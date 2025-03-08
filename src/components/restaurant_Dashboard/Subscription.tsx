import axios from "axios";
import { Check } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

const SubscriptionPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const features = [
    {
      title: "Premium Ad Placement",
      description:
        "Your restaurant will be featured at the top of search results and get prime visibility on the homepage.",
      included: true,
    },
    {
      title: "Sponsored Offers",
      description:
        "Promote your special offers and deals with highlighted placement across the platform.",
      included: true,
    },
    {
      title: "Analytics Dashboard",
      description:
        "Get detailed insights on customer behavior, popular dishes, and peak hours.",
      included: true,
    },
  ];

  // 🔹 Handle Subscription Click
  const handleSubscription = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required. Please log in.");
        return;
      }

      // 🔹 Send PATCH request to subscribe the restaurant
      const response = await axios.patch(
        "http://localhost:4000/api/v1/restaurants/subscribe-to-pro",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status === "success") {
        toast.success("Subscription successful! You are now a Pro user.");
        window.location.reload(); // Refresh the UI
      }
    } catch (error) {
      console.error("Subscription failed:", error);
      toast.error("Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl w-full bg-white shadow-2xl rounded-3xl p-12 text-center border border-gray-300">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-900">
        Choose Your Plan
      </h1>
      <p className="text-gray-600 mb-10">
        Boost your restaurant's visibility and attract more customers.
      </p>

      <div className="bg-gray-50 p-10 rounded-2xl text-left shadow-lg border border-gray-300 hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 hover:scale-105">
        <h2 className="text-2xl font-bold text-gray-800">Pro</h2>
        <p className="text-gray-600 mt-2">₹16,000/month</p>
        <ul className="mt-6 space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-700">
              <Check className="h-6 w-6 text-green-500 mr-3" /> {feature.title}
            </li>
          ))}
        </ul>

        {/* 🔹 Subscribe Button */}
        <button
          onClick={handleSubscription}
          disabled={loading}
          className={`mt-8 w-full bg-primary text-white py-4 rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-110 shadow-lg ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/80"
          }`}
        >
          {loading ? "Processing..." : "Subscribe to Pro"}
        </button>
      </div>

      <p className="text-gray-500 mt-10 text-sm">
        Subscription auto-renews until canceled.{" "}
        <a href="#" className="underline">
          Learn more
        </a>
      </p>
    </div>
  );
};

export default SubscriptionPage;
