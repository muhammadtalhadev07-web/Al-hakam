import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Booking } from '@/types';
import UserDashboard from './UserDashboard';

export const metadata: Metadata = {
  title: 'My Dashboard',
  description: 'View and manage your car rental bookings with Al Hakam Tours.',
  robots: { index: false },
};

// Always render per request (reads auth cookies)
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  if (!supabase) redirect('/auth/login?redirectTo=/dashboard');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login?redirectTo=/dashboard');

  const [{ data: bookings }, { data: profile }] = await Promise.all([
    supabase.from('bookings').select('*, car:cars(*)').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle(),
  ]);

  const name = profile?.full_name || (user.user_metadata?.full_name as string | undefined) || user.email || 'there';

  return (
    <main className="mesh-bg min-h-screen pb-24 pt-32">
      <UserDashboard name={name} email={user.email ?? ''} bookings={(bookings ?? []) as Booking[]} />
    </main>
  );
}
