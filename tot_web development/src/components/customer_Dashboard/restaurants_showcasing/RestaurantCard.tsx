import { Heart, Star, Clock, DollarSign } from 'lucide-react';
import { Button } from '../../common/button';
import { Card } from '../../common/ui/card';
import { cn } from '../../../utils';

interface RestaurantCardProps {
  name: string;
  cuisine: string;
  rating: number;
  image: string;
  tags: string[];
}

export function RestaurantCard({ name, cuisine, rating, image, tags }: RestaurantCardProps) {
  return (
    <Card className="overflow-hidden group animate-scale-in hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={image}
          alt={name}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground"
        >
          <Heart className="h-5 w-5" />
        </Button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="font-semibold text-lg text-white">{name}</h3>
          <p className="text-sm text-white/80">{cuisine}</p>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-secondary" fill="currentColor" />
            <span className="font-medium">{rating}</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm">20-30 min</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <DollarSign className="h-4 w-4" />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "px-2 py-1 text-xs rounded-full",
                tag === "Trending" && "bg-accent text-accent-foreground",
                tag === "New" && "bg-secondary text-secondary-foreground",
                tag === "Popular" && "bg-primary text-primary-foreground",
                !["Trending", "New", "Popular"].includes(tag) && "bg-muted text-muted-foreground"
              )}
            >
              {tag}
            </span>
          ))}
        </div>
        
        <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
          View Menu
        </Button>
      </div>
    </Card>
  );
}