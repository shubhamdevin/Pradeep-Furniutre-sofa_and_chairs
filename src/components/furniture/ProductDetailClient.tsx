'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import InteractiveFurnitureViewer from '@/components/three-d/InteractiveFurnitureViewer';
import LuxuryProductCard from '@/components/furniture/LuxuryProductCard';
import { 
  Camera, 
  ShieldCheck, 
  Layers, 
  Ruler, 
  FileText, 
  Printer, 
  MessageCircle, 
  Sliders, 
  CheckCircle2, 
  Info, 
  Calendar,
  X,
  Send,
  ArrowRight,
  Box
} from 'lucide-react';

interface Props {
  product: any;
  relatedProducts: any[];
  fabricSwatches: any[];
  threeDAsset: any;
}

export default function ProductDetailClient({
  product,
  relatedProducts,
  fabricSwatches,
  threeDAsset,
}: Props) {
  // Active Media View: Photography vs. 3D Viewer
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | '3d'>('photos');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSwatch, setSelectedSwatch] = useState<string | null>(fabricSwatches[0]?.name || null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showSpecSheetModal, setShowSpecSheetModal] = useState(false);

  // Quote Form State
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Agra',
    dimensionsNote: '',
    fabricPreference: selectedSwatch || 'Standard As Catalog',
    notes: '',
  });
  const [submittingQuote, setSubmittingQuote] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState<string | null>(null);

  const images = product.images.length > 0 ? product.images : [
    { id: '1', url: '/images/models/sofa_03_primary.png', viewAngle: 'Hero Front' }
  ];

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingQuote(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'PRODUCT_ENQUIRY',
          productId: product.id,
          productTitle: product.name,
          customerName: quoteForm.name,
          customerPhone: quoteForm.phone,
          customerEmail: quoteForm.email,
          city: quoteForm.city,
          notes: `Quotation requested for ${product.name} (${product.sku}). Custom dimensions: ${quoteForm.dimensionsNote || 'Standard'}. Preferred Fabric: ${quoteForm.fabricPreference}. Client notes: ${quoteForm.notes}`,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setQuoteSuccess(data.leadCode || 'LEAD-CONFIRMED');
      } else {
        alert(data.error || 'Failed to submit enquiry. Please try again or reach via WhatsApp.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please call our atelier directly.');
    } finally {
      setSubmittingQuote(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Pradeep Furniture Atelier! I am inquiring about model "${product.name}" (${product.sku}). I would like to discuss custom dimensions and receive an offline quotation.`
  );

  return (
    <div className="space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-slate-dark">
        <Link href="/" className="hover:text-graphite transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-graphite transition-colors">Catalogue</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category?.slug}`} className="hover:text-graphite transition-colors">
          {product.category?.name}
        </Link>
        <span>/</span>
        <span className="text-graphite font-semibold">{product.name}</span>
      </nav>

      {/* Main Two-Column Product Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Visual Stage (Photography vs. 3D Model) */}
        <div className="lg:col-span-7 space-y-3.5">
          {/* Media Mode Tabs */}
          <div className="flex items-center space-x-1.5 bg-platinum-soft p-1 rounded-md w-fit border border-platinum-border">
            <button
              onClick={() => setActiveMediaTab('photos')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded text-xs font-semibold transition-all ${
                activeMediaTab === 'photos'
                  ? 'bg-graphite text-white shadow-subtle'
                  : 'text-slate-dark hover:text-graphite'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Photography Gallery ({images.length})</span>
            </button>

            {threeDAsset && (
              <button
                onClick={() => setActiveMediaTab('3d')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded text-xs font-semibold transition-all ${
                  activeMediaTab === '3d'
                    ? 'bg-graphite text-white shadow-subtle'
                    : 'text-slate-dark hover:text-graphite'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>Interactive 360° Studio</span>
              </button>
            )}
          </div>

          {/* Media Viewport */}
          {activeMediaTab === '3d' && threeDAsset ? (
            <div className="space-y-2">
              <InteractiveFurnitureViewer
                asset={threeDAsset}
                productTitle={product.name}
                initialHeight="h-[480px] sm:h-[560px]"
              />
              <div className="text-[11px] text-slate-muted text-center flex items-center justify-center space-x-2 pt-1">
                <Info className="w-3 h-3 text-slate-dark" />
                <span>Drag to rotate 360° • Scroll wheel to zoom contours • Verified 1:1 workshop model</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Primary High-Resolution Display */}
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-white border border-platinum-border shadow-card">
                <img
                  src={images[activeImageIndex]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {images[activeImageIndex]?.viewAngle && (
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-0.5 bg-graphite/90 text-white backdrop-blur text-[10px] font-mono font-medium rounded">
                      {images[activeImageIndex]?.viewAngle}
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {images.map((img: any, idx: number) => (
                    <button
                      key={img.id || idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-16 rounded overflow-hidden shrink-0 border transition-all ${
                        activeImageIndex === idx ? 'border-graphite shadow-subtle ring-1 ring-graphite' : 'border-platinum-border opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Specification & Customization Actions */}
        <div className="lg:col-span-5 space-y-5">
          <div className="space-y-1.5 border-b border-platinum-border pb-4">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-graphite text-white">
                {product.sku}
              </span>
              {product.collection && (
                <span className="text-xs font-bold uppercase tracking-wider text-slate-dark">
                  {product.collection.name}
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-graphite font-medium">
              {product.name}
            </h1>

            {product.tagline && (
              <p className="text-xs font-sans text-slate-dark font-medium">
                {product.tagline}
              </p>
            )}
          </div>

          <p className="text-xs text-slate-dark leading-relaxed font-light">
            {product.description}
          </p>

          {/* Quick Specification Badges */}
          <div className="grid grid-cols-2 gap-2.5 bg-white p-3.5 rounded-lg border border-platinum-border text-xs">
            <div>
              <span className="text-slate-muted block text-[11px]">Seating Capacity:</span>
              <span className="font-semibold text-graphite">{product.seatingCapacity || 'Custom Seater'}</span>
            </div>
            <div>
              <span className="text-slate-muted block text-[11px]">Standard Dimensions:</span>
              <span className="font-semibold text-graphite truncate block">{product.dimensionsSummary || 'Custom CAD Blueprint'}</span>
            </div>
            <div>
              <span className="text-slate-muted block text-[11px]">Structural Frame:</span>
              <span className="font-semibold text-graphite truncate block">{product.frameMaterial || 'Kiln-Dried Teak/Sal'}</span>
            </div>
            <div>
              <span className="text-slate-muted block text-[11px]">Cushion Core:</span>
              <span className="font-semibold text-graphite truncate block">{product.foamDensity || '45D HR Foam'}</span>
            </div>
          </div>

          {/* Available Fabric Swatches Selector (Section 11) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-graphite">Recommended Swatch:</span>
              <span className="text-slate-dark font-medium">{selectedSwatch || 'Select Fabric'}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {fabricSwatches.map((sw) => (
                <button
                  key={sw.id}
                  onClick={() => {
                    setSelectedSwatch(sw.name);
                    setQuoteForm((prev) => ({ ...prev, fabricPreference: sw.name }));
                  }}
                  className={`w-7 h-7 rounded border transition-transform ${
                    selectedSwatch === sw.name ? 'scale-110 border-graphite shadow-subtle ring-2 ring-graphite' : 'border-platinum-border'
                  }`}
                  style={{ backgroundColor: sw.colorHex }}
                  title={`${sw.name} (${sw.weaveType})`}
                />
              ))}
            </div>
          </div>

          {/* Primary Action Buttons (STRICTLY NO E-COMMERCE / CHECKOUT) */}
          <div className="space-y-2.5 pt-4 border-t border-platinum-border">
            <button
              onClick={() => setShowQuoteModal(true)}
              className="w-full py-3.5 rounded-md bg-graphite text-white hover:bg-graphite-hover text-xs uppercase tracking-wider font-semibold transition-all shadow-subtle flex items-center justify-center space-x-2"
            >
              <FileText className="w-4 h-4 text-slate-silver" />
              <span>Request Custom Quotation</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href={`/studio?baseProduct=${product.id}`}
                className="py-2.5 px-3 rounded-md bg-platinum-soft hover:bg-platinum text-graphite text-xs font-semibold uppercase tracking-wider text-center transition-colors border border-platinum-border flex items-center justify-center space-x-1.5"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-dark" />
                <span>Customize Design</span>
              </Link>

              <a
                href={`https://wa.me/919897023456?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-md bg-white hover:bg-platinum-soft text-graphite text-xs font-semibold uppercase tracking-wider text-center transition-colors border border-platinum-border flex items-center justify-center space-x-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-slate-dark" />
                <span>WhatsApp Concierge</span>
              </a>
            </div>

            <div className="flex items-center justify-between pt-1.5 text-xs">
              <button
                onClick={() => setShowSpecSheetModal(true)}
                className="inline-flex items-center space-x-1 text-slate-dark hover:text-graphite underline"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>View Architectural Spec Sheet</span>
              </button>

              <Link
                href="/consultation"
                className="inline-flex items-center space-x-1 text-slate-dark hover:text-graphite font-medium underline"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Atelier Visit</span>
              </Link>
            </div>
          </div>

          {/* Absolute Assurance Box */}
          <div className="bg-white p-3.5 rounded-lg border border-platinum-border space-y-1.5 text-xs text-slate-dark">
            <div className="flex items-center space-x-1.5 text-graphite font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>10-Year Solid Hardwood Frame Guarantee</span>
            </div>
            <p className="text-[11px] text-slate-muted leading-relaxed">
              Every sofa and chair is custom-manufactured in Agra. We do not sell mass-produced imported stock. All commercial agreements are verified offline with bank transfer receipts.
            </p>
          </div>
        </div>
      </div>

      {/* Technical Specifications Matrix */}
      <div className="bg-white rounded-lg p-6 md:p-8 border border-platinum-border shadow-subtle space-y-6">
        <div className="border-b border-platinum-border pb-3">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-dark">Manufacturing Details</span>
          <h2 className="font-serif text-2xl text-graphite font-medium mt-0.5">
            Technical Specifications &amp; Craftsmanship
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dimensions */}
          <div className="space-y-2.5 bg-platinum-soft p-4 rounded-md border border-platinum-border">
            <div className="flex items-center space-x-2 text-graphite">
              <Ruler className="w-4 h-4 text-slate-dark" />
              <h3 className="font-sans font-semibold text-sm">Dimensions &amp; Ergonomics</h3>
            </div>
            <ul className="space-y-1 text-xs text-slate-dark">
              <li><strong>Overall Dimensions:</strong> {product.dimensionsSummary || 'Custom configured'}</li>
              <li><strong>Width:</strong> {product.widthCm ? `${product.widthCm} cm` : 'Bespoke'}</li>
              <li><strong>Depth:</strong> {product.depthCm ? `${product.depthCm} cm` : 'Bespoke'}</li>
              <li><strong>Height:</strong> {product.heightCm ? `${product.heightCm} cm` : 'Bespoke'}</li>
              <li><strong>Seat Height:</strong> {product.seatHeightCm ? `${product.seatHeightCm} cm` : '17.5" Standard'}</li>
            </ul>
          </div>

          {/* Frame & Wood */}
          <div className="space-y-2.5 bg-platinum-soft p-4 rounded-md border border-platinum-border">
            <div className="flex items-center space-x-2 text-graphite">
              <Layers className="w-4 h-4 text-slate-dark" />
              <h3 className="font-sans font-semibold text-sm">Frame &amp; Joinery</h3>
            </div>
            <ul className="space-y-1 text-xs text-slate-dark">
              <li><strong>Structural Timber:</strong> {product.frameMaterial || 'Kiln-Dried Salwood & Teak'}</li>
              <li><strong>Moisture Level:</strong> Under 10% Kiln-Seasoned</li>
              <li><strong>Joinery:</strong> Double-doweled mortise and tenon joinery</li>
              <li><strong>Suspension:</strong> {product.suspension || 'High tensile zig-zag steel springs'}</li>
              <li><strong>Leg Finish:</strong> {product.legFinish || 'Solid timber plinth / ferrules'}</li>
            </ul>
          </div>

          {/* Cushioning */}
          <div className="space-y-2.5 bg-platinum-soft p-4 rounded-md border border-platinum-border">
            <div className="flex items-center space-x-2 text-graphite">
              <CheckCircle2 className="w-4 h-4 text-slate-dark" />
              <h3 className="font-sans font-semibold text-sm">Comfort &amp; Upholstery</h3>
            </div>
            <ul className="space-y-1 text-xs text-slate-dark">
              <li><strong>Core Foam:</strong> {product.foamDensity || '45D Sag-Resistant High Resilience PU'}</li>
              <li><strong>Comfort Wrap:</strong> Virgin micro-fiber feather crown topper</li>
              <li><strong>Fabric Tier:</strong> {product.upholsteryType || 'Belgian Luxe Velvet / Bouclé / Leather'}</li>
              <li><strong>Warranty:</strong> 10-Year Framework &amp; 5-Year Foam Resilience</li>
              <li><strong>Care:</strong> Professional fabric dry-clean / vacuum with soft brush</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Furniture Designs */}
      {relatedProducts.length > 0 && (
        <div className="space-y-5">
          <div className="flex justify-between items-end border-b border-platinum-border pb-3">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-slate-dark">Complementary Silhouettes</span>
              <h2 className="font-serif text-2xl text-graphite font-medium mt-0.5">Related Designs in Collection</h2>
            </div>
            <Link href="/products" className="text-xs font-semibold text-graphite hover:underline uppercase tracking-wider flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <LuxuryProductCard
                key={rel.id}
                product={rel}
                showQuickActions={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quote Request Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 bg-graphite-deep/80 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-150">
          <div className="bg-white max-w-lg w-full rounded-lg p-6 shadow-elevated border border-platinum-border text-graphite relative">
            <div className="flex items-start justify-between pb-3 border-b border-platinum-border">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-dark">Official Atelier Request</span>
                <h3 className="font-serif text-xl font-medium mt-0.5">Request Custom Quotation</h3>
                <p className="text-xs text-slate-dark mt-0.5">{product.name} ({product.sku})</p>
              </div>
              <button onClick={() => { setShowQuoteModal(false); setQuoteSuccess(null); }} className="text-slate-muted hover:text-graphite">
                <X className="w-5 h-5" />
              </button>
            </div>

            {quoteSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-platinum-soft text-status-success flex items-center justify-center mx-auto border border-platinum-border">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-xl font-medium">Quotation Request Received!</h4>
                <p className="text-xs text-slate-dark max-w-xs mx-auto">
                  Our atelier design consultant will review your specifications and contact you with custom drawings and offline pricing schedule.
                </p>
                <div className="bg-platinum-soft p-2.5 rounded border border-platinum-border text-xs font-mono font-semibold">
                  Reference: {quoteSuccess}
                </div>
                <button
                  onClick={() => { setShowQuoteModal(false); setQuoteSuccess(null); }}
                  className="px-6 py-2 bg-graphite text-white rounded text-xs font-semibold uppercase tracking-wider"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block text-slate-dark font-medium mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={quoteForm.name}
                    onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-md bg-platinum-soft border border-platinum-border text-graphite focus:outline-none focus:border-graphite"
                    placeholder="e.g. Radhika Sharma"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-dark font-medium mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={quoteForm.phone}
                      onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-md bg-platinum-soft border border-platinum-border text-graphite focus:outline-none focus:border-graphite"
                      placeholder="+91 98970 00000"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-dark font-medium mb-1">Delivery City</label>
                    <input
                      type="text"
                      value={quoteForm.city}
                      onChange={(e) => setQuoteForm({ ...quoteForm, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-md bg-platinum-soft border border-platinum-border text-graphite focus:outline-none focus:border-graphite"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-dark font-medium mb-1">Custom Dimensions or Modifications</label>
                  <input
                    type="text"
                    value={quoteForm.dimensionsNote}
                    onChange={(e) => setQuoteForm({ ...quoteForm, dimensionsNote: e.target.value })}
                    className="w-full px-3 py-2 rounded-md bg-platinum-soft border border-platinum-border text-graphite focus:outline-none focus:border-graphite"
                    placeholder="e.g. Standard 88-inch or 10-foot bay window customization"
                  />
                </div>

                <div>
                  <label className="block text-slate-dark font-medium mb-1">Preferred Fabric &amp; Colour</label>
                  <input
                    type="text"
                    value={quoteForm.fabricPreference}
                    onChange={(e) => setQuoteForm({ ...quoteForm, fabricPreference: e.target.value })}
                    className="w-full px-3 py-2 rounded-md bg-platinum-soft border border-platinum-border text-graphite focus:outline-none focus:border-graphite"
                  />
                </div>

                <div>
                  <label className="block text-slate-dark font-medium mb-1">Additional Project Notes</label>
                  <textarea
                    rows={2}
                    value={quoteForm.notes}
                    onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-md bg-platinum-soft border border-platinum-border text-graphite focus:outline-none focus:border-graphite"
                    placeholder="Floor details, timeline, or matching armchairs..."
                  />
                </div>

                <div className="pt-2 border-t border-platinum-border">
                  <button
                    type="submit"
                    disabled={submittingQuote}
                    className="w-full py-3 bg-graphite hover:bg-graphite-hover text-white font-semibold rounded-md text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
                  >
                    <Send className="w-3.5 h-3.5 text-slate-silver" />
                    <span>{submittingQuote ? 'Submitting...' : 'Submit Quotation Request'}</span>
                  </button>
                  <p className="text-[10px] text-slate-muted text-center mt-1.5">
                    No online checkout. Formal quotation &amp; CAD blueprints delivered offline.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Specification Sheet Modal / Printable View (Section 16 Design) */}
      {showSpecSheetModal && (
        <div className="fixed inset-0 z-50 bg-graphite-deep/80 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center overflow-y-auto">
          <div className="bg-white max-w-3xl w-full rounded-lg p-8 shadow-elevated border border-platinum-border text-graphite relative max-h-[90vh] overflow-y-auto print:m-0 print:p-0">
            <div className="flex items-start justify-between pb-4 border-b border-platinum-border mb-6 print:hidden">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-graphite" />
                <span className="font-sans text-sm font-bold uppercase tracking-wider">Atelier Architectural Specification Sheet</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-graphite text-white rounded text-xs font-semibold flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
                <button onClick={() => setShowSpecSheetModal(false)} className="text-slate-muted hover:text-graphite p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Spec Sheet Document Content */}
            <div className="space-y-6 text-xs font-sans">
              <div className="border-b border-graphite pb-4 flex justify-between items-end">
                <div>
                  <h3 className="font-serif text-2xl font-bold uppercase tracking-tight text-graphite">PRADEEP FURNITURE ATELIER</h3>
                  <p className="text-slate-dark text-[11px] font-medium">Architectural Upholstered Seating &amp; Contract Manufacturing</p>
                  <p className="text-slate-muted text-[10px] mt-0.5">Bodla Industrial Compound &amp; Civil Lines Gallery, Agra, UP</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold block">{product.sku}</span>
                  <span className="text-[10px] text-slate-muted">DATE: {new Date().toLocaleDateString('en-GB')}</span>
                </div>
              </div>

              <div>
                <h4 className="font-serif text-xl font-medium text-graphite">{product.name}</h4>
                <p className="text-xs text-slate-dark italic mt-0.5">{product.tagline}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 border border-platinum-border p-3.5 rounded bg-platinum-soft">
                <div>
                  <strong className="block text-slate-dark">Category:</strong> {product.category?.name}
                </div>
                <div>
                  <strong className="block text-slate-dark">Collection:</strong> {product.collection?.name || 'Atelier Signature'}
                </div>
                <div>
                  <strong className="block text-slate-dark">Seating Capacity:</strong> {product.seatingCapacity}
                </div>
                <div>
                  <strong className="block text-slate-dark">Dimensions:</strong> {product.dimensionsSummary}
                </div>
              </div>

              <div className="space-y-1.5">
                <h5 className="font-sans text-xs font-bold uppercase tracking-wider border-b border-platinum-border pb-1">Framing &amp; Engineering</h5>
                <p><strong>Timber Skeleton:</strong> {product.frameMaterial}</p>
                <p><strong>Moisture Level:</strong> Seasoned &amp; Kiln-Dried below 10%</p>
                <p><strong>Suspension System:</strong> {product.suspension}</p>
                <p><strong>Core Foam:</strong> {product.foamDensity}</p>
                <p><strong>Plinth / Feet:</strong> {product.legFinish}</p>
              </div>

              <div className="space-y-1.5">
                <h5 className="font-sans text-xs font-bold uppercase tracking-wider border-b border-platinum-border pb-1">Upholstery &amp; Fabric</h5>
                <p><strong>Fabric Specification:</strong> {product.upholsteryType}</p>
                <p><strong>Martindale Rub Count:</strong> 45,000 - 65,000 Contract Grade Standard</p>
                <p><strong>Stitching:</strong> Heavy-duty bonded nylon thread with French topstitching</p>
              </div>

              <div className="pt-4 border-t border-graphite text-[11px] text-slate-muted flex justify-between">
                <span>Structural Warranty: 10 Years Solid Frame</span>
                <span>Commercial Transaction: Strictly Offline via Atelier Agreement</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
