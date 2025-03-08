import { motion } from "framer-motion";
import {
  Clock,
  CreditCard,
  Languages,
  Smartphone,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { FeatureCard } from "../../components/common/FeatureCard";
import { JapaneseHouseScene } from "../../components/threeD/Restaurantmodel";

const features = [
  {
    icon: <UtensilsCrossed className="h-8 w-8 text-primary" />,
    title: "No Calls for Waiters Required",
    description:
      "Place orders without any verbal communication. Everything is handled through our intuitive interface.",
  },
  {
    icon: <Clock className="h-8 w-8 text-primary" />,
    title: "Quick Guest Mode",
    description:
      "Try our service without creating an account. Enjoy a 3-hour daily session to explore and order.",
  },
  {
    icon: <User className="h-8 w-8 text-primary" />,
    title: "Personalized Experience",
    description:
      "Create an account to save your preferences, track orders, and enjoy a customized ordering experience.",
  },
  {
    icon: <Smartphone className="h-8 w-8 text-primary" />,
    title: "Cross-Platform Access",
    description:
      "Access your favorite restaurants from any device, anywhere. Seamless experience across all platforms.",
  },
  {
    icon: <CreditCard className="h-8 w-8 text-primary" />,
    title: "Multiple Payment Options",
    description:
      "Pay securely using your preferred payment method with instant confirmation and receipts.",
  },
  {
    icon: <Languages className="h-8 w-8 text-primary" />,
    title: "Multilingual Support",
    description:
      "Order in your preferred language with our comprehensive language support system.",
  },
];

export function Features() {
  return (
    <section className="py-16 relative overflow-hidden bg-background">
      {/* Background without vertical strips */}

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent inline-block mb-4">
            Why Choose TOT?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience seamless ordering with our innovative platform designed
            for your comfort
          </p>
        </motion.div>

        <div className="mb-16">
          <JapaneseHouseScene />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <FeatureCard feature={feature} index={index} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
