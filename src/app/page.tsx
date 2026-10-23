import { ArrowRight } from 'lucide-react';
import { FleetGrid } from '@/components/cars/FleetGrid';
import { FaqAccordion } from '@/components/faq/FaqAccordion';
import ContactSection from '@/components/home/ContactSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import HeroSection from '@/components/home/HeroSection';
import HowItWorks from '@/components/home/HowItWorks';
import ServicesPreview from '@/components/home/ServicesPreview';
import StatsMarquee from '@/components/home/StatsMarquee';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import ToursShowcase from '@/components/home/ToursShowcase';
import { Reveal } from '@/components/motion/Reveal';
import { CTABanner } from '@/components/shared/CTABanner';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ButtonLink } from '@/components/ui/Button';
import { FAQS } from '@/data/content';
import { getCars } from '@/lib/data/cars';

// ============================================================
// Home Page (Server Component — data is fetched on the server,
// so the fleet is in the HTML for SEO and there is no loading flash)
// ============================================================

export const revalidate = 300; // refresh fleet data every 5 minutes

export default async function HomePage() {
  const { cars } = await getCars();
  const featured = cars.filter((c) => c.is_available).slice(0, 6);
  const startingPrice = Math.min(...cars.map((c) => c.price_per_day));

  return (
    <main>
      <HeroSection startingPrice={startingPrice} />
      <StatsMarquee />

      {/* Featured fleet */}
      <section id="featured-fleet" className="mesh-bg py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our fleet"
            title={<>Featured <span className="gold-gradient">vehicles</span></>}
            subtitle="Hand-picked, immaculately maintained and ready for your journey — book in under two minutes."
          />
          <FleetGrid cars={featured} />
          <Reveal className="mt-14 text-center">
            <ButtonLink href="/cars" variant="outline" size="lg" icon={<ArrowRight size={18} />} iconPosition="right">
              View full fleet ({cars.length} vehicles)
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      <ServicesPreview />
      <ToursShowcase />
      <HowItWorks />
      <FeaturesSection />
      <TestimonialsSection />

      {/* FAQ preview */}
      <section className="py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
          <div className="lg:col-span-2">
            <SectionHeading
              align="left"
              eyebrow="FAQ"
              title={<>Questions? <span className="gold-gradient">Answered.</span></>}
              subtitle="Everything you need to know about documents, deposits, fuel and cancellations."
              className="mb-8"
            />
            <Reveal>
              <ButtonLink href="/faq" variant="outline" icon={<ArrowRight size={16} />} iconPosition="right">
                See all FAQs
              </ButtonLink>
            </Reveal>
          </div>
          <div className="lg:col-span-3">
            <FaqAccordion items={FAQS.slice(0, 5)} />
          </div>
        </div>
      </section>

      <CTABanner />
      <ContactSection />
    </main>
  );
}
