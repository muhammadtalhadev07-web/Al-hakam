import type { Metadata } from 'next';
import { LegalPage } from '@/components/shared/LegalPage';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = { title: 'Privacy Policy', description: `How ${siteConfig.name} collects and protects your data.` };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="October 2026"
      sections={[
        { heading: 'Information we collect', body: 'When you book a car, send a message or create an account we collect your name, phone number, email address, booking dates and any notes you provide. We also collect basic, anonymous usage data to improve the website.' },
        { heading: 'How we use it', body: 'Your information is used only to process and confirm bookings, contact you about your rental or tour, provide customer support and meet legal obligations. We never sell your personal data.' },
        { heading: 'Identity documents', body: 'CNIC, passport or driving licence copies are verified at vehicle hand-over and stored securely for the duration required by law, after which they are deleted.' },
        { heading: 'Data storage & security', body: 'Account and booking data is stored with our database provider (Supabase) using encryption in transit and at rest. Access is limited to authorised staff.' },
        { heading: 'Cookies', body: 'We use essential cookies to keep you signed in. No advertising or tracking cookies are used.' },
        { heading: 'Your rights', body: `You can request a copy, correction or deletion of your data at any time by emailing ${siteConfig.email}.` },
        { heading: 'Contact', body: `Questions about this policy? Email ${siteConfig.email} or call ${siteConfig.phones[0].display}.` },
      ]}
    />
  );
}
