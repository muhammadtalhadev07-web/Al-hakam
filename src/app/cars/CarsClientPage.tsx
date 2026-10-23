'use client';

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useDeferredValue, useMemo, useRef, useState } from 'react';
import CarCard from '@/components/cars/CarCard';
import { Button } from '@/components/ui/Button';
import { cn, formatCurrency } from '@/lib/utils';
import type { Car, CarCategory, CarFilters } from '@/types';

// ============================================================
// Fleet browser — search, category tabs, filters & sorting
// ============================================================

const CATEGORIES: (CarCategory | 'All')[] = ['All', 'Luxury', 'SUV', 'Sedan', 'Van'];

const SORTS: { value: CarFilters['sort']; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'seats', label: 'Most seats' },
];

const defaultFilters: CarFilters = { category: 'All', maxPrice: null, transmission: 'All', seats: 'All', sort: 'recommended' };

interface Props {
  cars: Car[];
  initialCategory?: CarCategory | 'All';
}

export default function CarsClientPage({ cars, initialCategory = 'All' }: Props) {
  const pathname = usePathname();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<CarFilters>({ ...defaultFilters, category: initialCategory });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const deferredSearch = useDeferredValue(search);

  // Is the toolbar currently pinned? (shows the full-width backdrop only when stuck)
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', () => {
    const el = toolbarRef.current;
    if (!el) return;
    const pinnedAt = parseFloat(getComputedStyle(el).top) || 0;
    setStuck(el.getBoundingClientRect().top <= pinnedAt + 1);
  });

  const priceBounds = useMemo(() => {
    const prices = cars.map((c) => c.price_per_day);
    return { min: Math.min(...prices, 0), max: Math.max(...prices, 1000) };
  }, [cars]);

  const seatOptions = useMemo(() => [...new Set(cars.map((c) => c.seats))].sort((a, b) => a - b), [cars]);

  const filtered = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();
    const list = cars.filter((car) => {
      if (filters.category !== 'All' && car.category !== filters.category) return false;
      if (filters.maxPrice !== null && car.price_per_day > filters.maxPrice) return false;
      if (filters.transmission !== 'All' && car.transmission !== filters.transmission) return false;
      if (filters.seats !== 'All' && car.seats < filters.seats) return false;
      if (q && ![car.name, car.brand, car.category, ...(car.features ?? [])].join(' ').toLowerCase().includes(q)) return false;
      return true;
    });
    const sorted = [...list];
    switch (filters.sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price_per_day - b.price_per_day);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price_per_day - a.price_per_day);
        break;
      case 'seats':
        sorted.sort((a, b) => b.seats - a.seats);
        break;
      default:
        sorted.sort((a, b) => Number(b.is_available) - Number(a.is_available));
    }
    return sorted;
  }, [cars, filters, deferredSearch]);

  const activeFilterCount = Number(filters.maxPrice !== null) + Number(filters.transmission !== 'All') + Number(filters.seats !== 'All');
  const isDirty = activeFilterCount > 0 || filters.category !== 'All' || search !== '' || filters.sort !== 'recommended';

  const setCategory = (category: CarCategory | 'All') => {
    setFilters((p) => ({ ...p, category }));
    // keep the URL shareable: /cars?category=SUV
    // (native history API: updates the URL without a server round-trip)
    const params = category === 'All' ? '' : `?category=${category}`;
    window.history.replaceState(null, '', `${pathname}${params}`);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setSearch('');
    window.history.replaceState(null, '', pathname);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Sticky toolbar — pinned just under the navbar. `--nav-offset` is
          published by <Navbar/> and drops to 0 when the navbar hides. The
          filter panel lives inside so it opens right under the search. */}
      <div
        ref={toolbarRef}
        data-stuck={stuck}
        className="sticky z-30 mb-6 transition-[top] duration-300 ease-out before:pointer-events-none before:absolute before:-bottom-3 before:-top-3 before:left-1/2 before:-z-10 before:w-screen before:-translate-x-1/2 before:bg-obsidian/90 before:opacity-0 before:backdrop-blur-xl before:transition-opacity before:content-[''] data-[stuck=true]:before:opacity-100"
        style={{ top: 'calc(var(--nav-offset, 72px) + 12px)' }}
      >
        <div className="relative rounded-2xl border border-white/10 bg-[#181818] p-3 shadow-2xl shadow-black/60">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by car, brand or feature…"
                aria-label="Search cars"
                className="luxury-input pl-10"
              />
            </div>
            <div className="flex gap-3">
              <select
                aria-label="Sort cars"
                value={filters.sort}
                onChange={(e) => setFilters((p) => ({ ...p, sort: e.target.value as CarFilters['sort'] }))}
                className="luxury-input min-w-0 flex-1 cursor-pointer sm:w-52 sm:flex-none"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <Button
                variant={filtersOpen ? 'gold' : 'glass'}
                icon={<SlidersHorizontal size={16} />}
                onClick={() => setFiltersOpen((o) => !o)}
                aria-expanded={filtersOpen}
                aria-controls="filter-panel"
              >
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-obsidian text-xs font-bold text-gold">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
          {/* Filter panel */}
          <AnimatePresence initial={false}>
            {filtersOpen && (
              <motion.div
                id="filter-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-3 grid grid-cols-1 gap-6 border-t border-white/10 p-3 pt-5 sm:grid-cols-3">
                  <div>
                    <label htmlFor="max-price" className="field-label">
                      Max price / day:{' '}
                      <span className="text-gold">{filters.maxPrice === null ? 'Any' : formatCurrency(filters.maxPrice)}</span>
                    </label>
                    <input
                      id="max-price"
                      type="range"
                      min={priceBounds.min}
                      max={priceBounds.max}
                      step={500}
                      value={filters.maxPrice ?? priceBounds.max}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setFilters((p) => ({ ...p, maxPrice: v >= priceBounds.max ? null : v }));
                      }}
                      className="w-full accent-gold"
                    />
                  </div>
                  <div>
                    <label htmlFor="transmission" className="field-label">
                      Transmission
                    </label>
                    <select
                      id="transmission"
                      value={filters.transmission}
                      onChange={(e) => setFilters((p) => ({ ...p, transmission: e.target.value as CarFilters['transmission'] }))}
                      className="luxury-input cursor-pointer"
                    >
                      <option value="All">All</option>
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="seats" className="field-label">
                      Minimum seats
                    </label>
                    <select
                      id="seats"
                      value={filters.seats}
                      onChange={(e) => setFilters((p) => ({ ...p, seats: e.target.value === 'All' ? 'All' : Number(e.target.value) }))}
                      className="luxury-input cursor-pointer"
                    >
                      <option value="All">Any</option>
                      {seatOptions.map((n) => (
                        <option key={n} value={n}>
                          {n}+ seats
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Category tabs */}
      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Car categories">
        {CATEGORIES.map((cat) => {
          const count = cat === 'All' ? cars.length : cars.filter((c) => c.category === cat).length;
          const active = filters.category === cat;
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setCategory(cat)}
              className={cn(
                'relative rounded-xl px-4 py-2 text-sm font-medium transition-colors',
                active ? 'text-obsidian' : 'border border-white/10 bg-white/5 text-text-gray hover:bg-white/10',
              )}
            >
              {active && (
                <motion.span
                  layoutId="cat-pill"
                  className="absolute inset-0 rounded-xl gold-gradient-bg"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">
                {cat} <span className="opacity-60">({count})</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Result count */}
      <div className="mb-6 flex items-center justify-between text-sm text-text-muted">
        <p aria-live="polite">
          Showing <span className="font-medium text-white">{filtered.length}</span> of{' '}
          <span className="font-medium text-white">{cars.length}</span> vehicles
        </p>
        {isDirty && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-gold transition hover:text-gold-light"
          >
            <RotateCcw size={14} /> Reset
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card py-20 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
            <X size={28} className="text-text-muted" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-white">No cars match your filters</h3>
          <p className="mb-6 text-text-muted">Try a different category or widen your price range.</p>
          <Button variant="outline" onClick={resetFilters}>
            Clear all filters
          </Button>
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((car, i) => (
              <motion.div
                key={car.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                <CarCard car={car} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
