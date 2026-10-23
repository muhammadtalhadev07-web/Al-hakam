'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, X, Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { IMAGES, canOptimize } from '@/data/images';
import { formatCurrency } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { revalidateFleet } from '@/app/actions/revalidate';
import type { Car, CarFormData, CarCategory, Transmission } from '@/types';

// ============================================================
// Admin Car Management (CRUD)
// ============================================================

const defaultForm: CarFormData = {
  name: '',
  category: 'SUV',
  price_per_day: 5000,
  image_url: '',
  seats: 5,
  transmission: 'Automatic',
  features: [],
  is_available: true,
  description: '',
  brand: '',
  year: 2024,
};

interface AdminCarsProps {
  initialCars: Car[];
}

export default function AdminCars({ initialCars }: AdminCarsProps) {
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [formOpen, setFormOpen] = useState(false);
  const [editCar, setEditCar] = useState<Car | null>(null);
  const [form, setForm] = useState<CarFormData>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [featuresInput, setFeaturesInput] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  const supabase = createClient();

  const openAdd = () => {
    setEditCar(null);
    setForm(defaultForm);
    setFeaturesInput('');
    setError(null);
    setFormOpen(true);
  };

  const openEdit = (car: Car) => {
    setEditCar(car);
    setForm({
      name: car.name,
      category: car.category,
      price_per_day: car.price_per_day,
      image_url: car.image_url,
      seats: car.seats,
      transmission: car.transmission,
      features: car.features || [],
      is_available: car.is_available,
      description: car.description || '',
      brand: car.brand || '',
      year: car.year || new Date().getFullYear(),
    });
    setFeaturesInput((car.features || []).join(', '));
    setError(null);
    setFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError(null);

    const parsedFeatures = featuresInput
      .split(',')
      .map(f => f.trim())
      .filter(Boolean);

    const payload = { ...form, name: form.name.trim(), features: parsedFeatures };

    try {
      if (editCar) {
        const { data, error } = await supabase
          .from('cars')
          .update(payload)
          .eq('id', editCar.id)
          .select()
          .single();
        if (error) throw error;
        setCars(prev => prev.map(c => c.id === editCar.id ? data : c));
      } else {
        const { data, error } = await supabase.from('cars').insert(payload).select().single();
        if (error) throw error;
        setCars(prev => [data, ...prev]);
      }
      setFormOpen(false);
      void revalidateFleet();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save car.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (car: Car) => {
    if (!supabase) return;
    if (!window.confirm(`Delete "${car.name}"? This cannot be undone.`)) return;
    setActionError(null);
    const { error } = await supabase.from('cars').delete().eq('id', car.id);
    if (error) {
      // Usually a foreign-key error: the car still has bookings
      setActionError(`Could not delete ${car.name}: ${error.message}. Tip: mark it unavailable instead.`);
      return;
    }
    setCars(prev => prev.filter(c => c.id !== car.id));
    void revalidateFleet();
  };

  const toggleAvailability = async (car: Car) => {
    if (!supabase) return;
    setActionError(null);
    // Optimistic update with rollback on failure
    setCars(prev => prev.map(c => c.id === car.id ? { ...c, is_available: !c.is_available } : c));
    const { error } = await supabase
      .from('cars')
      .update({ is_available: !car.is_available })
      .eq('id', car.id);
    if (error) {
      setCars(prev => prev.map(c => c.id === car.id ? { ...c, is_available: car.is_available } : c));
      setActionError(`Could not update ${car.name}: ${error.message}`);
      return;
    }
    void revalidateFleet();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Car Management</h2>
          <p className="text-[#8A8A8A] text-sm">{cars.length} vehicles in fleet</p>
        </div>
        <Button variant="gold" size="md" icon={<Plus size={16} />} onClick={openAdd}>
          Add Car
        </Button>
      </div>

      {actionError && (
        <div role="alert" className="flex items-center gap-2 p-3 rounded-xl bg-[#EA4335]/10 border border-[#EA4335]/30 text-[#EA4335] text-sm">
          <AlertCircle size={16} className="shrink-0" /> {actionError}
        </div>
      )}

      {cars.length === 0 && (
        <div className="glass-card p-12 text-center text-[#8A8A8A]">
          No cars in the database yet. The public site is showing demo cars — click <strong className="text-[#E5C158]">Add Car</strong> to add your own.
        </div>
      )}

      {/* Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {cars.map((car, i) => (
          <motion.div
            key={car.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card overflow-hidden"
          >
            {/* Image */}
            <div className="relative h-40">
              <Image
                src={car.image_url || IMAGES.fallbackCar}
                alt={car.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                unoptimized={!canOptimize(car.image_url || IMAGES.fallbackCar)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 to-transparent" />
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  type="button"
                  aria-label={car.is_available ? `Mark ${car.name} unavailable` : `Mark ${car.name} available`}
                  onClick={() => toggleAvailability(car)}
                  className={`p-1.5 rounded-lg transition-all ${car.is_available ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}
                  title="Toggle availability"
                >
                  {car.is_available ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                </button>
                <button
                  type="button"
                  aria-label={`Edit ${car.name}`}
                  title="Edit"
                  onClick={() => openEdit(car)}
                  className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${car.name}`}
                  title="Delete"
                  onClick={() => handleDelete(car)}
                  className="p-1.5 rounded-lg bg-[#EA4335]/10 text-[#EA4335] hover:bg-[#EA4335]/20 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-white font-semibold text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>{car.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${car.is_available ? 'text-green-400 bg-green-400/10 border-green-400/30' : 'text-red-400 bg-red-400/10 border-red-400/30'}`}>
                  {car.is_available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#8A8A8A]">
                <span>{car.category} • {car.seats} seats • {car.transmission}</span>
                <span className="text-[#E5C158] font-semibold">{formatCurrency(car.price_per_day)}/day</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {formOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50"
              onClick={() => setFormOpen(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
                style={{ background: '#242424', border: '1px solid rgba(229,193,88,0.15)' }}
              >
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {editCar ? 'Edit Car' : 'Add New Car'}
                  </h3>
                  <button type="button" aria-label="Close" onClick={() => setFormOpen(false)} className="p-2 rounded-lg text-[#8A8A8A] hover:text-white hover:bg-white/10 transition-all">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs text-[#8A8A8A] mb-2 uppercase tracking-wider">Car Name *</label>
                      <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="luxury-input" placeholder="Toyota Land Cruiser" required />
                    </div>
                    <div>
                      <label className="block text-xs text-[#8A8A8A] mb-2 uppercase tracking-wider">Category *</label>
                      <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as CarCategory }))} className="luxury-input">
                        {['SUV', 'Sedan', 'Luxury', 'Van'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-[#8A8A8A] mb-2 uppercase tracking-wider">Price / Day (PKR) *</label>
                      <input type="number" value={form.price_per_day} onChange={e => setForm(p => ({ ...p, price_per_day: Number(e.target.value) }))} className="luxury-input" min={100} required />
                    </div>
                    <div>
                      <label className="block text-xs text-[#8A8A8A] mb-2 uppercase tracking-wider">Seats *</label>
                      <input type="number" value={form.seats} onChange={e => setForm(p => ({ ...p, seats: Number(e.target.value) }))} className="luxury-input" min={1} max={15} required />
                    </div>
                    <div>
                      <label className="block text-xs text-[#8A8A8A] mb-2 uppercase tracking-wider">Transmission</label>
                      <select value={form.transmission} onChange={e => setForm(p => ({ ...p, transmission: e.target.value as Transmission }))} className="luxury-input">
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-[#8A8A8A] mb-2 uppercase tracking-wider">Image URL *</label>
                      <input type="url" value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} className="luxury-input" placeholder="https://..." required />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-[#8A8A8A] mb-2 uppercase tracking-wider">Features (comma-separated)</label>
                      <input type="text" value={featuresInput} onChange={e => setFeaturesInput(e.target.value)} className="luxury-input" placeholder="AC, GPS, Sunroof, Leather Seats" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-[#8A8A8A] mb-2 uppercase tracking-wider">Description</label>
                      <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="luxury-input resize-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-[#8A8A8A] mb-2 uppercase tracking-wider">Brand</label>
                      <input type="text" value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} className="luxury-input" placeholder="Toyota" />
                    </div>
                    <div>
                      <label className="block text-xs text-[#8A8A8A] mb-2 uppercase tracking-wider">Year</label>
                      <input type="number" value={form.year} onChange={e => setForm(p => ({ ...p, year: Number(e.target.value) }))} className="luxury-input" min={2000} max={2030} />
                    </div>
                    <div className="col-span-2 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setForm(p => ({ ...p, is_available: !p.is_available }))}
                        role="switch"
                        aria-checked={form.is_available}
                        aria-label="Available for booking"
                        className={`relative w-11 h-6 rounded-full transition-all ${form.is_available ? 'gold-gradient-bg' : 'bg-[#3a3a3a]'}`}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.is_available ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                      </button>
                      <span className="text-sm text-[#D1D1D1]">
                        {form.is_available ? 'Available for booking' : 'Mark as unavailable'}
                      </span>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-[#EA4335]/10 border border-[#EA4335]/30 text-[#EA4335] text-sm">
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="glass" size="md" onClick={() => setFormOpen(false)} className="flex-1">Cancel</Button>
                    <Button type="submit" variant="gold" size="md" loading={loading} icon={<Save size={16} />} className="flex-1">
                      {editCar ? 'Save Changes' : 'Add Car'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
