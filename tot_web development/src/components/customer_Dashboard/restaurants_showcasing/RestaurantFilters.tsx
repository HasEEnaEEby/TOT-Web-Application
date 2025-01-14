import { Button } from '../../common/button';
import { 
  Clock, 
  Star, 
  DollarSign, 
  Utensils 
} from 'lucide-react';

const filters = [
  { icon: Star, label: 'Most Popular' },
  { icon: Clock, label: 'Nearest First' },
  { icon: DollarSign, label: 'Price' },
  { icon: Utensils, label: 'Cuisine' },
];

export function RestaurantFilters() {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map(({ icon: Icon, label }) => (
        <Button
          key={label}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Icon className="h-4 w-4" />
          {label}
        </Button>
      ))}
    </div>
  );
}