'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Calendar, X, PhoneCall } from 'lucide-react';

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappMessage = encodeURIComponent(
    'Hello Pradeep Furniture Atelier! I am interested in discussing a custom sofa / fancy chair quotation for my space.'
  );

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-3">
      {/* Quick Menu Popover */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-elevated border border-platinum-border p-4 w-72 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-platinum-border">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-graphite" />
              <span className="font-sans text-xs font-semibold uppercase tracking-wider text-graphite">
                Atelier Concierge
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-dark hover:text-graphite p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-dark my-3 leading-relaxed">
            Direct consultation for custom dimensions, CAD blueprints, and visiting our Bodla workshop or Civil Lines gallery.
          </p>

          <div className="space-y-2">
            <a
              href={`https://wa.me/919897023456?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-md bg-graphite hover:bg-graphite-hover text-white text-xs font-semibold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire via WhatsApp</span>
            </a>

            <Link
              href="/consultation"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-md bg-platinum-soft hover:bg-platinum-hover text-graphite text-xs font-semibold transition-colors border border-platinum-border"
            >
              <Calendar className="w-4 h-4 text-slate-dark" />
              <span>Book Private Visit</span>
            </Link>

            <a
              href="tel:+919897023456"
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-md bg-white hover:bg-platinum-soft text-slate-dark text-xs font-medium transition-colors justify-center border border-platinum-border"
            >
              <PhoneCall className="w-3.5 h-3.5 text-slate-dark" />
              <span>+91 98970 23456</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2.5 rounded-md bg-graphite text-white hover:bg-graphite-hover shadow-elevated border border-graphite-border flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider transition-all"
        aria-label="Contact Atelier"
      >
        <span className="w-2 h-2 rounded-full bg-olive-muted" />
        <span>Atelier Contact</span>
      </button>
    </div>
  );
}
