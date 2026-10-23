import type { ReactNode } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'center' | 'left';
  className?: string;
}

export function SectionHeading({ eyebrow, title, subtitle, align = 'center', className }: SectionHeadingProps) {
  const centered = align === 'center';
  return (
    <div className={cn('mb-14', centered && 'mx-auto max-w-2xl text-center', className)}>
      <Reveal distance={16}>
        <span className="eyebrow">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-5 text-balance text-4xl font-black leading-[1.08] text-white sm:text-5xl">{title}</h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.16}>
          <p className={cn('mt-5 text-base leading-relaxed text-text-muted sm:text-lg', centered && 'mx-auto max-w-xl')}>{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}
