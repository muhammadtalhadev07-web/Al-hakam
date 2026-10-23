import type { FaqItem, ServiceItem, Testimonial } from '@/types';
import { IMAGES, unsplash } from './images';

// ============================================================
// Marketing content — sample copy, replace with your own.
// NOTE: testimonials below are placeholders. Swap them for real
// customer reviews before the site goes live.
// ============================================================

export const STATS = [
  { value: 12500, suffix: '+', label: 'Happy Clients' },
  { value: 60, suffix: '+', label: 'Premium Vehicles' },
  { value: 12, suffix: '+', label: 'Years Experience' },
  { value: 35, suffix: '', label: 'Cities Covered' },
] as const;

export const BRANDS = ['Toyota', 'Honda', 'Mercedes-Benz', 'BMW', 'Audi', 'Land Rover', 'Porsche', 'Hyundai', 'Kia', 'Rolls-Royce'];

export const SERVICES: ServiceItem[] = [
  {
    slug: 'self-drive',
    title: 'Self-Drive Rentals',
    short: 'Pick a car, grab the keys and go — daily, weekly or monthly.',
    description:
      'Flexible self-drive rentals with comprehensive insurance, unlimited city mileage and doorstep delivery anywhere in Lahore.',
    points: ['Daily, weekly & monthly plans', 'Doorstep delivery & pick-up', 'Comprehensive insurance', 'Unlimited city mileage'],
    image_url: IMAGES.driving,
    icon: 'car',
  },
  {
    slug: 'chauffeur',
    title: 'Chauffeur-Driven Cars',
    short: 'Professional, uniformed drivers who know every road.',
    description:
      'Sit back while our vetted, uniformed chauffeurs handle traffic, parking and routes. Perfect for executives, families and guests.',
    points: ['Background-checked drivers', 'Uniformed & multilingual', 'Hourly or full-day', 'Driver meals & stay arranged'],
    image_url: unsplash('1555215695-3004980ad54e', 1400),
    icon: 'briefcase',
  },
  {
    slug: 'weddings',
    title: 'Wedding & Events',
    short: 'Rolls-Royce, Range Rover and decorated convoys for your big day.',
    description:
      'From baraat convoys to bridal cars with floral décor — we coordinate timings, routes and photo stops so you don’t have to.',
    points: ['Decorated bridal car', 'Matching convoy vehicles', 'Event coordinator', 'Photo-shoot friendly cars'],
    image_url: unsplash('1631295868223-63265b40d9e4', 1400),
    icon: 'heart',
  },
  {
    slug: 'airport',
    title: 'Airport Transfers',
    short: 'On-time pick-ups at Lahore, Islamabad and Karachi airports.',
    description:
      'Flight-tracked airport transfers with meet-and-greet, luggage help and fixed pricing — no surge, no surprises.',
    points: ['Flight tracking', 'Meet & greet with name board', 'Free 60-min waiting', 'Fixed transparent pricing'],
    image_url: IMAGES.roadTrip,
    icon: 'plane',
  },
  {
    slug: 'corporate',
    title: 'Corporate Fleet',
    short: 'Monthly contracts and VIP movement for businesses.',
    description:
      'Dedicated vehicles and drivers for companies, delegations and NGOs, with monthly invoicing and a single point of contact.',
    points: ['Monthly invoicing', 'Dedicated account manager', 'Replacement guarantee', 'Delegation & VIP protocol'],
    image_url: unsplash('1606664515524-ed2f786a0bd6', 1400),
    icon: 'crown',
  },
  {
    slug: 'tours',
    title: 'Northern Tours',
    short: 'Guided trips to Hunza, Skardu, Swat and beyond.',
    description:
      '4x4 vehicles, mountain-experienced drivers, hotels and itineraries — complete, worry-free tour packages across Pakistan.',
    points: ['4x4 mountain vehicles', 'Hotels & meals arranged', 'Custom itineraries', 'Group & family packages'],
    image_url: IMAGES.mountains,
    icon: 'mountain',
  },
];

export const PROCESS_STEPS = [
  { title: 'Choose your car', text: 'Browse the fleet, filter by type, seats or budget and pick the perfect ride.' },
  { title: 'Pick your dates', text: 'Select pick-up and return dates — the total price updates instantly.' },
  { title: 'Confirm in minutes', text: 'Our team calls or WhatsApps you to confirm details and documents.' },
  { title: 'Enjoy the drive', text: 'Car delivered to your door, fuelled, cleaned and ready to go.' },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Ahmed Raza',
    location: 'Lahore',
    rating: 5,
    service: 'Land Cruiser · Northern tour',
    text: 'The 4x4 was immaculate and our driver knew every turn of the KKH. The team replied on WhatsApp within minutes. Will book again!',
    date: 'Sep 2026',
  },
  {
    name: 'Fatima Malik',
    location: 'Karachi',
    rating: 5,
    service: 'Rolls-Royce · Wedding',
    text: 'Booked the Rolls-Royce for our wedding. Spotless car, punctual chauffeur and the décor was beautiful. Made our day extra special.',
    date: 'Aug 2026',
  },
  {
    name: 'Hassan Iqbal',
    location: 'Islamabad',
    rating: 5,
    service: 'Camry Hybrid · Corporate',
    text: 'We use Al Hakam for our visiting delegations. Smooth booking, well-maintained cars and monthly invoicing that just works.',
    date: 'Jul 2026',
  },
  {
    name: 'Sara Khan',
    location: 'Peshawar',
    rating: 5,
    service: 'Honda CR-V · Self-drive',
    text: 'Transparent pricing, no hidden charges and the car was delivered to my door. Best rental experience I have had in Pakistan.',
    date: 'Jun 2026',
  },
  {
    name: 'Bilal Ahmed',
    location: 'Faisalabad',
    rating: 5,
    service: 'Hunza Explorer · Family tour',
    text: 'Seven days in Hunza with kids and zero stress. Hotels, food and the itinerary were all perfectly planned.',
    date: 'May 2026',
  },
  {
    name: 'Ayesha Siddiqui',
    location: 'Lahore',
    rating: 4,
    service: 'Airport transfer',
    text: 'Driver was waiting with a name board at 3 AM even though my flight was delayed. Really appreciated the professionalism.',
    date: 'Apr 2026',
  },
];

export const FAQS: FaqItem[] = [
  { category: 'Booking', question: 'How do I book a car?', answer: 'Choose a car on the Fleet page, select your dates and submit the booking form. Our team will call or WhatsApp you within minutes to confirm. You can also call 0305-6758074 directly.' },
  { category: 'Booking', question: 'What documents do I need?', answer: 'For self-drive: original CNIC (or passport for foreigners) and a valid driving licence. For chauffeur-driven bookings, only your CNIC / passport is required.' },
  { category: 'Booking', question: 'Can I book for someone else?', answer: 'Yes. Enter the guest’s name and phone in the special requests field — we will coordinate pick-up directly with them.' },
  { category: 'Payments', question: 'Which payment methods do you accept?', answer: 'Cash, bank transfer, JazzCash, Easypaisa and debit/credit cards. Corporate clients can pay on monthly invoice.' },
  { category: 'Payments', question: 'Is there a security deposit?', answer: 'Self-drive rentals require a refundable security deposit that depends on the vehicle. Chauffeur-driven bookings do not need a deposit.' },
  { category: 'Vehicles', question: 'Is fuel included?', answer: 'Self-drive cars are delivered with a full tank and should be returned full. For chauffeur-driven and tour bookings fuel can be included in your quote.' },
  { category: 'Vehicles', question: 'Are your cars insured?', answer: 'Every vehicle carries comprehensive insurance and is inspected before each rental.' },
  { category: 'Vehicles', question: 'What happens if the car breaks down?', answer: 'Call our 24/7 line. We provide roadside assistance and a replacement vehicle as quickly as possible.' },
  { category: 'Tours', question: 'Can you customise a tour?', answer: 'Absolutely. Tell us your dates, group size and budget and we will design an itinerary around you.' },
  { category: 'Tours', question: 'Are northern area roads safe in your cars?', answer: 'Mountain tours use 4x4 vehicles driven by drivers with years of experience on the KKH, Babusar and Deosai routes.' },
  { category: 'Policies', question: 'What is your cancellation policy?', answer: 'Free cancellation up to 48 hours before pick-up. Cancellations within 48 hours may be charged one day’s rental.' },
  { category: 'Policies', question: 'Can I take a self-drive car out of the city?', answer: 'Yes, intercity travel is allowed with prior notice. Some vehicles are restricted from northern areas for safety reasons.' },
];

export const VALUES = [
  { title: 'Safety First', text: 'Every car is inspected before every trip and every driver is background-checked.' },
  { title: 'Honest Pricing', text: 'The price you see is the price you pay — no hidden fees, no surge pricing.' },
  { title: 'Always Reachable', text: 'Real people on the phone and WhatsApp, 24 hours a day, 7 days a week.' },
  { title: 'Local Expertise', text: 'Born in Lahore, we know Pakistan’s roads from Karachi to Khunjerab.' },
];

export const MILESTONES = [
  { year: '2014', title: 'Founded in Lahore', text: 'Started with three sedans and one promise: honest service.' },
  { year: '2017', title: 'Northern tours launched', text: 'Added 4x4 vehicles and our first Hunza & Skardu packages.' },
  { year: '2020', title: 'Luxury & wedding fleet', text: 'Introduced Range Rover, Mercedes and the Rolls-Royce bridal car.' },
  { year: '2023', title: 'Corporate partnerships', text: 'Became the transport partner for companies and delegations.' },
  { year: '2026', title: 'Online booking', text: 'Launched this website so you can book in under two minutes.' },
];
