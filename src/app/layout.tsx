import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { ScrollProgress } from '@/components/motion/ScrollProgress';
import { FloatingActions } from '@/components/shared/FloatingActions';
import { NetworkStatus } from '@/components/shared/NetworkStatus';
import { Providers } from '@/components/shared/Providers';
import { siteConfig } from '@/lib/site';
import './globals.css';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Luxury Car Rentals & Tours in Pakistan`,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  keywords: [
    'car rental Lahore',
    'rent a car Pakistan',
    'luxury car rental',
    'wedding car rental Lahore',
    'Hunza tour package',
    'chauffeur driven car',
    'Al Hakam Tours',
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Luxury Car Rentals & Tours`,
    description: siteConfig.description,
  },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#111111',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-obsidian font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-obsidian"
        >
          Skip to content
        </a>
        <Providers>
          <ScrollProgress />
          <Navbar />
          <div id="main">{children}</div>
          <Footer />
          <FloatingActions />
          <NetworkStatus />
        </Providers>
      </body>
    </html>
  );
}
