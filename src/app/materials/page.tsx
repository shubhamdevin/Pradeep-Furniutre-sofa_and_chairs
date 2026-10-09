import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Sparkles, Layers, ShieldCheck, ArrowRight } from 'lucide-react';

export const revalidate = 60;

export default async function MaterialsPage() {
  const [materials, swatches] = await Promise.all([
    prisma.furnitureMaterial.findMany({
      include: { swatches: true },
    }),
    prisma.fabricSwatch.findMany({
      include: { material: true },
    }),
  ]);

  return (
    <div className="min-h-screen bg-ivory-100 py-12 md:py-20 text-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cream border border-gold/30 text-xs text-walnut font-semibold uppercase tracking-wider">
            <span>Atelier Swatch Library</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium text-charcoal">
            Materials &amp; Fabric Library
          </h1>
          <p className="text-sm text-charcoal/70 leading-relaxed max-w-xl mx-auto">
            Discover our curated inventory of heavy Belgian velvets, bouclés, top-grain Italian leathers, and seasoned teakwood finishes. Every material is certified for rub count, colour fastness, and structural resilience.
          </p>
        </div>

        {/* Fabric Swatches Showcase */}
        <div className="space-y-6">
          <div className="border-b border-ivory-300 pb-3 flex justify-between items-end">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-gold">Upholstery Textiles</span>
              <h2 className="font-serif text-2xl font-semibold mt-0.5">Signature Fabric Swatches</h2>
            </div>
            <span className="text-xs text-charcoal/60">Sample swatches sent to your address on request</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {swatches.map((sw) => (
              <div
                key={sw.id}
                className="bg-white rounded-2xl p-5 border border-ivory-300 shadow-sm hover:shadow-luxury transition-all space-y-3"
              >
                <div
                  className="w-full h-28 rounded-xl border border-ivory-200 shadow-inner flex items-end p-2.5"
                  style={{ backgroundColor: sw.colorHex }}
                >
                  <span className="text-[10px] font-mono font-semibold bg-charcoal/80 text-white px-2 py-0.5 rounded backdrop-blur">
                    {sw.code}
                  </span>
                </div>
                <div>
                  <h4 className="font-serif font-medium text-base text-charcoal">{sw.name}</h4>
                  <div className="text-xs text-charcoal/70 mt-1 space-y-0.5">
                    <p><strong>Weave:</strong> {sw.weaveType || 'Textured Luxe'}</p>
                    <p><strong>Durability:</strong> {sw.rubCount ? `${sw.rubCount.toLocaleString()} Rubs` : 'Contract Grade'}</p>
                    <p><strong>Collection:</strong> {sw.material?.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timbers & Foams */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-ivory-300 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-ivory-100 flex items-center justify-center text-walnut">
              <Layers className="w-5 h-5 text-gold" />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-charcoal">Structural Hardwood Standards</h3>
            <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed">
              We exclusively manufacture frames from seasoned Teak and Sal timbers. Wood is moisture-tested before joinery to guarantee that no frame squeaks or contracts over years of seasonal humidity shifts in Indian climates.
            </p>
            <ul className="text-xs text-charcoal/80 space-y-1.5 pt-2">
              <li>• <strong>CP Teakwood:</strong> High natural oil density, pest-resistant, ideal for exposed carved legs.</li>
              <li>• <strong>Seasoned Salwood:</strong> Extremely dense interlocking grain, ideal for heavy internal sofa spans.</li>
              <li>• <strong>Tenon Joinery:</strong> Glued mortise &amp; tenon with solid birch corner blocks.</li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-ivory-300 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-ivory-100 flex items-center justify-center text-walnut">
              <ShieldCheck className="w-5 h-5 text-gold" />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-charcoal">Foam &amp; Comfort Science</h3>
            <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed">
              Standard retailer foams sag within 18 months because of low 28-32 density filler materials. We utilize 45D and 50D High Resilience cold-cure foams with feather-down toppers that spring back indefinitely.
            </p>
            <ul className="text-xs text-charcoal/80 space-y-1.5 pt-2">
              <li>• <strong>50D Ortho-Support:</strong> Unyielding structural foundation preventing bottoming out.</li>
              <li>• <strong>45D HR Comfort Core:</strong> Elastic bounce and pressure-relief for long lounging.</li>
              <li>• <strong>Feather-Down Crown:</strong> Channeled micro-fiber pocket wraps for that bespoke cloud feel.</li>
            </ul>
          </div>
        </div>

        {/* Request Swatch Samples CTA */}
        <div className="rounded-3xl bg-cream/70 border border-gold/30 p-8 sm:p-12 text-center space-y-4 max-w-3xl mx-auto">
          <h3 className="font-serif text-2xl sm:text-3xl text-charcoal font-medium">
            Touch &amp; Feel Physical Fabric Swatches
          </h3>
          <p className="text-xs sm:text-sm text-charcoal/70 max-w-lg mx-auto">
            We courier physical swatch ring binders and wood finish samples directly to your residence or architecture studio anywhere in India.
          </p>
          <div className="pt-2">
            <Link
              href="/consultation"
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-charcoal text-white hover:bg-charcoal-light text-xs font-semibold uppercase tracking-wider"
            >
              <span>Request Swatch Sample Kit</span>
              <ArrowRight className="w-4 h-4 text-gold" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
