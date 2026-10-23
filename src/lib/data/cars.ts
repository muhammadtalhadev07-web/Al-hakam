import { cache } from 'react';
import { DEMO_CARS } from '@/data/cars';
import { createPublicClient } from '@/lib/supabase/server';
import type { Car } from '@/types';

// ============================================================
// Car data access (server-only)
// Reads from Supabase when configured; falls back to the demo fleet
// if Supabase is missing, errors, or the table is still empty.
// ============================================================

export type CarSource = 'supabase' | 'demo';

export const getCars = cache(async (): Promise<{ cars: Car[]; source: CarSource }> => {
  const supabase = createPublicClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[getCars] Supabase error, using demo fleet:', error.message);
    } else if (data && data.length > 0) {
      return { cars: data as Car[], source: 'supabase' };
    }
  }
  return { cars: DEMO_CARS, source: 'demo' };
});

export async function getFeaturedCars(limit = 6): Promise<Car[]> {
  const { cars } = await getCars();
  return cars.filter((c) => c.is_available).slice(0, limit);
}

export async function getCarById(id: string): Promise<Car | null> {
  const { cars } = await getCars();
  return cars.find((c) => c.id === id) ?? null;
}

export async function getSimilarCars(car: Car, limit = 3): Promise<Car[]> {
  const { cars } = await getCars();
  return cars
    .filter((c) => c.id !== car.id && c.category === car.category)
    .concat(cars.filter((c) => c.id !== car.id && c.category !== car.category))
    .slice(0, limit);
}
