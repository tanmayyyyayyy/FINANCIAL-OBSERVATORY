import React, { useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Animmaster-style Interactive Spring Hover Card
 *
 * Micro-interaction card featuring subtle cursor-tracking spotlight and spring motion.
 * Designed to complement the Apple x Linear x Raycast dark aesthetic of Financial Observatory.
 *
 * Attribution: Adapted for React/Vite from Animmaster Lib interaction design patterns.
 * License: Free open adaptation. Commercial/PRO components require license from https://animmasterlib.dev/
 */
export interface AnimmasterHoverCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function AnimmasterHoverCard({
  children,
  className,
  glowColor = "rgba(255, 255, 255, 0.08)",
  ...props
}: AnimmasterHoverCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const reduceMotion = useReducedMotion();

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setMousePosition({ x: -100, y: -100 });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#0c0c0e]/80 p-5 backdrop-blur-md transition-colors",
        "focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/20",
        className
      )}
      {...(props as any)}
    >
      {/* Dynamic Cursor Spotlight Effect */}
      {!reduceMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(420px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}, transparent 60%)`,
          }}
        />
      )}

      {/* Content wrapper */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

export default AnimmasterHoverCard;
