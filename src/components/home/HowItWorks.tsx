'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { PROCESS_STEPS } from '@/data/content';

// Vertical timeline whose gold line "draws" itself as you scroll
export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section className="relative overflow-hidden bg-ink py-28">
      <div className="grid-bg absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title={<>Booked in <span className="gold-gradient">four easy steps</span></>}
          subtitle="No paperwork marathons, no hidden charges. Most bookings are confirmed in under ten minutes."
        />

        <div ref={ref} className="relative">
          {/* Track + animated progress line */}
          <div className="absolute left-6 top-0 h-full w-px bg-white/10 md:left-1/2 md:-translate-x-1/2" />
          <motion.div style={{ height: lineHeight }} className="absolute left-6 top-0 w-px origin-top bg-gradient-to-b from-gold to-gold-dark md:left-1/2 md:-translate-x-1/2" />

          <ol className="space-y-16">
            {PROCESS_STEPS.map((step, i) => {
              const right = i % 2 === 1;
              return (
                <li key={step.title} className="relative grid grid-cols-1 md:grid-cols-2 md:gap-16">
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                    className="absolute left-6 top-1 z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border-4 border-ink gold-gradient-bg font-display text-lg font-black text-obsidian shadow-lg shadow-gold/30 md:left-1/2"
                  >
                    {i + 1}
                  </motion.span>
                  <motion.div
                    initial={{ opacity: 0, x: right ? 60 : -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className={`glass-card ml-16 p-6 md:ml-0 ${right ? 'md:col-start-2' : 'md:text-right'}`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-widest text-gold">Step {i + 1}</p>
                    <h3 className="mt-2 text-2xl font-bold text-white">{step.title}</h3>
                    <p className="mt-2 text-text-muted">{step.text}</p>
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
