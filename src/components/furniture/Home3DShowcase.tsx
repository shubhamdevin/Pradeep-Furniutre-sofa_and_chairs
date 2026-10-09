'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import InteractiveFurnitureViewer from '@/components/three-d/InteractiveFurnitureViewer';
import { ThreeDAssetItem } from '@/lib/types';
import { Box, Sliders, ArrowRight, Info, CheckCircle2 } from 'lucide-react';

interface ShowcaseProps {
  assets: (ThreeDAssetItem & { productSlug?: string; productTitle?: string })[];
}

export default function Home3DShowcase({ assets }: ShowcaseProps) {
  const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[0]?.id || 'asset-3d-sofa-03');

  const activeAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];

  return (
    <div className="bg-graphite-deep rounded-xl p-6 sm:p-8 lg:p-10 border border-graphite-border shadow-elevated text-platinum">
      {/* Model Tabs Selection Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-graphite-border pb-6 mb-8">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-slate-silver">3D Geometry Inspection</span>
          <h3 className="font-serif text-xl sm:text-2xl text-white font-medium mt-0.5">
            {activeAsset?.name || 'Selected 3D Model'}
          </h3>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex flex-wrap gap-2">
          {assets.map((asset) => (
            <button
              key={asset.id}
              onClick={() => setSelectedAssetId(asset.id)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                selectedAssetId === asset.id
                  ? 'bg-platinum text-graphite-deep shadow-subtle'
                  : 'bg-graphite-elevated hover:bg-graphite text-platinum border border-graphite-border'
              }`}
            >
              <Box className={`w-3 h-3 ${selectedAssetId === asset.id ? 'text-graphite' : 'text-slate-silver'}`} />
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
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-graphite-elevated rounded-lg p-5 border border-graphite-border space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-silver">
                Active Studio Verification
              </span>
              <h4 className="font-serif text-lg font-medium text-white mt-1">
                {activeAsset?.productTitle || activeAsset?.name}
              </h4>
            </div>

            {/* Poster Verification Match */}
            {activeAsset?.posterImageUrl && (
              <div className="bg-graphite p-3 rounded border border-graphite-border flex items-center space-x-3 shadow-subtle">
                <div className="w-16 h-12 rounded overflow-hidden bg-graphite-deep shrink-0 border border-graphite-border">
                  <img
                    src={activeAsset.posterImageUrl}
                    alt={activeAsset.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-white font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-status-success" />
                    <span>100% Matching Card Photo</span>
                  </span>
                  <span className="text-[11px] text-slate-silver block leading-tight mt-0.5">
                    Exact geometry &amp; textile preview
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2 text-xs text-slate-silver">
              <div className="flex justify-between border-b border-graphite-border pb-1.5">
                <span className="text-slate-muted">Provider:</span>
                <span className="font-semibold text-platinum">{activeAsset?.provider}</span>
              </div>
              <div className="flex justify-between border-b border-graphite-border pb-1.5">
                <span className="text-slate-muted">Mode:</span>
                <span className="font-semibold text-platinum">{activeAsset?.embedMode}</span>
              </div>
              <div className="flex justify-between border-b border-graphite-border pb-1.5">
                <span className="text-slate-muted">Licensing:</span>
                <span className="font-semibold text-platinum">{activeAsset?.licence}</span>
              </div>
              <div className="flex justify-between border-b border-graphite-border pb-1.5">
                <span className="text-slate-muted">Author:</span>
                <span className="font-semibold text-platinum">{activeAsset?.author}</span>
              </div>
            </div>

            <div className="bg-graphite p-3 rounded border border-graphite-border text-[11px] text-slate-silver leading-relaxed flex items-start space-x-2">
              <Info className="w-3.5 h-3.5 text-slate-silver shrink-0 mt-0.5" />
              <span>
                {activeAsset?.disclaimer || 'Interactive 3D model provided for digital scale inspection. Real manufactured pieces are customized with your selected timber and upholstery.'}
              </span>
            </div>
          </div>

          {/* Action CTAs (NO CHECKOUT/CART) */}
          <div className="space-y-2.5">
            {activeAsset?.productSlug && (
              <Link
                href={`/products/${activeAsset.productSlug}`}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-md bg-platinum text-graphite-deep hover:bg-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-subtle"
              >
                <span>View Full Product Specifications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            <Link
              href="/studio"
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-md bg-graphite-elevated hover:bg-graphite text-platinum text-xs font-semibold uppercase tracking-wider transition-colors border border-graphite-border"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Launch 3D Customizer Studio</span>
            </Link>

            <Link
              href="/custom-design"
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-md bg-graphite-deep hover:bg-graphite text-slate-silver hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors border border-graphite-border"
            >
              <span>Request Custom Fabrication</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
