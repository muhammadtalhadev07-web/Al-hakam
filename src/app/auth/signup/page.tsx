'use client';

import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Eye, EyeOff, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { AuthShell, AuthUnavailable, safeRedirect } from '@/components/auth/AuthShell';
import { Button, ButtonLink } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import { cn, isValidEmail } from '@/lib/utils';

// ============================================================
// Sign up
// The `profiles` row is created by a database trigger (see
// supabase/schema.sql) — inserting it from the browser fails under RLS
// when email confirmation is enabled.
// ============================================================

function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0–4
}

function SignupForm() {
  const router = useRouter();
  const redirectTo = safeRedirect(useSearchParams().get('redirectTo'));
  const loginHref = `/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`;
  const supabase = createClient();
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsConfirm, setNeedsConfirm] = useState(false);

  const strength = passwordStrength(form.password);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    setError(null);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    if (form.fullName.trim().length < 2) return setError('Please enter your full name.');
    if (!isValidEmail(form.email)) return setError('Please enter a valid email address.');
    if (form.password.length < 8) return setError('Password must be at least 8 characters.');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');

    setLoading(true);
    const { data, error: signupError } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: { full_name: form.fullName.trim(), phone: form.phone.trim() },
        emailRedirectTo: `${window.location.origin}${loginHref}`,
      },
    });
    setLoading(false);

    if (signupError) return setError(signupError.message);

    if (data.session && data.user) {
      // Email confirmation disabled → already signed in.
      // Best-effort profile row in case the DB trigger hasn't been installed yet.
      await supabase
        .from('profiles')
        .upsert(
          { id: data.user.id, email: data.user.email, full_name: form.fullName.trim(), phone: form.phone.trim() || null, role: 'customer' },
          { onConflict: 'id', ignoreDuplicates: true }
        );
      router.replace(redirectTo);
    } else {
      setNeedsConfirm(true);
    }
  };

  if (needsConfirm) {
    return (
      <AuthShell title="Check your inbox" subtitle="One more step to activate your account." footer={<Link href="/" className="text-gold">Back to home</Link>}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card-gold p-8 text-center">
          <CheckCircle2 size={48} className="mx-auto text-gold" />
          <p className="mt-4 text-text-gray">
            We sent a confirmation link to <strong className="text-white">{form.email}</strong>. Click it, then sign in.
          </p>
          <ButtonLink href={loginHref} size="lg" className="mt-6 w-full">Go to sign in</ButtonLink>
        </motion.div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Book faster and keep all your trips in one place."
      footer={
        <>
          Already have an account?{' '}
          <Link href={loginHref} className="font-medium text-gold hover:text-gold-light">Sign in</Link>
        </>
      }
    >
      {!supabase ? (
        <AuthUnavailable />
      ) : (
        <form onSubmit={handleSignup} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="field-label">Full name</label>
              <input id="fullName" value={form.fullName} onChange={set('fullName')} placeholder="Muhammad Ali" className="luxury-input" autoComplete="name" required />
            </div>
            <div>
              <label htmlFor="phone" className="field-label">Mobile</label>
              <input id="phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="0300-1234567" className="luxury-input" autoComplete="tel" />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="field-label">Email</label>
            <input id="email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" className="luxury-input" autoComplete="email" required />
          </div>
          <div>
            <label htmlFor="password" className="field-label">Password</label>
            <div className="relative">
              <input id="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Min. 8 characters" className="luxury-input pr-11" autoComplete="new-password" required />
              <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {form.password && (
              <div className="mt-2 flex gap-1" aria-label={`Password strength ${strength} of 4`}>
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className={cn('h-1 flex-1 rounded-full transition', i < strength ? (strength < 2 ? 'bg-red-400' : strength < 4 ? 'bg-amber-300' : 'bg-emerald-400') : 'bg-white/10')} />
                ))}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="field-label">Confirm password</label>
            <input id="confirmPassword" type="password" value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Repeat password" className="luxury-input" autoComplete="new-password" required />
          </div>

          {error && (
            <div role="alert" className="flex items-center gap-2 rounded-xl border border-accent-red/30 bg-accent-red/10 p-3 text-sm text-red-300">
              <AlertCircle size={16} className="shrink-0" /> {error}
            </div>
          )}

          <Button type="submit" size="lg" loading={loading} icon={<UserPlus size={16} />} iconPosition="right" className="w-full">
            Create Account
          </Button>
        </form>
      )}
    </AuthShell>
  );
}

export default function SignupPage() {
  // useSearchParams needs a Suspense boundary on statically rendered pages
  return (
    <Suspense fallback={<div className="min-h-screen bg-obsidian" />}>
      <SignupForm />
    </Suspense>
  );
}
