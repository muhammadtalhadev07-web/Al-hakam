'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Fuel, Star, Users, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { IMAGES, canOptimize } from '@/data/images';
import { cn, formatCurrency } from '@/lib/utils';
import type { Car } from '@/types';

// ============================================================
// Car Card — every action leads to the car's details page, where
// booking happens (and where login is required).
// ============================================================

interface CarCardProps {
  car: Car;
  index?: number;
}

export const categoryColors: Record<string, string> = {
  SUV: 'text-sky-300 bg-black/60 border-sky-400/40',
  Sedan: 'text-violet-300 bg-black/60 border-violet-400/40',
  Luxury: 'text-gold bg-black/60 border-gold/40',
  Van: 'text-emerald-300 bg-black/60 border-emerald-400/40',
};

export default function CarCard({ car, index = 0 }: CarCardProps) {
  const href = `/cars/${car.id}`;
  const [imgSrc, setImgSrc] = useState(car.image_url || IMAGES.fallbackCar);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group glass-card relative flex flex-col overflow-hidden transition-[border-color,box-shadow] duration-300 hover:border-gold/30 hover:shadow-2xl hover:shadow-gold/5"
    >
      {/* Image */}
      {/* Image link is a mouse convenience; keyboard/screen readers use the title and button links */}
      <Link href={href} tabIndex={-1} aria-hidden className="relative block h-56 overflow-hidden bg-charcoal">
        <Image
          src={imgSrc}
          alt={car.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          unoptimized={!canOptimize(imgSrc)}
          onError={() => setImgSrc(IMAGES.fallbackCar)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/10 to-transparent" />

        <span className={cn('absolute right-3 top-3 rounded-full border px-2.5 py-0.5 text-xs font-medium backdrop-blur', categoryColors[car.category] ?? 'border-white/20 bg-white/10 text-white')}>
          {car.category}
        </span>
        {!car.is_available && (
          <span className="absolute left-3 top-3 rounded-full border border-accent-red/50 bg-black/70 px-2.5 py-0.5 text-xs font-medium text-red-300 backdrop-blur">
            Currently booked
          </span>
        )}
        {car.rating ? (
          <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white backdrop-blur">
            <Star size={12} className="fill-gold text-gold" /> {car.rating.toFixed(1)}
          </span>
        ) : null}
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-white transition-colors group-hover:text-gold">
            <Link href={href}>{car.name}</Link>
          </h3>
          {car.year ? <span className="mt-1 text-xs text-text-muted">{car.year}</span> : null}
        </div>

        <ul className="mb-4 flex flex-wrap gap-2 text-xs text-text-gray">
          <Spec icon={<Users size={12} />}>{car.seats} Seats</Spec>
          <Spec icon={<Zap size={12} />}>{car.transmission}</Spec>
          {car.fuel && <Spec icon={<Fuel size={12} />}>{car.fuel}</Spec>}
        </ul>

        <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
          <div>
            <div className="font-display text-xl font-black gold-gradient">{formatCurrency(car.price_per_day)}</div>
            <div className="text-xs text-text-muted">per day</div>
          </div>
          <ButtonLink
            href={href}
            size="sm"
            variant={car.is_available ? 'gold' : 'glass'}
            icon={<ArrowRight size={14} />}
            iconPosition="right"
            aria-label={car.is_available ? `Book ${car.name}` : `View ${car.name} details`}
          >
            {car.is_available ? 'Book Now' : 'View Details'}
          </ButtonLink>
        </div>
      </div>
    </motion.article>
  );
}

function Spec({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
      <span className="text-gold">{icon}</span>
      {children}
    </li>
  );
}
