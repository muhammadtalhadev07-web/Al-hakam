'use client';

import { AlertCircle, Eye, EyeOff, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { AuthShell, AuthUnavailable, safeRedirect } from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

// ============================================================
// Login
// ============================================================

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = safeRedirect(searchParams.get('redirectTo'));
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!supabase) return <AuthUnavailable />;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setError(error.message === 'Invalid login credentials' ? 'Incorrect email or password.' : error.message);
      setLoading(false);
      return;
    }
    // One navigation only: a parallel router.refresh() would re-request /auth/login,
    // which the middleware now redirects (user is signed in) and races this one.
    // Dynamic pages (dashboard/admin) are never cached, so no refresh is needed.
    router.replace(redirectTo);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      <div>
        <label htmlFor="email" className="field-label">Email address</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="luxury-input" required autoComplete="email" />
      </div>
      <div>
        <label htmlFor="password" className="field-label">Password</label>
        <div className="relative">
          <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="luxury-input pr-11" required autoComplete="current-password" />
          <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition hover:text-white" aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="flex items-center gap-2 rounded-xl border border-accent-red/30 bg-accent-red/10 p-3 text-sm text-red-300">
          <AlertCircle size={16} className="shrink-0" /> {error}
        </div>
      )}

      <Button type="submit" size="lg" loading={loading} icon={<LogIn size={16} />} iconPosition="right" className="w-full">
        Sign In
      </Button>
    </form>
  );
}

function SignupLink() {
  // keep the return address when switching to sign-up
  const redirectTo = useSearchParams().get('redirectTo');
  const href = redirectTo ? `/auth/signup?redirectTo=${encodeURIComponent(safeRedirect(redirectTo))}` : '/auth/signup';
  return (
    <Link href={href} className="font-medium text-gold hover:text-gold-light">
      Create one
    </Link>
  );
}

function BookingNotice() {
  const redirectTo = useSearchParams().get('redirectTo') ?? '';
  if (!redirectTo.includes('book=1')) return null;
  return (
    <p className="mb-6 rounded-xl border border-gold/25 bg-gold/10 p-3 text-sm text-gold-light">
      Please sign in to complete your booking — you&apos;ll go straight back to the car.
    </p>
  );
}

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your bookings."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Suspense fallback={<Link href="/auth/signup" className="font-medium text-gold">Create one</Link>}>
            <SignupLink />
          </Suspense>
        </>
      }
    >
      <Suspense fallback={null}>
        <BookingNotice />
      </Suspense>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-white/5" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
