import { Quote, Star } from 'lucide-react';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { TESTIMONIALS } from '@/data/content';
import type { Testimonial } from '@/types';

// Two rows of testimonials drifting in opposite directions
export default function TestimonialsSection() {
  const half = Math.ceil(TESTIMONIALS.length / 2);
  const rows = [TESTIMONIALS.slice(0, half), TESTIMONIALS.slice(half)];

  return (
    <section className="relative overflow-hidden bg-ink py-28">
      <div className="section-divider absolute inset-x-0 top-0" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Client stories"
          title={<>What our clients <span className="gold-gradient">say</span></>}
          subtitle="Weddings, family holidays, delegations and late-night airport runs — here is how it went."
        />
      </div>

      <div className="space-y-6 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        {rows.map((row, r) => (
          <div key={r} className="flex overflow-hidden">
            <div
              className="flex w-max gap-6 animate-marquee hover:[animation-play-state:paused]"
              style={{ animationDirection: r % 2 ? 'reverse' : 'normal', animationDuration: '55s' }}
            >
              {[...row, ...row].map((t, i) => (
                <TestimonialCard key={`${t.name}-${i}`} t={t} hidden={i >= row.length} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TestimonialCard({ t, hidden }: { t: Testimonial; hidden: boolean }) {
  return (
    <figure aria-hidden={hidden} className="glass-card relative w-[340px] shrink-0 p-6 sm:w-[420px]">
      <Quote size={40} className="absolute right-5 top-5 text-gold/15" />
      <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} className={i < t.rating ? 'fill-gold text-gold' : 'text-white/20'} />
        ))}
      </div>
      <blockquote className="mt-4 text-sm leading-relaxed text-text-gray">&ldquo;{t.text}&rdquo;</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full gold-gradient-bg font-bold text-obsidian">{t.name[0]}</span>
        <span>
          <span className="block text-sm font-semibold text-white">{t.name}</span>
          <span className="block text-xs text-text-muted">{t.location} · {t.service}</span>
        </span>
      </figcaption>
    </figure>
  );
}
