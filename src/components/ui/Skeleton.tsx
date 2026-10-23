import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// ============================================================
// Skeleton Loading Components
// ============================================================

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('shimmer rounded-lg', className)} {...props} />;
}

export function CarCardSkeleton() {
  return (
    <div className="glass-card overflow-hidden" aria-hidden>
      <Skeleton className="h-56 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="h-px bg-white/5" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
