import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/lib/site';

export function Logo({
  className,
  subtitle,
  compact = false,
  priority = true,
}: {
  className?: string;
  subtitle?: string;
  compact?: boolean;
  priority?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn('group flex items-center gap-3 transition-opacity hover:opacity-95', className)}
      aria-label={`${siteConfig.name} — home`}
    >
      <div className="relative flex items-center">
        <Image
          src="/logo.png"
          alt={siteConfig.name}
          width={compact ? 150 : 220}
          height={compact ? 66 : 97}
          priority={priority}
          className={cn(
            'w-auto object-contain transition-all duration-300 ease-out group-hover:scale-[1.02]',
            compact ? 'h-11 sm:h-13' : 'h-14 sm:h-20'
          )}
        />
      </div>
      {subtitle && (
        <span className="hidden border-l border-white/15 pl-3 text-xs font-semibold tracking-wider text-gold uppercase lg:inline-block">
          {subtitle}
        </span>
      )}
    </Link>
  );
}

