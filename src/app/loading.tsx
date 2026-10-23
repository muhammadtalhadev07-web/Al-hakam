// Route-level loading UI (shown while server components stream)
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian" role="status" aria-label="Loading">
      <div className="relative h-14 w-14">
        <span className="absolute inset-0 rounded-full border-2 border-white/10" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-gold" />
      </div>
    </div>
  );
}
