'use client';

import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

// Respect the visitor's OS "reduce motion" setting for every animation
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
