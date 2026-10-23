'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Clock, Phone, Shield, Star } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';
import { SplitText } from '@/components/motion/SplitText';
import { ButtonLink } from '@/components/ui/Button';
import { IMAGES } from '@/data/images';
import { primaryPhone } from '@/lib/site';
import { formatCurrency } from '@/lib/utils';

// ============================================================
// Hero — scroll-linked parallax: background zooms & drifts,
// content lifts and fades as you scroll past.
// ============================================================

const pills = [
  { icon: <Shield size={14} />, text: 'Fully insured' },
  { icon: <Star size={14} />, text: '4.9 average rating' },
  { icon: <Clock size={14} />, text: '24/7 support' },
];

export default function HeroSection({ startingPrice }: { startingPrice: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.25]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const cardX = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden">
      {/* Background */}
      <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0 -z-10">
        <Image src={IMAGES.heroCar} alt="Black Range Rover parked outside a modern building" fill priority sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-obsidian via-obsidian/80 to-obsidian/20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-obsidian via-transparent to-obsidian/40" />
      <div className="grid-bg absolute inset-0 -z-10 opacity-40" />

      {/* Floating gold orbs */}
      <div aria-hidden className="absolute -left-32 top-1/3 -z-10 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="mx-auto w-full max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="eyebrow">
            <span className="h-2 w-2 animate-pulse rounded-full bg-gold" />
            Pakistan&apos;s premier luxury car rental
          </motion.span>

          <h1 className="mt-6 text-5xl font-black leading-[1.02] text-white sm:text-7xl lg:text-8xl">
            <SplitText text="Drive in" onMount delay={0.15} />
            <br />
            <SplitText text="Absolute Luxury" onMount delay={0.35} wordClassName="gold-gradient" />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-text-gray"
          >
            World-class car rentals, chauffeur-driven luxury and hand-crafted tours across Pakistan. From a Lahore
            airport pick-up to a week in Hunza — every journey, perfected.
          </motion.p>

          <motion.ul
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.85 } } }}
            className="mt-7 flex flex-wrap gap-2"
          >
            {pills.map(({ icon, text }) => (
              <motion.li
                key={text}
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-text-gray backdrop-blur"
              >
                <span className="text-gold">{icon}</span>
                {text}
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-9 flex flex-col gap-4 sm:flex-row"
          >
            <ButtonLink href="/cars" size="lg" icon={<ArrowRight size={18} />} iconPosition="right">
              Explore Our Fleet
            </ButtonLink>
            <ButtonLink href={`tel:${primaryPhone.tel}`} variant="glass" size="lg" icon={<Phone size={16} />}>
              Call {primaryPhone.display}
            </ButtonLink>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating "starting price" card */}
      <motion.div
        style={{ x: cardX }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-28 right-8 hidden xl:block"
      >
        <div className="glass-card-gold animate-float p-5 shadow-2xl">
          <p className="text-xs uppercase tracking-widest text-text-muted">Rentals from</p>
          <p className="font-display text-3xl font-black gold-gradient">{formatCurrency(startingPrice)}</p>
          <p className="text-xs text-text-muted">per day · free delivery in Lahore</p>
        </div>
      </motion.div>
    </section>
  );
}
