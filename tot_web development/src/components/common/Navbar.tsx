import { Clock, User } from "lucide-react";
import { Link } from "react-router-dom";
import TOTLogo from '../../assets/images/TOT-logo.png'; 
import { Button } from "./button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "./navigation-menu";

export function Navbar({ setIsGuestMode }: { setIsGuestMode: (state: boolean) => void }) {
  const handleGuestModeClick = () => {
    setIsGuestMode(true);
  };

  return (
    <nav className="border-b bg-white shadow-md">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <img 
              src={TOTLogo} 
              alt="TOT Logo" 
              className="h-16 w-auto sm:h-20" 
            />
          </div>
          
          {/* Navigation Menu */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink className="px-4 py-2 hover:text-primary transition-colors" href="/">
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className="px-4 py-2 hover:text-primary transition-colors" href="/restaurants">
                  Restaurants
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className="px-4 py-2 hover:text-primary transition-colors" href="/how-it-works">
                  How It Works
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Button Section */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="hidden md:flex" onClick={handleGuestModeClick}>
              <Clock className="mr-2 h-4 w-4" />
              Guest Mode
            </Button>
            <Link to="/Login">
              <Button>
                <User className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
