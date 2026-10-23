'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, Shield, User } from 'lucide-react';
import { siteConfig } from '@/lib/site';
import { formatDate } from '@/lib/utils';
import type { Profile } from '@/types';

// ============================================================
// Admin Customers List
// ============================================================

interface AdminCustomersProps {
  profiles: Profile[];
}

export default function AdminCustomers({ profiles }: AdminCustomersProps) {
  const admins = profiles.filter(p => p.role === 'admin');
  const customers = profiles.filter(p => p.role === 'customer');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Customer Leads</h2>
        <p className="text-[#8A8A8A] text-sm">{customers.length} registered customers, {admins.length} admin(s)</p>
      </div>

      {/* Contact Info Banner */}
      <div className="glass-card-gold p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-[#E5C158] font-semibold mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Quick Contact Numbers</div>
          <p className="text-[#D1D1D1] text-sm">For direct customer support</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {siteConfig.phones.map((p, i) => (
            <a key={p.tel} href={`tel:${p.tel}`} className={i === 0 ? 'flex items-center gap-2 px-4 py-2 rounded-xl gold-gradient-bg text-[#1A1A1A] font-semibold text-sm' : 'flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-white text-sm border border-white/10'}>
              <Phone size={14} /> {p.display}
            </a>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center gap-2 p-5 border-b border-white/10">
          <User size={18} className="text-[#E5C158]" />
          <h3 className="text-white font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Registered Customers</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full luxury-table">
            <thead>
              <tr>
                <th className="text-left">User</th>
                <th className="text-left">Email</th>
                <th className="text-left">Role</th>
                <th className="text-left">Joined</th>
                <th className="text-left">Contact</th>
              </tr>
            </thead>
            <tbody>
              {profiles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-[#8A8A8A]">No users found</td>
                </tr>
              ) : (
                profiles.map((profile, i) => (
                  <motion.tr
                    key={profile.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full gold-gradient-bg flex items-center justify-center text-[#1A1A1A] font-bold text-xs shrink-0">
                          {(profile.full_name || profile.email)?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="text-white text-sm font-medium">{profile.full_name || '—'}</div>
                          <div className="text-[#8A8A8A] text-xs">ID: {profile.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <a href={`mailto:${profile.email}`} className="text-[#D1D1D1] text-sm hover:text-[#E5C158] transition-colors flex items-center gap-1.5">
                        <Mail size={12} />
                        {profile.email}
                      </a>
                    </td>
                    <td>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        profile.role === 'admin'
                          ? 'text-[#E5C158] bg-[#E5C158]/10 border-[#E5C158]/30'
                          : 'text-[#D1D1D1] bg-white/5 border-white/10'
                      }`}>
                        {profile.role === 'admin' && <Shield size={10} />}
                        {profile.role}
                      </span>
                    </td>
                    <td className="text-[#8A8A8A] text-sm whitespace-nowrap">
                      {formatDate(profile.created_at)}
                    </td>
                    <td>
                      {profile.phone ? (
                        <a href={`tel:${profile.phone}`} className="flex items-center gap-1.5 text-[#D1D1D1] hover:text-[#E5C158] text-sm transition-colors">
                          <Phone size={12} />
                          {profile.phone}
                        </a>
                      ) : (
                        <span className="text-[#8A8A8A] text-xs">No phone</span>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
