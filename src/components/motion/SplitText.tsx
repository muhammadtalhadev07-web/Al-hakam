'use client';

import { motion } from 'framer-motion';

// ============================================================
// SplitText — animates a heading word by word
// ============================================================

interface SplitTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  /** animate on mount (hero) instead of when scrolled into view */
  onMount?: boolean;
}

export function SplitText({ text, className, wordClassName, delay = 0, onMount = false }: SplitTextProps) {
  const words = text.split(' ');
  const trigger = onMount ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, amount: 0.5 } };

  return (
    <motion.span
      className={className}
      initial="hidden"
      {...trigger}
      transition={{ staggerChildren: 0.08, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.12em] align-bottom" aria-hidden>
          <motion.span
            className={`inline-block ${wordClassName ?? ''}`}
            variants={{
              hidden: { y: '110%', rotate: 4 },
              show: { y: '0%', rotate: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
