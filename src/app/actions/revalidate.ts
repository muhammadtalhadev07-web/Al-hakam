'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

// ============================================================
// Refresh cached fleet pages after an admin changes a car.
// Car pages are cached for 5 minutes (ISR); without this a newly
// added car would 404 and edits would show late.
// ============================================================

export async function revalidateFleet(): Promise<void> {
  const supabase = await createClient();
  if (!supabase) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (profile?.role !== 'admin') return;

  revalidatePath('/', 'layout'); // home, /cars, /cars/[id], sitemap …
}
