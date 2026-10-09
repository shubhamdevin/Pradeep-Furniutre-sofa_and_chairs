'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  RotateCw, 
  Sliders, 
  ArrowRight, 
  Check, 
  X, 
  Heart, 
  Scale, 
  Eye, 
  Layers, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import InteractiveFurnitureViewer from '@/components/three-d/InteractiveFurnitureViewer';

export interface LuxuryProductCardProps {
  product: {
    id: string;
    sku: string;
    name: string;
    slug: string;
    description?: string | null;
    furnitureType?: string | null;
    seatingCapacity?: string | null;
    dimensionsSummary?: string | null;
    isCustomizable?: boolean | null;
    isFeatured?: boolean | null;
    category?: { name: string; slug: string } | null;
    collection?: { name: string; slug: string } | null;
    images: { url: string; viewAngle?: string | null; isPrimary?: boolean | null }[];
    threeDAsset?: any;
  } | any;
  isShortlisted?: boolean;
  isCompared?: boolean;
  onToggleShortlist?: (id: string) => void;
  onToggleCompare?: (id: string) => void;
  showQuickActions?: boolean;
}

export default function LuxuryProductCard({
  product,
  isShortlisted = false,
  isCompared = false,
  onToggleShortlist,
  onToggleCompare,
  showQuickActions = true,
}: LuxuryProductCardProps) {
  const [show3DModal, setShow3DModal] = useState(false);
  const [modalActiveTab, setModalActiveTab] = useState<'3d' | 'compare'>('3d');

  // Find primary image or first available
  const primaryImg =
    product.images?.find((i: any) => i.isPrimary)?.url ||
    product.images?.[0]?.url ||
    '/images/models/sofa_03_primary.png';

  const has3D = Boolean(product.threeDAsset);

  // Format 3D asset for viewer
  const formatted3D = product.threeDAsset
    ? {
        ...product.threeDAsset,
        productSlug: product.slug,
        productTitle: product.name,
      }
    : null;

  return (
    <>
      <div className="luxury-card bg-white rounded-2xl overflow-hidden flex flex-col justify-between group relative transition-all duration-300 hover:shadow-luxury-hover">
        <div>
          {/* Product Image Stage */}
          <div className="relative aspect-[4/3] bg-ivory-100 overflow-hidden sheen-overlay">
            <img
              src={primaryImg}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />

            {/* Top Badges */}
            <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
              <span className="px-2.5 py-1 bg-white/95 backdrop-blur-md text-charcoal text-[10px] font-mono font-semibold rounded-full border border-ivory-300 shadow-sm">
                {product.sku}
              </span>

              {showQuickActions && (
                <div className="flex items-center space-x-1.5">
                  {onToggleShortlist && (
                    <button
                      onClick={() => onToggleShortlist(product.id)}
                      className={`p-1.5 rounded-full backdrop-blur-md transition-colors shadow-sm ${
                        isShortlisted
                          ? 'bg-red-50 text-red-600'
                          : 'bg-white/90 text-charcoal/70 hover:bg-white hover:text-red-500'
                      }`}
                      title={isShortlisted ? 'Saved in Shortlist' : 'Save to Shortlist'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-red-600' : ''}`} />
                    </button>
                  )}

                  {onToggleCompare && (
                    <button
                      onClick={() => onToggleCompare(product.id)}
                      className={`p-1.5 rounded-full backdrop-blur-md transition-colors shadow-sm ${
                        isCompared
                          ? 'bg-charcoal text-gold'
                          : 'bg-white/90 text-charcoal/70 hover:bg-white hover:text-charcoal'
                      }`}
                      title="Compare Design"
                    >
                      <Scale className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 3D Model Badge & Quick Inspect Trigger */}
            {has3D && (
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between z-10">
                <span className="px-2.5 py-1 bg-charcoal/90 backdrop-blur text-gold text-[10px] font-semibold rounded-full flex items-center space-x-1.5 border border-gold/30 shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping" />
                  <span>Exact 3D Model</span>
                </span>

                <button
                  onClick={() => setShow3DModal(true)}
                  className="px-3 py-1 bg-white/95 hover:bg-gold hover:text-charcoal text-charcoal text-[10px] font-bold uppercase tracking-wider rounded-full backdrop-blur-md transition-all shadow-md flex items-center space-x-1 border border-ivory-300 group-hover:scale-105"
                  title="Inspect interactive 3D model with 360° rotation"
                >
                  <RotateCw className="w-3 h-3 text-gold group-hover:text-charcoal" />
                  <span>Inspect 3D</span>
                </button>
              </div>
            )}

            {!has3D && product.isCustomizable && (
              <div className="absolute bottom-3 left-3 z-10">
                <span className="px-2.5 py-0.5 bg-cream/95 text-walnut text-[10px] font-semibold rounded-full border border-gold/30">
                  Customizable
                </span>
              </div>
            )}
          </div>

          {/* Card Body */}
          <div className="p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-gold">
                {product.category?.name || 'Bespoke Atelier'}
              </span>

              {has3D && (
                <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>1:1 Photo &amp; 3D Match</span>
                </span>
              )}
            </div>

            <Link href={`/products/${product.slug}`} className="block">
              <h3 className="font-serif text-lg font-medium text-charcoal hover:text-gold transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>

            {product.description && (
              <p className="text-xs text-charcoal/70 line-clamp-2 leading-relaxed font-light">
                {product.description}
              </p>
            )}

            {/* Specifications Grid */}
            <div className="pt-3 border-t border-ivory-200/80 space-y-1.5 text-xs text-charcoal/80">
              {product.seatingCapacity && (
                <div className="flex justify-between">
                  <span className="text-walnut font-medium">Capacity:</span>
                  <span className="text-charcoal">{product.seatingCapacity}</span>
                </div>
              )}
              {product.dimensionsSummary && (
                <div className="flex justify-between">
                  <span className="text-walnut font-medium">Dimensions:</span>
                  <span className="truncate max-w-[150px] text-right text-charcoal">
                    {product.dimensionsSummary}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions (NO SHOPPING CART / BUY NOW) */}
        <div className="p-5 pt-0 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/products/${product.slug}`}
              className="px-3 py-2.5 text-center rounded-xl bg-ivory-100 hover:bg-charcoal hover:text-ivory-100 text-charcoal text-xs font-semibold transition-all border border-ivory-300"
            >
              View Details
            </Link>
            <Link
              href={`/studio?baseProduct=${product.id}`}
              className="px-3 py-2.5 text-center rounded-xl bg-gold/15 hover:bg-gold hover:text-charcoal text-walnut text-xs font-semibold transition-all border border-gold/30 flex items-center justify-center space-x-1"
            >
              <Sliders className="w-3 h-3" />
              <span>Customize</span>
            </Link>
          </div>

          <Link
            href={`/quotation?productId=${product.id}`}
            className="w-full block py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-charcoal/70 hover:text-gold transition-colors"
          >
            Request Factory Quotation →
          </Link>
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE 3D QUICK-INSPECTION MODAL (STRICT 1:1 MODEL MATCH PROOF)
         ========================================================================= */}
      {show3DModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm animate-fade-in">
          <div 
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-ivory-300 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-ivory-200 flex items-center justify-between bg-ivory-50/70">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 bg-charcoal text-gold text-[10px] font-semibold rounded-full">
                    {product.sku}
                  </span>
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold rounded-full flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Exact 1:1 Photo &amp; 3D Match</span>
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal">
                  {product.name}
                </h3>
              </div>

              <button
                onClick={() => setShow3DModal(false)}
                className="w-10 h-10 rounded-full bg-ivory-100 hover:bg-ivory-200 text-charcoal flex items-center justify-center transition-colors"
                title="Close Viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="px-6 pt-4 border-b border-ivory-200 flex items-center space-x-4 bg-ivory-50/40">
              <button
                onClick={() => setModalActiveTab('3d')}
                className={`pb-3 text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 border-b-2 transition-all ${
                  modalActiveTab === '3d'
                    ? 'border-gold text-charcoal'
                    : 'border-transparent text-charcoal/50 hover:text-charcoal'
                }`}
              >
                <RotateCw className="w-3.5 h-3.5 text-gold" />
                <span>Interactive 3D Geometry (Rotate 360°)</span>
              </button>

              <button
                onClick={() => setModalActiveTab('compare')}
                className={`pb-3 text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 border-b-2 transition-all ${
                  modalActiveTab === 'compare'
                    ? 'border-gold text-charcoal'
                    : 'border-transparent text-charcoal/50 hover:text-charcoal'
                }`}
              >
                <Scale className="w-3.5 h-3.5 text-gold" />
                <span>Side-by-Side Photo &amp; 3D Match</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {modalActiveTab === '3d' ? (
                <div className="space-y-4">
                  <InteractiveFurnitureViewer
                    asset={formatted3D}
                    productTitle={product.name}
                    initialHeight="h-[420px] sm:h-[480px]"
                  />
                  <div className="p-3 bg-ivory-50 rounded-xl border border-ivory-200 text-xs text-charcoal/80 flex items-center justify-between">
                    <span>
                      <strong className="text-walnut">Interactive Controls:</strong> Left-click and drag to rotate 360° | Scroll wheel to zoom | Right-click to pan
                    </span>
                    <span className="text-[11px] text-emerald-800 font-semibold flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Verified Workshop Geometry</span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  {/* Left: Card Photo */}
                  <div className="bg-ivory-50 rounded-2xl p-4 border border-ivory-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-charcoal">
                        1. Product Card Photograph
                      </span>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-ivory-300 font-mono">
                        Original Render
                      </span>
                    </div>
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white border border-ivory-200">
                      <img
                        src={primaryImg}
                        alt="Original Photograph"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-[11px] text-charcoal/70 leading-relaxed">
                      This is the official atelier master photograph shown on the product card.
                    </p>
                  </div>

                  {/* Right: Live 3D Model */}
                  <div className="bg-ivory-50 rounded-2xl p-4 border border-ivory-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-gold">
                        2. Live Interactive 3D Model
                      </span>
                      <span className="text-[10px] bg-charcoal text-gold px-2 py-0.5 rounded-full font-mono">
                        360° Active
                      </span>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-ivory-200">
                      <InteractiveFurnitureViewer
                        asset={formatted3D}
                        productTitle={product.name}
                        initialHeight="h-[260px] sm:h-[300px]"
                      />
                    </div>
                    <p className="text-[11px] text-charcoal/70 leading-relaxed">
                      Exact 1:1 geometry match. Rotate and zoom to verify the armrest, cushions, and frame proportions.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-5 sm:p-6 border-t border-ivory-200 bg-ivory-50/70 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-charcoal/70">
                <span>Model Dimensions: <strong>{product.dimensionsSummary || 'Custom CAD Available'}</strong></span>
                <span className="mx-2">•</span>
                <span>Seating: <strong>{product.seatingCapacity || 'Custom'}</strong></span>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <Link
                  href={`/studio?baseProduct=${product.id}`}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gold text-charcoal hover:bg-gold-dark text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Customize in 3D Studio</span>
                </Link>

                <Link
                  href={`/products/${product.slug}`}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-charcoal text-white hover:bg-charcoal-light text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5"
                >
                  <span>Full Specifications</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gold" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
