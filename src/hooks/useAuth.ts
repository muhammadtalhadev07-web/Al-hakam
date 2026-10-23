'use client';

import type { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createClient } from '@/lib/supabase/client';

// ============================================================
// useAuth — current Supabase user for client components.
// `onAuthStateChange` emits INITIAL_SESSION straight away, so one
// subscription covers first load, sign-in, sign-out and token refresh.
// UI-only: anything sensitive is re-checked on the server.
// ============================================================

export interface AuthState {
  user: User | null;
  /** true until the first session check finishes */
  loading: boolean;
  /** false in demo mode (no Supabase keys) — accounts are unavailable */
  enabled: boolean;
}

export function useAuth(): AuthState {
  const enabled = isSupabaseConfigured();
  const [state, setState] = useState<{ user: User | null; loading: boolean }>({ user: null, loading: enabled });

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ user: session?.user ?? null, loading: false });
    });
    return () => subscription.unsubscribe();
  }, []);

  return { ...state, enabled };
}

/** Login URL that sends the visitor back to `returnTo` afterwards. */
export function loginUrl(returnTo: string): string {
  return `/auth/login?redirectTo=${encodeURIComponent(returnTo)}`;
}
