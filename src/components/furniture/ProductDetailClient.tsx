'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import InteractiveFurnitureViewer from '@/components/three-d/InteractiveFurnitureViewer';
import LuxuryProductCard from '@/components/furniture/LuxuryProductCard';
import { 
  Sparkles, 
  Camera, 
  ShieldCheck, 
  Layers, 
  Compass, 
  Ruler, 
  FileText, 
  Printer, 
  MessageCircle, 
  Phone, 
  Sliders, 
  CheckCircle2, 
  Info, 
  Calendar,
  X,
  Send,
  ArrowRight
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
    { id: '1', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80', viewAngle: 'Hero Front' }
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
    <div className="space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-charcoal/60">
        <Link href="/" className="hover:text-charcoal transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-charcoal transition-colors">Catalogue</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category?.slug}`} className="hover:text-charcoal transition-colors">
          {product.category?.name}
        </Link>
        <span>/</span>
        <span className="text-charcoal font-medium">{product.name}</span>
      </nav>

      {/* Main Two-Column Product Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Visual Stage (Photography vs. 3D Model) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Media Mode Tabs */}
          <div className="flex items-center space-x-2 bg-ivory-200/60 p-1.5 rounded-2xl w-fit border border-ivory-300">
            <button
              onClick={() => setActiveMediaTab('photos')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeMediaTab === 'photos'
                  ? 'bg-white text-charcoal shadow-sm'
                  : 'text-charcoal/70 hover:text-charcoal'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-walnut" />
              <span>Photography Gallery ({images.length})</span>
            </button>

            {threeDAsset && (
              <button
                onClick={() => setActiveMediaTab('3d')}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeMediaTab === '3d'
                    ? 'bg-charcoal text-white shadow-sm'
                    : 'text-charcoal/70 hover:text-charcoal'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-gold" />
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
                initialHeight="h-[480px] sm:h-[580px]"
              />
              <div className="text-[11px] text-charcoal/60 text-center flex items-center justify-center space-x-2 pt-1">
                <Info className="w-3 h-3 text-gold" />
                <span>Drag with mouse or swipe to rotate • Pinch or scroll to inspect upholstery contour</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Primary High-Resolution Display */}
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-ivory-300 shadow-luxury">
                <img
                  src={images[activeImageIndex]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {images[activeImageIndex]?.viewAngle && (
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-charcoal/80 text-ivory-100 backdrop-blur-md text-[11px] font-medium rounded-full">
                      Angle: {images[activeImageIndex]?.viewAngle}
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img: any, idx: number) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-24 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        activeImageIndex === idx ? 'border-gold shadow-md' : 'border-ivory-300 opacity-70 hover:opacity-100'
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
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-charcoal text-ivory-100">
                {product.sku}
              </span>
              {product.collection && (
                <span className="text-xs font-bold uppercase tracking-wider text-gold">
                  {product.collection.name}
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-medium">
              {product.name}
            </h1>

            {product.tagline && (
              <p className="text-sm font-serif italic text-walnut">
                &ldquo;{product.tagline}&rdquo;
              </p>
            )}
          </div>

          <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed">
            {product.description}
          </p>

          {/* Quick Specification Badges */}
          <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-ivory-300 text-xs">
            <div>
              <span className="text-walnut font-medium block">Seating Capacity:</span>
              <span className="font-semibold text-charcoal">{product.seatingCapacity || 'Custom Seater'}</span>
            </div>
            <div>
              <span className="text-walnut font-medium block">Standard Dimensions:</span>
              <span className="font-semibold text-charcoal">{product.dimensionsSummary || 'Custom CAD Blueprint'}</span>
            </div>
            <div>
              <span className="text-walnut font-medium block">Structural Frame:</span>
              <span className="font-semibold text-charcoal truncate block">{product.frameMaterial || 'Kiln-Dried Teak/Sal'}</span>
            </div>
            <div>
              <span className="text-walnut font-medium block">Cushion Core:</span>
              <span className="font-semibold text-charcoal truncate block">{product.foamDensity || '45D HR Foam'}</span>
            </div>
          </div>

          {/* Available Fabric Swatches Selector */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-charcoal">Recommended Swatch:</span>
              <span className="text-gold font-medium">{selectedSwatch || 'Select Fabric'}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {fabricSwatches.map((sw) => (
                <button
                  key={sw.id}
                  onClick={() => {
                    setSelectedSwatch(sw.name);
                    setQuoteForm((prev) => ({ ...prev, fabricPreference: sw.name }));
                  }}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    selectedSwatch === sw.name ? 'scale-110 border-charcoal shadow-md ring-2 ring-gold/50' : 'border-white shadow-sm'
                  }`}
                  style={{ backgroundColor: sw.colorHex }}
                  title={`${sw.name} (${sw.weaveType})`}
                />
              ))}
            </div>
          </div>

          {/* Primary Action Buttons (STRICTLY NO E-COMMERCE / CHECKOUT) */}
          <div className="space-y-3 pt-4 border-t border-ivory-300">
            <button
              onClick={() => setShowQuoteModal(true)}
              className="w-full py-4 rounded-full bg-charcoal text-ivory-100 hover:bg-charcoal-light hover:text-gold text-xs uppercase tracking-widest font-semibold transition-all shadow-luxury border border-charcoal flex items-center justify-center space-x-2"
            >
              <FileText className="w-4 h-4 text-gold" />
              <span>Request Custom Quotation</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href={`/studio?baseProduct=${product.id}`}
                className="py-3 px-4 rounded-xl bg-gold/15 hover:bg-gold/25 text-walnut text-xs font-semibold uppercase tracking-wider text-center transition-colors flex items-center justify-center space-x-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Customize Design</span>
              </Link>

              <a
                href={`https://wa.me/919897023456?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider text-center transition-colors flex items-center justify-center space-x-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Atelier</span>
              </a>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                onClick={() => setShowSpecSheetModal(true)}
                className="inline-flex items-center space-x-1 text-walnut hover:text-charcoal underline"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>View / Print Spec Sheet</span>
              </button>

              <Link
                href="/consultation"
                className="inline-flex items-center space-x-1 text-gold hover:text-gold-dark font-medium underline"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Showroom Inspection</span>
              </Link>
            </div>
          </div>

          {/* Absolute Assurance Box */}
          <div className="bg-ivory-50 p-4 rounded-xl border border-ivory-300 space-y-2 text-xs text-charcoal/80">
            <div className="flex items-center space-x-2 text-emerald-800 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>10-Year Solid Hardwood Frame Guarantee</span>
            </div>
            <p className="text-[11px] text-charcoal/70 leading-relaxed">
              Every sofa and chair is custom-manufactured in Agra. We do not sell mass-produced imported stock. All commercial agreements are verified offline with bank transfer receipts.
            </p>
          </div>
        </div>
      </div>

      {/* Technical Specifications Matrix */}
      <div className="bg-white rounded-3xl p-8 md:p-12 border border-ivory-300 shadow-luxury space-y-8">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-gold">Manufacturing Details</span>
          <h2 className="font-serif text-2xl md:text-3xl text-charcoal font-semibold mt-1">
            Technical Specifications &amp; Craftsmanship
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Dimensions */}
          <div className="space-y-3 bg-ivory-50/50 p-5 rounded-2xl border border-ivory-200">
            <div className="flex items-center space-x-2 text-walnut">
              <Ruler className="w-4 h-4 text-gold" />
              <h3 className="font-serif font-semibold text-base text-charcoal">Dimensions &amp; Ergonomics</h3>
            </div>
            <ul className="space-y-1.5 text-xs text-charcoal/80">
              <li><strong>Overall Dimensions:</strong> {product.dimensionsSummary || 'Custom configured'}</li>
              <li><strong>Width:</strong> {product.widthCm ? `${product.widthCm} cm` : 'Bespoke'}</li>
              <li><strong>Depth:</strong> {product.depthCm ? `${product.depthCm} cm` : 'Bespoke'}</li>
              <li><strong>Height:</strong> {product.heightCm ? `${product.heightCm} cm` : 'Bespoke'}</li>
              <li><strong>Seat Height:</strong> {product.seatHeightCm ? `${product.seatHeightCm} cm` : '17.5" Standard'}</li>
            </ul>
          </div>

          {/* Frame & Wood */}
          <div className="space-y-3 bg-ivory-50/50 p-5 rounded-2xl border border-ivory-200">
            <div className="flex items-center space-x-2 text-walnut">
              <Layers className="w-4 h-4 text-gold" />
              <h3 className="font-serif font-semibold text-base text-charcoal">Frame &amp; Joinery</h3>
            </div>
            <ul className="space-y-1.5 text-xs text-charcoal/80">
              <li><strong>Structural Timber:</strong> {product.frameMaterial || 'Kiln-Dried Salwood & Teak'}</li>
              <li><strong>Moisture Control:</strong> Under 10% Kiln-Seasoned</li>
              <li><strong>Joinery:</strong> Double-doweled mortise and tenon with corner glue blocks</li>
              <li><strong>Suspension:</strong> {product.suspension || 'High tensile zig-zag steel springs with cross-webbing'}</li>
              <li><strong>Leg / Plinth Finish:</strong> {product.legFinish || 'Turned solid walnut with brass ferrules'}</li>
            </ul>
          </div>

          {/* Cushioning & Upholstery */}
          <div className="space-y-3 bg-ivory-50/50 p-5 rounded-2xl border border-ivory-200">
            <div className="flex items-center space-x-2 text-walnut">
              <Sparkles className="w-4 h-4 text-gold" />
              <h3 className="font-serif font-semibold text-base text-charcoal">Comfort &amp; Upholstery</h3>
            </div>
            <ul className="space-y-1.5 text-xs text-charcoal/80">
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
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-gold">Complementary Silhouettes</span>
              <h2 className="font-serif text-2xl text-charcoal font-semibold mt-1">Related Designs in Collection</h2>
            </div>
            <Link href="/products" className="text-xs font-semibold text-walnut hover:text-charcoal uppercase tracking-wider flex items-center space-x-1">
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
        <div className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-150">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-ivory-300 text-charcoal relative">
            <div className="flex items-start justify-between pb-3 border-b border-ivory-200">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold">Official Request</span>
                <h3 className="font-serif text-xl font-semibold mt-0.5">Request Custom Quotation</h3>
                <p className="text-xs text-charcoal/70 mt-0.5">{product.name} ({product.sku})</p>
              </div>
              <button onClick={() => { setShowQuoteModal(false); setQuoteSuccess(null); }} className="text-charcoal/50 hover:text-charcoal">
                <X className="w-5 h-5" />
              </button>
            </div>

            {quoteSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-xl font-medium">Quotation Request Received!</h4>
                <p className="text-xs text-charcoal/70 max-w-xs mx-auto">
                  Our atelier design consultant will review your specifications and contact you with custom drawings and offline pricing schedule.
                </p>
                <div className="bg-ivory-50 p-3 rounded-xl border border-ivory-300 text-xs font-mono font-semibold">
                  Reference: {quoteSuccess}
                </div>
                <button
                  onClick={() => { setShowQuoteModal(false); setQuoteSuccess(null); }}
                  className="px-6 py-2.5 bg-charcoal text-white rounded-xl text-xs font-semibold uppercase tracking-wider"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block text-walnut font-medium mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={quoteForm.name}
                    onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-charcoal focus:outline-none focus:border-gold"
                    placeholder="e.g. Radhika Sharma"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-walnut font-medium mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={quoteForm.phone}
                      onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-charcoal focus:outline-none focus:border-gold"
                      placeholder="+91 98970 00000"
                    />
                  </div>
                  <div>
                    <label className="block text-walnut font-medium mb-1">Delivery City</label>
                    <input
                      type="text"
                      value={quoteForm.city}
                      onChange={(e) => setQuoteForm({ ...quoteForm, city: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-charcoal focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-walnut font-medium mb-1">Custom Dimensions or Adjustments</label>
                  <input
                    type="text"
                    value={quoteForm.dimensionsNote}
                    onChange={(e) => setQuoteForm({ ...quoteForm, dimensionsNote: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-charcoal focus:outline-none focus:border-gold"
                    placeholder="e.g. Standard 88-inch or 10-foot bay window customization"
                  />
                </div>

                <div>
                  <label className="block text-walnut font-medium mb-1">Preferred Fabric &amp; Colour</label>
                  <input
                    type="text"
                    value={quoteForm.fabricPreference}
                    onChange={(e) => setQuoteForm({ ...quoteForm, fabricPreference: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-charcoal focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-walnut font-medium mb-1">Additional Project Notes</label>
                  <textarea
                    rows={2}
                    value={quoteForm.notes}
                    onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-50 border border-ivory-300 text-charcoal focus:outline-none focus:border-gold"
                    placeholder="Floor details, timeline, or matching living room armchairs..."
                  />
                </div>

                <div className="pt-3 border-t border-ivory-200">
                  <button
                    type="submit"
                    disabled={submittingQuote}
                    className="w-full py-3.5 bg-charcoal hover:bg-charcoal-light text-white font-semibold rounded-xl text-xs uppercase tracking-widest transition-colors flex items-center justify-center space-x-2"
                  >
                    <Send className="w-3.5 h-3.5 text-gold" />
                    <span>{submittingQuote ? 'Submitting to Atelier...' : 'Submit Quotation Request'}</span>
                  </button>
                  <p className="text-[10px] text-charcoal/60 text-center mt-2">
                    No online payment required. Formal quote and CAD draft delivered offline.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Specification Sheet Modal / Printable View */}
      {showSpecSheetModal && (
        <div className="fixed inset-0 z-50 bg-charcoal/80 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center overflow-y-auto">
          <div className="bg-white max-w-3xl w-full rounded-3xl p-8 shadow-2xl border border-ivory-300 text-charcoal relative max-h-[90vh] overflow-y-auto print:m-0 print:p-0">
            <div className="flex items-start justify-between pb-4 border-b border-ivory-300 mb-6 print:hidden">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-gold" />
                <span className="font-serif text-lg font-semibold">Atelier Architectural Specification Sheet</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-charcoal text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
                <button onClick={() => setShowSpecSheetModal(false)} className="text-charcoal/50 hover:text-charcoal p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Spec Sheet Document Content */}
            <div className="space-y-6 text-xs font-sans">
              <div className="border-b border-charcoal pb-4 flex justify-between items-end">
                <div>
                  <h3 className="font-serif text-2xl font-bold uppercase tracking-tight">PRADEEP FURNITURE ATELIER</h3>
                  <p className="text-walnut text-[11px] font-medium">Bespoke Upholstered Seating &amp; Architectural Manufacturing</p>
                  <p className="text-charcoal/60 text-[10px] mt-0.5">Bodla Industrial Compound &amp; Civil Lines Showroom, Agra, UP</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold block">{product.sku}</span>
                  <span className="text-[10px] text-charcoal/60">DATE: {new Date().toLocaleDateString('en-GB')}</span>
                </div>
              </div>

              <div>
                <h4 className="font-serif text-xl font-semibold text-charcoal">{product.name}</h4>
                <p className="text-xs text-charcoal/70 italic mt-0.5">{product.tagline}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border border-ivory-300 p-4 rounded-xl bg-ivory-50">
                <div>
                  <strong className="block text-walnut">Category:</strong> {product.category?.name}
                </div>
                <div>
                  <strong className="block text-walnut">Collection:</strong> {product.collection?.name || 'Atelier Signature'}
                </div>
                <div>
                  <strong className="block text-walnut">Seating Capacity:</strong> {product.seatingCapacity}
                </div>
                <div>
                  <strong className="block text-walnut">Dimensions:</strong> {product.dimensionsSummary}
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="font-serif text-sm font-semibold border-b border-ivory-200 pb-1">Framing &amp; Engineering</h5>
                <p><strong>Timber Skeleton:</strong> {product.frameMaterial}</p>
                <p><strong>Moisture Level:</strong> Seasoned &amp; Kiln-Dried below 10%</p>
                <p><strong>Suspension System:</strong> {product.suspension}</p>
                <p><strong>Core Foam:</strong> {product.foamDensity}</p>
                <p><strong>Plinth / Feet:</strong> {product.legFinish}</p>
              </div>

              <div className="space-y-2">
                <h5 className="font-serif text-sm font-semibold border-b border-ivory-200 pb-1">Upholstery &amp; Fabric</h5>
                <p><strong>Fabric Specification:</strong> {product.upholsteryType}</p>
                <p><strong>Martindale Rub Count:</strong> 45,000 - 65,000 Contract Grade Standard</p>
                <p><strong>Stitching:</strong> Heavy-duty bonded nylon thread with French topstitching</p>
              </div>

              <div className="pt-4 border-t border-charcoal text-[11px] text-charcoal/70 flex justify-between">
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
