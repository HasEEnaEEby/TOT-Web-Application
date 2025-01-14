import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import {
    ChefHat,
    Coffee,
    Soup,
    Sparkles,
    UtensilsCrossed,
} from "lucide-react";
import React, { useEffect, useState } from 'react';

interface CircularLogoProps {
  scale?: number;
}

export const CircularLogo: React.FC<CircularLogoProps> = ({ scale = 1 }) => {
  const [stage, setStage] = useState(0);
  const controls = useAnimation();
  const [particles, setParticles] = useState<{ x: number; y: number; scale: number; rotation: number }[]>([]);

  const foodItems = [
    { icon: UtensilsCrossed, name: '寿司', color: 'text-red-500', bgColor: 'from-red-500' },
    { icon: Soup, name: 'ラーメン', color: 'text-amber-500', bgColor: 'from-amber-500' },
    { icon: Coffee, name: '抹茶', color: 'text-emerald-500', bgColor: 'from-emerald-500' },
    { icon: UtensilsCrossed, name: '刺身', color: 'text-blue-500', bgColor: 'from-blue-500' },
    { icon: Coffee, name: 'カフェ', color: 'text-purple-500', bgColor: 'from-purple-500' },
    { icon: ChefHat, name: '天ぷら', color: 'text-orange-500', bgColor: 'from-orange-500' }
  ];

  useEffect(() => {
    controls.start({
      rotate: 360,
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }
    });

    const interval = setInterval(() => {
      setStage(prev => (prev + 1) % foodItems.length);
      setParticles(Array.from({ length: 5 }, () => ({
        x: (Math.random() - 0.5) * 50, // Reduced particle spread
        y: (Math.random() - 0.5) * 50,
        scale: Math.random() * 0.3 + 0.2, // Smaller particles
        rotation: Math.random() * 360
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="relative w-12 h-12 cursor-pointer group" // Reduced from w-20 h-20
      style={{ transform: `scale(${scale})` }}
    >
      {/* Particle Effects */}
      <AnimatePresence>
        {particles.map((particle, index) => (
          <motion.div
            key={`particle-${stage}-${index}`}
            initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
            animate={{ 
              x: particle.x,
              y: particle.y,
              scale: particle.scale,
              rotate: particle.rotation,
              opacity: 0
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2"
          >
            <Sparkles className={`w-2 h-2 ${foodItems[stage].color}`} /> {/* Reduced from w-3 h-3 */}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Rotating Outer Ring */}
      <motion.div 
        className="absolute inset-0"
        animate={controls}
      >
        {foodItems.map((Item, index) => {
          const angle = (index * 60) * (Math.PI / 180);
          const x = Math.cos(angle) * 20; 
          const y = Math.sin(angle) * 20;
          
          return (
            <motion.div
              key={index}
              className={`absolute left-1/2 top-1/2 -ml-2 -mt-2
                transition-all duration-500 hover:z-10
                ${stage === index ? 'scale-125' : 'scale-100'}`}
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
              whileHover={{ scale: 1.5, rotate: 360 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Item.icon 
                className={`w-4 h-4 ${Item.color} transition-transform
                  group-hover:scale-110 filter drop-shadow-lg`} // Reduced from w-6 h-6
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Central TOT Logo */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          scale: [1, 1.1, 1],
          rotateY: [0, 180, 360],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="relative w-8 h-8 rounded-full bg-white shadow-xl 
          flex items-center justify-center overflow-hidden
          group-hover:shadow-2xl transition-shadow duration-300
          backdrop-blur-sm bg-white/90"> {/* Reduced from w-14 h-14 */}
          <div className="absolute inset-0 bg-gradient-to-r from-current to-transparent opacity-5" />
          
          <h1 
            className={`text-sm font-black tracking-tight text-transparent bg-clip-text 
              bg-gradient-to-br ${foodItems[stage].bgColor} to-orange-500
              transition-all duration-500 transform-gpu`} // Reduced from text-xl
            style={{ 
              fontFamily: "'Yuji Syuku', serif",
              writingMode: stage % 2 === 0 ? 'horizontal-tb' : 'vertical-rl'
            }}
          >
            TOT
          </h1>
        </div>
      </motion.div>

      {/* Decorative Rings */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`ring-${i}`}
            className={`absolute inset-0 rounded-full border border-current opacity-10
              ${foodItems[stage].color} transition-colors duration-500
              backdrop-blur-sm`}
            animate={{
              rotate: 360,
              scale: [1 + i * 0.1, 1 + i * 0.15, 1 + i * 0.1],
            }}
            transition={{
              rotate: {
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "linear"
              },
              scale: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CircularLogo;