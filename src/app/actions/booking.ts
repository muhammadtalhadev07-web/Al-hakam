'use server';

import { createClient } from '@/lib/supabase/server';
import { calculateDays, getTodayString, isValidEmail, isValidPakPhone } from '@/lib/utils';

// ============================================================
// Booking server action
// The total is recalculated on the server from the car's real price,
// so a visitor can't tamper with the amount in the browser.
// ============================================================

export interface BookingInput {
  car_id: string;
  start_date: string;
  end_date: string;
  customer_name: string;
  phone: string;
  email?: string;
  notes?: string;
  with_driver?: boolean;
}

export type BookingResult =
  | { ok: true; mode: 'saved'; total: number; days: number }
  | { ok: true; mode: 'demo'; total: number; days: number }
  | { ok: false; error: string; code?: 'auth' };

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export async function createBooking(input: BookingInput, clientTotal: number): Promise<BookingResult> {
  // ── Validation ──
  const name = input.customer_name?.trim();
  const phone = input.phone?.trim();
  const email = input.email?.trim() || null; // falls back to the account email below

  if (!name || name.length < 2) return { ok: false, error: 'Please enter your full name.' };
  if (!phone || !isValidPakPhone(phone)) return { ok: false, error: 'Please enter a valid mobile number, e.g. 0300-1234567.' };
  if (email && !isValidEmail(email)) return { ok: false, error: 'Please enter a valid email address.' };
  if (!ISO_DATE.test(input.start_date) || !ISO_DATE.test(input.end_date)) return { ok: false, error: 'Please choose valid dates.' };
  if (input.start_date < getTodayString()) return { ok: false, error: 'Pick-up date cannot be in the past.' };
  if (input.end_date <= input.start_date) return { ok: false, error: 'Return date must be after the pick-up date.' };

  const days = calculateDays(input.start_date, input.end_date);
  if (days > 90) return { ok: false, error: 'For rentals longer than 90 days please contact us for a monthly plan.' };

  const supabase = await createClient();
  if (!supabase) {
    // Demo mode: accounts are unavailable, so bookings can't be stored
    return { ok: false, code: 'auth', error: 'Online booking needs an account. Please sign in first.' };
  }

  // Booking requires a signed-in user — enforced here, not just in the UI.
  // getUser() re-validates the session token with Supabase.
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, code: 'auth', error: 'Please sign in to book a car.' };

  // Demo car (cars table still empty) → no DB row to reference; client continues on WhatsApp
  if (input.car_id.startsWith('demo-')) {
    return { ok: true, mode: 'demo', total: clientTotal, days };
  }

  const { data: car, error: carError } = await supabase
    .from('cars')
    .select('id, price_per_day, is_available')
    .eq('id', input.car_id)
    .maybeSingle();

  if (carError || !car) return { ok: false, error: 'This car could not be found. Please refresh and try again.' };
  if (!car.is_available) return { ok: false, error: 'Sorry, this car has just been booked. Please choose another.' };

  const total = Number(car.price_per_day) * days;

  const notes = [input.with_driver ? '[Chauffeur requested]' : null, input.notes?.trim() || null]
    .filter(Boolean)
    .join(' ');

  const { error } = await supabase.from('bookings').insert({
    car_id: car.id,
    user_id: user.id,
    start_date: input.start_date,
    end_date: input.end_date,
    total_amount: total,
    status: 'pending',
    customer_name: name,
    phone,
    email: email ?? user.email ?? null,
    notes: notes || null,
  });

  if (error) {
    console.error('[createBooking]', error.message);
    return { ok: false, error: 'We could not save your booking right now. Please try again or WhatsApp us.' };
  }

  return { ok: true, mode: 'saved', total, days };
}
