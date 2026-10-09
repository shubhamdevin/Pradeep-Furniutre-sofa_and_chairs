'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import InteractiveFurnitureViewer from '@/components/three-d/InteractiveFurnitureViewer';
import { 
  Sparkles, 
  Sliders, 
  CheckCircle2, 
  Scale, 
  FileText, 
  ShieldCheck, 
  Info, 
  Send, 
  RotateCcw,
  Check,
  AlertTriangle
} from 'lucide-react';

interface Props {
  products: any[];
  fabricSwatches: any[];
  initialProductId?: string;
}

export default function SmartStudioClient({
  products,
  fabricSwatches,
  initialProductId,
}: Props) {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProductId || products[0]?.id || ''
  );

  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // Configuration A (Active)
  const [layout, setLayout] = useState<'Straight' | 'L-Shape Left' | 'L-Shape Right' | 'Curved Panoramic' | 'U-Shape'>('Straight');
  const [seating, setSeating] = useState<'2 Seater' | '3 Seater' | '4 Seater' | '6 Seater Modular'>('3 Seater');
  const [selectedFabric, setSelectedFabric] = useState(fabricSwatches[0]?.name || 'Belgian Luxe Velvet');
  const [comfort, setComfort] = useState<'Medium Balanced (45D)' | 'Plush Cloud with Down' | 'Firm Ortho-Support (50D)'>('Medium Balanced (45D)');
  const [armrest, setArmrest] = useState<'Curved Architectural' | 'Slim Tailored' | 'Chesterfield Rolled' | 'Track Arm'>('Curved Architectural');
  const [backrest, setBackrest] = useState<'Channel Fluted' | 'Deep Diamond Tufted' | 'Smooth Clean Cushion' | 'Low Italian Bolster'>('Smooth Clean Cushion');
  const [legFinish, setLegFinish] = useState<'Turned Walnut with Brass' | 'Concealed Shadow Plinth' | 'Brushed Gold Titanium' | 'Ebonized Black Oak'>('Turned Walnut with Brass');

  // Saved Config B for comparison
  const [configB, setConfigB] = useState<any | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  // Quote Form
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Agra',
    notes: '',
  });
  const [submittingQuote, setSubmittingQuote] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState<string | null>(null);

  // Dynamic Calculated Dimensions
  const estimatedDimensions = useMemo(() => {
    let width = 88;
    let depth = 38;
    let height = 32;

    if (seating === '2 Seater') width = 68;
    if (seating === '3 Seater') width = 88;
    if (seating === '4 Seater') width = 108;
    if (seating === '6 Seater Modular') width = 136;

    if (layout.includes('L-Shape')) depth = 64;
    if (layout === 'U-Shape') {
      depth = 84;
      width = Math.max(width, 132);
    }
    if (layout === 'Curved Panoramic') {
      width = Math.max(width, 120);
      depth = 46;
    }

    return `${width}" W × ${depth}" D × ${height}" H (Seat Height: 17.5")`;
  }, [layout, seating]);

  // Manufacturer Compatibility Rule Check
  const compatibilityAlerts = useMemo(() => {
    const alerts: string[] = [];
    if (backrest === 'Deep Diamond Tufted' && armrest === 'Slim Tailored') {
      alerts.push('Engineering Note: Deep diamond tufting is engineered with rolled shelter arms for optimum upholstery tension.');
    }
    if (layout === 'Curved Panoramic' && legFinish === 'Turned Walnut with Brass') {
      alerts.push('Recommendation: Curved panoramic silhouettes achieve optimal structural balance with a Concealed Shadow Plinth foundation.');
    }
    return alerts;
  }, [backrest, armrest, layout, legFinish]);

  // Save current config into slot B for comparison
  const handleSaveToB = () => {
    setConfigB({
      productName: currentProduct?.name || 'Custom Specimen',
      layout,
      seating,
      fabric: selectedFabric,
      comfort,
      armrest,
      backrest,
      legFinish,
      dimensions: estimatedDimensions,
    });
    setShowCompare(true);
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingQuote(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'CUSTOM_STUDIO',
          productId: currentProduct?.id,
          productTitle: currentProduct?.name,
          customerName: quoteForm.name,
          customerPhone: quoteForm.phone,
          customerEmail: quoteForm.email,
          city: quoteForm.city,
          notes: `Custom Studio Configuration for ${currentProduct?.name}: Layout=${layout}, Seating=${seating}, Fabric=${selectedFabric}, Comfort=${comfort}, Armrests=${armrest}, Backrest=${backrest}, Base=${legFinish}. Dimensions=${estimatedDimensions}. Client Notes: ${quoteForm.notes}`,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setQuoteSuccess(data.leadCode || 'LEAD-CONFIRMED');
      } else {
        alert(data.error || 'Failed to submit enquiry.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again.');
    } finally {
      setSubmittingQuote(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Studio Header Bar */}
      <div className="bg-white rounded-lg p-5 border border-platinum-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <label className="text-xs font-semibold text-slate-dark uppercase tracking-wider whitespace-nowrap">
            Base Model:
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full md:w-80 px-3.5 py-2.5 rounded-md bg-platinum-soft border border-platinum-border text-xs font-medium text-graphite focus:outline-none focus:border-graphite"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sku})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <button
            onClick={handleSaveToB}
            className="px-4 py-2.5 bg-platinum hover:bg-platinum-soft text-graphite border border-platinum-border rounded-md text-xs font-medium flex items-center space-x-1.5 transition-colors"
          >
            <Scale className="w-3.5 h-3.5 text-slate-muted" />
            <span>Save to Compare ({configB ? 'Ready' : 'Slot B'})</span>
          </button>

          <button
            onClick={() => setShowQuoteModal(true)}
            className="px-5 py-2.5 bg-graphite hover:bg-graphite-hover text-white rounded-md text-xs font-medium uppercase tracking-wider flex items-center space-x-1.5 transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5 text-slate-silver" />
            <span>Request Quotation</span>
          </button>
        </div>
      </div>

      {/* Main Studio Workstation: 3D Stage + Configuration Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 3D Geometry Stage & Live Calculated Specs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-lg p-6 border border-platinum-border shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-muted">3D Digital Mockup</span>
                <h3 className="font-serif text-2xl font-medium text-graphite">{currentProduct?.name}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>1:1 Photo &amp; 3D Match</span>
                </span>
                <span className="text-xs font-mono bg-platinum-soft px-2.5 py-1 rounded text-graphite border border-platinum-border">
                  {currentProduct?.sku}
                </span>
              </div>
            </div>

            {/* Interactive 3D Model Viewport */}
            <InteractiveFurnitureViewer
              asset={currentProduct?.threeDAsset}
              productTitle={currentProduct?.name || 'Sofa'}
              initialHeight="h-[460px] sm:h-[520px]"
            />

            <div className="bg-platinum-soft/70 p-4 rounded-md border border-platinum-border text-xs space-y-2 text-graphite/90">
              <div className="flex justify-between items-center pb-1.5 border-b border-platinum-border">
                <span className="text-slate-dark font-medium">Calculated Dimensions:</span>
                <span className="font-semibold text-graphite">{estimatedDimensions}</span>
              </div>
              <div className="flex justify-between items-center pb-1.5 border-b border-platinum-border">
                <span className="text-slate-dark font-medium">Layout &amp; Seating:</span>
                <span className="font-medium text-graphite">{layout} • {seating}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-dark font-medium">Selected Upholstery:</span>
                <span className="font-semibold text-graphite">{selectedFabric}</span>
              </div>
              <div className="text-[11px] text-slate-muted pt-1">
                *Visual 3D model illustrates ergonomic volume. Physical carpentry in our Agra workshop executes exact tailored millimeters.
              </div>
            </div>
          </div>

          {/* Compatibility Alerts Notice */}
          {compatibilityAlerts.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-md p-4 text-xs text-amber-900 space-y-1">
              <div className="flex items-center space-x-1.5 font-semibold text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Atelier Master Craftsman Advice:</span>
              </div>
              {compatibilityAlerts.map((alt, i) => (
                <p key={i} className="pl-5 text-amber-800/90 leading-relaxed">{alt}</p>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Customization Controls Panel */}
        <div className="lg:col-span-5 bg-white rounded-lg p-6 sm:p-8 border border-platinum-border shadow-sm space-y-6">
          <div className="border-b border-platinum-border pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-muted">Tailor Attributes</span>
            <h3 className="font-serif text-2xl font-medium text-graphite mt-0.5">Configuration Studio</h3>
          </div>

          {/* 1. Layout & Shape */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-dark uppercase tracking-wider">
              1. Silhouette Layout
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['Straight', 'L-Shape Left', 'L-Shape Right', 'Curved Panoramic', 'U-Shape'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setLayout(opt as any)}
                  className={`p-2.5 rounded-md border text-left font-medium transition-colors ${
                    layout === opt 
                      ? 'border-graphite bg-platinum-soft text-graphite font-semibold shadow-sm' 
                      : 'border-platinum-border hover:bg-platinum text-graphite/80'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Seating Capacity */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-dark uppercase tracking-wider">
              2. Seating Capacity
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['2 Seater', '3 Seater', '4 Seater', '6 Seater Modular'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSeating(opt as any)}
                  className={`p-2.5 rounded-md border text-left font-medium transition-colors ${
                    seating === opt 
                      ? 'border-graphite bg-platinum-soft text-graphite font-semibold shadow-sm' 
                      : 'border-platinum-border hover:bg-platinum text-graphite/80'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Fabric Swatch Picker */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-dark uppercase tracking-wider">3. Fabric Swatch</label>
              <span className="text-graphite font-semibold">{selectedFabric}</span>
            </div>
            <div className="flex flex-wrap gap-2.5 pt-1">
              {fabricSwatches.map((sw) => (
                <button
                  key={sw.id}
                  type="button"
                  onClick={() => setSelectedFabric(sw.name)}
                  className={`w-9 h-9 rounded-md border transition-transform ${
                    selectedFabric === sw.name 
                      ? 'scale-105 border-graphite shadow-sm ring-2 ring-slate-muted/50' 
                      : 'border-platinum-border shadow-none'
                  }`}
                  style={{ backgroundColor: sw.colorHex }}
                  title={`${sw.name} (${sw.weaveType})`}
                />
              ))}
            </div>
          </div>

          {/* 4. Cushion Comfort */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-dark uppercase tracking-wider">
              4. Cushion Comfort Core
            </label>
            <div className="space-y-1.5 text-xs">
              {['Medium Balanced (45D)', 'Plush Cloud with Down', 'Firm Ortho-Support (50D)'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setComfort(opt as any)}
                  className={`w-full p-2.5 rounded-md border text-left font-medium transition-colors ${
                    comfort === opt 
                      ? 'border-graphite bg-platinum-soft text-graphite font-semibold shadow-sm' 
                      : 'border-platinum-border hover:bg-platinum text-graphite/80'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Armrest Style */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-dark uppercase tracking-wider">
              5. Armrest Silhouette
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['Curved Architectural', 'Slim Tailored', 'Chesterfield Rolled', 'Track Arm'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setArmrest(opt as any)}
                  className={`p-2.5 rounded-md border text-left font-medium transition-colors ${
                    armrest === opt 
                      ? 'border-graphite bg-platinum-soft text-graphite font-semibold shadow-sm' 
                      : 'border-platinum-border hover:bg-platinum text-graphite/80'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Backrest Style */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-dark uppercase tracking-wider">
              6. Backrest Craftsmanship
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['Channel Fluted', 'Deep Diamond Tufted', 'Smooth Clean Cushion', 'Low Italian Bolster'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setBackrest(opt as any)}
                  className={`p-2.5 rounded-md border text-left font-medium transition-colors ${
                    backrest === opt 
                      ? 'border-graphite bg-platinum-soft text-graphite font-semibold shadow-sm' 
                      : 'border-platinum-border hover:bg-platinum text-graphite/80'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 7. Leg & Plinth Finish */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-dark uppercase tracking-wider">
              7. Foundation &amp; Plinth Base
            </label>
            <div className="space-y-1.5 text-xs">
              {['Turned Walnut with Brass', 'Concealed Shadow Plinth', 'Brushed Gold Titanium', 'Ebonized Black Oak'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setLegFinish(opt as any)}
                  className={`w-full p-2.5 rounded-md border text-left font-medium transition-colors ${
                    legFinish === opt 
                      ? 'border-graphite bg-platinum-soft text-graphite font-semibold shadow-sm' 
                      : 'border-platinum-border hover:bg-platinum text-graphite/80'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-platinum-border space-y-2.5">
            <button
              onClick={() => setShowQuoteModal(true)}
              className="w-full py-3.5 rounded-md bg-graphite hover:bg-graphite-hover text-white text-xs font-medium uppercase tracking-widest transition-colors flex items-center justify-center space-x-2 shadow-sm"
            >
              <Send className="w-3.5 h-3.5 text-slate-silver" />
              <span>Submit Configuration for Quote</span>
            </button>

            <Link
              href={`/custom-design?product=${currentProduct?.id}`}
              className="w-full block py-2 text-center text-xs text-slate-dark hover:text-graphite underline transition-colors"
            >
              Have external reference sketches? Upload in Design Wizard →
            </Link>
          </div>
        </div>
      </div>

      {/* Side-by-Side Configuration Comparison (Config A vs Config B) */}
      {showCompare && configB && (
        <div className="bg-white rounded-lg p-6 sm:p-8 border border-platinum-border shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-platinum-border pb-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-slate-muted">Design Comparison</span>
              <h3 className="font-serif text-2xl font-medium text-graphite mt-0.5">Compare Two Configurations</h3>
            </div>
            <button
              onClick={() => setShowCompare(false)}
              className="text-xs text-slate-dark hover:text-graphite underline font-medium"
            >
              Close Comparison
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Slot A */}
            <div className="space-y-3 bg-platinum-soft/50 p-5 rounded-md border border-platinum-border">
              <div className="flex items-center justify-between pb-2 border-b border-platinum-border">
                <span className="font-serif text-lg font-medium text-graphite">Configuration A (Active)</span>
                <span className="text-[10px] bg-graphite text-white px-2 py-0.5 rounded font-mono">Current</span>
              </div>
              <p><strong className="text-slate-dark font-medium">Layout:</strong> {layout}</p>
              <p><strong className="text-slate-dark font-medium">Seating:</strong> {seating}</p>
              <p><strong className="text-slate-dark font-medium">Fabric:</strong> {selectedFabric}</p>
              <p><strong className="text-slate-dark font-medium">Comfort Core:</strong> {comfort}</p>
              <p><strong className="text-slate-dark font-medium">Armrest:</strong> {armrest}</p>
              <p><strong className="text-slate-dark font-medium">Backrest:</strong> {backrest}</p>
              <p><strong className="text-slate-dark font-medium">Base Plinth:</strong> {legFinish}</p>
              <p><strong className="text-slate-dark font-medium">Calculated Dimensions:</strong> {estimatedDimensions}</p>
            </div>

            {/* Slot B */}
            <div className="space-y-3 bg-white p-5 rounded-md border border-platinum-border">
              <div className="flex items-center justify-between pb-2 border-b border-platinum-border">
                <span className="font-serif text-lg font-medium text-graphite">Configuration B (Saved)</span>
                <span className="text-[10px] bg-platinum-soft text-graphite px-2 py-0.5 rounded font-mono border border-platinum-border">
                  Saved Slot
                </span>
              </div>
              <p><strong className="text-slate-dark font-medium">Layout:</strong> {configB.layout}</p>
              <p><strong className="text-slate-dark font-medium">Seating:</strong> {configB.seating}</p>
              <p><strong className="text-slate-dark font-medium">Fabric:</strong> {configB.fabric}</p>
              <p><strong className="text-slate-dark font-medium">Comfort Core:</strong> {configB.comfort}</p>
              <p><strong className="text-slate-dark font-medium">Armrest:</strong> {configB.armrest}</p>
              <p><strong className="text-slate-dark font-medium">Backrest:</strong> {configB.backrest}</p>
              <p><strong className="text-slate-dark font-medium">Base Plinth:</strong> {configB.legFinish}</p>
              <p><strong className="text-slate-dark font-medium">Calculated Dimensions:</strong> {configB.dimensions}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quotation Request Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 bg-graphite-deep/80 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-150">
          <div className="bg-white max-w-lg w-full rounded-lg p-6 sm:p-8 shadow-2xl border border-platinum-border text-graphite relative">
            <div className="flex items-start justify-between pb-3 border-b border-platinum-border">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-muted">Direct Atelier RFQ</span>
                <h3 className="font-serif text-2xl font-medium mt-0.5 text-graphite">Request Studio Quotation</h3>
                <p className="text-xs text-slate-dark mt-0.5">{currentProduct?.name} ({estimatedDimensions})</p>
              </div>
              <button
                onClick={() => { setShowQuoteModal(false); setQuoteSuccess(null); }}
                className="text-slate-muted hover:text-graphite text-sm px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            {quoteSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                </div>
                <h4 className="font-serif text-2xl font-medium text-graphite">Configuration Received</h4>
                <p className="text-xs text-slate-dark max-w-xs mx-auto leading-relaxed">
                  Our draftsmen will review the technical parameters, prepare the formal quotation schedule, and connect with you.
                </p>
                <div className="bg-platinum-soft p-3 rounded-md border border-platinum-border text-xs font-mono font-semibold text-graphite">
                  Reference: {quoteSuccess}
                </div>
                <button
                  onClick={() => { setShowQuoteModal(false); setQuoteSuccess(null); }}
                  className="px-6 py-2.5 bg-graphite hover:bg-graphite-hover text-white rounded-md text-xs font-medium uppercase tracking-wider"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="mt-4 space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-dark font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={quoteForm.name}
                    onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-md bg-platinum-soft border border-platinum-border text-graphite focus:outline-none focus:border-graphite"
                    placeholder="e.g. Anand Mehra"
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
                      className="w-full px-3.5 py-2.5 rounded-md bg-platinum-soft border border-platinum-border text-graphite focus:outline-none focus:border-graphite"
                      placeholder="+91 98970 00000"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-dark font-medium mb-1">Delivery City</label>
                    <input
                      type="text"
                      value={quoteForm.city}
                      onChange={(e) => setQuoteForm({ ...quoteForm, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-md bg-platinum-soft border border-platinum-border text-graphite focus:outline-none focus:border-graphite"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-dark font-medium mb-1">Special Instructions</label>
                  <textarea
                    rows={2}
                    value={quoteForm.notes}
                    onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-md bg-platinum-soft border border-platinum-border text-graphite focus:outline-none focus:border-graphite"
                    placeholder="Floor details, specific door clearances, or foam preferences..."
                  />
                </div>

                <div className="pt-3 border-t border-platinum-border">
                  <button
                    type="submit"
                    disabled={submittingQuote}
                    className="w-full py-3.5 bg-graphite hover:bg-graphite-hover text-white font-medium rounded-md text-xs uppercase tracking-widest transition-colors flex items-center justify-center space-x-2"
                  >
                    <Send className="w-3.5 h-3.5 text-slate-silver" />
                    <span>{submittingQuote ? 'Transmitting to Atelier...' : 'Submit Studio Configuration'}</span>
                  </button>
                  <p className="text-[11px] text-slate-muted text-center mt-2">
                    Commercial transactions are finalized strictly offline through atelier bank agreement.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
