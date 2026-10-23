import { ArrowLeft, Calendar, Check, Clock, MapPin, Mountain, Star, Users } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { PageHero } from '@/components/shared/PageHero';
import { WhatsAppIcon } from '@/components/shared/SocialIcons';
import { ButtonLink } from '@/components/ui/Button';
import { TOURS, getTourBySlug } from '@/data/tours';
import { primaryPhone, whatsappLink } from '@/lib/site';
import { formatCurrency } from '@/lib/utils';
import ItineraryTimeline from './ItineraryTimeline';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return TOURS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  if (!tour) return { title: 'Tour not found' };
  return { title: tour.title, description: tour.summary, openGraph: { images: [tour.image_url] } };
}

export default async function TourDetailPage({ params }: Props) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  if (!tour) notFound();

  const facts = [
    { icon: <Clock size={18} />, label: 'Duration', value: `${tour.duration_days} day${tour.duration_days > 1 ? 's' : ''}` },
    { icon: <Users size={18} />, label: 'Group size', value: tour.group_size },
    { icon: <Calendar size={18} />, label: 'Best season', value: tour.best_season },
    { icon: <Mountain size={18} />, label: 'Difficulty', value: tour.difficulty },
  ];
  const others = TOURS.filter((t) => t.slug !== tour.slug).slice(0, 3);

  return (
    <main>
      <PageHero
        eyebrow={tour.region}
        title={tour.title}
        subtitle={tour.summary}
        image={tour.image_url}
        crumbs={[{ label: 'Tours', href: '/tours' }, { label: tour.title }]}
      >
        <div className="flex items-center gap-2 text-sm text-text-gray">
          <Star size={16} className="fill-gold text-gold" /> <span className="font-semibold text-white">{tour.rating}</span> · {tour.reviews} reviews
        </div>
      </PageHero>

      <div className="mesh-bg">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-8">
            <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {facts.map((f) => (
                <StaggerItem key={f.label} className="glass-card p-4">
                  <span className="text-gold">{f.icon}</span>
                  <p className="mt-2 text-xs text-text-muted">{f.label}</p>
                  <p className="text-sm font-semibold text-white">{f.value}</p>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal className="mt-12">
              <h2 className="mb-5 text-3xl font-bold text-white">Highlights</h2>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {tour.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-3 text-text-gray">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 text-gold"><MapPin size={13} /></span>
                    {h}
                  </li>
                ))}
              </ul>
            </Reveal>

            <div className="mt-14">
              <Reveal><h2 className="mb-8 text-3xl font-bold text-white">Day-by-day itinerary</h2></Reveal>
              <ItineraryTimeline days={tour.itinerary} />
            </div>

            <Stagger className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {tour.gallery.map((src, i) => (
                <StaggerItem key={src + i} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
                  <Image src={src} alt={`${tour.title} photo ${i + 1}`} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition-transform duration-700 hover:scale-110" />
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <aside className="lg:col-span-4">
            <div className="glass-card-gold space-y-6 p-6 lg:sticky lg:top-28">
              <div>
                <p className="text-xs uppercase tracking-widest text-text-muted">Starting from</p>
                <p className="font-display text-4xl font-black gold-gradient">{formatCurrency(tour.price_from)}</p>
                <p className="text-sm text-text-muted">per person · twin sharing</p>
              </div>
              <div>
                <p className="mb-3 text-sm font-semibold text-white">What&apos;s included</p>
                <ul className="space-y-2 text-sm text-text-gray">
                  {tour.includes.map((inc) => (
                    <li key={inc} className="flex items-start gap-2"><Check size={16} className="mt-0.5 shrink-0 text-gold" /> {inc}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <ButtonLink
                  href={whatsappLink(`Hi! I'm interested in the "${tour.title}" tour. Please share available dates and a quote.`)}
                  size="lg"
                  className="w-full"
                  icon={<WhatsAppIcon className="h-5 w-5" />}
                >
                  Enquire on WhatsApp
                </ButtonLink>
                <ButtonLink href={`tel:${primaryPhone.tel}`} variant="glass" className="w-full">
                  Call {primaryPhone.display}
                </ButtonLink>
              </div>
            </div>
          </aside>
        </div>

        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <Link href="/tours" className="mb-6 inline-flex items-center gap-2 text-sm text-text-muted hover:text-gold"><ArrowLeft size={16} /> All tours</Link>
          <h2 className="mb-8 text-3xl font-bold text-white">More <span className="gold-gradient">adventures</span></h2>
          <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {others.map((t) => (
              <StaggerItem key={t.slug}>
                <Link href={`/tours/${t.slug}`} className="group relative block h-64 overflow-hidden rounded-2xl border border-white/10">
                  <Image src={t.image_url} alt={t.title} fill sizes="33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                  <div className="absolute bottom-0 p-5">
                    <p className="text-xs text-gold">{t.duration_days} days · {t.region}</p>
                    <h3 className="text-xl font-bold text-white">{t.title}</h3>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      </div>
    </main>
  );
}
