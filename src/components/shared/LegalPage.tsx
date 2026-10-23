import { Reveal } from '@/components/motion/Reveal';

// Shared layout for Privacy / Terms pages
export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: { heading: string; body: string }[] }) {
  return (
    <main className="mesh-bg pb-24 pt-36">
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <span className="eyebrow">Legal</span>
          <h1 className="mt-5 text-5xl font-black text-white">{title}</h1>
          <p className="mt-3 text-sm text-text-muted">Last updated: {updated}</p>
        </Reveal>
        <div className="mt-12 space-y-10">
          {sections.map((s, i) => (
            <Reveal key={s.heading} delay={Math.min(i, 4) * 0.04}>
              <h2 className="text-xl font-bold text-white">
                <span className="mr-2 text-gold">{String(i + 1).padStart(2, '0')}.</span>
                {s.heading}
              </h2>
              <p className="mt-3 leading-relaxed text-text-gray">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </article>
    </main>
  );
}
