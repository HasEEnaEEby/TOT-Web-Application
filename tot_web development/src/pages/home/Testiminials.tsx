import { Avatar, AvatarFallback, AvatarImage } from "../../components/common/ui/avatar";
import { Card } from "../../components/common/ui/card";

const testimonials = [
  {
    content: "FoodEase has transformed how I order food. No more anxiety about phone calls!",
    author: "Sarah Chen",
    role: "Customer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
  },
  {
    content: "Our restaurant has seen a 40% increase in orders since joining FoodEase.",
    author: "Michael Rodriguez",
    role: "Restaurant Owner",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
  },
  {
    content: "The platform is intuitive and makes ordering food a breeze.",
    author: "Alex Thompson",
    role: "Customer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
  }
];

export function Testimonials() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What People Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers and partners.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6">
              <blockquote className="text-lg mb-6">"{testimonial.content}"</blockquote>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                  <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}