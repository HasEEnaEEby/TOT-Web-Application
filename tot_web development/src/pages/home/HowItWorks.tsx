import { Store, Menu, ShoppingCart, CreditCard } from "lucide-react";

const steps = [
  {
    icon: <Store className="h-8 w-8 text-primary" />,
    title: "Choose a Restaurant",
    description: "Browse through our curated list of restaurants in your area."
  },
  {
    icon: <Menu className="h-8 w-8 text-primary" />,
    title: "Browse & Customize",
    description: "Explore menus and customize your order to your liking."
  },
  {
    icon: <ShoppingCart className="h-8 w-8 text-primary" />,
    title: "Place Your Order",
    description: "Review your order and submit it with just a few clicks."
  },
  {
    icon: <CreditCard className="h-8 w-8 text-primary" />,
    title: "Pay & Enjoy",
    description: "Complete your payment securely and wait for your delicious meal."
  }
];

export function HowItWorks() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Getting your favorite food delivered is easier than ever with our simple process.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-primary/20" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}