"use client";

import React from "react";
import { motion } from "framer-motion";

type RevealDirection = "up" | "left" | "right";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  amount?: number;
  once?: boolean;
  direction?: RevealDirection;
}

const getOffset = (direction: RevealDirection) => {
  switch (direction) {
    case "left":
      return { x: 48, y: 0 };
    case "right":
      return { x: -48, y: 0 };
    default:
      return { x: 0, y: 44 };
  }
};

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 0.7,
  amount = 0.22,
  once = true,
  direction = "up",
}: ScrollRevealProps) {
  const offset = getOffset(direction);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{
        delay,
        duration,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
