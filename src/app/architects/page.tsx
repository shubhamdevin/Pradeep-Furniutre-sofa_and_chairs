import React from 'react';
import Link from 'next/link';
import { Building2, Compass, ShieldCheck } from 'lucide-react';

export default function ArchitectsPage() {
  return (
    <div className="min-h-screen bg-platinum py-16 md:py-24 text-graphite font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-slate-muted">
            B2B Contract Manufacturing
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-medium text-graphite">
            For Architects, Designers &amp; Developers
          </h1>
          <p className="text-sm text-slate-dark leading-relaxed max-w-xl mx-auto">
            Direct workshop fabrication tailored to your CAD specifications. We collaborate with leading architectural studios to manufacture custom furniture runs for luxury residences, boutique hotels, and executive spaces.
          </p>
        </div>

        {/* Core Architect Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-8 border border-platinum-border shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-md bg-platinum-soft flex items-center justify-center text-graphite border border-platinum-border">
              <Compass className="w-5 h-5 text-slate-muted" />
            </div>
            <h3 className="font-serif text-xl font-medium text-graphite">CAD &amp; Millimeter Prototyping</h3>
            <p className="text-xs sm:text-sm text-slate-dark leading-relaxed">
              Send us your AutoCAD plans, furniture sketches, or PDF elevations. Our in-house draftsmen verify frame ergonomics, generate joinery cut sheets, and build physical prototypes before batch production.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 border border-platinum-border shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-md bg-platinum-soft flex items-center justify-center text-graphite border border-platinum-border">
              <ShieldCheck className="w-5 h-5 text-slate-muted" />
            </div>
            <h3 className="font-serif text-xl font-medium text-graphite">Contract Grade Certifications</h3>
            <p className="text-xs sm:text-sm text-slate-dark leading-relaxed">
              We supply commercial contract grade Martindale rub fabrics (up to 100,000 rubs), fire-retardant (FR) treated foams, and heavy-duty commercial steel sinuous springs built for high-traffic hospitality suites.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 border border-platinum-border shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-md bg-platinum-soft flex items-center justify-center text-graphite border border-platinum-border">
              <Building2 className="w-5 h-5 text-slate-muted" />
            </div>
            <h3 className="font-serif text-xl font-medium text-graphite">Transparent Tiered Pricing</h3>
            <p className="text-xs sm:text-sm text-slate-dark leading-relaxed">
              We offer trade pricing schedules directly from our Bodla manufacturing unit, bypassing luxury retail markups and middleman agents. Detailed Bill of Materials (BOM) estimates delivered within 48 hours.
            </p>
          </div>
        </div>

        {/* Architect RFQ Form CTA */}
        <div className="bg-graphite-deep text-platinum rounded-lg p-8 sm:p-12 lg:p-16 border border-slate-border shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-silver">Commercial Inquiries</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium">
              Have an Upcoming Hospitality or Villa Project?
            </h2>
            <p className="text-sm text-slate-silver leading-relaxed">
              Submit your project blueprints, furniture schedules, or mood boards. We provide formal non-disclosure agreements (NDAs) and deliver tailored commercial quotation schedules.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/custom-design?type=ARCHITECT_B2B"
              className="px-7 py-3.5 rounded-md bg-platinum hover:bg-white text-graphite font-medium text-xs uppercase tracking-widest text-center transition-colors shadow-sm"
            >
              Submit Commercial RFQ
            </Link>
            <Link
              href="/consultation"
              className="px-7 py-3.5 rounded-md bg-graphite hover:bg-graphite-hover text-white font-medium text-xs uppercase tracking-widest text-center border border-slate-border transition-colors"
            >
              Book Atelier Meeting
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
