import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, MessageCircle, Calendar } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-platinum py-16 md:py-24 text-graphite font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-slate-muted">
            Showroom &amp; Works Locations
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-medium text-graphite">
            Connect with Pradeep Atelier
          </h1>
          <p className="text-sm text-slate-dark leading-relaxed max-w-xl mx-auto">
            We welcome clients, architectural studios, and interior designers to visit our luxury gallery or tour our dedicated manufacturing facility in Agra.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Civil Lines Showroom */}
          <div className="bg-white rounded-lg p-8 sm:p-10 border border-platinum-border shadow-sm space-y-5">
            <div className="inline-flex items-center space-x-2 text-slate-muted text-xs font-semibold uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-graphite" />
              <span>Showroom Gallery</span>
            </div>

            <h2 className="font-serif text-2xl font-medium text-graphite">
              Civil Lines Design Gallery
            </h2>

            <p className="text-xs sm:text-sm text-slate-dark leading-relaxed">
              Experience finished sofas, inspect full swatch books, test cushion firmness, and sit down with our senior interior consultants.
            </p>

            <div className="space-y-3 pt-3 border-t border-platinum-border text-xs text-slate-dark">
              <p><strong className="text-graphite font-medium">Address:</strong> 18 Civil Lines, Heritage Boulevard, Agra, UP - 282002</p>
              <p><strong className="text-graphite font-medium">Hours:</strong> Mon - Sat: 10:00 AM - 8:00 PM | Sun: By Appointment</p>
              <p><strong className="text-graphite font-medium">Phone:</strong> +91 98970 23456</p>
              <p><strong className="text-graphite font-medium">Email:</strong> bespoke@pradeepfurniture.com</p>
            </div>

            <div className="pt-2 flex gap-3">
              <a
                href="https://wa.me/919897023456"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-md bg-graphite hover:bg-graphite-hover text-white text-xs font-medium transition-colors flex items-center space-x-1.5 shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5 text-slate-silver" />
                <span>WhatsApp</span>
              </a>

              <Link
                href="/consultation"
                className="px-5 py-2.5 rounded-md bg-platinum hover:bg-platinum-soft text-graphite border border-platinum-border text-xs font-medium transition-colors flex items-center space-x-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-muted" />
                <span>Book Visit</span>
              </Link>
            </div>
          </div>

          {/* Bodla Workshop Compound */}
          <div className="bg-white rounded-lg p-8 sm:p-10 border border-platinum-border shadow-sm space-y-5">
            <div className="inline-flex items-center space-x-2 text-slate-muted text-xs font-semibold uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-graphite" />
              <span>Manufacturing Works</span>
            </div>

            <h2 className="font-serif text-2xl font-medium text-graphite">
              Bodla Factory &amp; Carpentry Works
            </h2>

            <p className="text-xs sm:text-sm text-slate-dark leading-relaxed">
              Our 15,000 sq ft production unit where raw teak timber is milled, mortise joinery is fitted, and custom upholstery is hand-tufted.
            </p>

            <div className="space-y-3 pt-3 border-t border-platinum-border text-xs text-slate-dark">
              <p><strong className="text-graphite font-medium">Address:</strong> Plot 42-44, Bodla Industrial Zone, Agra, UP - 282007</p>
              <p><strong className="text-graphite font-medium">Hours:</strong> Mon - Sat: 9:00 AM - 6:30 PM (Prior Appointment Recommended)</p>
              <p><strong className="text-graphite font-medium">Direct Workshop Line:</strong> +91 98970 23457</p>
              <p><strong className="text-graphite font-medium">GSTIN:</strong> 09AABCP1234F1Z9</p>
            </div>

            <div className="pt-2 flex gap-3">
              <Link
                href="/manufacturing"
                className="px-5 py-2.5 rounded-md bg-platinum hover:bg-platinum-soft text-graphite border border-platinum-border text-xs font-medium transition-colors"
              >
                Learn Factory Process
              </Link>

              <Link
                href="/consultation"
                className="px-5 py-2.5 rounded-md bg-graphite hover:bg-graphite-hover text-white text-xs font-medium transition-colors shadow-sm"
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
