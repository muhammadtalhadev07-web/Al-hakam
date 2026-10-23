'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate, calculateDays } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { Booking, BookingStatus } from '@/types';
import { whatsappLinkFor } from './adminUtils';

// ============================================================
// Admin Bookings Management
// ============================================================

interface AdminBookingsProps {
  initialBookings: Booking[];
}

type FilterStatus = BookingStatus | 'all';

export default function AdminBookings({ initialBookings }: AdminBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const updateStatus = async (id: string, status: BookingStatus) => {
    if (!supabase) return;
    if (status === 'cancelled' && !window.confirm('Cancel this booking?')) return;
    setUpdatingId(id);
    setError(null);
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (error) {
      // 23P01 = exclusion violation from the bookings_no_overlap DB constraint
      setError(
        error.code === '23P01'
          ? 'This car is already confirmed for overlapping dates. Cancel or reschedule the other booking first.'
          : `Could not update booking: ${error.message}`
      );
    } else {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    }
    setUpdatingId(null);
  };

  const q = query.trim().toLowerCase();
  const filtered = bookings.filter(b =>
    (filter === 'all' || b.status === filter) &&
    (!q || [b.customer_name, b.phone, b.email, b.car?.name].filter(Boolean).join(' ').toLowerCase().includes(q))
  );

  const statusCounts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Booking Management</h2>
          <p className="text-[#8A8A8A] text-sm">{bookings.length} total bookings</p>
        </div>
      </div>

      <input
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search by customer, phone, email or car…"
        aria-label="Search bookings"
        className="luxury-input max-w-md"
      />

      {error && (
        <div role="alert" className="p-3 rounded-xl bg-[#EA4335]/10 border border-[#EA4335]/30 text-[#EA4335] text-sm">{error}</div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as FilterStatus[]).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              filter === s
                ? 'gold-gradient-bg text-[#1A1A1A]'
                : 'bg-white/5 border border-white/10 text-[#D1D1D1] hover:bg-white/10'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${filter === s ? 'bg-[#1A1A1A]/20 text-[#1A1A1A]' : 'bg-white/10 text-[#8A8A8A]'}`}>
              {statusCounts[s]}
            </span>
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full luxury-table">
            <thead>
              <tr>
                <th className="text-left">Customer</th>
                <th className="text-left">Car</th>
                <th className="text-left">Dates</th>
                <th className="text-left">Days</th>
                <th className="text-left">Amount</th>
                <th className="text-left">Status</th>
                <th className="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#8A8A8A]">
                    No bookings found
                  </td>
                </tr>
              ) : (
                filtered.map((booking, i) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <td>
                      <div className="text-white text-sm font-medium">{booking.customer_name}</div>
                      <a href={whatsappLinkFor(booking.phone)} target="_blank" rel="noopener noreferrer" className="text-[#8A8A8A] text-xs hover:text-[#25D366]">{booking.phone}</a>
                      {booking.email && <div className="text-[#8A8A8A] text-xs">{booking.email}</div>}
                      {booking.notes && <div className="mt-1 max-w-56 truncate text-xs text-[#E5C158]/80" title={booking.notes}>📝 {booking.notes}</div>}
                    </td>
                    <td>
                      <div className="text-[#D1D1D1] text-sm">
                        {booking.car?.name || '—'}
                      </div>
                    </td>
                    <td>
                      <div className="text-[#D1D1D1] text-xs whitespace-nowrap">
                        {formatDate(booking.start_date)}
                      </div>
                      <div className="text-[#8A8A8A] text-xs whitespace-nowrap">
                        → {formatDate(booking.end_date)}
                      </div>
                    </td>
                    <td className="text-[#D1D1D1] text-sm">
                      {calculateDays(booking.start_date, booking.end_date)}d
                    </td>
                    <td>
                      <div className="text-[#E5C158] font-semibold text-sm whitespace-nowrap">
                        {formatCurrency(Number(booking.total_amount))}
                      </div>
                    </td>
                    <td>
                      <Badge variant="status" status={booking.status}>
                        {booking.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              aria-label="Confirm booking"
                              onClick={() => updateStatus(booking.id, 'confirmed')}
                              disabled={updatingId === booking.id}
                              className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all disabled:opacity-50"
                              title="Confirm"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              type="button"
                              aria-label="Cancel booking"
                              onClick={() => updateStatus(booking.id, 'cancelled')}
                              disabled={updatingId === booking.id}
                              className="p-1.5 rounded-lg bg-[#EA4335]/10 text-[#EA4335] hover:bg-[#EA4335]/20 transition-all disabled:opacity-50"
                              title="Cancel"
                            >
                              <X size={14} />
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            type="button"
                            aria-label="Mark booking complete"
                            onClick={() => updateStatus(booking.id, 'completed')}
                            disabled={updatingId === booking.id}
                            className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all disabled:opacity-50"
                            title="Mark Complete"
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}
                        {(booking.status === 'completed' || booking.status === 'cancelled') && (
                          <span className="text-[#8A8A8A] text-xs px-2">—</span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
