import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Award, Box, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-platinum py-16 md:py-24 text-graphite font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-slate-muted">
            Generations of Precision Craftsmanship
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-medium text-graphite">
            The Atelier Story
          </h1>
          <p className="text-sm text-slate-dark leading-relaxed max-w-xl mx-auto">
            Pradeep Furniture Atelier was established with a singular discipline: luxury seating should not be mass-stamped out of anonymous composite factories. It must be engineered from seasoned hardwoods, chiseled by hand, and tailored to architectural tolerances.
          </p>
        </div>

        {/* Narrative Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5 text-xs sm:text-sm text-slate-dark leading-relaxed">
            <h2 className="font-serif text-2xl sm:text-4xl font-medium text-graphite">
              Rooted in Agra’s Architectural Heritage
            </h2>
            <p>
              Agra has inspired global design for centuries through geometric inlay precision, master stone masonry, and grand royal proportions. We carry forward this standard of perfection into contemporary architectural seating.
            </p>
            <p>
              While contemporary retailers distribute fragile flat-pack sofas joined by staples and particleboard, our workshop in Bodla continues to construct mortise-and-tenon joints out of seasoned Salwood and Grade-A Teak.
            </p>
            <p>
              We practice conscious slow manufacturing. We produce limited quantities, but every piece is engineered to endure 20 to 30 years without sagging or structural fatigue.
            </p>

            <div className="pt-4 grid grid-cols-2 gap-4 border-t border-platinum-border">
              <div>
                <span className="font-sans text-3xl font-semibold text-graphite">10-Year</span>
                <span className="block text-xs text-slate-muted mt-0.5">Structural Warranty</span>
              </div>
              <div>
                <span className="font-sans text-3xl font-semibold text-graphite">Zero</span>
                <span className="block text-xs text-slate-muted mt-0.5">Particleboard or MDF</span>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-sm bg-white border border-platinum-border">
            <img
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80"
              alt="Artisan Timber Craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-8 border border-platinum-border shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-md bg-platinum-soft flex items-center justify-center text-graphite border border-platinum-border">
              <Award className="w-5 h-5 text-slate-muted" />
            </div>
            <h3 className="font-serif text-xl font-medium text-graphite">Honest Raw Materials</h3>
            <p className="text-xs text-slate-dark leading-relaxed">
              We never conceal substandard framework behind fabric. We welcome our clients to visit our Bodla workshop and inspect the bare joinery before upholstery begins.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 border border-platinum-border shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-md bg-platinum-soft flex items-center justify-center text-graphite border border-platinum-border">
              <ShieldCheck className="w-5 h-5 text-slate-muted" />
            </div>
            <h3 className="font-serif text-xl font-medium text-graphite">Non-E-Commerce Ethics</h3>
            <p className="text-xs text-slate-dark leading-relaxed">
              True luxury cannot be bought with an impulsive &apos;Add to Cart&apos; click. Every piece demands consultative spatial measurement and thoughtful fabric selection.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 border border-platinum-border shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-md bg-platinum-soft flex items-center justify-center text-graphite border border-platinum-border">
              <Box className="w-5 h-5 text-slate-muted" />
            </div>
            <h3 className="font-serif text-xl font-medium text-graphite">Millimeter Precision</h3>
            <p className="text-xs text-slate-dark leading-relaxed">
              Whether tailoring to an asymmetrical living alcove or matching the exact armrest height of a custom credenza, our CAD draftsmen build to your exact architectural requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
