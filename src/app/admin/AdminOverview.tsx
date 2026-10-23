'use client';

import { motion } from 'framer-motion';
import {
  DollarSign, Car, Calendar, Clock, TrendingUp, CheckCircle
} from 'lucide-react';
import { formatCompact, formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import type { Car as CarType, Booking } from '@/types';

// ============================================================
// Admin Overview / Analytics Dashboard
// ============================================================

interface AdminOverviewProps {
  cars: CarType[];
  bookings: Booking[];
}

export default function AdminOverview({ cars, bookings }: AdminOverviewProps) {
  const totalRevenue = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + Number(b.total_amount || 0), 0);
  const activeRentals = bookings.filter(b => b.status === 'confirmed').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const availableCars = cars.filter(c => c.is_available).length;

  const recentBookings = bookings.slice(0, 5);

  const stats = [
    {
      icon: <DollarSign size={22} />,
      label: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      sub: 'Excluding cancelled',
      color: '#E5C158',
    },
    {
      icon: <Car size={22} />,
      label: 'Available Cars',
      value: `${availableCars} / ${cars.length}`,
      sub: 'Fleet availability',
      color: '#22c55e',
    },
    {
      icon: <CheckCircle size={22} />,
      label: 'Active Rentals',
      value: activeRentals,
      sub: 'Currently confirmed',
      color: '#3b82f6',
    },
    {
      icon: <Clock size={22} />,
      label: 'Pending Approval',
      value: pendingBookings,
      sub: 'Awaiting confirmation',
      color: '#f59e0b',
    },
  ];

  // Monthly revenue (last 6 months)
  const monthlyData = getMonthlyRevenue(bookings);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ icon, label, value, sub, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-5"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={{ background: `${color}15`, border: `1px solid ${color}30` }}
            >
              <span style={{ color }}>{icon}</span>
            </div>
            <div
              className="text-2xl font-black mb-1"
              style={{ color, fontFamily: 'Outfit, sans-serif' }}
            >
              {value}
            </div>
            <div className="text-white text-sm font-medium">{label}</div>
            <div className="text-[#8A8A8A] text-xs">{sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Monthly Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-6 lg:col-span-3"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={18} className="text-[#E5C158]" />
            <h3 className="text-white font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Monthly Revenue
            </h3>
          </div>
          <div className="flex h-44 items-end gap-3">
            {monthlyData.map(({ month, revenue }, i) => {
              const maxRev = Math.max(...monthlyData.map(m => m.revenue), 1);
              const heightPct = (revenue / maxRev) * 100;
              return (
                <div key={month} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <div className="text-xs font-medium text-[#E5C158]">
                    {revenue > 0 ? formatCompact(revenue) : ''}
                  </div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(heightPct, 3)}%` }}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full rounded-t-lg gold-gradient-bg"
                    title={formatCurrency(revenue)}
                  />
                  <div className="text-xs text-[#8A8A8A]">{month}</div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Car Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <h3 className="text-white font-semibold mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>Fleet Status</h3>
          <div className="space-y-3">
            {cars.slice(0, 5).map((car) => (
              <div key={car.id} className="flex items-center justify-between gap-2">
                <div className="text-sm text-[#D1D1D1] truncate flex-1">{car.name}</div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border ${
                    car.is_available
                      ? 'text-green-400 bg-green-400/10 border-green-400/30'
                      : 'text-red-400 bg-red-400/10 border-red-400/30'
                  }`}
                >
                  {car.is_available ? 'Available' : 'Rented'}
                </span>
              </div>
            ))}
            {cars.length > 5 && (
              <p className="text-xs text-[#8A8A8A] pt-2">+{cars.length - 5} more vehicles</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card overflow-hidden"
      >
        <div className="flex items-center gap-2 p-5 border-b border-white/10">
          <Calendar size={18} className="text-[#E5C158]" />
          <h3 className="text-white font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Recent Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full luxury-table">
            <thead>
              <tr>
                <th className="text-left">Customer</th>
                <th className="text-left">Car</th>
                <th className="text-left">Dates</th>
                <th className="text-left">Amount</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-[#8A8A8A]">No bookings yet</td>
                </tr>
              ) : (
                recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <div className="text-white text-sm font-medium">{booking.customer_name}</div>
                      <div className="text-[#8A8A8A] text-xs">{booking.phone}</div>
                    </td>
                    <td className="text-[#D1D1D1]">{booking.car?.name || '—'}</td>
                    <td className="text-[#D1D1D1] text-xs">
                      {formatDate(booking.start_date)} → {formatDate(booking.end_date)}
                    </td>
                    <td className="text-[#E5C158] font-semibold">{formatCurrency(Number(booking.total_amount))}</td>
                    <td>
                      <Badge variant="status" status={booking.status}>
                        {booking.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

// ── Helper: compute last 6 months revenue ───────────────────

function getMonthlyRevenue(bookings: Booking[]) {
  const months: { month: string; revenue: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const now = new Date();
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1); // 1st of month avoids 31st→skip bugs
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleString('en-US', { month: 'short' });
    const revenue = bookings
      .filter(b => b.status !== 'cancelled' && b.created_at.startsWith(key))
      .reduce((sum, b) => sum + Number(b.total_amount || 0), 0);
    months.push({ month: label, revenue });
  }
  return months;
}
