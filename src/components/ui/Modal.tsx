'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useId, useRef, useSyncExternalStore, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

// ============================================================
// Accessible Modal — Escape to close, scroll lock, focus handling.
// Rendered in a portal on <body>: a parent with `backdrop-filter`
// or `transform` would otherwise trap the `position: fixed` overlay.
// ============================================================

const noop = () => () => {};
const useIsClient = () => useSyncExternalStore(noop, () => true, () => false);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const sizeMap = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-6xl',
};

export function Modal({ isOpen, onClose, title, children, size = 'md', className }: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
      previouslyFocused?.focus?.();
    };
  }, [isOpen]);

  const isClient = useIsClient();
  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            aria-hidden
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 30 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'relative w-full max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-gold/15 bg-[#1b1b1b]/95 shadow-2xl outline-none',
              sizeMap[size],
              className
            )}
          >
            {title ? (
              <div className="flex items-center justify-between border-b border-white/10 p-6">
                <h2 id={titleId} className="text-xl font-semibold text-white">
                  {title}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close dialog"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-gray-200 backdrop-blur transition hover:bg-black/70 hover:text-white"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
