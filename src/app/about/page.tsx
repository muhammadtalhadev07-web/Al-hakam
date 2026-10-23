import { Compass, HeartHandshake, PhoneCall, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import StatsMarquee from '@/components/home/StatsMarquee';
import { Parallax } from '@/components/motion/Parallax';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { CTABanner } from '@/components/shared/CTABanner';
import { PageHero } from '@/components/shared/PageHero';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { MILESTONES, VALUES } from '@/data/content';
import { IMAGES } from '@/data/images';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About Us',
  description: `The story of ${siteConfig.name} — Lahore-born car rental and tour company serving Pakistan since ${siteConfig.founded}.`,
};

const valueIcons = [<ShieldCheck key="s" size={22} />, <HeartHandshake key="h" size={22} />, <PhoneCall key="p" size={22} />, <Compass key="c" size={22} />];

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="About us"
        title={<>Driven by <span className="gold-gradient">trust</span> since {siteConfig.founded}</>}
        subtitle="A Lahore family business that grew from three sedans into one of Punjab's most trusted luxury rental and tour companies."
        image={IMAGES.lahore}
        crumbs={[{ label: 'About' }]}
      />

      {/* Story */}
      <section className="mesh-bg py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative grid grid-cols-2 gap-4">
            <Parallax offset={30} className="relative mt-12 aspect-[3/4] overflow-hidden rounded-3xl border border-white/10">
              <Image src={IMAGES.driving} alt="Chauffeur at the wheel" fill sizes="25vw" className="object-cover" />
            </Parallax>
            <Parallax offset={-30} className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-white/10">
              <Image src={IMAGES.valley} alt="Mountain valley in the north" fill sizes="25vw" className="object-cover" />
            </Parallax>
          </div>
          <div>
            <SectionHeading
              align="left"
              eyebrow="Our story"
              title={<>More than a <span className="gold-gradient">rental company</span></>}
              className="mb-6"
            />
            <Reveal>
              <p className="leading-relaxed text-text-gray">
                Al Hakam Tours &amp; Rent A Car started in {siteConfig.founded} with a simple idea: treat every customer like family.
                No hidden charges, no excuses — just clean cars, honest prices and drivers you can trust with your loved ones.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 leading-relaxed text-text-gray">
                Today we serve families, wedding parties, corporate delegations and adventurers heading north to Hunza and Skardu.
                The fleet has grown, but the promise hasn&apos;t changed.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <StatsMarquee />

      {/* Values */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="What we stand for" title={<>Our <span className="gold-gradient">values</span></>} />
          <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <StaggerItem key={v.title} className="glass-card group p-6 transition hover:-translate-y-1 hover:border-gold/25">
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl gold-gradient-bg text-obsidian">{valueIcons[i]}</span>
                <h3 className="text-xl font-bold text-white">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{v.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-ink py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Our journey" title={<>Milestones along <span className="gold-gradient">the road</span></>} />
          <ol className="relative border-l border-gold/20 pl-8">
            {MILESTONES.map((m, i) => (
              <Reveal as="li" key={m.year} direction="left" delay={i * 0.05} className="relative mb-12 last:mb-0">
                <span className="absolute -left-[42px] top-1 flex h-5 w-5 items-center justify-center rounded-full border-4 border-ink bg-gold" />
                <span className="font-display text-sm font-bold tracking-widest text-gold">{m.year}</span>
                <h3 className="mt-1 text-2xl font-bold text-white">{m.title}</h3>
                <p className="mt-1 text-text-muted">{m.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <CTABanner />
    </main>
  );
}
