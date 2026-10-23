import type { Metadata } from 'next';
import ContactSection from '@/components/home/ContactSection';
import { Reveal } from '@/components/motion/Reveal';
import { PageHero } from '@/components/shared/PageHero';
import { IMAGES } from '@/data/images';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `Call ${siteConfig.phones[0].display}, WhatsApp or send us a message — Al Hakam Tours replies within minutes.`,
};

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Contact"
        title={<>Let&apos;s plan your <span className="gold-gradient">next trip</span></>}
        subtitle="Call, WhatsApp or drop us a message. Real people, 24 hours a day."
        image={IMAGES.nightPeaks}
        crumbs={[{ label: 'Contact' }]}
      />
      <div className="mesh-bg">
        <ContactSection showHeading={false} />
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <Reveal direction="zoom" className="overflow-hidden rounded-[2rem] border border-white/10">
            <iframe
              title={`${siteConfig.shortName} location map`}
              src={siteConfig.mapEmbed}
              className="h-[420px] w-full grayscale invert-[0.9] hue-rotate-180"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </section>
      </div>
    </main>
  );
}
