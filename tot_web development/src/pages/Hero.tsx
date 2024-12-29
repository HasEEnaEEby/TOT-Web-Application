import { Clock } from "lucide-react";
import landingImage from '../assets/images/landing.jpg';
import { Button } from "../components/common/button";

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Order Food with 
            <span className="text-primary"> Peace of Mind</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Experience hassle-free food ordering designed for introverts. No phone calls, no social anxiety - just delicious food delivered to your door.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="text-lg">
              Start Ordering
            </Button>
            <Button size="lg" variant="outline" className="text-lg">
              View Restaurants
            </Button>
          </div>
        </div>
        <div className="relative">
        <img
        src={landingImage}
        alt="Delicious food spread"
        className="rounded-lg shadow-2xl"
      />
          <div className="absolute -bottom-6 -left-6 bg-background p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Quick & Easy</p>
                <p className="text-sm text-muted-foreground">Order in minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
