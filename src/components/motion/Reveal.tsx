'use client';

import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

// ============================================================
// Scroll-triggered reveal primitives
// ============================================================

type Direction = 'up' | 'down' | 'left' | 'right' | 'none' | 'zoom';

const offset = (direction: Direction, distance: number) => {
  switch (direction) {
    case 'up': return { y: distance };
    case 'down': return { y: -distance };
    case 'left': return { x: distance };
    case 'right': return { x: -distance };
    case 'zoom': return { scale: 0.92 };
    default: return {};
  }
};

const EASE = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  as?: 'div' | 'section' | 'li' | 'span' | 'article';
}

/** Fades + slides its children in when they scroll into view. */
export function Reveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  distance = 40,
  once = true,
  as = 'div',
}: RevealProps) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial={{ opacity: 0, filter: 'blur(6px)', ...offset(direction, distance) }}
      whileInView={{ opacity: 1, filter: 'blur(0px)', x: 0, y: 0, scale: 1 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Component>
  );
}

const container: Variants = {
  hidden: {},
  show: (stagger: number = 0.1) => ({ transition: { staggerChildren: stagger, delayChildren: 0.05 } }),
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 36, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE } },
};

/** Parent that staggers the reveal of its <StaggerItem> children. */
export function Stagger({
  children,
  className,
  stagger = 0.1,
  amount = 0.15,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={container}
      custom={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}
