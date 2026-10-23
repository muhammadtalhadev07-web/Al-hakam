'use client';

import { CalendarCheck, LogIn } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import BookingModal from '@/components/cars/BookingModal';
import { Button } from '@/components/ui/Button';
import { loginUrl, useAuth } from '@/hooks/useAuth';
import type { Car } from '@/types';

// ============================================================
// Auth-gated "Book this car" button
//  • signed in  → opens the booking form (pre-filled from the account)
//  • signed out → login page, then straight back here with the form open
//    (/auth/login?redirectTo=/cars/<id>?book=1)
// The server action re-checks the session, so this is UX, not security.
// ============================================================

export default function BookActions({ car }: { car: Car }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [autoOpened, setAutoOpened] = useState(false);

  const wantsToBook = searchParams.get('book') === '1';
  const returnTo = `${pathname}?book=1`;

  // Back from login with ?book=1 → open the form once (adjust-state-during-render pattern)
  if (wantsToBook && !autoOpened && !loading && user && car.is_available) {
    setAutoOpened(true);
    setOpen(true);
  }

  // Drop ?book=1 from the address bar so refresh/share doesn't reopen the form
  useEffect(() => {
    if (autoOpened) window.history.replaceState(null, '', pathname);
  }, [autoOpened, pathname]);

  if (!car.is_available) {
    return (
      <Button size="lg" className="w-full" disabled>
        Currently unavailable
      </Button>
    );
  }

  if (loading) {
    return (
      <Button size="lg" className="w-full" loading>
        Book this car
      </Button>
    );
  }

  if (!user) {
    return (
      <div className="space-y-2">
        <Button size="lg" className="w-full" icon={<LogIn size={18} />} onClick={() => router.push(loginUrl(returnTo))}>
          Login to book
        </Button>
        <p className="text-center text-xs text-text-muted">Sign in or create a free account to book online.</p>
      </div>
    );
  }

  return (
    <>
      <Button size="lg" className="w-full" icon={<CalendarCheck size={18} />} onClick={() => setOpen(true)}>
        Book this car
      </Button>
      <BookingModal car={car} user={user} isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
