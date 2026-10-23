import { ArrowLeft, BadgeCheck, Briefcase, Calendar, Check, Fuel, ShieldCheck, Star, Users, Zap } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FleetGrid } from '@/components/cars/FleetGrid';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { IMAGES, canOptimize } from '@/data/images';
import { getCarById, getCars, getSimilarCars } from '@/lib/data/cars';
import { formatCurrency } from '@/lib/utils';
import BookCarPanel from './BookCarPanel';

type Props = { params: Promise<{ id: string }> };

export const revalidate = 300; // pick up fleet changes from Supabase every 5 min

// Pre-render whichever fleet is live (Supabase cars, or the demo fleet as fallback).
// Cars added later are rendered on first visit and refreshed by revalidateFleet().
export async function generateStaticParams() {
  const { cars } = await getCars();
  return cars.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const car = await getCarById(id);
  if (!car) return { title: 'Car not found' };
  return {
    title: `${car.name} Rental`,
    description: `Rent the ${car.name} from ${formatCurrency(car.price_per_day)}/day. ${car.description ?? ''}`.trim(),
    openGraph: { images: [car.image_url] },
  };
}

export default async function CarDetailPage({ params }: Props) {
  const { id } = await params;
  const car = await getCarById(id);
  if (!car) notFound();

  const similar = await getSimilarCars(car);
  const image = car.image_url || IMAGES.fallbackCar;

  const specs = [
    { icon: <Users size={18} />, label: 'Seats', value: `${car.seats}` },
    { icon: <Zap size={18} />, label: 'Gearbox', value: car.transmission },
    { icon: <Fuel size={18} />, label: 'Fuel', value: car.fuel ?? '—' },
    { icon: <Briefcase size={18} />, label: 'Luggage', value: car.luggage ? `${car.luggage} bags` : '—' },
    { icon: <Calendar size={18} />, label: 'Model', value: car.year ? `${car.year}` : '—' },
    { icon: <ShieldCheck size={18} />, label: 'Insurance', value: 'Comprehensive' },
  ];

  return (
    <main className="mesh-bg pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/cars" className="mb-6 inline-flex items-center gap-2 text-sm text-text-muted transition hover:text-gold">
          <ArrowLeft size={16} /> Back to fleet
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left: image + details */}
          <div className="lg:col-span-8">
            <Reveal direction="zoom" className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-white/10">
              <Image src={image} alt={car.name} fill priority sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" unoptimized={!canOptimize(image)} />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-gold/40 bg-black/50 px-3 py-1 text-xs font-medium text-gold backdrop-blur">{car.category}</span>
                {car.rating ? (
                  <span className="flex items-center gap-1 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur">
                    <Star size={12} className="fill-gold text-gold" /> {car.rating.toFixed(1)}
                    {car.reviews ? <span className="text-text-muted">({car.reviews} reviews)</span> : null}
                  </span>
                ) : null}
              </div>
            </Reveal>

            <Reveal className="mt-8">
              <p className="text-sm uppercase tracking-[0.2em] text-gold">{car.brand ?? car.category}</p>
              <h1 className="mt-2 text-4xl font-black text-white sm:text-5xl">{car.name}</h1>
              {car.description && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-gray">{car.description}</p>}
            </Reveal>

            <Reveal className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {specs.map((s) => (
                <div key={s.label} className="glass-card flex items-center gap-3 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold">{s.icon}</span>
                  <span>
                    <span className="block text-xs text-text-muted">{s.label}</span>
                    <span className="block text-sm font-semibold text-white">{s.value}</span>
                  </span>
                </div>
              ))}
            </Reveal>

            {car.features?.length ? (
              <Reveal className="mt-10">
                <h2 className="mb-4 text-2xl font-bold text-white">Features</h2>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {car.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-text-gray">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 text-gold"><Check size={14} /></span>
                      {f}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}

            <Reveal className="mt-10 glass-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                <BadgeCheck className="text-gold" size={20} /> Rental terms
              </h2>
              <ul className="grid gap-2 text-sm text-text-gray sm:grid-cols-2">
                <li>• Original CNIC / passport required</li>
                <li>• Valid driving licence for self-drive</li>
                <li>• Refundable security deposit (self-drive)</li>
                <li>• Free cancellation up to 48 hours before</li>
                <li>• Full-to-full fuel policy</li>
                <li>• 24/7 roadside assistance included</li>
              </ul>
            </Reveal>
          </div>

          {/* Right: sticky booking panel */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <BookCarPanel car={car} />
            </div>
          </aside>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="You may also like" title={<>Similar <span className="gold-gradient">vehicles</span></>} align="left" />
          <FleetGrid cars={similar} />
        </section>
      )}
    </main>
  );
}
