import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

// ============================================================
// Luxury Button + ButtonLink
// Use <ButtonLink> for navigation instead of wrapping <Button> in <Link>
// (a <button> inside an <a> is invalid HTML and breaks keyboard users).
// ============================================================

type ButtonVariant = 'gold' | 'outline' | 'ghost' | 'danger' | 'glass';
type ButtonSize = 'sm' | 'md' | 'lg';

interface StyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

const variantStyles: Record<ButtonVariant, string> = {
  gold: 'relative overflow-hidden gold-gradient-bg text-obsidian font-semibold shadow-lg shadow-gold/20 hover:shadow-gold/40 hover:-translate-y-0.5 active:translate-y-0',
  outline: 'border border-gold/50 text-gold hover:bg-gold/10 hover:border-gold',
  ghost: 'text-text-gray hover:text-white hover:bg-white/5',
  danger: 'bg-accent-red/10 border border-accent-red/30 text-accent-red hover:bg-accent-red/20',
  glass: 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-sm',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg gap-1.5',
  md: 'px-6 py-3 text-sm rounded-xl gap-2',
  lg: 'px-8 py-4 text-base rounded-xl gap-2.5',
};

export function buttonClasses({ variant = 'gold', size = 'md' }: StyleProps, className?: string) {
  return cn(
    'group/btn inline-flex items-center justify-center font-medium transition-all duration-300 cursor-pointer select-none whitespace-nowrap',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:pointer-events-none',
    variantStyles[variant],
    sizeStyles[size],
    className
  );
}

function Content({ icon, iconPosition = 'left', children, variant }: StyleProps & { children: ReactNode }) {
  return (
    <>
      {variant === 'gold' && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-white/40 blur-md animate-shine"
        />
      )}
      {icon && iconPosition === 'left' && <span className="relative shrink-0">{icon}</span>}
      <span className="relative">{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="relative shrink-0 transition-transform duration-300 group-hover/btn:translate-x-1">{icon}</span>
      )}
    </>
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, StyleProps {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'gold', size = 'md', loading = false, icon, iconPosition = 'left', className, children, disabled, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses({ variant, size }, className)}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          <span className="sr-only">Loading</span>
        </>
      ) : (
        <Content icon={icon} iconPosition={iconPosition} variant={variant}>
          {children}
        </Content>
      )}
    </button>
  )
);
Button.displayName = 'Button';

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement>, StyleProps {
  href: string;
  /** Use a plain <a> (tel:, mailto:, wa.me, external) instead of next/link */
  external?: boolean;
}

export function ButtonLink({ href, variant = 'gold', size = 'md', icon, iconPosition = 'left', className, children, external, ...props }: ButtonLinkProps) {
  const classes = buttonClasses({ variant, size }, className);
  const content = (
    <Content icon={icon} iconPosition={iconPosition} variant={variant}>
      {children}
    </Content>
  );
  const isExternal = external ?? /^(https?:|tel:|mailto:)/.test(href);

  if (isExternal) {
    const newTab = href.startsWith('http');
    return (
      <a href={href} className={classes} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...props}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...props}>
      {content}
    </Link>
  );
}
