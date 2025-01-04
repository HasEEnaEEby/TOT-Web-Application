// FeatureCard.tsx
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

interface FeatureCardProps {
  feature: {
    icon: React.ReactNode;
    title: string;
    description: string;
  };
  index: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative bg-background p-8 rounded-xl shadow-lg overflow-hidden group"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      
      {/* Icon Container */}
      <motion.div
        animate={{
          scale: isHovered ? 1.1 : 1,
          rotate: isHovered ? 10 : 0
        }}
        className="p-4 bg-primary/10 rounded-2xl w-fit mb-6 relative"
      >
        <motion.div
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1.2 : 0.8
          }}
          className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl"
        />
        {feature.icon}
      </motion.div>

      {/* Content */}
      <h3 className="text-2xl font-bold mb-4 relative z-10">{feature.title}</h3>
      <p className="text-muted-foreground mb-6 relative z-10">
        {feature.description}
      </p>

      {/* Learn More Button */}
      <motion.button
        animate={{
          x: isHovered ? 5 : 0
        }}
        className="flex items-center text-primary font-medium group"
      >
        Learn More
        <motion.div
          animate={{
            x: isHovered ? 5 : 0,
            opacity: isHovered ? 1 : 0.5
          }}
          className="ml-2"
        >
          <ArrowRight className="h-4 w-4" />
        </motion.div>
      </motion.button>

      {/* Decorative Elements */}
      <motion.div
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.8
        }}
        className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"
      />
    </motion.div>
  );
};