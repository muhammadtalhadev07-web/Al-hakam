'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Award, Clock, CreditCard, HeartHandshake, MapPin, Shield } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { IMAGES } from '@/data/images';

// ============================================================
// Why choose us — image with scroll-driven reveal + feature grid
// ============================================================

const features = [
  { icon: <Shield size={22} />, title: 'Fully insured', description: 'Comprehensive insurance on every vehicle for complete peace of mind.' },
  { icon: <Clock size={22} />, title: '24/7 support', description: 'Real people on call around the clock, wherever your journey takes you.' },
  { icon: <MapPin size={22} />, title: 'Nationwide coverage', description: 'Karachi to Khunjerab — we operate across every major city and route.' },
  { icon: <CreditCard size={22} />, title: 'Flexible payment', description: 'Cash, bank transfer, JazzCash, Easypaisa or monthly corporate invoices.' },
  { icon: <HeartHandshake size={22} />, title: 'Vetted chauffeurs', description: 'Background-checked, uniformed drivers who know every road.' },
  { icon: <Award size={22} />, title: 'Immaculate fleet', description: 'Late-model cars, detailed and inspected before every single trip.' },
];

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const clip = useTransform(scrollYProgress, [0, 1], ['inset(18% 18% 18% 18% round 2rem)', 'inset(0% 0% 0% 0% round 2rem)']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.3, 1]);

  return (
    <section className="relative overflow-hidden py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(229,193,88,0.07),transparent_60%)]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div ref={ref} className="relative aspect-[4/5] w-full">
          <motion.div style={{ clipPath: clip }} className="absolute inset-0 overflow-hidden">
            <motion.div style={{ scale: imgScale }} className="absolute inset-0">
              <Image src={IMAGES.driving} alt="Chauffeur driving a luxury car at dusk" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 to-transparent" />
          </motion.div>
          <Reveal delay={0.3} className="absolute -bottom-6 left-6 right-6 sm:left-auto sm:w-72">
            <div className="glass-card-gold p-5 backdrop-blur-xl">
              <p className="font-display text-4xl font-black gold-gradient">12+ years</p>
              <p className="mt-1 text-sm text-text-gray">of safe, on-time journeys across Pakistan.</p>
            </div>
          </Reveal>
        </div>

        <div>
          <Reveal>
            <span className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-gold" />Why choose us</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 text-4xl font-black leading-tight text-white sm:text-5xl">
              The <span className="gold-gradient">Al Hakam</span> difference
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 max-w-lg text-text-muted">We don&apos;t just rent cars — we look after people. That&apos;s why most of our clients come back.</p>
          </Reveal>

          <Stagger className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2" stagger={0.07}>
            {features.map(({ icon, title, description }) => (
              <StaggerItem key={title} className="group rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition hover:border-gold/20 hover:bg-gold/[0.03]">
                <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold transition group-hover:bg-gold group-hover:text-obsidian">
                  {icon}
                </span>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">{description}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
