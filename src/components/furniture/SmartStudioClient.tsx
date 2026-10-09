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

    return `${width}" Width x ${depth}" Depth x ${height}" Height (Seat Height: 17.5")`;
  }, [layout, seating]);

  // Manufacturer Compatibility Rule Check
  const compatibilityAlerts = useMemo(() => {
    const alerts: string[] = [];
    if (backrest === 'Deep Diamond Tufted' && armrest === 'Slim Tailored') {
      alerts.push('Note: Deep diamond tufting is traditionally constructed with rolled shelter arms for optimum fabric pleating tension.');
    }
    if (layout === 'Curved Panoramic' && legFinish === 'Turned Walnut with Brass') {
      alerts.push('Recommendation: Curved panoramic silhouettes achieve optimal structural balance with a Concealed Shadow Plinth base.');
    }
    return alerts;
  }, [backrest, armrest, layout, legFinish]);

  // Save current config into slot B for comparison
  const handleSaveToB = () => {
    setConfigB({
      productName: currentProduct.name,
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
          productId: currentProduct.id,
          productTitle: currentProduct.name,
          customerName: quoteForm.name,
          customerPhone: quoteForm.phone,
          customerEmail: quoteForm.email,
          city: quoteForm.city,
          notes: `Custom Studio Configuration for ${currentProduct.name}: Layout=${layout}, Seating=${seating}, Fabric=${selectedFabric}, Comfort=${comfort}, Armrests=${armrest}, Backrest=${backrest}, Base=${legFinish}. Dimensions=${estimatedDimensions}. Client Notes: ${quoteForm.notes}`,
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
    <div className="space-y-10">
      {/* Studio Header Bar */}
      <div className="bg-white rounded-2xl p-5 border border-ivory-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <label className="text-xs font-semibold text-walnut whitespace-nowrap">Base Model:</label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full md:w-72 px-3 py-2 rounded-xl bg-ivory-50 border border-ivory-300 text-xs font-serif font-medium text-charcoal focus:outline-none focus:border-gold"
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
            className="px-4 py-2 bg-ivory-100 hover:bg-ivory-200 text-charcoal rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Scale className="w-3.5 h-3.5 text-walnut" />
            <span>Save to Compare ({configB ? 'Ready' : 'Slot B'})</span>
          </button>

          <button
            onClick={() => setShowQuoteModal(true)}
            className="px-5 py-2 bg-charcoal hover:bg-charcoal-light text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5 text-gold" />
            <span>Request Quotation</span>
          </button>
        </div>
      </div>

      {/* Main Studio Workstation: 3D Stage + Configuration Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 3D Geometry Stage & Live Calculated Specs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-ivory-300 shadow-luxury space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold">3D Digital Mockup</span>
                <h3 className="font-serif text-xl font-medium text-charcoal">{currentProduct.name}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-semibold flex items-center space-x-1 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>1:1 Photo &amp; 3D Match</span>
                </span>
                <span className="text-xs font-mono bg-ivory-100 px-2.5 py-1 rounded-full text-charcoal border border-ivory-200">
                  {currentProduct.sku}
                </span>
              </div>
            </div>

            {/* Interactive 3D Model Viewport */}
            <InteractiveFurnitureViewer
              asset={currentProduct.threeDAsset}
              productTitle={currentProduct.name}
              initialHeight="h-[460px] sm:h-[520px]"
            />

            <div className="bg-ivory-50 p-4 rounded-2xl border border-ivory-200 text-xs space-y-1.5 text-charcoal/80">
              <div className="flex justify-between">
                <span className="text-walnut font-medium">Calculated Dimensions:</span>
                <span className="font-semibold text-charcoal">{estimatedDimensions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-walnut font-medium">Layout &amp; Seating:</span>
                <span>{layout} • {seating}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-walnut font-medium">Selected Upholstery:</span>
                <span className="text-gold font-semibold">{selectedFabric}</span>
              </div>
              <div className="text-[11px] text-charcoal/60 pt-1 italic">
                *Visual 3D model illustrates ergonomic volume. Physical carpentry in our workshop executes exact tailored dimensions.
              </div>
            </div>
          </div>

          {/* Compatibility Alerts Notice */}
          {compatibilityAlerts.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-1">
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
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-ivory-300 shadow-luxury space-y-6">
          <div className="border-b border-ivory-200 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gold">Tailor Attributes</span>
            <h3 className="font-serif text-2xl font-semibold text-charcoal mt-0.5">Configuration Studio</h3>
          </div>

          {/* 1. Layout & Shape */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-walnut uppercase tracking-wider">1. Silhouette Layout</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['Straight', 'L-Shape Left', 'L-Shape Right', 'Curved Panoramic', 'U-Shape'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setLayout(opt as any)}
                  className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                    layout === opt ? 'border-gold bg-cream text-charcoal font-bold shadow-sm' : 'border-ivory-300 hover:bg-ivory-50 text-charcoal'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Seating Capacity */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-walnut uppercase tracking-wider">2. Seating Capacity</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['2 Seater', '3 Seater', '4 Seater', '6 Seater Modular'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSeating(opt as any)}
                  className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                    seating === opt ? 'border-gold bg-cream text-charcoal font-bold shadow-sm' : 'border-ivory-300 hover:bg-ivory-50 text-charcoal'
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
              <label className="font-semibold text-walnut uppercase tracking-wider">3. Fabric Swatch</label>
              <span className="text-gold font-semibold">{selectedFabric}</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {fabricSwatches.map((sw) => (
                <button
                  key={sw.id}
                  type="button"
                  onClick={() => setSelectedFabric(sw.name)}
                  className={`w-9 h-9 rounded-full border-2 transition-transform ${
                    selectedFabric === sw.name ? 'scale-110 border-charcoal shadow-md ring-2 ring-gold/50' : 'border-white shadow-sm'
                  }`}
                  style={{ backgroundColor: sw.colorHex }}
                  title={`${sw.name} (${sw.weaveType})`}
                />
              ))}
            </div>
          </div>

          {/* 4. Cushion Comfort */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-walnut uppercase tracking-wider">4. Cushion Comfort</label>
            <div className="space-y-1.5 text-xs">
              {['Medium Balanced (45D)', 'Plush Cloud with Down', 'Firm Ortho-Support (50D)'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setComfort(opt as any)}
                  className={`w-full p-2.5 rounded-xl border text-left font-medium transition-all ${
                    comfort === opt ? 'border-gold bg-cream text-charcoal font-bold shadow-sm' : 'border-ivory-300 hover:bg-ivory-50 text-charcoal'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Armrest Style */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-walnut uppercase tracking-wider">5. Armrest Silhouette</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['Curved Architectural', 'Slim Tailored', 'Chesterfield Rolled', 'Track Arm'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setArmrest(opt as any)}
                  className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                    armrest === opt ? 'border-gold bg-cream text-charcoal font-bold shadow-sm' : 'border-ivory-300 hover:bg-ivory-50 text-charcoal'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Backrest Style */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-walnut uppercase tracking-wider">6. Backrest Craftsmanship</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['Channel Fluted', 'Deep Diamond Tufted', 'Smooth Clean Cushion', 'Low Italian Bolster'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setBackrest(opt as any)}
                  className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                    backrest === opt ? 'border-gold bg-cream text-charcoal font-bold shadow-sm' : 'border-ivory-300 hover:bg-ivory-50 text-charcoal'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 7. Leg & Plinth Finish */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-walnut uppercase tracking-wider">7. Leg / Plinth Foundation</label>
            <div className="space-y-1.5 text-xs">
              {['Turned Walnut with Brass', 'Concealed Shadow Plinth', 'Brushed Gold Titanium', 'Ebonized Black Oak'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setLegFinish(opt as any)}
                  className={`w-full p-2.5 rounded-xl border text-left font-medium transition-all ${
                    legFinish === opt ? 'border-gold bg-cream text-charcoal font-bold shadow-sm' : 'border-ivory-300 hover:bg-ivory-50 text-charcoal'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-ivory-200 space-y-2">
            <button
              onClick={() => setShowQuoteModal(true)}
              className="w-full py-4 rounded-xl bg-charcoal hover:bg-charcoal-light text-white text-xs font-semibold uppercase tracking-widest transition-colors flex items-center justify-center space-x-2 shadow-luxury"
            >
              <Send className="w-4 h-4 text-gold" />
              <span>Submit Configuration for Quote</span>
            </button>

            <Link
              href={`/custom-design?product=${currentProduct.id}`}
              className="w-full block py-2.5 text-center text-xs text-walnut hover:text-charcoal underline"
            >
              Have a sketch of this? Upload in Full Wizard →
            </Link>
          </div>
        </div>
      </div>

      {/* Side-by-Side Configuration Comparison (Config A vs Config B) */}
      {showCompare && configB && (
        <div className="bg-white rounded-3xl p-8 border border-ivory-300 shadow-luxury space-y-6">
          <div className="flex items-center justify-between border-b border-ivory-200 pb-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-gold">Section 9 Feature</span>
              <h3 className="font-serif text-2xl font-semibold text-charcoal mt-0.5">Compare Two Configurations</h3>
            </div>
            <button
              onClick={() => setShowCompare(false)}
              className="text-xs text-walnut hover:text-charcoal underline"
            >
              Close Comparison
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8 text-xs">
            {/* Slot A */}
            <div className="space-y-3 bg-ivory-50 p-5 rounded-2xl border border-gold/40">
              <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
                <span className="font-serif text-lg font-bold text-charcoal">Configuration A (Active)</span>
                <span className="text-[10px] bg-charcoal text-white px-2 py-0.5 rounded font-mono">Current</span>
              </div>
              <p><strong>Layout:</strong> {layout}</p>
              <p><strong>Seating:</strong> {seating}</p>
              <p><strong>Fabric:</strong> {selectedFabric}</p>
              <p><strong>Comfort Core:</strong> {comfort}</p>
              <p><strong>Armrest:</strong> {armrest}</p>
              <p><strong>Backrest:</strong> {backrest}</p>
              <p><strong>Base Plinth:</strong> {legFinish}</p>
              <p><strong>Calculated Dimensions:</strong> {estimatedDimensions}</p>
            </div>

            {/* Slot B */}
            <div className="space-y-3 bg-white p-5 rounded-2xl border border-ivory-300">
              <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
                <span className="font-serif text-lg font-bold text-charcoal">Configuration B (Saved)</span>
                <span className="text-[10px] bg-ivory-200 text-charcoal px-2 py-0.5 rounded font-mono">Saved Slot</span>
              </div>
              <p><strong>Layout:</strong> {configB.layout}</p>
              <p><strong>Seating:</strong> {configB.seating}</p>
              <p><strong>Fabric:</strong> {configB.fabric}</p>
              <p><strong>Comfort Core:</strong> {configB.comfort}</p>
              <p><strong>Armrest:</strong> {configB.armrest}</p>
              <p><strong>Backrest:</strong> {configB.backrest}</p>
              <p><strong>Base Plinth:</strong> {configB.legFinish}</p>
              <p><strong>Calculated Dimensions:</strong> {configB.dimensions}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quotation Request Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-150">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-ivory-300 text-charcoal relative">
            <div className="flex items-start justify-between pb-3 border-b border-ivory-200">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold">Direct Atelier RFQ</span>
                <h3 className="font-serif text-xl font-semibold mt-0.5">Request Studio Quotation</h3>
                <p className="text-xs text-charcoal/70 mt-0.5">{currentProduct.name} ({estimatedDimensions})</p>
              </div>
              <button
                onClick={() => { setShowQuoteModal(false); setQuoteSuccess(null); }}
                className="text-charcoal/50 hover:text-charcoal"
              >
                ✕
              </button>
            </div>

            {quoteSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-xl font-medium">Configuration Received!</h4>
                <p className="text-xs text-charcoal/70 max-w-xs mx-auto">
                  Our draftsmen will prepare the formal quotation schedule and contact you directly.
                </p>
                <div className="bg-ivory-50 p-3 rounded-xl border border-ivory-300 text-xs font-mono font-semibold">
                  Reference: {quoteSuccess}
                </div>
                <button
                  onClick={() => { setShowQuoteModal(false); setQuoteSuccess(null); }}
                  className="px-6 py-2.5 bg-charcoal text-white rounded-xl text-xs font-semibold uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block text-walnut font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={quoteForm.name}
                    onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 focus:outline-none focus:border-gold"
                    placeholder="e.g. Anand Mehra"
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
                      className="w-full px-3 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 focus:outline-none focus:border-gold"
                      placeholder="+91 98970 00000"
                    />
                  </div>
                  <div>
                    <label className="block text-walnut font-medium mb-1">Delivery City</label>
                    <input
                      type="text"
                      value={quoteForm.city}
                      onChange={(e) => setQuoteForm({ ...quoteForm, city: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-walnut font-medium mb-1">Special Instructions</label>
                  <textarea
                    rows={2}
                    value={quoteForm.notes}
                    onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-50 border border-ivory-300 focus:outline-none focus:border-gold"
                    placeholder="Floor details, specific door clearances, or foam preferences..."
                  />
                </div>

                <div className="pt-3 border-t border-ivory-200">
                  <button
                    type="submit"
                    disabled={submittingQuote}
                    className="w-full py-3.5 bg-charcoal hover:bg-charcoal-light text-white font-semibold rounded-xl text-xs uppercase tracking-widest transition-colors flex items-center justify-center space-x-2"
                  >
                    <Send className="w-3.5 h-3.5 text-gold" />
                    <span>{submittingQuote ? 'Transmitting to Atelier...' : 'Submit Studio Configuration'}</span>
                  </button>
                  <p className="text-[10px] text-charcoal/60 text-center mt-2">
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
