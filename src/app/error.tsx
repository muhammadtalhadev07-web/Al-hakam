'use client';

import { RotateCcw } from 'lucide-react';
import { useEffect } from 'react';
import { Button, ButtonLink } from '@/components/ui/Button';

// Catches unexpected runtime errors in any page segment
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mesh-bg flex min-h-screen items-center justify-center px-4 text-center">
      <div className="glass-card max-w-md p-10">
        <h1 className="text-3xl font-bold text-white">Something went wrong</h1>
        <p className="mt-3 text-text-muted">
          Please try again. If the problem continues, check your internet connection or call us on 0305-6758074.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={reset} icon={<RotateCcw size={16} />}>Try again</Button>
          <ButtonLink href="/" variant="glass">Go home</ButtonLink>
        </div>
      </div>
    </main>
  );
}
