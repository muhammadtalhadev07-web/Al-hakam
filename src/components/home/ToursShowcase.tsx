'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Clock, MapPin, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLayoutEffect, useRef, useState } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { TOURS } from '@/data/tours';
import { formatCurrency } from '@/lib/utils';
import type { Tour } from '@/types';

// ============================================================
// Tours — pinned section that scrolls horizontally as you scroll
// down (desktop). Mobile gets a native swipeable carousel.
// ============================================================

export default function ToursShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth + 64));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const progress = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <>
      {/* Desktop: pinned horizontal scroll */}
      <section ref={sectionRef} className="relative hidden md:block" style={{ height: `calc(100vh + ${distance}px)` }} aria-label="Tour packages">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div className="mx-auto mb-10 flex w-full max-w-7xl items-end justify-between gap-8 px-8">
            <div>
              <span className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-gold" />Tour packages</span>
              <h2 className="mt-5 text-5xl font-black leading-tight text-white">
                Discover Pakistan&apos;s <span className="gold-gradient">hidden gems</span>
              </h2>
            </div>
            <ButtonLink href="/tours" variant="outline" icon={<ArrowRight size={16} />} iconPosition="right">
              All tours
            </ButtonLink>
          </div>

          <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-6 pl-8 will-change-transform lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
            {TOURS.map((tour, i) => (
              <TourCard key={tour.slug} tour={tour} index={i} />
            ))}
          </motion.div>

          <div className="mx-auto mt-10 h-1 w-full max-w-7xl px-8">
            <div className="h-full overflow-hidden rounded-full bg-white/10">
              <motion.div style={{ width: progress }} className="h-full rounded-full gold-gradient-bg" />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile: swipe carousel */}
      <section className="py-24 md:hidden" aria-label="Tour packages">
        <div className="px-4">
          <span className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-gold" />Tour packages</span>
          <h2 className="mt-5 text-4xl font-black leading-tight text-white">
            Discover Pakistan&apos;s <span className="gold-gradient">hidden gems</span>
          </h2>
        </div>
        <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none]">
          {TOURS.map((tour, i) => (
            <div key={tour.slug} className="snap-start">
              <TourCard tour={tour} index={i} />
            </div>
          ))}
        </div>
        <div className="mt-6 px-4">
          <ButtonLink href="/tours" variant="outline" className="w-full" icon={<ArrowRight size={16} />} iconPosition="right">
            View all tours
          </ButtonLink>
        </div>
      </section>
    </>
  );
}

function TourCard({ tour, index }: { tour: Tour; index: number }) {
  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group relative block h-[440px] w-[78vw] shrink-0 overflow-hidden rounded-[2rem] border border-white/10 sm:w-[380px] lg:h-[480px] lg:w-[420px]"
    >
      <Image src={tour.image_url} alt={tour.title} fill sizes="420px" className="object-cover transition-transform duration-1000 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <span className="absolute left-5 top-5 font-display text-6xl font-black text-white/15">{String(index + 1).padStart(2, '0')}</span>
      <span className="absolute right-5 top-5 flex items-center gap-1 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur">
        <Star size={12} className="fill-gold text-gold" /> {tour.rating}
      </span>
      <div className="absolute inset-x-0 bottom-0 p-6">
        <div className="mb-3 flex flex-wrap gap-3 text-xs text-text-gray">
          <span className="flex items-center gap-1"><MapPin size={12} className="text-gold" /> {tour.region}</span>
          <span className="flex items-center gap-1"><Clock size={12} className="text-gold" /> {tour.duration_days} day{tour.duration_days > 1 ? 's' : ''}</span>
        </div>
        <h3 className="text-2xl font-bold text-white">{tour.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-text-gray">{tour.summary}</p>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm text-text-muted">
            from <span className="font-display text-lg font-bold text-gold">{formatCurrency(tour.price_from)}</span>
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-500 group-hover:bg-gold group-hover:text-obsidian">
            <ArrowRight size={18} />
          </span>
        </div>
      </div>
    </Link>
  );
}
