'use client';

import { Inbox, Mail, MessageCircle, Phone } from 'lucide-react';
import { whatsappLinkFor } from './adminUtils';
import { formatDate } from '@/lib/utils';
import type { ContactMessage } from './AdminLayout';

// Contact-form enquiries (table: contact_messages)
export default function AdminMessages({ messages }: { messages: ContactMessage[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Enquiries</h2>
        <p className="text-sm text-text-muted">{messages.length} message{messages.length === 1 ? '' : 's'} from the contact form</p>
      </div>

      {messages.length === 0 ? (
        <div className="glass-card p-12 text-center text-text-muted">
          <Inbox size={36} className="mx-auto mb-3 text-gold/60" />
          No messages yet. (Make sure the <code className="text-gold">contact_messages</code> table from <code>supabase/schema.sql</code> exists.)
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {messages.map((m) => (
            <article key={m.id} className="glass-card space-y-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-white">{m.name}</h3>
                  <p className="text-xs text-text-muted">{formatDate(m.created_at)}{m.subject ? ` · ${m.subject}` : ''}</p>
                </div>
              </div>
              <p className="whitespace-pre-line text-sm text-text-gray">{m.message}</p>
              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                <a href={`tel:${m.phone}`} className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-3 py-1.5 text-text-gray hover:text-gold"><Phone size={12} /> {m.phone}</a>
                <a href={whatsappLinkFor(m.phone)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-[#25D366]/10 px-3 py-1.5 text-[#25D366]"><MessageCircle size={12} /> WhatsApp</a>
                {m.email && <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-3 py-1.5 text-text-gray hover:text-gold"><Mail size={12} /> {m.email}</a>}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
