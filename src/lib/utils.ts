// ============================================================
// Utility helpers
// ============================================================

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const pkr = new Intl.NumberFormat('en-PK', {
  style: 'currency',
  currency: 'PKR',
  maximumFractionDigits: 0,
});

/** Format a price in PKR, e.g. "Rs 12,000" */
export function formatCurrency(amount: number): string {
  return pkr.format(Number.isFinite(amount) ? amount : 0);
}

/** Compact PKR, e.g. 125000 → "125k" */
export function formatCompact(amount: number): string {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(amount);
}

/** Parse "YYYY-MM-DD" as a *local* date (new Date('2026-01-05') is parsed as UTC). */
function parseISODate(date: string): Date {
  const [y, m, d] = date.slice(0, 10).split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

/** Number of rental days between two "YYYY-MM-DD" strings (minimum 1). */
export function calculateDays(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 1;
  const diff = parseISODate(endDate).getTime() - parseISODate(startDate).getTime();
  return Math.max(1, Math.round(diff / 86_400_000));
}

/** Format a date (ISO / timestamp) as "21 Oct 2026" */
export function formatDate(dateString: string): string {
  if (!dateString) return '—';
  const date = dateString.length === 10 ? parseISODate(dateString) : new Date(dateString);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

/** Local date → "YYYY-MM-DD" (toISOString() would shift to UTC and give yesterday in PKT mornings). */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getTodayString(): string {
  return toISODate(new Date());
}

export function addDays(date: string, days: number): string {
  const d = parseISODate(date);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

export function getTomorrowString(): string {
  return addDays(getTodayString(), 1);
}

/** Status badge colour mapping */
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending: 'text-amber-300 bg-amber-300/10 border-amber-300/30',
    confirmed: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    completed: 'text-sky-400 bg-sky-400/10 border-sky-400/30',
    cancelled: 'text-red-400 bg-red-400/10 border-red-400/30',
  };
  return map[status] || 'text-gray-400 bg-gray-400/10 border-gray-400/30';
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Basic Pakistani mobile validation: 03XX-XXXXXXX or +92 3XX XXXXXXX */
export function isValidPakPhone(phone: string): boolean {
  const digits = phone.replace(/[^\d+]/g, '');
  return /^(\+92|0092|0)3\d{9}$/.test(digits);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}
