'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Car, Calendar, Users, Menu, X, LogOut, ChevronRight, Inbox, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import AdminOverview from './AdminOverview';
import AdminCars from './AdminCars';
import AdminBookings from './AdminBookings';
import AdminCustomers from './AdminCustomers';
import AdminMessages from './AdminMessages';
import type { Car as CarType, Booking, Profile } from '@/types';

// ============================================================
// Admin Layout — Sidebar + Content
// ============================================================

type AdminTab = 'overview' | 'cars' | 'bookings' | 'customers' | 'messages';

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  subject?: string | null;
  message: string;
  created_at: string;
}

interface AdminLayoutProps {
  cars: CarType[];
  bookings: Booking[];
  profiles: Profile[];
  messages: ContactMessage[];
}

const navItems = [
  { id: 'overview' as AdminTab, label: 'Overview', icon: <LayoutDashboard size={18} /> },
  { id: 'cars' as AdminTab, label: 'Car Management', icon: <Car size={18} /> },
  { id: 'bookings' as AdminTab, label: 'Bookings', icon: <Calendar size={18} /> },
  { id: 'customers' as AdminTab, label: 'Customers', icon: <Users size={18} /> },
  { id: 'messages' as AdminTab, label: 'Messages', icon: <Inbox size={18} /> },
];

export default function AdminLayout({ cars, bookings, profiles, messages }: AdminLayoutProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase?.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  return (
    <div className="min-h-screen flex" style={{ background: '#141414' }}>
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-30 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:sticky lg:h-screen lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: '#151515', borderRight: '1px solid rgba(229,193,88,0.1)' }}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-[#E5C158]/10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gold-gradient-bg flex items-center justify-center">
              <span className="text-[#1A1A1A] font-black text-xs" style={{ fontFamily: 'Outfit, sans-serif' }}>AH</span>
            </div>
            <div>
              <div className="text-white font-bold text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>Al Hakam</div>
              <div className="text-[10px] text-[#E5C158] uppercase tracking-wider">Admin Panel</div>
            </div>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="p-4 flex-1">
          <div className="space-y-1">
            {navItems.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === id
                    ? 'gold-gradient-bg text-[#1A1A1A]'
                    : 'text-[#D1D1D1] hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  {icon}
                  {label}
                </div>
                {id === 'bookings' && pendingCount > 0 && (
                  <span className="bg-[#EA4335] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {pendingCount}
                  </span>
                )}
                {activeTab === id && id !== 'bookings' && <ChevronRight size={14} />}
              </button>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#E5C158]/10">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 text-sm text-[#8A8A8A] hover:text-white rounded-xl hover:bg-white/5 transition-all mb-1">
            <ExternalLink size={14} />
            View Website
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 text-sm text-[#EA4335] hover:bg-[#EA4335]/5 rounded-xl transition-all w-full"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header
          className="flex items-center justify-between px-6 py-4 border-b border-[#E5C158]/10"
          style={{ background: 'rgba(26,26,26,0.8)', backdropFilter: 'blur(10px)' }}
        >
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-all"
              aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h1 className="text-white font-bold text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {navItems.find(n => n.id === activeTab)?.label}
              </h1>
              <p className="text-[#8A8A8A] text-xs">Al Hakam Tours Admin</p>
            </div>
          </div>

          {pendingCount > 0 && (
            <button
              onClick={() => setActiveTab('bookings')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#EA4335]/10 border border-[#EA4335]/30 text-[#EA4335] text-xs"
            >
              <span className="w-2 h-2 rounded-full bg-[#EA4335] animate-pulse" />
              {pendingCount} pending booking{pendingCount !== 1 ? 's' : ''}
            </button>
          )}
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && <AdminOverview cars={cars} bookings={bookings} />}
            {activeTab === 'cars' && <AdminCars initialCars={cars} />}
            {activeTab === 'bookings' && <AdminBookings initialBookings={bookings} />}
            {activeTab === 'customers' && <AdminCustomers profiles={profiles} />}
            {activeTab === 'messages' && <AdminMessages messages={messages} />}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
