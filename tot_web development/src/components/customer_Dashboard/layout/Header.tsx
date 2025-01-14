import { Search, ShoppingCart, UtensilsCrossed } from 'lucide-react';
import { Input } from '../../common/InputField';
import { Button } from '../../common/button';
import { UserMenu } from '../customer_profile/UserMenu';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <UtensilsCrossed className="h-6 w-6 text-primary" />
          <span className="font-bold text-2xl text-primary">TOT</span>
        </div>
        
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                          placeholder="Search restaurants, dishes, or cuisines..."
                          className="w-full pl-10 bg-secondary/10 hover:bg-secondary/20 transition-colors" label={''}            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-[10px] font-medium flex items-center justify-center text-white">
              2
            </span>
          </Button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}