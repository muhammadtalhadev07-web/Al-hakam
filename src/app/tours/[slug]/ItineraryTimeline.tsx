'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import type { TourDay } from '@/types';

// Itinerary whose gold progress line fills as you read down the days
export default function ItineraryTimeline({ days }: { days: TourDay[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 50%'] });
  const height = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <ol ref={ref} className="relative space-y-8 pl-14">
      <span className="absolute left-5 top-2 h-[calc(100%-1rem)] w-px bg-white/10" aria-hidden />
      <motion.span style={{ height }} className="absolute left-5 top-2 w-px bg-gradient-to-b from-gold to-gold-dark" aria-hidden />
      {days.map((d) => (
        <motion.li
          key={d.day}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <span className="absolute -left-14 top-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-obsidian gold-gradient-bg text-sm font-black text-obsidian">
            {d.day}
          </span>
          <div className="glass-card p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">Day {d.day}</p>
            <h3 className="mt-1 text-lg font-bold text-white">{d.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-text-muted">{d.description}</p>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
