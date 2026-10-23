'use client';

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { whatsappLink } from '@/lib/site';
import { WhatsAppIcon } from './SocialIcons';

// WhatsApp quick-chat + back-to-top buttons
export function FloatingActions() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [showTop, setShowTop] = useState(false);

  useMotionValueEvent(scrollY, 'change', (y) => setShowTop(y > 700));

  if (pathname.startsWith('/admin') || pathname.startsWith('/auth')) return null;

  return (
    <div className="fixed bottom-6 right-5 z-[60] flex flex-col items-end gap-3">
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#1f1f1f]/90 text-gold shadow-xl backdrop-blur transition hover:border-gold/40"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
      <motion.a
        href={whatsappLink('Assalam o Alaikum! I would like to book a car with Al Hakam Tours.')}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, type: 'spring' }}
        whileHover={{ scale: 1.08 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/30"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40" aria-hidden />
        <WhatsAppIcon className="relative h-7 w-7" />
      </motion.a>
    </div>
  );
}
