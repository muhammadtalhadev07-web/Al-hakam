// ============================================================
// Site-wide business details — edit once, used everywhere
// ============================================================

export const siteConfig = {
  name: 'Al Hakam Tours & Rent A Car',
  shortName: 'Al Hakam Tours',
  tagline: 'Rent A Car',
  description:
    'Premium car rentals, chauffeur-driven luxury cars and bespoke tour packages across Pakistan — from Lahore to Hunza.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://alhakamtours.com',
  phones: [
    { display: '0305-6758074', tel: '+923056758074' },
    { display: '0316-6005009', tel: '+923166005009' },
  ],
  whatsapp: '923056758074',
  email: 'info@alhakamtours.com',
  address: 'Lahore, Punjab, Pakistan',
  city: 'Lahore',
  mapEmbed:
    'https://www.google.com/maps?q=Lahore,Punjab,Pakistan&output=embed',
  hours: { weekdays: 'Mon – Sun: 8:00 AM – 10:00 PM', support: '24/7 roadside & booking support' },
  // TODO: replace with your real social profile URLs
  socials: {
    facebook: 'https://facebook.com/',
    instagram: 'https://instagram.com/',
    youtube: 'https://youtube.com/',
  },
  founded: 2014,
} as const;

export const primaryPhone = siteConfig.phones[0];

/** Build a wa.me link with a pre-filled message */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${siteConfig.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// Header + footer navigation (the logo links to the home page)
export const mainNav = [
  { href: '/cars', label: 'Fleet' },
  { href: '/tours', label: 'Tours' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;
