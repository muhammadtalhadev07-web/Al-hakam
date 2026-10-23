import type { Metadata } from 'next';
import { PageHero } from '@/components/shared/PageHero';
import { CTABanner } from '@/components/shared/CTABanner';
import { IMAGES } from '@/data/images';
import { getCars } from '@/lib/data/cars';
import type { CarCategory } from '@/types';
import CarsClientPage from './CarsClientPage';

export const metadata: Metadata = {
  title: 'Our Fleet',
  description: 'Browse luxury sedans, SUVs, vans and wedding cars available for rent in Lahore and across Pakistan.',
};

const VALID: CarCategory[] = ['SUV', 'Sedan', 'Luxury', 'Van'];

export default async function CarsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const [{ cars }, { category }] = await Promise.all([getCars(), searchParams]);
  const initialCategory = VALID.includes(category as CarCategory) ? (category as CarCategory) : 'All';

  return (
    <main>
      <PageHero
        eyebrow="Our Fleet"
        title={<>Find your <span className="gold-gradient">perfect ride</span></>}
        subtitle="From fuel-sipping city sedans to Rolls-Royce wedding cars and 29-seat coasters — every vehicle inspected, insured and ready."
        image={IMAGES.silhouette}
        crumbs={[{ label: 'Fleet' }]}
      />
      <section className="mesh-bg pb-8 pt-4">
        <CarsClientPage key={initialCategory} cars={cars} initialCategory={initialCategory} />
      </section>
      <CTABanner />
    </main>
  );
}
