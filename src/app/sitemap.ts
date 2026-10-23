import type { MetadataRoute } from 'next';
import { TOURS } from '@/data/tours';
import { getCars } from '@/lib/data/cars';
import { siteConfig } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const { cars } = await getCars();
  const staticRoutes = ['', '/cars', '/tours', '/services', '/about', '/contact', '/faq', '/privacy', '/terms'];

  return [
    ...staticRoutes.map((path) => ({ url: `${base}${path}`, changeFrequency: 'weekly' as const, priority: path === '' ? 1 : 0.7 })),
    ...cars.map((c) => ({ url: `${base}/cars/${c.id}`, changeFrequency: 'weekly' as const, priority: 0.6 })),
    ...TOURS.map((t) => ({ url: `${base}/tours/${t.slug}`, changeFrequency: 'monthly' as const, priority: 0.6 })),
  ];
}
