'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Logo } from '@/components/shared/Logo';
import { IMAGES } from '@/data/images';
import { primaryPhone } from '@/lib/site';

// Split-screen layout for login / signup
export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  return (
    <main className="grid min-h-screen grid-cols-1 bg-obsidian lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <motion.div initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0">
          <Image src={IMAGES.silhouette} alt="" fill priority sizes="50vw" className="object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-obsidian/20" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-5xl font-black leading-tight text-white">
            Every journey, <span className="gold-gradient">perfected.</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-4 max-w-md text-text-gray">
            Manage your bookings, track confirmations and re-book your favourite cars in seconds.
          </motion.p>
        </div>
      </div>

      <div className="mesh-bg relative flex items-center justify-center p-6 sm:p-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
          <div className="mb-10 flex items-center justify-between">
            <Logo />
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-text-muted transition hover:text-gold">
              <ArrowLeft size={14} /> Home
            </Link>
          </div>
          <h1 className="text-3xl font-black text-white">{title}</h1>
          <p className="mt-2 text-text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-text-muted">{footer}</div>
        </motion.div>
      </div>
    </main>
  );
}

export function AuthUnavailable() {
  return (
    <div className="flex gap-3 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">
      <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-300" />
      <p>
        Online accounts are not available yet. You can still book any car from the fleet page or call us on{' '}
        <a href={`tel:${primaryPhone.tel}`} className="font-semibold text-gold underline">{primaryPhone.display}</a>.
        <span className="mt-1 block text-xs opacity-70">
          (Developer note: add your Supabase keys to <code>.env.local</code> to enable sign-in.)
        </span>
      </p>
    </div>
  );
}

/** Only allow same-site relative redirects (prevents open-redirect attacks). */
export function safeRedirect(target: string | null, fallback = '/dashboard'): string {
  if (!target || !target.startsWith('/') || target.startsWith('//')) return fallback;
  return target;
}
