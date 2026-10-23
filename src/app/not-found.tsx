import { ArrowLeft, Car } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main className="mesh-bg flex min-h-screen items-center justify-center px-4 pt-20 text-center">
      <div>
        <p className="font-display text-[9rem] font-black leading-none gold-gradient sm:text-[12rem]">404</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Looks like you took a wrong turn</h1>
        <p className="mx-auto mt-3 max-w-md text-text-muted">The page you are looking for doesn&apos;t exist or has been moved.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/" icon={<ArrowLeft size={16} />}>Back home</ButtonLink>
          <ButtonLink href="/cars" variant="glass" icon={<Car size={16} />}>Browse fleet</ButtonLink>
        </div>
      </div>
    </main>
  );
}
