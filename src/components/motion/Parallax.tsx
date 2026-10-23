'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

// ============================================================
// Parallax — moves its content at a different speed while scrolling
// ============================================================

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Pixels travelled across the element's scroll range (negative = upward). */
  offset?: number;
}

export function Parallax({ children, className, offset = 80 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="h-full w-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
