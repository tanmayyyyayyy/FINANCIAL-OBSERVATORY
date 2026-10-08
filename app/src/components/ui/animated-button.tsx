"use client";

import React from "react";
import { motion, type MotionProps, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimatedButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  MotionProps & {
    children?: React.ReactNode;
    as?: any;
  };

/**
 * AnimatedButton
 * - micro-motion spring button with subtle shine and tap feedback
 * - respects prefers-reduced-motion
 * - accepts all native button props
 */
const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children = "Browse Components",
  className = "",
  as = "button",
  ...rest
}) => {
  const Component = (motion as any)[as] || motion.button;
  const reduceMotion = useReducedMotion();

  return (
    <Component
      {...rest}
      whileHover={reduceMotion ? undefined : { scale: 1.015 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 450,
        damping: 25,
        mass: 0.5,
      }}
      className={cn(
        "group relative overflow-hidden transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    >
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </Component>
  );
};

export { AnimatedButton };
export default AnimatedButton;
