import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

interface AuthButtonProps extends HTMLMotionProps<"button"> {
  isLoading?: boolean;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ isLoading, children, ...props }) => {
  return (
    <motion.button
      whileHover={!isLoading ? { scale: 1.05 } : {}}
      whileTap={!isLoading ? { scale: 0.95 } : {}}
      disabled={isLoading}
      className={`w-full py-3 px-6 rounded-lg font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-all ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </motion.button>
  );
};
