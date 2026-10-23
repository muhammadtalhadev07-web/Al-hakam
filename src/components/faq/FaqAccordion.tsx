'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useId, useState } from 'react';
import { cn } from '@/lib/utils';
import type { FaqItem } from '@/types';

// Accessible accordion — one item open at a time
export function FaqAccordion({ items, defaultOpen = 0 }: { items: FaqItem[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;
        return (
          <motion.div
            key={item.question}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.04 }}
            className={cn('overflow-hidden rounded-2xl border transition-colors', isOpen ? 'border-gold/30 bg-gold/[0.04]' : 'border-white/10 bg-white/[0.02] hover:border-white/20')}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <span className="font-medium text-white">{item.question}</span>
                <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full', isOpen ? 'bg-gold text-obsidian' : 'bg-white/5 text-gold')}>
                  <Plus size={16} />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="px-5 pb-5 leading-relaxed text-text-muted">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
