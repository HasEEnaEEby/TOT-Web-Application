import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import {
  Cherry,
  Clock,
  Menu,
  Sparkles,
  User,
  X
} from "lucide-react";
import React, { useState } from 'react';
import CircularLogo from '../1logo/logo';
import { ThemeToggle } from "../common/ThemeToggle";
import { Button } from "../common/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport
} from "../common/navigation-menu";

const FloatingIcon: React.FC<{ icon: React.ReactNode; delay?: number }> = ({ icon, delay = 0 }) => (
  <motion.div
    className="absolute"
    initial={{ y: 0 }}
    animate={{ 
      y: [-10, 10, -10],
      rotate: [-5, 5, -5]
    }}
    transition={{ 
      duration: 4,
      repeat: Infinity,
      delay,
      ease: "easeInOut" 
    }}
  >
    {icon}
  </motion.div>
);

interface NavItemProps {
  item: { title: string; path: string; submenu?: Array<{ title: string; path: string }> };
  index: number;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
}

const NavItem: React.FC<NavItemProps> = ({ 
  item, 
  index, 
  hoveredIndex, 
  setHoveredIndex 
}) => {
  return (
    <NavigationMenuItem className="relative">
      <motion.div
        onHoverStart={() => setHoveredIndex(index)}
        onHoverEnd={() => setHoveredIndex(null)}
        className="relative perspective-1000"
      >
        {item.submenu ? (
          <NavigationMenuTrigger
            className="px-4 py-2 transition-all duration-300 data-[state=open]:bg-accent/50
              transform-gpu hover:translate-y-[-2px] active:translate-y-[1px]"
          >
            <motion.span
              animate={hoveredIndex === index ? {
                textShadow: "0 0 8px rgba(255,255,255,0.5)"
              } : {}}
            >
              {item.title}
            </motion.span>
          </NavigationMenuTrigger>
        ) : (
          <NavigationMenuLink 
            href={item.path}
            className="px-4 py-2 transition-all duration-300 hover:bg-accent hover:text-accent-foreground inline-block
              transform-gpu hover:translate-y-[-2px] active:translate-y-[1px]"
          >
            <motion.span
              animate={hoveredIndex === index ? {
                textShadow: "0 0 8px rgba(255,255,255,0.5)"
              } : {}}
            >
              {item.title}
            </motion.span>
          </NavigationMenuLink>
        )}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: hoveredIndex === index ? "100%" : 0,
            opacity: hoveredIndex === index ? 1 : 0
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30
          }}
        />
        <motion.div
          className="absolute -right-2 -top-2 opacity-0"
          animate={{
            opacity: hoveredIndex === index ? 1 : 0,
            y: hoveredIndex === index ? -4 : 0
          }}
          transition={{ duration: 0.2 }}
        >
          <Cherry className="w-4 h-4 text-pink-400" />
        </motion.div>
      </motion.div>

      {item.submenu && (
        <NavigationMenuContent>
          <motion.ul
            initial={{ opacity: 0, y: 10, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: 10, rotateX: -10 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="p-4 w-64 grid gap-3 perspective-1000"
          >
            {item.submenu.map((subItem, subIndex) => (
              <motion.li
                key={subIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: subIndex * 0.1 }}
                className="relative"
                whileHover={{ x: 5 }}
              >
                <NavigationMenuLink
                  href={subItem.path}
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none 
                    transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {subItem.title}
                </NavigationMenuLink>
              </motion.li>
            ))}
          </motion.ul>
        </NavigationMenuContent>
      )}
    </NavigationMenuItem>
  );
};

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { scrollY } = useScroll();

  const headerHeight = useTransform(scrollY, [0, 100], ["6rem", "4rem"]);
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.8]);
  const backgroundOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);

  const menuItems = [
    {
      title: 'Home',
      path: '/'
    },
    {
      title: 'Restaurants',
      path: '/restaurants',
      submenu: [
        { title: 'Featured', path: '/restaurants/featured' },
        { title: 'Nearby', path: '/restaurants/nearby' },
        { title: 'Popular', path: '/restaurants/popular' }
      ]
    },
    {
      title: 'How It Works',
      path: '/how-it-works'
    }
  ];

  return (
    <motion.nav 
      style={{ 
        height: headerHeight,
        backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity})`
      }}
      className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <motion.div
        className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none"
        initial={false}
      >
        {[...Array(20)].map((_, i) => (
          <FloatingIcon
            key={i}
            icon={
              i % 2 === 0 ? 
                <Cherry className="text-pink-300 w-4 h-4" /> : 
                <Sparkles className="text-amber-300 w-3 h-3" />
            }
            delay={i * 0.2}
          />
        ))}
      </motion.div>

      <div className="container mx-auto px-4 h-full relative">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ scale: logoScale }}
            className="flex items-center space-x-2"
          >
            <CircularLogo />
          </motion.div>
          
          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {menuItems.map((item, index) => (
                <NavItem
                  key={index}
                  item={item}
                  index={index}
                  hoveredIndex={hoveredIndex}
                  setHoveredIndex={setHoveredIndex}
                />
              ))}
            </NavigationMenuList>
            <NavigationMenuViewport />
          </NavigationMenu>

          {/* Action Buttons */}
          <motion.div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ThemeToggle />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Button 
                variant="outline" 
                className="hidden md:flex"
              >
                <Clock className="mr-2 h-4 w-4" />
                Guest Mode
              </Button>
              <motion.div
                className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.5, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <Button className="relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20"
                  animate={{
                    x: ["0%", "100%", "0%"]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <User className="mr-2 h-4 w-4" />
                Sign In
              </Button>
              <motion.div
                className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-1000"
                style={{ zIndex: -1 }}
              />
            </motion.div>
            
            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-2 rounded-md hover:bg-accent relative group"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div
                className="absolute inset-0 rounded-md bg-accent opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ zIndex: -1 }}
                layoutId="menuBackground"
              />
            </motion.button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-64 bg-background shadow-lg md:hidden"
            >
              <div className="p-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="mb-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </motion.button>
                
                <motion.ul
                  initial="closed"
                  animate="open"
                  variants={{
                    open: {
                      transition: { staggerChildren: 0.07, delayChildren: 0.2 }
                    },
                    closed: {
                      transition: { staggerChildren: 0.05, staggerDirection: -1 }
                    }
                  }}
                  className="space-y-4"
                >
                  {menuItems.map((item, index) => (
                    <motion.li
                      key={index}
                      variants={{
                        open: {
                          y: 0,
                          opacity: 1,
                          transition: {
                            y: { stiffness: 1000, velocity: -100 }
                          }
                        },
                        closed: {
                          y: 50,
                          opacity: 0,
                          transition: {
                            y: { stiffness: 1000 }
                          }
                        }
                      }}
                      className="relative"
                    >
                      <motion.a
                        href={item.path}
                        className="block px-4 py-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
                        whileHover={{ x: 10 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {item.title}
                      </motion.a>
                      {item.submenu && (
                        <motion.ul
                          initial="closed"
                          animate="open"
                          variants={{
                            open: {
                              opacity: 1,
                              height: "auto",
                              transition: {
                                staggerChildren: 0.05
                              }
                            },
                            closed: {
                              opacity: 0,
                              height: 0
                            }
                          }}
                          className="pl-8 mt-2 space-y-2 overflow-hidden"
                        >
                          {item.submenu.map((subItem, subIndex) => (
                            <motion.li
                              key={subIndex}
                              variants={{
                                open: {
                                  x: 0,
                                  opacity: 1
                                },
                                closed: {
                                  x: -20,
                                  opacity: 0
                                }
                              }}
                            >
                              <motion.a
                                href={subItem.path}
                                className="block px-4 py-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
                                whileHover={{ x: 10 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              >
                                {subItem.title}
                              </motion.a>
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}