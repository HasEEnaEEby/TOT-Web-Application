import { Restaurant } from "@/types/restaurant";
import { Sidebar } from "lucide-react";
import { Header } from "../layout/Header";
import { RestaurantGrid } from "../restaurants_showcasing/RestaurantGrid";

const restaurants: Restaurant[] = [
  {
    name: "La Piazza",
    cuisine: "Italian",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    tags: ["Trending", "Family-Friendly"],
  },
  {
    name: "Sakura",
    cuisine: "Japanese",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b",
    tags: ["New", "Date Night"],
  },
  {
    name: "The Grill House",
    cuisine: "American",
    rating: 4.5,
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
