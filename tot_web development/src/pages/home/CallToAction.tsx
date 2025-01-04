import { Button } from "../../components/common/button";

export function CallToAction() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
          Join thousands of satisfied customers and restaurant partners. 
          Start your journey with FoodEase today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" className="text-primary">
            Sign Up as Customer
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent">
            Register Restaurant
          </Button>
        </div>
      </div>
    </section>
  );
}