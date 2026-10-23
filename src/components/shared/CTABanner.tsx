import { ArrowRight, Phone } from 'lucide-react';
import { IMAGES } from '@/data/images';
import { primaryPhone } from '@/lib/site';
import { ButtonLink } from '@/components/ui/Button';
import { Parallax } from '@/components/motion/Parallax';
import { Reveal } from '@/components/motion/Reveal';
import Image from 'next/image';
import type { ReactNode } from 'react';

// Full-width call-to-action with parallax background
export function CTABanner({
  title = (
    <>
      Ready for your <span className="gold-gradient">next journey?</span>
    </>
  ),
  text = 'Tell us where you are going — we will have the perfect car fuelled, cleaned and waiting at your door.',
}: {
  title?: ReactNode;
  text?: string;
}) {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-gold/20">
        <Parallax offset={60} className="absolute inset-0 -top-20 -bottom-20">
          <Image src={IMAGES.heroRoad} alt="" fill sizes="(max-width: 1280px) 100vw, 1280px" className="object-cover" />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/85 to-obsidian/30" />
        <div className="relative px-6 py-16 sm:px-12 sm:py-20 lg:max-w-2xl">
          <Reveal>
            <h2 className="text-balance text-4xl font-black leading-tight text-white sm:text-5xl">
              {title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-lg text-text-gray">{text}</p>
          </Reveal>
          <Reveal delay={0.2} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/cars" size="lg" icon={<ArrowRight size={18} />} iconPosition="right">
              Browse the Fleet
            </ButtonLink>
            <ButtonLink href={`tel:${primaryPhone.tel}`} variant="glass" size="lg" icon={<Phone size={16} />}>
              {primaryPhone.display}
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
