'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Printer, 
  Plus, 
  CheckCircle2, 
  Wrench, 
  Eye, 
  X, 
  DollarSign, 
  ShieldCheck, 
  Lock,
  ArrowRight,
  Send
} from 'lucide-react';

interface Props {
  initialQuotations: any[];
  customers: any[];
  leads: any[];
}

export default function QuotationsClient({ initialQuotations, customers, leads }: Props) {
  const [quotations, setQuotations] = useState(initialQuotations);
  const [selectedQuote, setSelectedQuote] = useState<any | null>(initialQuotations[0] || null);

  // Modals
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showNewQuoteModal, setShowNewQuoteModal] = useState(false);
  const [convertingJob, setConvertingJob] = useState(false);

  // New Quote Form
  const [newQuote, setNewQuote] = useState({
    customerId: customers[0]?.id || '',
    leadId: leads[0]?.id || '',
    itemDescription: 'Bespoke 3-Seater Sofa in Velvet',
    dimensions: '96"W x 38"D x 32"H',
    upholsterySpec: 'Belgian Luxe Velvet (V-EMR-01)',
    frameSpec: 'Solid Kiln-Dried CP Teakwood Frame',
    quantity: 1,
    unitEstimate: 125000,
    internalCost: 72000,
    deliveryWeeks: 4,
  });

  const handleCreateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: newQuote.customerId,
          leadId: newQuote.leadId || null,
          items: [
            {
              itemDescription: newQuote.itemDescription,
              dimensions: newQuote.dimensions,
              upholsterySpec: newQuote.upholsterySpec,
              frameSpec: newQuote.frameSpec,
              quantity: newQuote.quantity,
              unitEstimate: newQuote.unitEstimate,
              totalLineAmount: newQuote.unitEstimate * newQuote.quantity,
            },
          ],
          subtotal: newQuote.unitEstimate * newQuote.quantity,
          taxPercent: 18.0,
          shippingCost: 3500,
          deliveryLeadWeeks: newQuote.deliveryWeeks,
          internalEstimatedCost: newQuote.internalCost,
          internalProfitMargin: ((newQuote.unitEstimate - newQuote.internalCost) / newQuote.unitEstimate) * 100,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Quotation ${data.quoteNumber} created successfully!`);
        window.location.reload();
      } else {
        alert(data.error || 'Failed to create quotation.');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating quotation.');
    }
  };

  // Convert Quotation into Factory Manufacturing Job Card
  const handleConvertToJob = async () => {
    if (!selectedQuote) return;
    setConvertingJob(true);

    try {
      const firstItem = selectedQuote.items[0] || {};
      const res = await fetch('/api/manufacturing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: selectedQuote.customerId,
          quotationId: selectedQuote.id,
          designRevisionId: selectedQuote.designRevisionId || null,
          productTitle: firstItem.itemDescription || 'Bespoke Atelier Commission',
          quantity: firstItem.quantity || 1,
          exactDimensions: firstItem.dimensions || '96"W x 38"D x 32"H',
          frameInstructions: firstItem.frameSpec || 'Solid Kiln-Dried CP Teakwood Frame',
          foamSpecification: 'Base 50D ortho-support, middle 45D HR foam, top microfiber crown',
          fabricCodeAndColor: firstItem.upholsterySpec || 'Belgian Velvet',
          priority: 'STANDARD',
          targetCompletionWeeks: selectedQuote.deliveryLeadWeeks || 4,
          notes: `Converted from accepted quotation ${selectedQuote.quoteNumber}. Commercial agreement confirmed offline.`,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Manufacturing Job Card ${data.jobCardNumber} created! Production released to Bodla workshop.`);
        window.location.href = '/admin/manufacturing';
      } else {
        alert(data.error || 'Failed to convert to job.');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating manufacturing job.');
    } finally {
      setConvertingJob(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-ivory-300 shadow-sm">
        <span className="text-xs font-semibold text-charcoal">
          Total Quotations: <strong>{quotations.length}</strong>
        </span>
        <button
          onClick={() => setShowNewQuoteModal(true)}
          className="px-4 py-2 bg-charcoal hover:bg-charcoal-light text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 text-gold" />
          <span>Draft New Quotation</span>
        </button>
      </div>

      {/* Two-Column Quotation View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Quotes List */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-ivory-300 shadow-sm divide-y divide-ivory-200 max-h-[750px] overflow-y-auto">
          {quotations.map((q) => (
            <div
              key={q.id}
              onClick={() => setSelectedQuote(q)}
              className={`p-5 cursor-pointer transition-colors ${
                selectedQuote?.id === q.id ? 'bg-cream/40 border-l-4 border-gold' : 'hover:bg-ivory-50'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono font-bold text-charcoal">{q.quoteNumber}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  q.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {q.status}
                </span>
              </div>

              <h4 className="font-serif font-medium text-charcoal text-base">{q.customer.fullName}</h4>
              <p className="text-xs font-mono font-bold text-gold mt-0.5">
                ₹{q.totalEstimate.toLocaleString('en-IN')} (incl. GST)
              </p>

              <div className="mt-2 flex items-center justify-between text-[11px] text-walnut font-medium">
                <span>Items: {q.items?.length || 1}</span>
                <span>Lead Time: {q.deliveryLeadWeeks} Wks</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Quote Details Stage */}
        {selectedQuote ? (
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-ivory-300 shadow-luxury space-y-6">
            <div className="flex items-start justify-between border-b border-ivory-200 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-gold text-sm">{selectedQuote.quoteNumber}</span>
                  <span className="text-xs bg-ivory-100 px-2 py-0.5 rounded text-charcoal font-semibold">
                    {selectedQuote.revisionCode}
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-semibold text-charcoal mt-1">
                  Quotation for {selectedQuote.customer.fullName}
                </h3>
                <p className="text-xs text-charcoal/60 mt-0.5">
                  Valid until {new Date(selectedQuote.validUntil).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowPdfModal(true)}
                  className="px-3.5 py-2 bg-ivory-100 hover:bg-ivory-200 text-charcoal rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                  title="View Printable Customer PDF"
                >
                  <Printer className="w-3.5 h-3.5 text-walnut" />
                  <span>Customer PDF</span>
                </button>

                <button
                  onClick={handleConvertToJob}
                  disabled={convertingJob}
                  className="px-4 py-2 bg-charcoal hover:bg-charcoal-light text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm"
                  title="Release to Bodla workshop floor"
                >
                  <Wrench className="w-3.5 h-3.5 text-gold" />
                  <span>{convertingJob ? 'Releasing...' : 'Release to Factory Job'}</span>
                </button>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-walnut uppercase tracking-wider block">
                Line Items Breakdown:
              </span>
              <div className="border border-ivory-300 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-ivory-50 border-b border-ivory-200 text-walnut font-semibold">
                    <tr>
                      <th className="p-3">Description &amp; Specifications</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Estimate</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ivory-200">
                    {selectedQuote.items?.map((item: any) => (
                      <tr key={item.id}>
                        <td className="p-3 space-y-1">
                          <span className="font-semibold block text-charcoal">{item.itemDescription}</span>
                          <span className="text-[11px] text-charcoal/70 block">Dims: {item.dimensions}</span>
                          <span className="text-[11px] text-charcoal/70 block">Upholstery: {item.upholsterySpec}</span>
                          <span className="text-[11px] text-charcoal/70 block">Frame: {item.frameSpec}</span>
                        </td>
                        <td className="p-3 text-center font-medium">{item.quantity}</td>
                        <td className="p-3 text-right font-mono">₹{item.unitEstimate?.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right font-mono font-semibold">₹{item.totalLineAmount?.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-ivory-50 p-5 rounded-2xl border border-ivory-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-walnut">Subtotal:</span>
                <span className="font-mono">₹{selectedQuote.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-walnut">GST ({selectedQuote.taxPercent}%):</span>
                <span className="font-mono">₹{selectedQuote.taxAmount?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-walnut">White-Glove Installation &amp; Shipping:</span>
                <span className="font-mono">₹{selectedQuote.shippingCost?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-ivory-300 font-serif text-base font-bold text-charcoal">
                <span>Grand Total Estimate:</span>
                <span className="font-mono text-gold font-sans font-bold">₹{selectedQuote.totalEstimate?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* SENSITIVE INTERNAL MARGINS (Section 12 Compliance) */}
            <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-amber-800">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>CONFIDENTIAL INTERNAL METRICS (NEVER DISPLAYED ON CUSTOMER PDF):</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <span className="block text-[11px]">Estimated Factory BOM Cost:</span>
                  <span className="font-mono font-bold text-charcoal">₹{selectedQuote.internalEstimatedCost?.toLocaleString('en-IN') || '112,000'}</span>
                </div>
                <div>
                  <span className="block text-[11px]">Internal Operating Margin:</span>
                  <span className="font-mono font-bold text-emerald-800">{selectedQuote.internalProfitMargin || '49.7'}%</span>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="text-xs text-charcoal/70 space-y-1 bg-white p-4 rounded-xl border border-ivory-200">
              <strong className="block text-walnut">Terms &amp; Conditions:</strong>
              <p className="whitespace-pre-line leading-relaxed">{selectedQuote.termsAndConditions}</p>
            </div>
          </div>
        ) : null}
      </div>

      {/* Customer Printable PDF View Modal */}
      {showPdfModal && selectedQuote && (
        <div className="fixed inset-0 z-50 bg-charcoal/80 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center overflow-y-auto">
          <div className="bg-white max-w-3xl w-full rounded-3xl p-8 shadow-2xl border border-ivory-300 text-charcoal relative max-h-[90vh] overflow-y-auto print:m-0 print:p-0">
            <div className="flex items-center justify-between pb-4 border-b border-ivory-300 mb-6 print:hidden">
              <span className="font-serif text-lg font-semibold">Official Customer Quotation PDF Preview</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-charcoal text-white rounded-xl text-xs font-semibold flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button onClick={() => setShowPdfModal(false)} className="text-charcoal/50 hover:text-charcoal p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Formal Quotation Document Layout */}
            <div className="space-y-6 text-xs font-sans">
              <div className="border-b-2 border-charcoal pb-4 flex justify-between items-end">
                <div>
                  <h2 className="font-serif text-2xl font-bold uppercase tracking-tight">PRADEEP FURNITURE ATELIER</h2>
                  <p className="text-walnut text-[11px] font-medium">Bespoke Luxury Seating &amp; Fancy Chairs Manufacturer</p>
                  <p className="text-charcoal/60 text-[10px] mt-0.5">Plot 42-44 Bodla Industrial Zone &amp; 18 Civil Lines, Agra, UP | GSTIN: 09AABCP1234F1Z9</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-bold block">{selectedQuote.quoteNumber}</span>
                  <span className="text-[10px] text-charcoal/60">DATE: {new Date(selectedQuote.createdAt).toLocaleDateString('en-GB')}</span>
                </div>
              </div>

              {/* Client Bill To */}
              <div className="grid grid-cols-2 gap-4 bg-ivory-50 p-4 rounded-xl border border-ivory-200">
                <div>
                  <strong className="block text-walnut uppercase text-[10px]">Client / Consignee:</strong>
                  <span className="font-serif font-semibold text-sm text-charcoal block">{selectedQuote.customer.fullName}</span>
                  <span className="block text-charcoal/80">{selectedQuote.customer.phone}</span>
                  <span className="block text-charcoal/80">{selectedQuote.customer.address || selectedQuote.customer.city || 'Agra'}</span>
                </div>
                <div className="text-right">
                  <strong className="block text-walnut uppercase text-[10px]">Estimate Validity:</strong>
                  <span>30 Days (Valid until {new Date(selectedQuote.validUntil).toLocaleDateString('en-GB')})</span>
                  <strong className="block text-walnut uppercase text-[10px] mt-2">Production Lead Time:</strong>
                  <span>{selectedQuote.deliveryLeadWeeks} Weeks from Blueprint Freeze</span>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-xs border border-ivory-300">
                <thead className="bg-ivory-100 border-b border-ivory-300 text-charcoal font-semibold">
                  <tr>
                    <th className="p-3">Item &amp; Specifications</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Estimate</th>
                    <th className="p-3 text-right">Total (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-200">
                  {selectedQuote.items?.map((it: any) => (
                    <tr key={it.id}>
                      <td className="p-3 space-y-0.5">
                        <span className="font-semibold block">{it.itemDescription}</span>
                        <span className="text-[11px] text-charcoal/70 block">Dimensions: {it.dimensions}</span>
                        <span className="text-[11px] text-charcoal/70 block">Upholstery: {it.upholsterySpec}</span>
                        <span className="text-[11px] text-charcoal/70 block">Frame: {it.frameSpec}</span>
                      </td>
                      <td className="p-3 text-center font-medium">{it.quantity}</td>
                      <td className="p-3 text-right font-mono">₹{it.unitEstimate?.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right font-mono font-semibold">₹{it.totalLineAmount?.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-mono">₹{selectedQuote.subtotal?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%):</span>
                    <span className="font-mono">₹{selectedQuote.taxAmount?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Installation &amp; White-Glove:</span>
                    <span className="font-mono">₹{selectedQuote.shippingCost?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2 border-charcoal font-bold text-sm">
                    <span>Total Estimate:</span>
                    <span className="font-mono">₹{selectedQuote.totalEstimate?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Payment terms */}
              <div className="border-t border-ivory-300 pt-4 space-y-1 text-[11px] text-charcoal/80">
                <strong>Commercial Finalization:</strong>
                <p>Commercial agreement finalized offline. 50% mobilization advance via bank RTGS / Cheque upon Job Release, 50% balance upon factory QC inspection approval prior to dispatch.</p>
                <p>Bank details: HDFC Bank | A/C: 502000XXXXXX | IFSC: HDFC0000242 | Beneficiary: Pradeep Furniture Atelier</p>
              </div>

              <div className="pt-6 border-t border-charcoal flex justify-between text-[11px] text-charcoal/60">
                <span>Authorized Signatory: Vikram Malhotra (Sales &amp; Client Relations)</span>
                <span>Customer Acceptance Sign: _______________________</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Quote Drafting Modal */}
      {showNewQuoteModal && (
        <div className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-ivory-300 text-charcoal relative">
            <div className="flex items-start justify-between pb-3 border-b border-ivory-200">
              <h3 className="font-serif text-xl font-semibold">Draft New Quotation</h3>
              <button onClick={() => setShowNewQuoteModal(false)} className="text-charcoal/50 hover:text-charcoal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuote} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-walnut font-medium mb-1">Customer *</label>
                <select
                  value={newQuote.customerId}
                  onChange={(e) => setNewQuote({ ...newQuote, customerId: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-ivory-50 border border-ivory-300 focus:outline-none focus:border-gold"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.fullName} ({c.phone})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-walnut font-medium mb-1">Item Description *</label>
                <input
                  type="text"
                  required
                  value={newQuote.itemDescription}
                  onChange={(e) => setNewQuote({ ...newQuote, itemDescription: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-ivory-50 border border-ivory-300 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-walnut font-medium mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={newQuote.dimensions}
                    onChange={(e) => setNewQuote({ ...newQuote, dimensions: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-ivory-50 border border-ivory-300 focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-walnut font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newQuote.quantity}
                    onChange={(e) => setNewQuote({ ...newQuote, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full p-2.5 rounded-xl bg-ivory-50 border border-ivory-300 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-walnut font-medium mb-1">Customer Unit Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newQuote.unitEstimate}
                    onChange={(e) => setNewQuote({ ...newQuote, unitEstimate: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-ivory-50 border border-ivory-300 focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-walnut font-medium mb-1">Internal BOM Cost (₹)</label>
                  <input
                    type="number"
                    value={newQuote.internalCost}
                    onChange={(e) => setNewQuote({ ...newQuote, internalCost: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-ivory-50 border border-ivory-300 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-ivory-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowNewQuoteModal(false)}
                  className="px-4 py-2 bg-ivory-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-charcoal text-white rounded-xl font-semibold"
                >
                  Save Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
