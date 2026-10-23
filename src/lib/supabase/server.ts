import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from './config';

// ============================================================
// Supabase Server Client (Server Components, Route Handlers, Actions)
// ============================================================

/** Returns a cookie-aware server client, or `null` when Supabase is not configured. */
export async function createClient(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured()) return null;
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component — safe to ignore because the
          // proxy/middleware refreshes the session on every request.
        }
      },
    },
  });
}

/**
 * Cookie-less client for public, cacheable reads (cars, tours …).
 * Does not touch cookies, so pages using it can be statically generated.
 */
export function createPublicClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: { getAll: () => [], setAll: () => {} },
  });
}
