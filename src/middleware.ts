import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from '@/lib/supabase/config';

// ============================================================
// Auth Middleware — refreshes the Supabase session & protects routes.
// (Next 16 calls this convention "proxy"; `middleware.ts` still works.)
// ============================================================

const PROTECTED_PREFIXES = ['/dashboard', '/admin'];

function redirectTo(request: NextRequest, pathname: string, withReturn = false) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = '';
  if (withReturn) url.searchParams.set('redirectTo', request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Demo mode: no Supabase credentials → nothing to refresh. Private areas
  // cannot work without a backend, so send visitors to the login page,
  // which explains how to configure Supabase.
  if (!isSupabaseConfigured()) {
    if (PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
      return redirectTo(request, '/auth/login', true);
    }
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: getUser() revalidates the token with Supabase (getSession() does not).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── /dashboard — signed-in users only ──
  if (pathname.startsWith('/dashboard') && !user) {
    return redirectTo(request, '/auth/login', true);
  }

  // ── /admin — admins only ──
  if (pathname.startsWith('/admin')) {
    if (!user) return redirectTo(request, '/auth/login', true);

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (profile?.role !== 'admin') return redirectTo(request, '/');
  }

  // ── Signed-in users don't need the auth pages — send them where they were going ──
  if (pathname.startsWith('/auth') && user) {
    const target = request.nextUrl.searchParams.get('redirectTo');
    const safe = target && target.startsWith('/') && !target.startsWith('//') ? target : '/dashboard';
    return NextResponse.redirect(new URL(safe, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    // Skip static assets, images and metadata files
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)',
  ],
};
