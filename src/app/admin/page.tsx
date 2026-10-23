import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Booking, Car, Profile } from '@/types';
import AdminLayout, { type ContactMessage } from './AdminLayout';

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: 'Al Hakam Tours admin dashboard',
  robots: { index: false },
};

// Always render per request (reads auth cookies)
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await createClient();
  if (!supabase) redirect('/auth/login?redirectTo=/admin');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login?redirectTo=/admin');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (profile?.role !== 'admin') redirect('/');

  const [cars, bookings, profiles, messages] = await Promise.all([
    supabase.from('cars').select('*').order('created_at', { ascending: false }),
    supabase.from('bookings').select('*, car:cars(name, image_url)').order('created_at', { ascending: false }),
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    // Optional table — returns an error (ignored) if not created yet
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(200),
  ]);

  return (
    <AdminLayout
      cars={(cars.data ?? []) as Car[]}
      bookings={(bookings.data ?? []) as Booking[]}
      profiles={(profiles.data ?? []) as Profile[]}
      messages={(messages.data ?? []) as ContactMessage[]}
    />
  );
}
