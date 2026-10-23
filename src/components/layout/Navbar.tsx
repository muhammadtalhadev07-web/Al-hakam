'use client';

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ChevronDown, LayoutDashboard, LogOut, Menu, Phone, Shield, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Logo } from '@/components/shared/Logo';
import { useAuth } from '@/hooks/useAuth';
import { ButtonLink } from '@/components/ui/Button';
import { mainNav, primaryPhone } from '@/lib/site';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

// ============================================================
// Navbar — transparent over heroes, glass on scroll, hides while
// scrolling down and reappears when scrolling up.
// ============================================================

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 20);
  });

  // Admin role for the signed-in user (auth state comes from the shared hook)
  useEffect(() => {
    const supabase = createClient();
    if (!supabase || !user) return;
    let cancelled = false;
    supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setRole(data?.role ?? null);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);
  const isAdmin = Boolean(user) && role === 'admin';

  // Publish the navbar's visible height as a CSS variable so sticky
  // elements (e.g. the Fleet search bar) can sit right underneath it.
  useEffect(() => {
    const header = headerRef.current;
    const root = document.documentElement;
    if (!header) return;
    const apply = () => root.style.setProperty('--nav-offset', `${header.offsetHeight}px`);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(header);
    return () => ro.disconnect();
  }, [scrolled]);

  // Close profile dropdown on outside click / Escape
  useEffect(() => {
    if (!profileOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!profileRef.current?.contains(e.target as Node)) setProfileOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setProfileOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [profileOpen]);

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    await createClient()?.auth.signOut();
    setProfileOpen(false);
    setIsOpen(false);
    router.push('/');
    router.refresh();
  };

  if (pathname.startsWith('/admin') || pathname.startsWith('/auth')) return null;

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background,padding,border,box-shadow] duration-300 ease-out',
          scrolled || isOpen
            ? 'navbar-blur py-2.5 sm:py-3 shadow-2xl shadow-black/40'
            : 'bg-transparent py-4 sm:py-5 border-b border-transparent'
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main">
          <Logo compact={scrolled} />

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {mainNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={cn(
                    'relative rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                    isActive(link.href) ? 'text-gold' : 'text-text-gray hover:text-white'
                  )}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-lg bg-gold/10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop right side */}
          <div className="hidden items-center gap-3 lg:flex">
            <a href={`tel:${primaryPhone.tel}`} className="flex items-center gap-2 text-xs text-text-gray transition hover:text-gold">
              <Phone size={13} /> {primaryPhone.display}
            </a>

            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((o) => !o)}
                  aria-expanded={profileOpen}
                  aria-haspopup="menu"
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full gold-gradient-bg text-xs font-bold text-obsidian">
                    {user.email?.[0]?.toUpperCase()}
                  </span>
                  <span className="max-w-28 truncate text-text-gray">{user.email}</span>
                  <ChevronDown size={14} className={cn('transition-transform', profileOpen && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      role="menu"
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-white/10 bg-[#1f1f1f]/95 shadow-2xl backdrop-blur-xl"
                    >
                      <Link role="menuitem" href="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-text-gray transition hover:bg-white/5 hover:text-white">
                        <LayoutDashboard size={15} /> My Bookings
                      </Link>
                      {isAdmin && (
                        <Link role="menuitem" href="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gold transition hover:bg-gold/5">
                          <Shield size={15} /> Admin Panel
                        </Link>
                      )}
                      <div className="h-px bg-white/10" />
                      <button role="menuitem" type="button" onClick={handleSignOut} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-accent-red transition hover:bg-accent-red/5">
                        <LogOut size={15} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <ButtonLink href="/auth/login" variant="ghost" size="sm">Login</ButtonLink>
                <ButtonLink href="/cars" size="sm">Book Now</ButtonLink>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setIsOpen((o) => !o)}
            className="rounded-lg p-2 text-white transition hover:bg-white/10 lg:hidden"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-obsidian/97 px-6 pb-10 pt-28 backdrop-blur-2xl lg:hidden"
          >
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.05 } } }}
              className="space-y-1"
            >
              {mainNav.map((link) => (
                <motion.li key={link.href} variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className={cn(
                      'block rounded-2xl px-4 py-3 font-display text-3xl font-bold transition',
                      isActive(link.href) ? 'text-gold' : 'text-white/80 hover:text-white'
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}>
                <Link href="/faq" onClick={closeMenu} className="block rounded-2xl px-4 py-3 font-display text-3xl font-bold text-white/80 hover:text-white">
                  FAQ
                </Link>
              </motion.li>
            </motion.ul>

            <div className="mt-8 space-y-3 border-t border-white/10 pt-6">
              <a href={`tel:${primaryPhone.tel}`} className="flex items-center gap-2 px-4 text-text-gray">
                <Phone size={16} className="text-gold" /> {primaryPhone.display}
              </a>
              {user ? (
                <div className="space-y-2 px-4">
                  <Link href="/dashboard" onClick={closeMenu} className="flex items-center gap-2 py-2 text-text-gray hover:text-white">
                    <LayoutDashboard size={16} /> My Bookings
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={closeMenu} className="flex items-center gap-2 py-2 text-gold">
                      <Shield size={16} /> Admin Panel
                    </Link>
                  )}
                  <button type="button" onClick={handleSignOut} className="flex items-center gap-2 py-2 text-accent-red">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 px-4 pt-2">
                  <ButtonLink href="/auth/login" variant="glass" className="flex-1" onClick={closeMenu}>Login</ButtonLink>
                  <ButtonLink href="/cars" className="flex-1" onClick={closeMenu}>Book Now</ButtonLink>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
