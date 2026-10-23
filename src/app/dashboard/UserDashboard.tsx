'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Car, Clock, Wallet } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { IMAGES, canOptimize } from '@/data/images';
import { calculateDays, formatCurrency, formatDate } from '@/lib/utils';
import type { Booking } from '@/types';

// ============================================================
// User Dashboard
// ============================================================

interface UserDashboardProps {
  name: string;
  email: string;
  bookings: Booking[];
}

export default function UserDashboard({ name, email, bookings }: UserDashboardProps) {
  const active = bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed');
  const past = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');
  const totalSpent = bookings.filter((b) => b.status !== 'cancelled').reduce((sum, b) => sum + Number(b.total_amount || 0), 0);

  const stats = [
    { icon: <Calendar size={20} />, label: 'Total bookings', value: bookings.length },
    { icon: <Clock size={20} />, label: 'Active bookings', value: active.length },
    { icon: <Wallet size={20} />, label: 'Total spent', value: formatCurrency(totalSpent) },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-text-muted">Welcome back,</p>
          <h1 className="text-4xl font-black text-white">
            {name.split(' ')[0]} <span className="gold-gradient">👋</span>
          </h1>
          <p className="mt-1 text-sm text-text-muted">{email}</p>
        </div>
        <ButtonLink href="/cars" icon={<Car size={16} />}>New booking</ButtonLink>
      </motion.div>

      <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ icon, label, value }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card flex items-center gap-4 p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gold-gradient-bg text-obsidian">{icon}</span>
            <span>
              <span className="block font-display text-2xl font-black text-white">{value}</span>
              <span className="block text-xs text-text-muted">{label}</span>
            </span>
          </motion.div>
        ))}
      </div>

      <section className="mb-12">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Active bookings</h2>
          <span className="text-xs text-text-muted">{active.length} booking{active.length === 1 ? '' : 's'}</span>
        </div>
        {active.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Car size={40} className="mx-auto text-gold/60" />
            <h3 className="mt-4 font-semibold text-white">No active bookings</h3>
            <p className="mb-6 mt-1 text-sm text-text-muted">Ready for your next journey?</p>
            <ButtonLink href="/cars" icon={<ArrowRight size={16} />} iconPosition="right">Browse the fleet</ButtonLink>
          </div>
        ) : (
          <div className="space-y-4">
            {active.map((b, i) => <BookingCard key={b.id} booking={b} index={i} />)}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="mb-5 text-2xl font-bold text-white">Booking history</h2>
          <div className="space-y-3">
            {past.map((b, i) => <BookingCard key={b.id} booking={b} index={i} compact />)}
          </div>
        </section>
      )}
    </div>
  );
}

function BookingCard({ booking, index, compact = false }: { booking: Booking; index: number; compact?: boolean }) {
  const days = calculateDays(booking.start_date, booking.end_date);
  const img = booking.car?.image_url || IMAGES.fallbackCar;

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="glass-card p-5 transition hover:border-gold/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {!compact && (
          <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl sm:w-36">
            <Image src={img} alt={booking.car?.name ?? 'Car'} fill sizes="144px" className="object-cover" unoptimized={!canOptimize(img)} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-white">
                {booking.car_id ? <Link href={`/cars/${booking.car_id}`} className="hover:text-gold">{booking.car?.name ?? 'Car'}</Link> : 'Car'}
              </h3>
              <p className="text-xs text-text-muted">
                {formatDate(booking.start_date)} → {formatDate(booking.end_date)} · {days} day{days === 1 ? '' : 's'}
              </p>
            </div>
            <Badge variant="status" status={booking.status}>{booking.status}</Badge>
          </div>
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <span>Booked {formatDate(booking.created_at)}</span>
            <span className="font-semibold text-gold">{formatCurrency(Number(booking.total_amount))}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
