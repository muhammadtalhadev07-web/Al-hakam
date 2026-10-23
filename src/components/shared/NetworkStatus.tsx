'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

// ============================================================
// NetworkStatus — internet connectivity check
// `navigator.onLine` only tells us a network adapter is up, so we also
// ping our own origin to confirm the connection really works.
// ============================================================

type Status = 'online' | 'offline' | 'restored';

async function hasInternet(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return false;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`/favicon.ico?ping=${Date.now()}`, {
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res.ok || res.status < 500;
  } catch {
    return false;
  }
}

export function NetworkStatus() {
  const [status, setStatus] = useState<Status>('online');
  const [checking, setChecking] = useState(false);
  const statusRef = useRef<Status>('online');
  const restoreTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const update = useCallback((next: Status) => {
    statusRef.current = next;
    setStatus(next);
    if (restoreTimer.current) clearTimeout(restoreTimer.current);
    if (next === 'restored') {
      restoreTimer.current = setTimeout(() => {
        statusRef.current = 'online';
        setStatus('online');
      }, 3500);
    }
  }, []);

  const verify = useCallback(async () => {
    setChecking(true);
    const ok = await hasInternet();
    setChecking(false);
    if (ok && statusRef.current === 'offline') update('restored');
    if (!ok && statusRef.current !== 'offline') update('offline');
  }, [update]);

  useEffect(() => {
    const goOffline = () => update('offline');
    const goOnline = () => void verify();
    const onVisible = () => {
      if (document.visibilityState === 'visible') void verify();
    };

    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    document.addEventListener('visibilitychange', onVisible);

    // Initial check + gentle re-check every 20s while offline
    const initial = setTimeout(() => {
      if (!navigator.onLine) update('offline');
    }, 0);
    const interval = setInterval(() => {
      if (statusRef.current === 'offline') void verify();
    }, 20_000);

    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
      document.removeEventListener('visibilitychange', onVisible);
      clearTimeout(initial);
      clearInterval(interval);
      if (restoreTimer.current) clearTimeout(restoreTimer.current);
    };
  }, [update, verify]);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4">
      <AnimatePresence>
        {status !== 'online' && (
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            role="status"
            className={`pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl ${
              status === 'offline'
                ? 'border-accent-red/40 bg-[#2a1513]/90 text-red-100'
                : 'border-emerald-400/40 bg-[#10261c]/90 text-emerald-100'
            }`}
          >
            {status === 'offline' ? <WifiOff size={18} className="text-red-400" /> : <Wifi size={18} className="text-emerald-400" />}
            <div className="text-sm">
              <p className="font-semibold">{status === 'offline' ? 'No internet connection' : 'Back online'}</p>
              <p className="text-xs opacity-80">
                {status === 'offline'
                  ? 'Check your Wi-Fi or mobile data. You can still call us on 0305-6758074.'
                  : 'Your connection has been restored.'}
              </p>
            </div>
            {status === 'offline' && (
              <button
                type="button"
                onClick={() => void verify()}
                className="ml-2 inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium transition hover:bg-white/20"
              >
                <RefreshCw size={12} className={checking ? 'animate-spin' : ''} />
                Retry
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
