import { Phone } from 'lucide-react';
import { Suspense } from 'react';
import { WhatsAppIcon } from '@/components/shared/SocialIcons';
import { Button, ButtonLink } from '@/components/ui/Button';
import { primaryPhone, whatsappLink } from '@/lib/site';
import { formatCurrency } from '@/lib/utils';
import type { Car } from '@/types';
import BookActions from './BookActions';

// Price + actions panel on the car details page (server component).
// Only the auth-aware booking button runs on the client.
export default function BookCarPanel({ car }: { car: Car }) {
  return (
    <div className="glass-card-gold p-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-text-muted">From</div>
          <div className="font-display text-4xl font-black gold-gradient">{formatCurrency(car.price_per_day)}</div>
          <div className="text-sm text-text-muted">per day</div>
        </div>
        <span
          className={
            car.is_available
              ? 'rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300'
              : 'rounded-full border border-accent-red/30 bg-accent-red/10 px-3 py-1 text-xs text-red-300'
          }
        >
          {car.is_available ? 'Available' : 'Currently booked'}
        </span>
      </div>

      {car.driver_price_per_day ? (
        <p className="mt-4 rounded-xl bg-white/5 p-3 text-sm text-text-gray">
          Chauffeur available for <span className="font-semibold text-white">{formatCurrency(car.driver_price_per_day)}</span>/day
        </p>
      ) : null}

      <div className="mt-6 space-y-3">
        {/* useSearchParams inside BookActions needs a Suspense boundary on a static page */}
        <Suspense
          fallback={
            <Button size="lg" className="w-full" disabled>
              Book this car
            </Button>
          }
        >
          <BookActions car={car} />
        </Suspense>
        <ButtonLink
          href={whatsappLink(`Hi! Is the ${car.name} available? I'd like a quote.`)}
          variant="glass"
          size="lg"
          className="w-full"
          icon={<WhatsAppIcon className="h-5 w-5 text-[#25D366]" />}
        >
          Ask on WhatsApp
        </ButtonLink>
        <ButtonLink href={`tel:${primaryPhone.tel}`} variant="ghost" className="w-full" icon={<Phone size={16} />}>
          {primaryPhone.display}
        </ButtonLink>
      </div>
    </div>
  );
}
