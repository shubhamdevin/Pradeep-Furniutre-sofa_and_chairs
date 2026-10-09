'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import InteractiveFurnitureViewer from '@/components/three-d/InteractiveFurnitureViewer';
import { ThreeDAssetItem } from '@/lib/types';
import { Sparkles, Sliders, ArrowRight, ShieldCheck, Info } from 'lucide-react';

interface ShowcaseProps {
  assets: (ThreeDAssetItem & { productSlug?: string; productTitle?: string })[];
}

export default function Home3DShowcase({ assets }: ShowcaseProps) {
  const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[0]?.id || 'asset-3d-sofa-03');

  const activeAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-ivory-300 shadow-luxury">
      {/* Model Tabs Selection Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ivory-200 pb-6 mb-8">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-gold">Choose Model to Inspect</span>
          <h3 className="font-serif text-xl sm:text-2xl text-charcoal font-semibold mt-0.5">
            {activeAsset?.name || 'Selected 3D Model'}
          </h3>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex flex-wrap gap-2">
          {assets.map((asset) => (
            <button
              key={asset.id}
              onClick={() => setSelectedAssetId(asset.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                selectedAssetId === asset.id
                  ? 'bg-charcoal text-white shadow-md'
                  : 'bg-ivory-100 hover:bg-ivory-200 text-charcoal'
              }`}
            >
              <Sparkles className={`w-3 h-3 ${selectedAssetId === asset.id ? 'text-gold' : 'text-walnut'}`} />
              <span>{asset.id.replace('asset-3d-', '').replace('-', ' ').toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left 3D Viewer Container */}
        <div className="lg:col-span-8">
          <InteractiveFurnitureViewer
            asset={activeAsset}
            productTitle={activeAsset?.productTitle || activeAsset?.name}
            initialHeight="h-[460px] sm:h-[540px]"
          />
        </div>

        {/* Right Asset Meta & Customization Options */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-ivory-50 rounded-2xl p-6 border border-ivory-300 space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-gold">
                Active 3D Verification
              </span>
              <h4 className="font-serif text-lg font-semibold text-charcoal mt-1">
                {activeAsset?.productTitle || activeAsset?.name}
              </h4>
            </div>

            {activeAsset?.posterImageUrl && (
              <div className="bg-white p-3 rounded-xl border border-ivory-200 flex items-center space-x-3 shadow-sm">
                <div className="w-16 h-12 rounded-lg overflow-hidden bg-ivory-100 shrink-0 border border-ivory-200">
                  <img
                    src={activeAsset.posterImageUrl}
                    alt={activeAsset.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-emerald-800 font-bold flex items-center space-x-1">
                    <span>✓ 100% Matching Card Photo</span>
                  </span>
                  <span className="text-[11px] text-charcoal/70 block leading-tight mt-0.5">
                    Identical geometry &amp; upholstery preview
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2 text-xs text-charcoal/80">
              <div className="flex justify-between border-b border-ivory-200 pb-1.5">
                <span className="text-walnut font-medium">Provider:</span>
                <span className="font-semibold">{activeAsset?.provider}</span>
              </div>
              <div className="flex justify-between border-b border-ivory-200 pb-1.5">
                <span className="text-walnut font-medium">Embed Mode:</span>
                <span className="font-semibold">{activeAsset?.embedMode}</span>
              </div>
              <div className="flex justify-between border-b border-ivory-200 pb-1.5">
                <span className="text-walnut font-medium">Licensing:</span>
                <span className="font-semibold text-emerald-800">{activeAsset?.licence}</span>
              </div>
              <div className="flex justify-between border-b border-ivory-200 pb-1.5">
                <span className="text-walnut font-medium">Author:</span>
                <span className="font-semibold">{activeAsset?.author}</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-ivory-200 text-[11px] text-charcoal/70 leading-relaxed flex items-start space-x-2">
              <Info className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
              <span>
                {activeAsset?.disclaimer || 'Interactive 3D model provided for digital scale inspection. Real manufactured pieces are customized with your selected timber and upholstery.'}
              </span>
            </div>
          </div>

          {/* Action CTAs (NO CHECKOUT/CART) */}
          <div className="space-y-3">
            {activeAsset?.productSlug && (
              <Link
                href={`/products/${activeAsset.productSlug}`}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-charcoal text-ivory-100 hover:bg-charcoal-light text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
              >
                <span>View Full Product Specifications</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold" />
              </Link>
            )}

            <Link
              href="/studio"
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gold/15 hover:bg-gold/25 text-walnut text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Launch 3D Customizer Studio</span>
            </Link>

            <Link
              href="/custom-design"
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-ivory-100 hover:bg-ivory-200 text-charcoal text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              <span>Request Custom Fabrication</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
