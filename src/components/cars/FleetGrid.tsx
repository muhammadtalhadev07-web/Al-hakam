import { cn } from '@/lib/utils';
import type { Car } from '@/types';
import CarCard from './CarCard';

// Responsive grid of car cards (cards link to the details page)
export function FleetGrid({ cars, className }: { cars: Car[]; className?: string }) {
  return (
    <div className={cn('grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {cars.map((car, i) => (
        <CarCard key={car.id} car={car} index={i} />
      ))}
    </div>
  );
}
