'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Calendar, X, PhoneCall, Sparkles } from 'lucide-react';

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappMessage = encodeURIComponent(
    'Hello Pradeep Furniture Atelier! I am interested in discussing a custom sofa / fancy chair quotation for my space.'
  );

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-3">
      {/* Quick Menu Popover */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-luxury-hover border border-ivory-300 p-4 w-72 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-serif text-sm font-semibold text-charcoal">Atelier Concierge</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-charcoal/50 hover:text-charcoal p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-charcoal/70 my-3 leading-relaxed">
            Need advice on living room dimensions, custom fabric swatches, or visiting our Agra workshop?
          </p>

          <div className="space-y-2">
            <a
              href={`https://wa.me/919897023456?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>

            <Link
              href="/consultation"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl bg-charcoal hover:bg-charcoal-light text-ivory-100 text-xs font-semibold transition-colors"
            >
              <Calendar className="w-4 h-4 text-gold" />
              <span>Book Showroom/Factory Visit</span>
            </Link>

            <a
              href="tel:+919897023456"
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-ivory-100 hover:bg-ivory-200 text-charcoal text-xs font-medium transition-colors justify-center"
            >
              <PhoneCall className="w-3.5 h-3.5 text-walnut" />
              <span>Call: +91 98970 23456</span>
            </a>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center space-x-2 px-4 py-3 rounded-full bg-charcoal text-white hover:bg-charcoal-light border border-gold/40 shadow-luxury-hover hover:scale-105 transition-all"
        title="Connect with Atelier Designer"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 group-hover:scale-110 transition-transform" />
        <MessageCircle className="w-5 h-5 text-gold" />
        <span className="text-xs font-semibold tracking-wider uppercase pr-1 hidden sm:inline">
          Consult Atelier
        </span>
      </button>
    </div>
  );
}
