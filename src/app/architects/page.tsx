import React from 'react';
import Link from 'next/link';
import { Building2, Compass, CheckCircle2, ShieldCheck, FileText, ArrowRight } from 'lucide-react';

export default function ArchitectsPage() {
  return (
    <div className="min-h-screen bg-ivory-100 py-12 md:py-20 text-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cream border border-gold/30 text-xs text-walnut font-semibold uppercase tracking-wider">
            <span>B2B Contract Manufacturing</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium text-charcoal">
            For Architects, Designers &amp; Commercial Developers
          </h1>
          <p className="text-sm text-charcoal/70 leading-relaxed max-w-xl mx-auto">
            Direct workshop fabrication tailored to your CAD specifications. We collaborate with leading architectural studios to manufacture custom furniture runs for hotels, restaurants, luxury residences, and executive offices.
          </p>
        </div>

        {/* Core Architect Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-ivory-300 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-ivory-100 text-walnut flex items-center justify-center">
              <Compass className="w-5 h-5 text-gold" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-charcoal">CAD &amp; Millimeter Prototyping</h3>
            <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed">
              Send us your AutoCAD plans, 3D SketchUp models, or PDF elevations. Our in-house draftsmen verify frame ergonomics, generate joinery cut sheets, and build physical prototypes before batch production.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-ivory-300 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-ivory-100 text-walnut flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-gold" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-charcoal">Contract Grade Certifications</h3>
            <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed">
              We supply commercial contract grade Martindale rub fabrics (up to 100,000 rubs), fire-retardant (FR) treated foams, and heavy-duty commercial steel sinuous springs built for high-traffic hospitality suites.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-ivory-300 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-ivory-100 text-walnut flex items-center justify-center">
              <Building2 className="w-5 h-5 text-gold" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-charcoal">Transparent Tiered Pricing</h3>
            <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed">
              We offer trade pricing schedules directly from our Bodla manufacturing unit, bypassing luxury retail markups and middleman agents. Detailed Bill of Materials (BOM) estimates delivered within 48 hours.
            </p>
          </div>
        </div>

        {/* Architect RFQ Form CTA */}
        <div className="bg-charcoal text-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-charcoal-light shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-gold">Commercial Inquiries</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium">
              Have an Upcoming Hospitality or Villa Project?
            </h2>
            <p className="text-sm text-ivory-300 leading-relaxed">
              Submit your project blueprints, furniture schedules, or mood boards. We provide formal non-disclosure agreements (NDAs) and deliver tailored commercial quotation schedules.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/custom-design?type=ARCHITECT_B2B"
              className="px-8 py-4 rounded-full bg-gold hover:bg-gold-light text-charcoal font-semibold text-xs uppercase tracking-widest text-center transition-all shadow-luxury-gold"
            >
              Submit Commercial RFQ
            </Link>
            <Link
              href="/consultation"
              className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-widest text-center border border-white/20 transition-all"
            >
              Book Atelier Meeting
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
