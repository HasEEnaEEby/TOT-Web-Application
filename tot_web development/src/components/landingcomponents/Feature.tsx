import { UtensilsCrossed, Clock, User } from "lucide-react";

const features = [
  {
    icon: <UtensilsCrossed className="h-6 w-6 text-primary" />,
    title: "No Phone Calls Required",
    description: "Place orders without any verbal communication. Everything is handled through our intuitive interface."
  },
  {
    icon: <Clock className="h-6 w-6 text-primary" />,
    title: "Quick Guest Mode",
    description: "Try our service without creating an account. Enjoy a 3-hour daily session to explore and order."
  },
  {
    icon: <User className="h-6 w-6 text-primary" />,
    title: "Personalized Experience",
    description: "Create an account to save your preferences, track orders, and enjoy a customized ordering experience."
  }
];

export function Features() {
  return (
    <section className="bg-muted py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose TOT?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-background p-6 rounded-lg shadow-sm">
              <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}