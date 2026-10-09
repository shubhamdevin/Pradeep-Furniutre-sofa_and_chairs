import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Heart, Award, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ivory-100 py-12 md:py-20 text-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cream border border-gold/30 text-xs text-walnut font-semibold uppercase tracking-wider">
            <span>Generations of Master Craftsmanship</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium text-charcoal">
            The Atelier Story
          </h1>
          <p className="text-sm text-charcoal/70 leading-relaxed max-w-xl mx-auto">
            Pradeep Furniture Atelier was founded on a simple conviction: luxury furniture should not be stamped out of anonymous plastic factories. It should be sculpted by human hands from seasoned timber and tailored like bespoke haute couture.
          </p>
        </div>

        {/* Narrative Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5 text-xs sm:text-sm text-charcoal/80 leading-relaxed font-light">
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-charcoal">
              Rooted in Agra’s Artisanal Heritage
            </h2>
            <p>
              Agra has inspired the world for centuries with its legendary stone inlays, timber carving, and royal architectural proportions. We carry forward this standard of perfection into contemporary seating.
            </p>
            <p>
              While contemporary retailers import fragile flat-pack sofas held together by staples and particleboard, our workshop in Bodla continues to chisel solid mortise-and-tenon joints out of seasoned Salwood and Teak.
            </p>
            <p>
              We believe in conscious slow manufacturing. We make fewer pieces, but each sofa is built to last 20 to 30 years without sagging or structural fatigue.
            </p>

            <div className="pt-4 grid grid-cols-2 gap-4 border-t border-ivory-300">
              <div>
                <span className="font-serif text-2xl font-bold text-charcoal">10-Year</span>
                <span className="block text-xs text-charcoal/60 mt-0.5">Structural Guarantee</span>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-charcoal">Zero</span>
                <span className="block text-xs text-charcoal/60 mt-0.5">Cheap Particleboard</span>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-luxury bg-white border border-ivory-300">
            <img
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80"
              alt="Artisan Timber Craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-ivory-300 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-ivory-100 flex items-center justify-center text-gold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-semibold">Honest Materials</h3>
            <p className="text-xs text-charcoal/70 leading-relaxed">
              We never conceal inferior timber behind fabric. We invite our clients into the workshop to inspect the raw skeleton before upholstery.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-ivory-300 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-ivory-100 flex items-center justify-center text-gold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-semibold">Non-E-Commerce Ethics</h3>
            <p className="text-xs text-charcoal/70 leading-relaxed">
              True luxury cannot be bought with an impulsive &apos;Add to Cart&apos; click. Every piece demands consultative measurement and thoughtful fabric selection.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-ivory-300 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-ivory-100 flex items-center justify-center text-gold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-semibold">Bespoke Millimeter Precision</h3>
            <p className="text-xs text-charcoal/70 leading-relaxed">
              Whether fitting a tricky bay window or matching the exact armrest height of an antique desk, our CAD draftsmen build to your exact architectural requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
