'use client';

import { motion } from 'framer-motion';
import { AlertCircle, Calendar, CheckCircle2, Mail, MessageSquare, Phone, User, UserCheck, Users, Zap } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState, useTransition } from 'react';
import { createBooking, type BookingResult } from '@/app/actions/booking';
import { WhatsAppIcon } from '@/components/shared/SocialIcons';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { IMAGES, canOptimize } from '@/data/images';
import { primaryPhone, whatsappLink } from '@/lib/site';
import { addDays, calculateDays, cn, formatCurrency, formatDate, getTodayString } from '@/lib/utils';
import type { User as AuthUser } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { loginUrl } from '@/hooks/useAuth';
import type { Car } from '@/types';

// ============================================================
// Booking Modal — only opened for signed-in users (see BookActions).
// Contact details are pre-filled from the account.
// ============================================================

interface BookingModalProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
  /** signed-in user, used to pre-fill name / phone / email */
  user?: AuthUser | null;
}

function contactFromUser(user?: AuthUser | null) {
  const meta = (user?.user_metadata ?? {}) as { full_name?: string; phone?: string };
  return { customer_name: meta.full_name ?? '', phone: meta.phone ?? '', email: user?.email ?? '' };
}

interface FormState {
  start_date: string;
  end_date: string;
  customer_name: string;
  phone: string;
  email: string;
  notes: string;
  with_driver: boolean;
}

const emptyForm = (): FormState => {
  const today = getTodayString();
  return {
    start_date: today,
    end_date: addDays(today, 1),
    customer_name: '',
    phone: '',
    email: '',
    notes: '',
    with_driver: false,
  };
};

export default function BookingModal({ car, isOpen, onClose, user }: BookingModalProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => ({ ...emptyForm(), ...contactFromUser(user) }));
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Extract<BookingResult, { ok: true }> | null>(null);
  const [pending, startTransition] = useTransition();

  // Fresh dates/result each time the modal opens (contact details are kept).
  // "Adjust state during render" pattern — avoids an extra effect pass.
  const sessionKey = isOpen ? (car?.id ?? '') : null;
  const [prevSessionKey, setPrevSessionKey] = useState<string | null>(null);
  if (sessionKey !== prevSessionKey) {
    setPrevSessionKey(sessionKey);
    if (sessionKey !== null) {
      const account = contactFromUser(user);
      setForm((prev) => ({
        ...emptyForm(),
        customer_name: prev.customer_name || account.customer_name,
        phone: prev.phone || account.phone,
        email: prev.email || account.email,
      }));
      setError(null);
      setResult(null);
    }
  }

  const today = getTodayString();
  const days = calculateDays(form.start_date, form.end_date);
  const driverRate = car?.driver_price_per_day ?? 0;
  const total = useMemo(() => {
    if (!car) return 0;
    return car.price_per_day * days + (form.with_driver ? driverRate * days : 0);
  }, [car, days, form.with_driver, driverRate]);

  if (!car) return null;

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      // Keep return date after pick-up date
      if (key === 'start_date' && next.end_date <= next.start_date) next.end_date = addDays(next.start_date, 1);
      return next;
    });
    setError(null);
  };

  const whatsappMessage = [
    `Assalam o Alaikum! I'd like to book the *${car.name}*.`,
    `📅 ${formatDate(form.start_date)} → ${formatDate(form.end_date)} (${days} day${days > 1 ? 's' : ''})`,
    form.with_driver ? '🧑‍✈️ With chauffeur' : '🚗 Self-drive',
    `💰 Estimated total: ${formatCurrency(result?.total ?? total)}`,
    `👤 ${form.customer_name} — ${form.phone}`,
    form.notes ? `📝 ${form.notes}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await createBooking(
        {
          car_id: car.id,
          start_date: form.start_date,
          end_date: form.end_date,
          customer_name: form.customer_name,
          phone: form.phone,
          email: form.email,
          notes: form.notes,
          with_driver: form.with_driver,
        },
        total
      );
      if (res.ok) setResult(res);
      else if (res.code === 'auth') router.push(loginUrl(`/cars/${car.id}?book=1`)); // session expired
      else setError(res.error);
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      {result ? (
        <div className="space-y-5 p-8 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 14 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full gold-gradient-bg shadow-xl shadow-gold/30"
          >
            <CheckCircle2 size={40} className="text-obsidian" />
          </motion.div>
          <h3 className="text-2xl font-bold text-white">
            {result.mode === 'saved' ? 'Booking request received!' : 'Almost done!'}
          </h3>
          <p className="text-text-gray">
            {result.mode === 'saved' ? (
              <>
                Thank you, <strong className="text-white">{form.customer_name}</strong>. Your request for{' '}
                <strong className="text-gold">{car.name}</strong> is saved. We&apos;ll call{' '}
                <strong className="text-white">{form.phone}</strong> shortly to confirm.
              </>
            ) : (
              <>
                Send your booking details to our team on WhatsApp and we&apos;ll confirm{' '}
                <strong className="text-gold">{car.name}</strong> within minutes.
              </>
            )}
          </p>
          <div className="glass-card-gold space-y-2 p-4 text-left text-sm text-text-gray">
            <Row label="Dates" value={`${formatDate(form.start_date)} → ${formatDate(form.end_date)}`} />
            <Row label="Duration" value={`${result.days} day${result.days > 1 ? 's' : ''}`} />
            <Row label="Estimated total" value={formatCurrency(result.total)} gold />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink
              href={whatsappLink(whatsappMessage)}
              className={cn('flex-1', result.mode === 'demo' && 'border-[#25D366] bg-[#25D366] font-semibold text-white hover:bg-[#1fb857]')}
              variant="glass"
              icon={<WhatsAppIcon className="h-5 w-5" />}
            >
              {result.mode === 'demo' ? 'Send on WhatsApp' : 'Also WhatsApp us'}
            </ButtonLink>
            {result.mode === 'saved' ? (
              <ButtonLink href="/dashboard" className="flex-1">
                View my bookings
              </ButtonLink>
            ) : (
              <Button variant="glass" onClick={onClose} className="flex-1">
                Done
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Car summary */}
          <div className="relative h-52 overflow-hidden rounded-t-3xl">
            <Image
              src={car.image_url || IMAGES.fallbackCar}
              alt={car.name}
              fill
              sizes="672px"
              className="object-cover"
              unoptimized={!canOptimize(car.image_url || IMAGES.fallbackCar)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1b1b1b] via-[#1b1b1b]/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{car.name}</h2>
                <div className="mt-1 flex items-center gap-3 text-sm text-text-gray">
                  <span className="flex items-center gap-1"><Users size={13} /> {car.seats} seats</span>
                  <span className="flex items-center gap-1"><Zap size={13} /> {car.transmission}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-xl font-black gold-gradient">{formatCurrency(car.price_per_day)}</div>
                <div className="text-xs text-text-muted">per day</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-6" noValidate>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Pick-up date" icon={<Calendar size={12} />} htmlFor="start_date">
                <input id="start_date" type="date" value={form.start_date} min={today} onChange={(e) => update('start_date', e.target.value)} className="luxury-input" required />
              </Field>
              <Field label="Return date" icon={<Calendar size={12} />} htmlFor="end_date">
                <input id="end_date" type="date" value={form.end_date} min={addDays(form.start_date, 1)} onChange={(e) => update('end_date', e.target.value)} className="luxury-input" required />
              </Field>
            </div>

            {driverRate > 0 && (
              <button
                type="button"
                role="switch"
                aria-checked={form.with_driver}
                onClick={() => update('with_driver', !form.with_driver)}
                className={cn(
                  'flex w-full items-center justify-between rounded-2xl border p-4 text-left transition',
                  form.with_driver ? 'border-gold/40 bg-gold/10' : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                )}
              >
                <span className="flex items-center gap-3">
                  <UserCheck size={18} className="text-gold" />
                  <span>
                    <span className="block text-sm font-medium text-white">Add a professional chauffeur</span>
                    <span className="block text-xs text-text-muted">+{formatCurrency(driverRate)} / day</span>
                  </span>
                </span>
                <span className={cn('relative h-6 w-11 rounded-full transition', form.with_driver ? 'gold-gradient-bg' : 'bg-white/15')}>
                  <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', form.with_driver ? 'translate-x-[22px]' : 'translate-x-0.5')} />
                </span>
              </button>
            )}

            {/* Live price */}
            <motion.div layout className="glass-card-gold flex items-center justify-between p-4">
              <div className="text-sm text-text-gray">
                {days} day{days > 1 ? 's' : ''} × {formatCurrency(car.price_per_day)}
                {form.with_driver && <span className="block text-xs text-text-muted">+ chauffeur {formatCurrency(driverRate * days)}</span>}
              </div>
              <motion.div key={total} initial={{ scale: 1.15, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="font-display text-2xl font-black gold-gradient">
                {formatCurrency(total)}
              </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full name *" icon={<User size={12} />} htmlFor="customer_name">
                <input id="customer_name" type="text" autoComplete="name" value={form.customer_name} onChange={(e) => update('customer_name', e.target.value)} placeholder="Muhammad Ali" className="luxury-input" required />
              </Field>
              <Field label="Mobile *" icon={<Phone size={12} />} htmlFor="phone">
                <input id="phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="0300-1234567" className="luxury-input" required />
              </Field>
            </div>

            <Field label="Email (optional)" icon={<Mail size={12} />} htmlFor="email">
              <input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" className="luxury-input" />
            </Field>

            <Field label="Special requests (optional)" icon={<MessageSquare size={12} />} htmlFor="notes">
              <textarea id="notes" rows={3} maxLength={500} value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Pick-up address, child seat, airport flight number…" className="luxury-input resize-none" />
            </Field>

            {error && (
              <motion.div role="alert" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 rounded-xl border border-accent-red/30 bg-accent-red/10 p-3 text-sm text-red-300">
                <AlertCircle size={16} className="shrink-0" /> {error}
              </motion.div>
            )}

            <Button type="submit" size="lg" loading={pending} className="w-full">
              Confirm Booking Request
            </Button>
            <p className="text-center text-xs text-text-muted">
              No payment now. Our team will confirm on <strong className="text-gold">{primaryPhone.display}</strong>.
            </p>
          </form>
        </>
      )}
    </Modal>
  );
}

function Field({ label, icon, htmlFor, children }: { label: string; icon?: React.ReactNode; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="field-label flex items-center gap-1.5">
        {icon} {label}
      </label>
      {children}
    </div>
  );
}

function Row({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span>{label}</span>
      <span className={gold ? 'font-bold text-gold' : 'font-medium text-white'}>{value}</span>
    </div>
  );
}
