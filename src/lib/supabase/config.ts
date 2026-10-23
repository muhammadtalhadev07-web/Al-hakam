// ============================================================
// Supabase configuration helpers
// ============================================================

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/**
 * True only when real Supabase credentials are present.
 * Lets the site run in "demo mode" (dummy data, WhatsApp bookings)
 * instead of crashing when .env.local is missing or still has placeholders.
 */
export function isSupabaseConfigured(): boolean {
  // https in production; http allowed only for a local Supabase (CLI: http://127.0.0.1:54321)
  const validUrl = SUPABASE_URL.startsWith('https://') || /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?/.test(SUPABASE_URL);
  return (
    validUrl &&
    SUPABASE_ANON_KEY.length > 20 &&
    !SUPABASE_URL.includes('your_supabase')
  );
}
