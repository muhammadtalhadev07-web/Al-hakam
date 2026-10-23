import type { ReactNode } from 'react';
import { cn, getStatusColor } from '@/lib/utils';

// ============================================================
// Badge Component
// ============================================================

type BadgeVariant = 'gold' | 'status' | 'glass';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  status?: string;
  className?: string;
}

const styles: Record<BadgeVariant, string> = {
  gold: 'bg-gold/10 border border-gold/30 text-gold',
  status: 'border',
  glass: 'bg-white/5 border border-white/10 text-text-gray',
};

export function Badge({ children, variant = 'glass', status, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        styles[variant],
        variant === 'status' && status ? getStatusColor(status) : null,
        className
      )}
    >
      {children}
    </span>
  );
}
