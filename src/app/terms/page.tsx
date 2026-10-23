import type { Metadata } from 'next';
import { LegalPage } from '@/components/shared/LegalPage';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = { title: 'Terms of Service', description: `Rental terms and conditions of ${siteConfig.name}.` };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="October 2026"
      sections={[
        { heading: 'Eligibility', body: 'Self-drive renters must be at least 21 years old with a valid driving licence held for at least one year, and present an original CNIC or passport.' },
        { heading: 'Bookings & confirmation', body: 'Online bookings are requests until confirmed by our team by phone or WhatsApp. Prices shown are per 24-hour day and may vary for peak dates.' },
        { heading: 'Security deposit', body: 'A refundable security deposit is required for self-drive rentals and is returned after the vehicle is inspected on return.' },
        { heading: 'Fuel & mileage', body: 'Vehicles are provided with a full tank and must be returned full. Intercity and northern-area travel must be declared at booking.' },
        { heading: 'Cancellations', body: 'Free cancellation up to 48 hours before pick-up. Later cancellations or no-shows may be charged one day’s rental.' },
        { heading: 'Damage & traffic fines', body: 'The renter is responsible for traffic violations during the rental and for damage not covered by insurance, as assessed on return.' },
        { heading: 'Chauffeur service', body: 'Chauffeur duty is up to 12 hours per day. Overtime, out-of-city meals and accommodation for the driver are charged as agreed in your quote.' },
        { heading: 'Liability', body: `${siteConfig.name} is not liable for delays caused by weather, road closures or events beyond our control, but will always help arrange alternatives.` },
      ]}
    />
  );
}
