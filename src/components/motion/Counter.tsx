'use client';

import { animate, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';

// ============================================================
// Counter — counts up from 0 when it scrolls into view
// ============================================================

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

const fmt = new Intl.NumberFormat('en-US');

export function Counter({ value, suffix = '', prefix = '', duration = 2, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;
    if (reduce) {
      node.textContent = `${prefix}${fmt.format(value)}${suffix}`;
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = `${prefix}${fmt.format(Math.round(v))}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix, prefix, duration, reduce]);

  // Server/initial render shows the final value (good for SEO & no-JS)
  return (
    <span ref={ref} className={className}>
      {prefix}
      {fmt.format(value)}
      {suffix}
    </span>
  );
}
