import { ArrowRight, Clock, MapPin, Mountain, Star, Users } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { CTABanner } from '@/components/shared/CTABanner';
import { PageHero } from '@/components/shared/PageHero';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { IMAGES } from '@/data/images';
import { TOURS } from '@/data/tours';
import { formatCurrency } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Tour Packages',
  description: 'Hunza, Skardu, Naran, Swat, Murree and Lahore heritage tours with 4x4 vehicles, hotels and experienced drivers.',
};

export default function ToursPage() {
  return (
    <main>
      <PageHero
        eyebrow="Tour packages"
        title={<>Journeys through <span className="gold-gradient">the North &amp; beyond</span></>}
        subtitle="Complete, worry-free packages — 4x4 vehicles, mountain-experienced drivers, hotels and hand-crafted itineraries."
        image={IMAGES.mountains}
        crumbs={[{ label: 'Tours' }]}
      />

      <section className="mesh-bg py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Choose your adventure" title={<>Popular <span className="gold-gradient">packages</span></>} subtitle="Every package can be customised for your dates, group size and budget." />

          <Stagger className="grid grid-cols-1 gap-8 md:grid-cols-2" stagger={0.1}>
            {TOURS.map((tour) => (
              <StaggerItem key={tour.slug}>
                <Link href={`/tours/${tour.slug}`} className="group glass-card block overflow-hidden transition hover:border-gold/30">
                  <div className="relative h-72 overflow-hidden">
                    <Image src={tour.image_url} alt={tour.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full border border-gold/40 bg-black/50 px-3 py-1 text-xs text-gold backdrop-blur">{tour.difficulty}</span>
                    <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur">
                      <Star size={12} className="fill-gold text-gold" /> {tour.rating} ({tour.reviews})
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="mb-3 flex flex-wrap gap-4 text-xs text-text-muted">
                      <span className="flex items-center gap-1"><MapPin size={13} className="text-gold" /> {tour.region}</span>
                      <span className="flex items-center gap-1"><Clock size={13} className="text-gold" /> {tour.duration_days} day{tour.duration_days > 1 ? 's' : ''}</span>
                      <span className="flex items-center gap-1"><Users size={13} className="text-gold" /> {tour.group_size}</span>
                      <span className="flex items-center gap-1"><Mountain size={13} className="text-gold" /> {tour.best_season}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white transition group-hover:text-gold">{tour.title}</h2>
                    <p className="mt-2 text-text-muted">{tour.summary}</p>
                    <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-5">
                      <span className="text-sm text-text-muted">
                        from <span className="font-display text-2xl font-black gold-gradient">{formatCurrency(tour.price_from)}</span>
                      </span>
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-gold">
                        View itinerary <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CTABanner title={<>Want a <span className="gold-gradient">custom tour?</span></>} text="Tell us your dates, group size and dream destinations — we will plan the route, vehicles and hotels for you." />
    </main>
  );
}
