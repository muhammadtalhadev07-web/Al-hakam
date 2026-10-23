import { Check } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { serviceIcons } from '@/components/home/ServicesPreview';
import HowItWorks from '@/components/home/HowItWorks';
import { Parallax } from '@/components/motion/Parallax';
import { Reveal } from '@/components/motion/Reveal';
import { CTABanner } from '@/components/shared/CTABanner';
import { PageHero } from '@/components/shared/PageHero';
import { WhatsAppIcon } from '@/components/shared/SocialIcons';
import { ButtonLink } from '@/components/ui/Button';
import { SERVICES } from '@/data/content';
import { IMAGES } from '@/data/images';
import { whatsappLink } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Self-drive rentals, chauffeur-driven cars, wedding cars, airport transfers, corporate fleet and northern tours.',
};

export default function ServicesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Our services"
        title={<>Every journey, <span className="gold-gradient">handled</span></>}
        subtitle="Six ways we can get you where you need to be — comfortably, safely and on time."
        image={IMAGES.heroRoad}
        crumbs={[{ label: 'Services' }]}
      />

      <div className="mesh-bg">
        {SERVICES.map((s, i) => {
          const flip = i % 2 === 1;
          return (
            <section key={s.slug} id={s.slug} className="scroll-mt-28 py-20">
              <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
                <Reveal direction={flip ? 'left' : 'right'} className={flip ? 'lg:order-2' : ''}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/10">
                    <Parallax offset={40} className="absolute inset-0 -top-12 -bottom-12">
                      <Image src={s.image_url} alt={s.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                    </Parallax>
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent" />
                    <span className="absolute bottom-5 left-5 font-display text-7xl font-black text-white/20">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                </Reveal>
                <div>
                  <Reveal>
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl gold-gradient-bg text-obsidian shadow-lg shadow-gold/20">{serviceIcons[s.icon]}</span>
                  </Reveal>
                  <Reveal delay={0.08}>
                    <h2 className="mt-6 text-4xl font-black text-white">{s.title}</h2>
                  </Reveal>
                  <Reveal delay={0.14}>
                    <p className="mt-4 text-lg leading-relaxed text-text-gray">{s.description}</p>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {s.points.map((p) => (
                        <li key={p} className="flex items-center gap-3 text-text-gray">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold"><Check size={14} /></span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                  <Reveal delay={0.26} className="mt-8 flex flex-wrap gap-3">
                    <ButtonLink href="/cars">Browse cars</ButtonLink>
                    <ButtonLink href={whatsappLink(`Hi! I'd like a quote for: ${s.title}`)} variant="glass" icon={<WhatsAppIcon className="h-4 w-4 text-[#25D366]" />}>
                      Get a quote
                    </ButtonLink>
                  </Reveal>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <HowItWorks />
      <CTABanner />
    </main>
  );
}
