import { Restaurant } from '@/types/restaurant';
import { RestaurantCard } from './RestaurantCard';
import { RestaurantFilters } from './RestaurantFilters';

interface RestaurantGridProps {
  restaurants: Restaurant[];
}

export function RestaurantGrid({ restaurants }: RestaurantGridProps) {
  return (
    <section className="space-y-6">
      <RestaurantFilters />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.name} {...restaurant} />
        ))}
      </div>
    </section>
  );
}