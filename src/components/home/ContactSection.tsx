'use client';

import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState, useTransition } from 'react';
import { sendContactMessage, type ContactInput } from '@/app/actions/contact';
import { Reveal } from '@/components/motion/Reveal';
import { WhatsAppIcon } from '@/components/shared/SocialIcons';
import { Button, ButtonLink } from '@/components/ui/Button';
import { siteConfig, whatsappLink } from '@/lib/site';

// ============================================================
// Contact — info cards + validated form (server action)
// ============================================================

const SUBJECTS = ['Car rental', 'Chauffeur service', 'Wedding / event', 'Tour package', 'Corporate', 'Other'];
const empty: ContactInput = { name: '', phone: '', email: '', subject: SUBJECTS[0], message: '' };

export default function ContactSection({ showHeading = true }: { showHeading?: boolean }) {
  const [form, setForm] = useState<ContactInput>(empty);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<null | 'saved' | 'demo'>(null);
  const [pending, startTransition] = useTransition();

  const set = (key: keyof ContactInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
    setError(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await sendContactMessage(form);
      if (res.ok) setDone(res.mode);
      else setError(res.error);
    });
  };

  const waText = `Assalam o Alaikum! I'm ${form.name} (${form.phone}).\nSubject: ${form.subject}\n\n${form.message}`;

  const cards = [
    { icon: <Phone size={20} />, label: 'Call us', value: siteConfig.phones.map((p) => p.display).join(' / '), href: `tel:${siteConfig.phones[0].tel}` },
    { icon: <Mail size={20} />, label: 'Email us', value: siteConfig.email, href: `mailto:${siteConfig.email}` },
    { icon: <MapPin size={20} />, label: 'Find us', value: siteConfig.address, href: 'https://maps.google.com/?q=Lahore,Pakistan' },
  ];

  return (
    <section id="contact" className="relative overflow-hidden py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          {showHeading && (
            <>
              <Reveal><span className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-gold" />Get in touch</span></Reveal>
              <Reveal delay={0.08}>
                <h2 className="mt-5 text-4xl font-black leading-tight text-white sm:text-5xl">
                  Ready to <span className="gold-gradient">book</span> your ride?
                </h2>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-5 max-w-lg leading-relaxed text-text-muted">
                  Our team replies within minutes — whether you need a bridal car, an SUV for the mountains or a daily driver.
                </p>
              </Reveal>
            </>
          )}

          <div className="mt-10 space-y-4">
            {cards.map(({ icon, label, value, href }, i) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="glass-card group flex items-center gap-4 p-4 transition hover:border-gold/25"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gold-gradient-bg text-obsidian shadow-lg shadow-gold/10 transition group-hover:scale-105">
                  {icon}
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-wider text-text-muted">{label}</span>
                  <span className="block font-medium text-white">{value}</span>
                </span>
              </motion.a>
            ))}
            <Reveal delay={0.4}>
              <ButtonLink href={whatsappLink('Assalam o Alaikum! I have a question.')} variant="glass" size="lg" className="mt-2 w-full sm:w-auto" icon={<WhatsAppIcon className="h-5 w-5 text-[#25D366]" />}>
                Chat on WhatsApp
              </ButtonLink>
            </Reveal>
          </div>
        </div>

        <Reveal direction="left" className="glass-card-gold p-6 sm:p-8">
          {done ? (
            <div className="space-y-4 py-10 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="mx-auto flex h-16 w-16 items-center justify-center rounded-full gold-gradient-bg">
                <CheckCircle2 size={32} className="text-obsidian" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white">{done === 'saved' ? 'Message sent!' : 'One last step'}</h3>
              <p className="text-text-gray">
                {done === 'saved'
                  ? 'Thanks for reaching out — we will get back to you shortly.'
                  : 'Tap below to send your message to our team on WhatsApp.'}
              </p>
              {done === 'demo' && (
                <ButtonLink href={whatsappLink(waText)} variant="glass" className="border-[#25D366] bg-[#25D366] font-semibold text-white hover:bg-[#1fb857]" icon={<WhatsAppIcon className="h-5 w-5" />}>
                  Send on WhatsApp
                </ButtonLink>
              )}
              <div>
                <button type="button" onClick={() => { setDone(null); setForm(empty); }} className="text-sm text-gold hover:underline">
                  Send another message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5" noValidate>
              <h3 className="text-2xl font-bold text-white">Send us a message</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className="field-label">Name *</label>
                  <input id="c-name" autoComplete="name" value={form.name} onChange={set('name')} placeholder="Your name" className="luxury-input" required />
                </div>
                <div>
                  <label htmlFor="c-phone" className="field-label">Mobile *</label>
                  <input id="c-phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} placeholder="0300-1234567" className="luxury-input" required />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-email" className="field-label">Email</label>
                  <input id="c-email" type="email" autoComplete="email" value={form.email} onChange={set('email')} placeholder="you@example.com" className="luxury-input" />
                </div>
                <div>
                  <label htmlFor="c-subject" className="field-label">Subject</label>
                  <select id="c-subject" value={form.subject} onChange={set('subject')} className="luxury-input cursor-pointer">
                    {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="c-message" className="field-label">Message *</label>
                <textarea id="c-message" rows={5} maxLength={2000} value={form.message} onChange={set('message')} placeholder="Tell us about your dates, destination and group size…" className="luxury-input resize-none" required />
              </div>

              {error && (
                <div role="alert" className="flex items-center gap-2 rounded-xl border border-accent-red/30 bg-accent-red/10 p-3 text-sm text-red-300">
                  <AlertCircle size={16} className="shrink-0" /> {error}
                </div>
              )}

              <Button type="submit" size="lg" loading={pending} icon={<Send size={16} />} iconPosition="right" className="w-full">
                Send Message
              </Button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
