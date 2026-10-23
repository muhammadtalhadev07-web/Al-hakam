import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from './config';

// ============================================================
// Supabase Browser Client (for Client Components)
// One shared instance per tab — creating a client on every render
// leaks auth listeners and causes extra network work.
// ============================================================

let browserClient: SupabaseClient | null = null;

/** Returns the shared browser client, or `null` when Supabase is not configured. */
export function createClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!browserClient) {
    browserClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return browserClient;
}
