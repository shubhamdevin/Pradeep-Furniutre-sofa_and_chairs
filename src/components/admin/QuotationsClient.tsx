'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import RecordEditor from './RecordEditor';
import { 
  FileText, 
  Printer, 
  Plus, 
  CheckCircle2, 
  Wrench, 
  Eye, 
  X, 
  ShieldCheck, 
  Lock,
  ArrowRight,
  Send
} from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

interface Props {
  initialQuotations: any[];
  customers: any[];
  leads: any[];
  initialLeadId?: string;
  initialCustomerId?: string;
}

export default function QuotationsClient({ initialQuotations, customers, leads, initialLeadId, initialCustomerId }: Props) {
  const { error: toastError, success: toastSuccess } = useToast();
  const [quotations, setQuotations] = useState(initialQuotations);
  const [selectedQuote, setSelectedQuote] = useState<any | null>(initialQuotations[0] || null);

  // Modals
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showNewQuoteModal, setShowNewQuoteModal] = useState(Boolean(initialLeadId));
  const [creatingQuote,setCreatingQuote] = useState(false);
  const [convertingJob, setConvertingJob] = useState(false);

  // New Quote Form
  const [newQuote, setNewQuote] = useState({
    customerId: initialCustomerId || customers[0]?.id || '',
    leadId: initialLeadId || '',
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
    if(creatingQuote)return;
    setCreatingQuote(true);
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
        toastSuccess('Quotation Generated', `Quotation ${data.quoteNumber} created successfully!`);
        window.location.reload();
      } else {
        toastError('Quotation Error', data.error || 'Failed to create quotation.');
      }
    } catch (err) {
      console.error(err);
      toastError('System Error', 'Error creating quotation.');
    } finally {setCreatingQuote(false);}
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
          quotationId: selectedQuote.id,
          customerId: selectedQuote.customerId,
          productTitle: selectedQuote.items.map((i:any)=>i.itemDescription).join('; ') || 'Bespoke Furniture',
          quantity: selectedQuote.items.reduce((sum:number,i:any)=>sum+i.quantity,0) || 1,
          targetCompletionWeeks: selectedQuote.deliveryLeadWeeks || 4,
          frameInstructions: selectedQuote.items.map((i:any)=>i.frameSpec).filter(Boolean).join('; ') || 'Solid Kiln-Dried CP Teakwood',
          foamSpecification: '45D High-Resilience PU Core with Down Quilt',
          fabricCodeAndColor: selectedQuote.items.map((i:any)=>i.upholsterySpec).filter(Boolean).join('; ') || 'Belgian Luxe Velvet',
          exactDimensions: selectedQuote.items.map((i:any)=>i.itemDescription+': '+(i.dimensions||'Confirm with client')).join('; '),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toastSuccess('Job Card Issued', `Quotation converted to Manufacturing Job ${data.jobCardNumber}!`);
        window.location.reload();
      } else {
        toastError('Factory Conversion Failed', data.error || 'Failed to convert to factory job.');
      }
    } catch (err) {
      console.error(err);
      toastError('System Error', 'Error converting to factory job.');
    } finally {
      setConvertingJob(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {selectedQuote && <RecordEditor key={selectedQuote.id} kind="quotations" record={selectedQuote} label="Update quotation status" onSaved={()=>window.location.reload()} fields={[{key:'status',label:'Status (accept before factory release)',options:['DRAFT','UNDER_REVIEW','SENT','REVISION_REQUESTED','ACCEPTED','REJECTED','EXPIRED'].map(value=>({value,label:value.replaceAll('_',' ')}))}]}/>}
      {/* Top Action Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-md border border-platinum-border shadow-sm">
        <span className="text-xs font-medium text-graphite">
          Total Quotations: <strong>{quotations.length}</strong>
        </span>
        <button
          onClick={() => setShowNewQuoteModal(true)}
          className="px-4 py-2 bg-graphite hover:bg-graphite-hover text-white text-xs font-medium rounded-md flex items-center space-x-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 text-slate-silver" />
          <span>Draft New Quotation</span>
        </button>
      </div>

      {/* Two-Column Quotation View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Quotes List */}
        <div className="lg:col-span-5 bg-white rounded-md border border-platinum-border shadow-sm divide-y divide-platinum-border max-h-[750px] overflow-y-auto">
          {quotations.map((q) => (
            <div
              key={q.id}
              onClick={() => setSelectedQuote(q)}
              className={`p-5 cursor-pointer transition-colors ${
                selectedQuote?.id === q.id 
                  ? 'bg-platinum-soft/70 border-l-2 border-graphite' 
                  : 'hover:bg-platinum-soft/40'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono font-medium text-graphite">{q.quoteNumber}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
                  q.status === 'ACCEPTED' 
                    ? 'bg-status-success/10 text-status-success' 
                    : 'bg-status-info/10 text-status-info'
                }`}>
                  {q.status}
                </span>
              </div>

              <h4 className="font-serif font-medium text-graphite text-base">{q.customer.fullName}</h4>
              <p className="text-xs font-mono font-medium text-graphite mt-0.5">
                ₹{q.totalEstimate.toLocaleString('en-IN')} (incl. GST)
              </p>

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-muted font-medium">
                <span>Items: {q.items?.length || 1}</span>
                <span>Lead Time: {q.deliveryLeadWeeks} Wks</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Quote Details Stage */}
        {selectedQuote ? (
          <div className="lg:col-span-7 bg-white rounded-md p-6 sm:p-8 border border-platinum-border shadow-sm space-y-6">
            <div className="flex items-start justify-between border-b border-platinum-border pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-medium text-slate-muted text-sm">{selectedQuote.quoteNumber}</span>
                  <span className="text-xs bg-platinum-soft px-2 py-0.5 rounded text-graphite font-medium border border-platinum-border">
                    {selectedQuote.revisionCode}
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-medium text-graphite mt-1">
                  Quotation for {selectedQuote.customer.fullName}
                </h3>
                <p className="text-xs text-slate-muted mt-0.5">
                  Valid until {new Date(selectedQuote.validUntil).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowPdfModal(true)}
                  className="px-3.5 py-2 bg-platinum hover:bg-platinum-soft text-graphite border border-platinum-border rounded-md text-xs font-medium flex items-center space-x-1.5 transition-colors"
                  title="View Printable Customer PDF"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-muted" />
                  <span>Customer PDF</span>
                </button>

                <button
                  onClick={handleConvertToJob}
                  disabled={convertingJob || selectedQuote.status !== 'ACCEPTED'}
                  className="px-4 py-2 bg-graphite hover:bg-graphite-hover text-white rounded-md text-xs font-medium flex items-center space-x-1.5 transition-colors shadow-sm"
                  title="Release to Bodla workshop floor"
                >
                  <Wrench className="w-3.5 h-3.5 text-slate-silver" />
                  <span>{convertingJob ? 'Releasing...' : 'Release to Factory Job'}</span>
                </button>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-dark uppercase tracking-wider block">
                Line Items Breakdown:
              </span>
              <div className="border border-platinum-border rounded-md overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-platinum-soft border-b border-platinum-border text-slate-dark font-medium">
                    <tr>
                      <th className="p-3">Description &amp; Specifications</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Estimate</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-platinum-border">
                    {selectedQuote.items?.map((item: any) => (
                      <tr key={item.id} className="hover:bg-platinum-soft/30">
                        <td className="p-3 space-y-1">
                          <span className="font-medium block text-graphite">{item.itemDescription}</span>
                          <span className="text-[11px] text-slate-dark block">Dims: {item.dimensions}</span>
                          <span className="text-[11px] text-slate-dark block">Upholstery: {item.upholsterySpec}</span>
                          <span className="text-[11px] text-slate-dark block">Frame: {item.frameSpec}</span>
                        </td>
                        <td className="p-3 text-center font-medium text-graphite">{item.quantity}</td>
                        <td className="p-3 text-right font-mono text-graphite">₹{item.unitEstimate?.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right font-mono font-medium text-graphite">₹{item.totalLineAmount?.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-platinum-soft/50 p-5 rounded-md border border-platinum-border text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-dark">Subtotal:</span>
                <span className="font-mono text-graphite">₹{selectedQuote.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-dark">GST ({selectedQuote.taxPercent}%):</span>
                <span className="font-mono text-graphite">₹{selectedQuote.taxAmount?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-dark">White-Glove Installation &amp; Shipping:</span>
                <span className="font-mono text-graphite">₹{selectedQuote.shippingCost?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-platinum-border font-serif text-base font-medium text-graphite">
                <span>Grand Total Estimate:</span>
                <span className="font-mono font-sans font-semibold text-graphite">₹{selectedQuote.totalEstimate?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* SENSITIVE INTERNAL MARGINS */}
            <div className="bg-amber-50/70 p-4 rounded-md border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="flex items-center space-x-1.5 font-medium text-amber-800">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>CONFIDENTIAL INTERNAL METRICS (NEVER DISPLAYED ON CUSTOMER PDF):</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <span className="block text-[11px]">Estimated Factory BOM Cost:</span>
                  <span className="font-mono font-semibold text-graphite">₹{selectedQuote.internalEstimatedCost?.toLocaleString('en-IN') || '112,000'}</span>
                </div>
                <div>
                  <span className="block text-[11px]">Internal Operating Margin:</span>
                  <span className="font-mono font-semibold text-status-success">{selectedQuote.internalProfitMargin || '49.7'}%</span>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="text-xs text-slate-dark space-y-1 bg-white p-4 rounded-md border border-platinum-border">
              <strong className="block text-graphite font-medium">Terms &amp; Conditions:</strong>
              <p className="whitespace-pre-line leading-relaxed">{selectedQuote.termsAndConditions}</p>
            </div>
          </div>
        ) : null}
      </div>

      {/* Customer Printable PDF View Modal */}
      {showPdfModal && selectedQuote && (
        <div className="quotation-print-overlay fixed inset-0 z-50 bg-graphite-deep/80 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center overflow-y-auto">
          <div className="quotation-print-sheet bg-white max-w-3xl w-full rounded-md p-8 shadow-2xl border border-platinum-border text-graphite relative max-h-[90vh] overflow-y-auto print:m-0 print:p-0">
            <div className="flex items-center justify-between pb-4 border-b border-platinum-border mb-6 print:hidden">
              <span className="font-serif text-lg font-medium text-graphite">Official Customer Quotation PDF Preview</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-graphite text-white rounded-md text-xs font-medium flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button onClick={() => setShowPdfModal(false)} className="text-slate-muted hover:text-graphite p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Formal Quotation Document Layout */}
            <div className="space-y-6 text-xs font-sans">
              <div className="border-b-2 border-graphite pb-4 flex justify-between items-end">
                <div>
                  <h2 className="font-serif text-2xl font-bold uppercase tracking-tight text-graphite">PRADEEP FURNITURE ATELIER</h2>
                  <p className="text-slate-dark text-[11px] font-medium">Bespoke Luxury Seating &amp; Fancy Chairs Manufacturer</p>
                  <p className="text-slate-muted text-[10px] mt-0.5">Nagla Latoori Singh, Deori Road, Agra, UP | Phone: +91 8445553853 | Email: pradeepfurniture2@gmail.com</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-bold block text-graphite">{selectedQuote.quoteNumber}</span>
                  <span className="text-[10px] text-slate-muted">DATE: {new Date(selectedQuote.createdAt).toLocaleDateString('en-GB')}</span>
                </div>
              </div>

              {/* Client Bill To */}
              <div className="grid grid-cols-2 gap-4 bg-platinum-soft/50 p-4 rounded-md border border-platinum-border">
                <div>
                  <strong className="block text-slate-dark uppercase text-[10px]">Client / Consignee:</strong>
                  <span className="font-medium text-sm text-graphite block">{selectedQuote.customer.fullName}</span>
                  <span className="block text-slate-dark">{selectedQuote.customer.phone}</span>
                  <span className="block text-slate-dark">{selectedQuote.customer.address || selectedQuote.customer.city || 'Agra'}</span>
                </div>
                <div className="text-right">
                  <strong className="block text-slate-dark uppercase text-[10px]">Estimate Validity:</strong>
                  <span className="text-graphite">30 Days (Valid until {new Date(selectedQuote.validUntil).toLocaleDateString('en-GB')})</span>
                  <strong className="block text-slate-dark uppercase text-[10px] mt-2">Production Lead Time:</strong>
                  <span className="text-graphite">{selectedQuote.deliveryLeadWeeks} Weeks from Blueprint Freeze</span>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-xs border border-platinum-border">
                <thead className="bg-platinum-soft border-b border-platinum-border text-graphite font-medium">
                  <tr>
                    <th className="p-3">Item &amp; Specifications</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Estimate</th>
                    <th className="p-3 text-right">Total (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-platinum-border">
                  {selectedQuote.items?.map((it: any) => (
                    <tr key={it.id}>
                      <td className="p-3 space-y-0.5">
                        <span className="font-medium block text-graphite">{it.itemDescription}</span>
                        <span className="text-[11px] text-slate-dark block">Dimensions: {it.dimensions}</span>
                        <span className="text-[11px] text-slate-dark block">Upholstery: {it.upholsterySpec}</span>
                        <span className="text-[11px] text-slate-dark block">Frame: {it.frameSpec}</span>
                      </td>
                      <td className="p-3 text-center font-medium text-graphite">{it.quantity}</td>
                      <td className="p-3 text-right font-mono text-graphite">₹{it.unitEstimate?.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right font-mono font-medium text-graphite">₹{it.totalLineAmount?.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-dark">Subtotal:</span>
                    <span className="font-mono text-graphite">₹{selectedQuote.subtotal?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-dark">GST (18%):</span>
                    <span className="font-mono text-graphite">₹{selectedQuote.taxAmount?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-dark">Installation &amp; White-Glove:</span>
                    <span className="font-mono text-graphite">₹{selectedQuote.shippingCost?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2 border-graphite font-semibold text-sm text-graphite">
                    <span>Total Estimate:</span>
                    <span className="font-mono">₹{selectedQuote.totalEstimate?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Payment terms */}
              <div className="border-t border-platinum-border pt-4 space-y-1 text-[11px] text-slate-dark">
                <strong className="text-graphite">Commercial Finalization:</strong>
                <p>Commercial agreement finalized offline. 50% mobilization advance via bank RTGS / Cheque upon Job Release, 50% balance upon factory QC inspection approval prior to dispatch.</p>
                <p>Bank details: HDFC Bank | A/C: 502000XXXXXX | IFSC: HDFC0000242 | Beneficiary: Pradeep Furniture Atelier</p>
              </div>

              <div className="pt-6 border-t border-platinum-border flex justify-between text-[11px] text-slate-muted">
                <span>Authorized Signatory: Vikram Malhotra (Sales &amp; Client Relations)</span>
                <span>Customer Acceptance Sign: _______________________</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Quote Drafting Modal */}
      {showNewQuoteModal && (
        <div className="fixed inset-0 z-50 bg-graphite-deep/80 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="bg-white max-w-lg w-full rounded-md p-6 sm:p-8 shadow-2xl border border-platinum-border text-graphite relative">
            <div className="flex items-start justify-between pb-3 border-b border-platinum-border">
              <h3 className="font-serif text-xl font-medium text-graphite">Draft New Quotation</h3>
              <button onClick={() => setShowNewQuoteModal(false)} className="text-slate-muted hover:text-graphite">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuote} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-dark font-medium mb-1">Customer *</label>
                <select
                  value={newQuote.customerId}
                  onChange={(e) => setNewQuote({ ...newQuote, customerId: e.target.value, leadId: '' })}
                  className="w-full p-2.5 rounded-md bg-platinum-soft border border-platinum-border text-graphite focus:outline-none focus:border-graphite"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.fullName} ({c.phone})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-dark font-medium mb-1">Item Description *</label>
                <input
                  type="text"
                  required
                  value={newQuote.itemDescription}
                  onChange={(e) => setNewQuote({ ...newQuote, itemDescription: e.target.value })}
                  className="w-full p-2.5 rounded-md bg-platinum-soft border border-platinum-border text-graphite focus:outline-none focus:border-graphite"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-dark font-medium mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={newQuote.dimensions}
                    onChange={(e) => setNewQuote({ ...newQuote, dimensions: e.target.value })}
                    className="w-full p-2.5 rounded-md bg-platinum-soft border border-platinum-border text-graphite focus:outline-none focus:border-graphite"
                  />
                </div>
                <div>
                  <label className="block text-slate-dark font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newQuote.quantity}
                    onChange={(e) => setNewQuote({ ...newQuote, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full p-2.5 rounded-md bg-platinum-soft border border-platinum-border text-graphite focus:outline-none focus:border-graphite"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-dark font-medium mb-1">Customer Unit Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newQuote.unitEstimate}
                    onChange={(e) => setNewQuote({ ...newQuote, unitEstimate: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-md bg-platinum-soft border border-platinum-border text-graphite focus:outline-none focus:border-graphite"
                  />
                </div>
                <div>
                  <label className="block text-slate-dark font-medium mb-1">Internal BOM Cost (₹)</label>
                  <input
                    type="number"
                    value={newQuote.internalCost}
                    onChange={(e) => setNewQuote({ ...newQuote, internalCost: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-md bg-platinum-soft border border-platinum-border text-graphite focus:outline-none focus:border-graphite"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-platinum-border flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowNewQuoteModal(false)}
                  className="px-4 py-2 bg-platinum hover:bg-platinum-soft text-graphite border border-platinum-border rounded-md font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={creatingQuote}
                  className="px-5 py-2 bg-graphite hover:bg-graphite-hover text-white rounded-md font-medium"
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
