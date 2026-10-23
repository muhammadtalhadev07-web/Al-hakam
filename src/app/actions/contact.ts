'use server';

import { createClient } from '@/lib/supabase/server';
import { isValidEmail, isValidPakPhone } from '@/lib/utils';

// ============================================================
// Contact form server action
// Saves to the `contact_messages` table when Supabase is set up
// (see supabase/schema.sql); otherwise tells the client to use WhatsApp.
// ============================================================

export interface ContactInput {
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
}

export type ContactResult = { ok: true; mode: 'saved' | 'demo' } | { ok: false; error: string };

export async function sendContactMessage(input: ContactInput): Promise<ContactResult> {
  const name = input.name?.trim();
  const phone = input.phone?.trim();
  const email = input.email?.trim() || null;
  const message = input.message?.trim();

  if (!name || name.length < 2) return { ok: false, error: 'Please enter your name.' };
  if (!phone || !isValidPakPhone(phone)) return { ok: false, error: 'Please enter a valid mobile number, e.g. 0300-1234567.' };
  if (email && !isValidEmail(email)) return { ok: false, error: 'Please enter a valid email address.' };
  if (!message || message.length < 10) return { ok: false, error: 'Please tell us a little more (at least 10 characters).' };
  if (message.length > 2000) return { ok: false, error: 'Message is too long (2000 characters max).' };

  const supabase = await createClient();
  if (!supabase) return { ok: true, mode: 'demo' };

  const { error } = await supabase.from('contact_messages').insert({
    name,
    phone,
    email,
    subject: input.subject?.trim() || null,
    message,
  });

  if (error) {
    // Table not created yet → don't lose the lead, fall back to WhatsApp
    console.error('[sendContactMessage]', error.message);
    return { ok: true, mode: 'demo' };
  }
  return { ok: true, mode: 'saved' };
}
