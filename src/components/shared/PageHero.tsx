'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, type ReactNode } from 'react';

// ============================================================
// Inner-page hero with parallax background and breadcrumb
// ============================================================

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  image: string;
  crumbs: { label: string; href?: string }[];
  children?: ReactNode;
}

export function PageHero({ eyebrow, title, subtitle, image, crumbs, children }: PageHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-[62vh] items-end overflow-hidden pb-16 pt-36">
      <motion.div style={{ y, scale }} className="absolute inset-0 -z-10">
        <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-obsidian/70 via-obsidian/60 to-obsidian" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_80%,rgba(229,193,88,0.15),transparent_55%)]" />

      <motion.div style={{ opacity }} className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.nav
          aria-label="Breadcrumb"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-text-gray">
            <li>
              <Link href="/" className="transition hover:text-gold">Home</Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.label} className="flex items-center gap-1.5">
                <ChevronRight size={12} className="text-gold/60" />
                {c.href ? (
                  <Link href={c.href} className="transition hover:text-gold">{c.label}</Link>
                ) : (
                  <span aria-current="page" className="text-gold">{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </motion.nav>

        <motion.span initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="eyebrow">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          {eyebrow}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-3xl text-balance text-5xl font-black leading-[1.05] text-white sm:text-6xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-5 max-w-2xl text-lg leading-relaxed text-text-gray"
          >
            {subtitle}
          </motion.p>
        )}
        {children && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mt-8">
            {children}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
