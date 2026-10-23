import { ArrowUpRight, Briefcase, Car, Crown, Heart, Mountain, Plane } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { SERVICES } from '@/data/content';
import type { ServiceItem } from '@/types';

export const serviceIcons: Record<ServiceItem['icon'], React.ReactNode> = {
  car: <Car size={22} />,
  crown: <Crown size={22} />,
  plane: <Plane size={22} />,
  briefcase: <Briefcase size={22} />,
  heart: <Heart size={22} />,
  mountain: <Mountain size={22} />,
};

export default function ServicesPreview() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What we do"
          title={<>Services built around <span className="gold-gradient">you</span></>}
          subtitle="Self-drive or chauffeur-driven, one airport run or a month-long corporate contract — we have you covered."
        />
        <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {SERVICES.map((s) => (
            <StaggerItem key={s.slug}>
              <Link href={`/services#${s.slug}`} className="group relative block h-80 overflow-hidden rounded-[1.75rem] border border-white/10">
                <Image src={s.image_url} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/70 to-obsidian/10 transition-colors duration-500 group-hover:via-obsidian/60" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl gold-gradient-bg text-obsidian shadow-lg shadow-gold/20 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-6">
                    {serviceIcons[s.icon]}
                  </span>
                  <h3 className="text-2xl font-bold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm text-text-gray">{s.short}</p>
                </div>
                <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur transition-all duration-500 group-hover:rotate-45 group-hover:border-gold group-hover:bg-gold group-hover:text-obsidian">
                  <ArrowUpRight size={18} />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
