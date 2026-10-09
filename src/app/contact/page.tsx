import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, MessageCircle, Calendar } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-ivory-100 py-12 md:py-20 text-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cream border border-gold/30 text-xs text-walnut font-semibold uppercase tracking-wider">
            <span>Showroom &amp; Works Locations</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium text-charcoal">
            Connect with Pradeep Furniture Atelier
          </h1>
          <p className="text-sm text-charcoal/70 leading-relaxed max-w-xl mx-auto">
            We welcome clients, architects, and interior designers to visit our luxury gallery or tour our factory workshop in Agra.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Civil Lines Showroom */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-ivory-300 shadow-luxury space-y-5">
            <div className="inline-flex items-center space-x-2 text-gold text-xs font-semibold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Showroom Gallery</span>
            </div>

            <h2 className="font-serif text-2xl font-semibold text-charcoal">
              Civil Lines Design Gallery
            </h2>

            <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed">
              Experience finished sofas, inspect full swatch books, test cushion firmness, and sit down with our senior interior consultants.
            </p>

            <div className="space-y-3 pt-3 border-t border-ivory-200 text-xs text-charcoal/80">
              <p><strong>Address:</strong> 18 Civil Lines, Heritage Boulevard, Agra, UP - 282002</p>
              <p><strong>Hours:</strong> Mon - Sat: 10:00 AM - 8:00 PM | Sun: By Appointment</p>
              <p><strong>Phone:</strong> +91 98970 23456</p>
              <p><strong>Email:</strong> bespoke@pradeepfurniture.com</p>
            </div>

            <div className="pt-2 flex gap-3">
              <a
                href="https://wa.me/919897023456"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center space-x-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <Link
                href="/consultation"
                className="px-5 py-2.5 rounded-xl bg-charcoal hover:bg-charcoal-light text-white text-xs font-semibold transition-colors flex items-center space-x-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-gold" />
                <span>Book Visit</span>
              </Link>
            </div>
          </div>

          {/* Bodla Workshop Compound */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-ivory-300 shadow-luxury space-y-5">
            <div className="inline-flex items-center space-x-2 text-gold text-xs font-semibold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Manufacturing Works</span>
            </div>

            <h2 className="font-serif text-2xl font-semibold text-charcoal">
              Bodla Factory &amp; Carpentry Works
            </h2>

            <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed">
              Our 15,000 sq ft production unit where raw teak timber is milled, mortise joinery is fitted, and custom upholstery is hand-tufted.
            </p>

            <div className="space-y-3 pt-3 border-t border-ivory-200 text-xs text-charcoal/80">
              <p><strong>Address:</strong> Plot 42-44, Bodla Industrial Zone, Agra, UP - 282007</p>
              <p><strong>Hours:</strong> Mon - Sat: 9:00 AM - 6:30 PM (Prior Appointment Recommended)</p>
              <p><strong>Direct Workshop Line:</strong> +91 98970 23457</p>
              <p><strong>GSTIN:</strong> 09AABCP1234F1Z9</p>
            </div>

            <div className="pt-2 flex gap-3">
              <Link
                href="/manufacturing"
                className="px-5 py-2.5 rounded-xl bg-ivory-100 hover:bg-ivory-200 text-charcoal text-xs font-semibold transition-colors"
              >
                Learn Factory Process
              </Link>

              <Link
                href="/consultation"
                className="px-5 py-2.5 rounded-xl bg-charcoal hover:bg-charcoal-light text-white text-xs font-semibold transition-colors"
              >
                Tour Workshop
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
