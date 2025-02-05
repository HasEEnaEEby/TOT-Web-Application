import { Restaurant } from "@/types/restaurant";
import { Sidebar } from "lucide-react";
import { Header } from "../../components/customer_Dashboard/layout/Header";
import { RestaurantGrid } from "../../components/customer_Dashboard/restaurants_showcasing/RestaurantGrid";

const restaurants: Restaurant[] = [
  {
    _id: "1",
    restaurantName: "La Piazza",
    email: "lapiazza@example.com",
    location: "123 Main St",
    contactNumber: "555-0123",
    quote: "Authentic Italian Cuisine",
    status: "approved",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    revenue: 50000,
    orders: 500,
    rating: 4.8,
    lastPayment: new Date().toISOString(),
    cuisine: "Italian",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    tags: ["Trending", "Family-Friendly"],
  },
  {
    _id: "2",
    restaurantName: "Sakura",
    email: "sakura@example.com",
    location: "456 Cherry Ave",
    contactNumber: "555-0124",
    quote: "Traditional Japanese Experience",
    status: "approved",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    revenue: 45000,
    orders: 450,
    rating: 4.6,
    lastPayment: new Date().toISOString(),
    cuisine: "Japanese",
    image: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b",
    tags: ["New", "Date Night"],
  },
  {
    _id: "3",
    restaurantName: "The Grill House",
    email: "grillhouse@example.com",
    location: "789 Oak Rd",
    contactNumber: "555-0125",
    quote: "Best Steaks in Town",
    status: "approved",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    revenue: 60000,
    orders: 600,
    rating: 4.5,
    lastPayment: new Date().toISOString(),
    cuisine: "American",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947",
    tags: ["Popular", "Steakhouse"],
  },
];

const CustomerForm = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />

      <main className="pl-64 pt-16">
        <div className="container mx-auto p-6">
          <section className="mb-8 animate-fade-in-up">
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
            <p className="text-muted-foreground">
              Discover new flavors and your favorite restaurants
            </p>
          </section>

          <section className="mb-12 animate-fade-in-up stagger-1">
            <h2 className="text-2xl font-semibold mb-6">Popular Restaurants</h2>
            <RestaurantGrid restaurants={restaurants} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default CustomerForm;
