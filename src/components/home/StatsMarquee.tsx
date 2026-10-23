import { Counter } from '@/components/motion/Counter';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { BRANDS, STATS } from '@/data/content';

// Animated counters + infinite brand marquee
export default function StatsMarquee() {
  return (
    <section className="relative border-y border-white/5 bg-ink py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Stagger className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {STATS.map((s) => (
            <StaggerItem key={s.label} className="text-center">
              <Counter value={s.value} suffix={s.suffix} className="font-display text-4xl font-black gold-gradient sm:text-5xl" />
              <p className="mt-2 text-sm text-text-muted">{s.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <div className="relative mt-14 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex w-max animate-marquee gap-14 hover:[animation-play-state:paused]">
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span key={`${b}-${i}`} aria-hidden={i >= BRANDS.length} className="font-display text-2xl font-bold uppercase tracking-widest text-white/20 transition hover:text-gold">
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
