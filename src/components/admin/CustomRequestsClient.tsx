'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sliders, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Upload, 
  Layers, 
  Ruler, 
  Send,
  Lock,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface Props {
  initialRequests: any[];
}

export default function CustomRequestsClient({ initialRequests }: Props) {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedReq, setSelectedReq] = useState<any | null>(initialRequests[0] || null);

  // New Revision Modal / Form
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [revisionSpecs, setRevisionSpecs] = useState('');
  const [revisionNotes, setRevisionNotes] = useState('');
  const [revisionCadUrl, setRevisionCadUrl] = useState('');
  const [freezeForJob, setFreezeForJob] = useState(true);
  const [savingRevision, setSavingRevision] = useState(false);

  const handleCreateRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;
    setSavingRevision(true);

    try {
      const res = await fetch(`/api/custom-requests/${selectedReq.id}/revision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          specifications: revisionSpecs,
          designerNotes: revisionNotes,
          proposedCadUrl: revisionCadUrl || null,
          approvalStatus: 'APPROVED',
          freezeForJob,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Design revision ${data.revisionCode} created successfully!`);
        window.location.reload();
      } else {
        alert(data.error || 'Failed to create revision.');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating revision.');
    } finally {
      setSavingRevision(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left List of Design Requests */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-ivory-300 shadow-sm divide-y divide-ivory-200 max-h-[750px] overflow-y-auto">
        {requests.map((req) => (
          <div
            key={req.id}
            onClick={() => setSelectedReq(req)}
            className={`p-5 cursor-pointer transition-colors ${
              selectedReq?.id === req.id ? 'bg-cream/40 border-l-4 border-gold' : 'hover:bg-ivory-50'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-mono font-bold text-charcoal">{req.referenceNumber}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                req.status === 'DESIGN_APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {req.status.replace('_', ' ')}
              </span>
            </div>

            <h4 className="font-serif font-medium text-charcoal text-base">{req.furnitureType}</h4>
            <p className="text-xs text-charcoal/70">{req.customer.fullName} • {req.deliveryCity || 'Agra'}</p>

            <div className="mt-2 flex items-center justify-between text-[11px] text-walnut font-medium">
              <span>Revisions: {req.revisions?.length || 0}</span>
              <span>Timeline: {req.requiredTimeline || 'Standard'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Right Details & Revisions Stage */}
      {selectedReq ? (
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-ivory-300 shadow-luxury space-y-6">
            <div className="flex items-start justify-between border-b border-ivory-200 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-gold">{selectedReq.referenceNumber}</span>
                <h3 className="font-serif text-2xl font-semibold text-charcoal mt-0.5">
                  {selectedReq.furnitureType}
                </h3>
                <p className="text-xs text-charcoal/60 mt-0.5">
                  Requested by {selectedReq.customer.fullName} ({selectedReq.customer.phone})
                </p>
              </div>

              <button
                onClick={() => setShowRevisionForm(!showRevisionForm)}
                className="px-4 py-2 bg-charcoal hover:bg-charcoal-light text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm"
              >
                <Upload className="w-3.5 h-3.5 text-gold" />
                <span>Add CAD Revision</span>
              </button>
            </div>

            {/* Customer Reference Photos Gallery */}
            {selectedReq.attachments?.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-walnut uppercase tracking-wider block">
                  Uploaded Reference Photographs:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedReq.attachments.map((att: any) => (
                    <div key={att.id} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-ivory-300 group">
                      <img src={att.fileUrl} alt={att.fileName} className="w-full h-full object-cover" />
                      <div className="absolute bottom-1 inset-x-1 bg-charcoal/80 text-white text-[9px] px-1.5 py-0.5 rounded truncate">
                        {att.fileType}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Requirements Summary */}
            <div className="grid grid-cols-2 gap-4 bg-ivory-50 p-4 rounded-xl border border-ivory-200 text-xs text-charcoal/80">
              <div>
                <span className="text-walnut font-medium block">Dimensions Summary:</span>
                <span className="font-semibold text-charcoal">{selectedReq.dimensionsSummary}</span>
              </div>
              <div>
                <span className="text-walnut font-medium block">Fabric &amp; Color:</span>
                <span>{selectedReq.fabricPreference} ({selectedReq.colorPreference || 'Custom'})</span>
              </div>
              <div>
                <span className="text-walnut font-medium block">Frame &amp; Timber:</span>
                <span>{selectedReq.framePreference || 'Kiln-Dried CP Teakwood'}</span>
              </div>
              <div>
                <span className="text-walnut font-medium block">Quantity:</span>
                <span className="font-semibold text-charcoal">{selectedReq.quantity} Unit(s)</span>
              </div>
            </div>

            {/* Revision Drafting Form */}
            {showRevisionForm && (
              <form onSubmit={handleCreateRevision} className="p-5 rounded-2xl bg-cream/40 border border-gold/40 space-y-4 text-xs">
                <h4 className="font-serif text-base font-semibold text-charcoal">
                  Draft New CAD Revision for {selectedReq.referenceNumber}
                </h4>

                <div>
                  <label className="block text-walnut font-medium mb-1">
                    Technical Specifications (Frame, Foam, Dimensions Freeze) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={revisionSpecs}
                    onChange={(e) => setRevisionSpecs(e.target.value)}
                    placeholder="e.g. 144''W x 42''D x 30''H. Solid CP Teak frame with 45D HR foam core and feather duvet crown..."
                    className="w-full p-2.5 rounded-xl bg-white border border-ivory-300 focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-walnut font-medium mb-1">Designer Internal Notes</label>
                  <input
                    type="text"
                    value={revisionNotes}
                    onChange={(e) => setRevisionNotes(e.target.value)}
                    placeholder="e.g. Approved during client in-person review on Oct 7. Ready for job card release."
                    className="w-full p-2.5 rounded-xl bg-white border border-ivory-300 focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-walnut font-medium mb-1">Proposed CAD / Blueprint Image URL (optional)</label>
                  <input
                    type="url"
                    value={revisionCadUrl}
                    onChange={(e) => setRevisionCadUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2.5 rounded-xl bg-white border border-ivory-300 focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="freeze-toggle"
                    checked={freezeForJob}
                    onChange={(e) => setFreezeForJob(e.target.checked)}
                    className="rounded text-gold focus:ring-0"
                  />
                  <label htmlFor="freeze-toggle" className="font-semibold text-charcoal cursor-pointer flex items-center space-x-1">
                    <Lock className="w-3.5 h-3.5 text-gold" />
                    <span>Freeze this design revision for factory production release</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRevisionForm(false)}
                    className="px-4 py-2 bg-ivory-200 text-charcoal rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingRevision}
                    className="px-5 py-2 bg-charcoal text-white rounded-xl text-xs font-semibold flex items-center space-x-1"
                  >
                    <Send className="w-3.5 h-3.5 text-gold" />
                    <span>{savingRevision ? 'Saving...' : 'Save & Freeze Revision'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Revisions History List */}
            <div className="space-y-3 pt-4 border-t border-ivory-200">
              <h4 className="font-serif font-semibold text-sm text-charcoal">Design Revisions History</h4>

              {selectedReq.revisions?.length === 0 ? (
                <p className="text-xs text-charcoal/60">No CAD revisions drafted yet. Click &apos;Add CAD Revision&apos; above.</p>
              ) : (
                <div className="space-y-3">
                  {selectedReq.revisions.map((rev: any) => (
                    <div key={rev.id} className="p-4 rounded-xl bg-ivory-50 border border-ivory-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-charcoal">{rev.revisionCode}</span>
                          {rev.isFrozenForJob && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 flex items-center space-x-1">
                              <Lock className="w-3 h-3" />
                              <span>Frozen for Factory Job</span>
                            </span>
                          )}
                        </div>
                        <span className="font-semibold text-emerald-800 uppercase text-[10px] bg-emerald-100 px-2 py-0.5 rounded">
                          {rev.approvalStatus}
                        </span>
                      </div>

                      <p className="text-charcoal/90"><strong>Specifications:</strong> {rev.specifications}</p>
                      {rev.designerNotes && (
                        <p className="text-charcoal/70"><strong>Notes:</strong> {rev.designerNotes}</p>
                      )}

                      <div className="pt-1 text-[11px] text-walnut flex justify-between">
                        <span>Drafted by: {rev.designer?.name || 'Lead Designer'}</span>
                        <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
