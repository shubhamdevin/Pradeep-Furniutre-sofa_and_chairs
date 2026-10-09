import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Layers, ShieldCheck, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-platinum py-16 md:py-24 text-graphite font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-slate-muted">
            Atelier Swatch Library
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-medium text-graphite">
            Materials &amp; Fabric Library
          </h1>
          <p className="text-sm text-slate-dark leading-relaxed max-w-xl mx-auto">
            Discover our curated archive of heavy Belgian velvets, bouclés, full-grain Italian leathers, and seasoned teakwood finishes. Every material is certified for rub count, colour fastness, and structural longevity.
          </p>
        </div>

        {/* Fabric Swatches Showcase */}
        <div className="space-y-6">
          <div className="border-b border-platinum-border pb-3 flex justify-between items-end">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-slate-muted">Upholstery Textiles</span>
              <h2 className="font-serif text-2xl font-medium text-graphite mt-0.5">Signature Fabric Swatches</h2>
            </div>
            <span className="text-xs text-slate-muted">Sample swatches dispatched to your address on request</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {swatches.map((sw) => (
              <div
                key={sw.id}
                className="bg-white rounded-lg p-5 border border-platinum-border shadow-sm space-y-3 transition-colors hover:border-graphite"
              >
                <div
                  className="w-full h-28 rounded border border-platinum-border flex items-end p-2.5"
                  style={{ backgroundColor: sw.colorHex }}
                >
                  <span className="text-[10px] font-mono font-medium bg-graphite/90 text-white px-2 py-0.5 rounded">
                    {sw.code}
                  </span>
                </div>
                <div>
                  <h4 className="font-serif font-medium text-base text-graphite">{sw.name}</h4>
                  <div className="text-xs text-slate-dark mt-1 space-y-0.5">
                    <p><strong className="font-medium text-graphite">Weave:</strong> {sw.weaveType || 'Textured Luxe'}</p>
                    <p><strong className="font-medium text-graphite">Durability:</strong> {sw.rubCount ? `${sw.rubCount.toLocaleString()} Rubs` : 'Contract Grade'}</p>
                    <p><strong className="font-medium text-graphite">Collection:</strong> {sw.material?.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timbers & Foams */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-8 border border-platinum-border shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-md bg-platinum-soft flex items-center justify-center text-graphite border border-platinum-border">
              <Layers className="w-5 h-5 text-slate-muted" />
            </div>
            <h3 className="font-serif text-2xl font-medium text-graphite">Structural Hardwood Standards</h3>
            <p className="text-xs sm:text-sm text-slate-dark leading-relaxed">
              We exclusively manufacture frames from seasoned Teak and Sal timbers. Wood is moisture-tested before joinery to guarantee that no frame squeaks or contracts over years of seasonal humidity shifts in Indian climates.
            </p>
            <ul className="text-xs text-slate-dark space-y-1.5 pt-2">
              <li>• <strong className="text-graphite font-medium">CP Teakwood:</strong> High natural oil density, pest-resistant, ideal for exposed carved legs.</li>
              <li>• <strong className="text-graphite font-medium">Seasoned Salwood:</strong> Extremely dense interlocking grain, ideal for heavy internal sofa spans.</li>
              <li>• <strong className="text-graphite font-medium">Tenon Joinery:</strong> Glued mortise &amp; tenon with solid corner reinforcement blocks.</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-8 border border-platinum-border shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-md bg-platinum-soft flex items-center justify-center text-graphite border border-platinum-border">
              <ShieldCheck className="w-5 h-5 text-slate-muted" />
            </div>
            <h3 className="font-serif text-2xl font-medium text-graphite">Foam &amp; Comfort Science</h3>
            <p className="text-xs sm:text-sm text-slate-dark leading-relaxed">
              Standard retailer foams sag within 18 months because of low 28-32 density filler materials. We utilize 45D and 50D High Resilience cold-cure foams with feather-down toppers that spring back indefinitely.
            </p>
            <ul className="text-xs text-slate-dark space-y-1.5 pt-2">
              <li>• <strong className="text-graphite font-medium">50D Ortho-Support:</strong> Unyielding structural foundation preventing bottoming out.</li>
              <li>• <strong className="text-graphite font-medium">45D HR Comfort Core:</strong> Elastic bounce and pressure-relief for long lounging.</li>
              <li>• <strong className="text-graphite font-medium">Feather-Down Crown:</strong> Channeled micro-fiber wraps for that tailored architectural crown.</li>
            </ul>
          </div>
        </div>

        {/* Request Swatch Samples CTA */}
        <div className="rounded-lg bg-platinum-soft border border-platinum-border p-8 sm:p-12 text-center space-y-3 max-w-3xl mx-auto">
          <h3 className="font-serif text-2xl sm:text-3xl text-graphite font-medium">
            Inspect Physical Fabric Swatches
          </h3>
          <p className="text-xs sm:text-sm text-slate-dark max-w-lg mx-auto leading-relaxed">
            We courier physical swatch ring binders and wood finish samples directly to your residence or architecture studio anywhere in India.
          </p>
          <div className="pt-2">
            <Link
              href="/consultation"
              className="inline-flex items-center space-x-2 px-7 py-3 rounded-md bg-graphite text-white hover:bg-graphite-hover text-xs font-medium uppercase tracking-wider transition-colors shadow-sm"
            >
              <span>Request Swatch Sample Kit</span>
              <ArrowRight className="w-4 h-4 text-slate-silver" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
