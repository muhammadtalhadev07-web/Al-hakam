import type { Metadata } from 'next';
import { FaqAccordion } from '@/components/faq/FaqAccordion';
import { Reveal } from '@/components/motion/Reveal';
import { CTABanner } from '@/components/shared/CTABanner';
import { PageHero } from '@/components/shared/PageHero';
import { FAQS } from '@/data/content';
import { IMAGES } from '@/data/images';
import type { FaqItem } from '@/types';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Answers about booking, documents, deposits, fuel, insurance, tours and cancellations.',
};

const CATEGORIES: FaqItem['category'][] = ['Booking', 'Payments', 'Vehicles', 'Tours', 'Policies'];

export default function FaqPage() {
  // FAQPage structured data for rich results in Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        eyebrow="Help centre"
        title={<>Frequently asked <span className="gold-gradient">questions</span></>}
        subtitle="Can't find your answer? Call or WhatsApp us — we reply within minutes."
        image={IMAGES.highlands}
        crumbs={[{ label: 'FAQ' }]}
      />
      <section className="mesh-bg py-20">
        <div className="mx-auto max-w-4xl space-y-14 px-4 sm:px-6 lg:px-8">
          {CATEGORIES.map((cat) => (
            <div key={cat} id={cat.toLowerCase()} className="scroll-mt-28">
              <Reveal>
                <h2 className="mb-5 text-2xl font-bold text-white">
                  <span className="gold-gradient">{cat}</span>
                </h2>
              </Reveal>
              <FaqAccordion items={FAQS.filter((f) => f.category === cat)} defaultOpen={null} />
            </div>
          ))}
        </div>
      </section>
      <CTABanner />
    </main>
  );
}
