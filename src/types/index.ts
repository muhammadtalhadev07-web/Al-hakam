// ============================================================
// Al Hakam Tours & Rent A Car — TypeScript Types
// ============================================================

export type CarCategory = 'SUV' | 'Sedan' | 'Luxury' | 'Van';
export type Transmission = 'Automatic' | 'Manual';
export type FuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type UserRole = 'admin' | 'customer';

// ------ Database Models ------

export interface Car {
  id: string;
  name: string;
  category: CarCategory;
  price_per_day: number;
  image_url: string;
  seats: number;
  transmission: Transmission;
  features: string[];
  is_available: boolean;
  description?: string | null;
  brand?: string | null;
  year?: number | null;
  created_at: string;
  // Optional presentation fields (present on demo data, optional in DB)
  fuel?: FuelType | null;
  luggage?: number | null;
  rating?: number | null;
  reviews?: number | null;
  gallery?: string[] | null;
  driver_price_per_day?: number | null;
}

export interface Booking {
  id: string;
  car_id: string;
  user_id?: string | null;
  start_date: string;
  end_date: string;
  total_amount: number;
  status: BookingStatus;
  customer_name: string;
  phone: string;
  email?: string | null;
  notes?: string | null;
  created_at: string;
  // Joined fields
  car?: Pick<Car, 'name' | 'image_url'> & Partial<Car>;
}

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string | null;
  phone?: string | null;
  created_at: string;
}

// ------ Static content models ------

export interface TourDay {
  day: number;
  title: string;
  description: string;
}

export interface Tour {
  slug: string;
  title: string;
  region: string;
  duration_days: number;
  price_from: number;
  group_size: string;
  image_url: string;
  gallery: string[];
  summary: string;
  highlights: string[];
  includes: string[];
  itinerary: TourDay[];
  best_season: string;
  difficulty: 'Easy' | 'Moderate' | 'Adventurous';
  rating: number;
  reviews: number;
}

export interface Testimonial {
  name: string;
  location: string;
  rating: number;
  text: string;
  date: string;
  service: string;
}

export interface FaqItem {
  category: 'Booking' | 'Payments' | 'Vehicles' | 'Tours' | 'Policies';
  question: string;
  answer: string;
}

export interface ServiceItem {
  slug: string;
  title: string;
  short: string;
  description: string;
  points: string[];
  image_url: string;
  icon: 'car' | 'crown' | 'plane' | 'briefcase' | 'heart' | 'mountain';
}

// ------ Form Types ------

export interface BookingFormData {
  car_id: string;
  start_date: string;
  end_date: string;
  customer_name: string;
  phone: string;
  email?: string;
  notes?: string;
}

export interface CarFormData {
  name: string;
  category: CarCategory;
  price_per_day: number;
  image_url: string;
  seats: number;
  transmission: Transmission;
  features: string[];
  is_available: boolean;
  description?: string;
  brand?: string;
  year?: number;
}

// ------ Analytics / Dashboard ------

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  bookings: number;
}

// ------ Filter Types ------

export interface CarFilters {
  category: CarCategory | 'All';
  /** `null` = no upper limit */
  maxPrice: number | null;
  transmission: Transmission | 'All';
  seats: number | 'All';
  sort: 'recommended' | 'price-asc' | 'price-desc' | 'seats';
}
