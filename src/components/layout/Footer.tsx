'use client';

import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/shared/Logo';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/shared/SocialIcons';
import { mainNav, siteConfig } from '@/lib/site';

// ============================================================
// Footer
// ============================================================

const fleetLinks = [
  { label: 'Luxury Cars', href: '/cars?category=Luxury' },
  { label: 'Premium SUVs', href: '/cars?category=SUV' },
  { label: 'Sedans', href: '/cars?category=Sedan' },
  { label: 'Vans & Coasters', href: '/cars?category=Van' },
  { label: 'Wedding Cars', href: '/services#weddings' },
  { label: 'Airport Transfers', href: '/services#airport' },
];

const socials = [
  { href: siteConfig.socials.facebook, label: 'Facebook', Icon: FacebookIcon },
  { href: siteConfig.socials.instagram, label: 'Instagram', Icon: InstagramIcon },
  { href: siteConfig.socials.youtube, label: 'YouTube', Icon: YoutubeIcon },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin') || pathname.startsWith('/auth')) return null;

  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[#0c0c0c]">
      <div className="section-divider" />
      {/* Giant watermark */}
      <div aria-hidden className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[18vw] font-black leading-none text-white/[0.025]">
        AL HAKAM
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-4">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-text-muted">{siteConfig.description}</p>
            <div className="flex items-center gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-text-muted transition hover:-translate-y-0.5 hover:border-gold/30 hover:bg-gold/5 hover:text-gold"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Explore" className="lg:col-span-2">
            {[...mainNav, { href: '/faq', label: 'FAQ' }].map(({ href, label }) => (
              <FooterLink key={href} href={href}>{label}</FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Our Fleet" className="lg:col-span-3">
            {fleetLinks.map(({ href, label }) => (
              <FooterLink key={label} href={href}>{label}</FooterLink>
            ))}
          </FooterColumn>

          <div className="lg:col-span-3">
            <h3 className="mb-5 font-display font-semibold text-white">Contact Us</h3>
            <ul className="space-y-3 text-sm text-text-muted">
              <li>
                <div className="flex items-start gap-3">
                  <Phone size={15} className="mt-0.5 shrink-0 text-gold" />
                  <div className="space-y-1">
                    {siteConfig.phones.map((p) => (
                      <a key={p.tel} href={`tel:${p.tel}`} className="block transition hover:text-gold">{p.display}</a>
                    ))}
                  </div>
                </div>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="flex items-start gap-3 transition hover:text-gold">
                  <Mail size={15} className="mt-0.5 shrink-0 text-gold" /> {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={15} className="mt-0.5 shrink-0 text-gold" /> {siteConfig.address}
              </li>
              <li className="flex items-start gap-3">
                <Clock size={15} className="mt-0.5 shrink-0 text-gold" />
                <span>
                  {siteConfig.hours.weekdays}
                  <span className="block text-gold">{siteConfig.hours.support}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/5 py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-xs text-text-muted sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="transition hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="transition hover:text-white">Terms of Service</Link>
            <Link href="/faq" className="transition hover:text-white">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <h3 className="mb-5 font-display font-semibold text-white">{title}</h3>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="group flex items-center gap-2 text-sm text-text-muted transition hover:text-gold">
        <span className="h-px w-3 bg-gold/40 transition-all group-hover:w-5 group-hover:bg-gold" />
        {children}
      </Link>
    </li>
  );
}
