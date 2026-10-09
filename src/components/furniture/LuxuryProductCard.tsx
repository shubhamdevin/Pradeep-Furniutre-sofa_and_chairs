'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  RotateCw, 
  Sliders, 
  ArrowRight, 
  Check, 
  X, 
  Heart, 
  Scale, 
  CheckCircle2,
  Box
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
      <div className="architectural-card bg-white rounded-lg overflow-hidden flex flex-col justify-between group relative border border-platinum-border transition-all duration-200 hover:border-slate-silver hover:shadow-card">
        <div>
          {/* Product Image Stage */}
          <div className="relative aspect-[4/3] bg-platinum-soft overflow-hidden border-b border-platinum-border">
            <img
              src={primaryImg}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
              loading="lazy"
            />

            {/* Top Badges */}
            <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
              <span className="px-2 py-0.5 bg-white/95 text-graphite text-[10px] font-mono font-semibold rounded border border-platinum-border shadow-subtle">
                {product.sku}
              </span>

              {showQuickActions && (
                <div className="flex items-center space-x-1">
                  {onToggleShortlist && (
                    <button
                      onClick={() => onToggleShortlist(product.id)}
                      className={`p-1.5 rounded transition-colors shadow-subtle ${
                        isShortlisted
                          ? 'bg-status-error text-white'
                          : 'bg-white/95 text-slate-dark hover:bg-white hover:text-graphite'
                      }`}
                      title={isShortlisted ? 'Saved in Shortlist' : 'Save to Shortlist'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-white' : ''}`} />
                    </button>
                  )}

                  {onToggleCompare && (
                    <button
                      onClick={() => onToggleCompare(product.id)}
                      className={`p-1.5 rounded transition-colors shadow-subtle ${
                        isCompared
                          ? 'bg-graphite text-white'
                          : 'bg-white/95 text-slate-dark hover:bg-white hover:text-graphite'
                      }`}
                      title="Compare Technical Specs"
                    >
                      <Scale className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 3D Model Badge & Quick Inspect Trigger */}
            {has3D && (
              <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between z-10">
                <span className="px-2 py-0.5 bg-graphite-deep text-platinum text-[10px] font-sans font-semibold rounded flex items-center space-x-1 border border-graphite-border shadow-subtle">
                  <Box className="w-3 h-3 text-slate-silver" />
                  <span>Interactive 3D</span>
                </span>

                <button
                  onClick={() => setShow3DModal(true)}
                  className="px-2.5 py-1 bg-white hover:bg-graphite hover:text-white text-graphite text-[10px] font-sans font-semibold uppercase tracking-wider rounded transition-all shadow-subtle flex items-center space-x-1 border border-platinum-border"
                  title="Inspect interactive 3D model with 360° rotation"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Inspect 3D</span>
                </button>
              </div>
            )}

            {!has3D && product.isCustomizable && (
              <div className="absolute bottom-2.5 left-2.5 z-10">
                <span className="px-2 py-0.5 bg-platinum-soft text-slate-dark text-[10px] font-sans font-medium rounded border border-platinum-border">
                  Customizable
                </span>
              </div>
            )}
          </div>

          {/* Card Body */}
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-dark">
                {product.category?.name || 'Architectural Seating'}
              </span>

              {has3D && (
                <span className="inline-flex items-center space-x-1 text-[10px] text-status-success font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>1:1 Photo &amp; 3D Match</span>
                </span>
              )}
            </div>

            <Link href={`/products/${product.slug}`} className="block">
              <h3 className="font-serif text-lg font-medium text-graphite hover:text-graphite-hover transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>

            {product.description && (
              <p className="text-xs text-slate-dark line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Specifications Details */}
            <div className="pt-2.5 border-t border-platinum-border space-y-1 text-xs text-slate-dark">
              {product.seatingCapacity && (
                <div className="flex justify-between">
                  <span className="text-slate-muted">Capacity:</span>
                  <span className="text-graphite font-medium">{product.seatingCapacity}</span>
                </div>
              )}
              {product.dimensionsSummary && (
                <div className="flex justify-between">
                  <span className="text-slate-muted">Dimensions:</span>
                  <span className="truncate max-w-[150px] text-right text-graphite">
                    {product.dimensionsSummary}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions (STRICTLY NO CART / BUY NOW) */}
        <div className="p-4 pt-0 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/products/${product.slug}`}
              className="px-3 py-2 text-center rounded-md bg-transparent hover:bg-platinum-soft text-graphite text-xs font-semibold transition-colors border border-graphite"
            >
              View Details
            </Link>
            <Link
              href={`/studio?baseProduct=${product.id}`}
              className="px-3 py-2 text-center rounded-md bg-graphite hover:bg-graphite-hover text-white text-xs font-semibold transition-colors border border-graphite flex items-center justify-center space-x-1"
            >
              <Sliders className="w-3 h-3" />
              <span>Customize</span>
            </Link>
          </div>

          <Link
            href={`/custom-design?product=${product.id}`}
            className="w-full block py-1.5 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-dark hover:text-graphite transition-colors"
          >
            Request Factory Quotation →
          </Link>
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE 3D QUICK-INSPECTION MODAL (ARCHITECTURAL DEEP GRAPHITE STAGE)
         ========================================================================= */}
      {show3DModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-graphite-deep/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="bg-white rounded-xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-elevated border border-platinum-border flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-platinum-border flex items-center justify-between bg-platinum-soft">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-graphite text-white text-[10px] font-mono font-semibold rounded">
                    {product.sku}
                  </span>
                  <span className="px-2 py-0.5 bg-white text-status-success border border-platinum-border text-[10px] font-semibold rounded flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Exact 1:1 Photo &amp; 3D Match Verified</span>
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-medium text-graphite">
                  {product.name}
                </h3>
              </div>

              <button
                onClick={() => setShow3DModal(false)}
                className="w-8 h-8 rounded bg-white hover:bg-platinum-soft text-graphite flex items-center justify-center border border-platinum-border transition-colors"
                title="Close Viewer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="px-6 pt-3 border-b border-platinum-border flex items-center space-x-4 bg-white">
              <button
                onClick={() => setModalActiveTab('3d')}
                className={`pb-2.5 text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 border-b-2 transition-all ${
                  modalActiveTab === '3d'
                    ? 'border-graphite text-graphite'
                    : 'border-transparent text-slate-muted hover:text-graphite'
                }`}
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Interactive 3D Geometry (Rotate 360°)</span>
              </button>

              <button
                onClick={() => setModalActiveTab('compare')}
                className={`pb-2.5 text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 border-b-2 transition-all ${
                  modalActiveTab === 'compare'
                    ? 'border-graphite text-graphite'
                    : 'border-transparent text-slate-muted hover:text-graphite'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Side-by-Side Photo &amp; 3D Verification</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {modalActiveTab === '3d' ? (
                <div className="space-y-3">
                  <div className="rounded-lg overflow-hidden border border-platinum-border">
                    <InteractiveFurnitureViewer
                      asset={formatted3D}
                      productTitle={product.name}
                      initialHeight="h-[400px] sm:h-[460px]"
                    />
                  </div>
                  <div className="p-3 bg-platinum-soft rounded-lg border border-platinum-border text-xs text-slate-dark flex items-center justify-between">
                    <span>
                      <strong className="text-graphite">Controls:</strong> Click &amp; drag to rotate 360° • Scroll wheel to zoom • Right-click to pan
                    </span>
                    <span className="text-[11px] text-status-success font-semibold flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Verified Workshop Geometry</span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  {/* Left: Card Photo */}
                  <div className="bg-platinum-soft rounded-lg p-4 border border-platinum-border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-graphite">
                        1. Product Card Photograph
                      </span>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-platinum-border font-mono">
                        Official Spec
                      </span>
                    </div>
                    <div className="aspect-[4/3] rounded overflow-hidden bg-white border border-platinum-border">
                      <img
                        src={primaryImg}
                        alt="Original Photograph"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-[11px] text-slate-dark leading-relaxed">
                      Official workshop master photograph shown across the digital showroom catalogue.
                    </p>
                  </div>

                  {/* Right: Live 3D Model */}
                  <div className="bg-platinum-soft rounded-lg p-4 border border-platinum-border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-graphite">
                        2. Live Interactive 3D Model
                      </span>
                      <span className="text-[10px] bg-graphite text-white px-2 py-0.5 rounded font-mono">
                        360° Geometry
                      </span>
                    </div>
                    <div className="rounded overflow-hidden border border-platinum-border">
                      <InteractiveFurnitureViewer
                        asset={formatted3D}
                        productTitle={product.name}
                        initialHeight="h-[250px] sm:h-[280px]"
                      />
                    </div>
                    <p className="text-[11px] text-slate-dark leading-relaxed">
                      Exact 1:1 geometry match. Rotate and zoom to verify proportional cushions, armrests, and frame.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-5 border-t border-platinum-border bg-platinum-soft flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-dark">
                <span>Dimensions: <strong className="text-graphite">{product.dimensionsSummary || 'Custom CAD Available'}</strong></span>
                <span className="mx-2 text-slate-silver">•</span>
                <span>Seating: <strong className="text-graphite">{product.seatingCapacity || 'Custom'}</strong></span>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <Link
                  href={`/studio?baseProduct=${product.id}`}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-md bg-white hover:bg-platinum text-graphite text-xs font-semibold uppercase tracking-wider transition-colors border border-platinum-border flex items-center justify-center space-x-1.5"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Customize in 3D Studio</span>
                </Link>

                <Link
                  href={`/products/${product.slug}`}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-md bg-graphite text-white hover:bg-graphite-hover text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5"
                >
                  <span>Full Specifications</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
