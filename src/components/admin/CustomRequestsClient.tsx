'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import RecordEditor from './RecordEditor';
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
  RefreshCw,
  Search,
  X,
  Maximize2,
  ChevronRight,
} from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

interface Props {
  initialRequests: any[];
}

export default function CustomRequestsClient({ initialRequests }: Props) {
  const { error: toastError, success: toastSuccess } = useToast();
  const [requests, setRequests] = useState(initialRequests);
  const [selectedReq, setSelectedReq] = useState<any | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  // Auto-sync with server and live polling
  const refreshRequests = async () => {
    try {
      const res = await fetch('/api/custom-requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
        setSelectedReq((current: any) => current
          ? data.find((r: any) => r.id === current.id) || null
          : null);
      }
    } catch (e) {
      console.error('Error fetching custom requests:', e);
    }
  };

  useEffect(() => {
    setRequests(initialRequests);
    setSelectedReq((current: any) => current
      ? initialRequests.find((r) => r.id === current.id) || null
      : null);
  }, [initialRequests]);

  useEffect(() => {
    const interval = setInterval(refreshRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshRequests();
    setIsRefreshing(false);
    toastSuccess('Refreshed', 'Design requests updated with latest data.');
  };

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
        const emailNote = data.emailNotification === 'sent'
          ? ' Customer notified by email.'
          : data.emailNotification && data.emailNotification !== 'undefined'
            ? ' Customer email could not be sent; check SMTP configuration and server logs.'
            : '';
        toastSuccess('Revision Created', `Design revision ${data.revisionCode} created successfully!${emailNote}`);
        window.location.reload();
      } else {
        toastError('Revision Failed', data.error || 'Failed to create revision.');
      }
    } catch (err) {
      console.error(err);
      toastError('System Error', 'Error creating revision.');
    } finally {
      setSavingRevision(false);
    }
  };

  const filtered = requests.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const matchName = (r.customer?.fullName || '').toLowerCase().includes(q);
    const matchRef = (r.referenceNumber || '').toLowerCase().includes(q);
    const matchPhone = (r.customer?.phone || '').includes(q);
    const matchType = (r.furnitureType || '').toLowerCase().includes(q);
    return matchName || matchRef || matchPhone || matchType;
  });

  return (
    <div className="space-y-4 font-sans">
      {/* Top Search & Live Refresh Toolbar */}
      <div className="bg-white rounded-md p-3.5 border border-platinum-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by customer, phone, CFR reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-md bg-platinum-soft border border-platinum-border text-xs text-graphite focus:outline-none focus:border-graphite"
          />
          <Search className="w-4 h-4 text-slate-muted absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-[11px] text-slate-dark">
            Showing <strong>{filtered.length}</strong> of {requests.length} requests
          </span>
          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-1.5 rounded-md font-medium text-xs bg-white hover:bg-platinum-soft text-slate-dark border border-platinum-border inline-flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start transition-all duration-300">
        {/* List of Design Requests: Full width by default, shrinks to col-span-5 when clicked */}
        <div className={`${selectedReq ? 'lg:col-span-5' : 'lg:col-span-12'} bg-white rounded-md border border-platinum-border shadow-sm divide-y divide-platinum-border max-h-[800px] overflow-y-auto transition-all duration-300`}>
          <div className="p-3 bg-platinum-soft/50 border-b border-platinum-border flex items-center justify-between text-xs">
            <span className="font-medium text-slate-dark">
              {filtered.length} Custom {filtered.length === 1 ? 'Request' : 'Requests'}
            </span>
            {selectedReq && (
              <button
                type="button"
                onClick={() => setSelectedReq(null)}
                className="text-[11px] text-slate-muted hover:text-graphite flex items-center gap-1 font-medium bg-white px-2 py-1 rounded border border-platinum-border shadow-2xs"
                title="Expand list to full width"
              >
                <Maximize2 className="w-3 h-3" />
                <span>Expand list</span>
              </button>
            )}
          </div>
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-dark">
              No custom design requests match your search.
            </div>
          ) : (
            filtered.map((req) => (
              <div
                key={req.id}
                onClick={() => setSelectedReq(selectedReq?.id === req.id ? null : req)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedReq?.id === req.id 
                    ? 'bg-platinum-soft/80 border-l-3 border-graphite' 
                    : 'hover:bg-platinum-soft/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono font-medium text-graphite">{req.referenceNumber}</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
                      req.status === 'DESIGN_APPROVED' 
                        ? 'bg-status-success/10 text-status-success' 
                        : 'bg-status-info/10 text-status-info'
                    }`}>
                      {req.status.replace(/_/g, ' ')}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 text-slate-muted transition-transform duration-200 ${selectedReq?.id === req.id ? 'rotate-90 text-graphite' : ''}`} />
                  </div>
                </div>

                <h4 className="font-serif font-medium text-graphite text-base">{req.furnitureType}</h4>
                <p className="text-xs text-slate-dark">{req.customer.fullName} • {req.deliveryCity || 'Agra'}</p>
                <p className="text-[11px] text-slate-muted mt-0.5 font-mono">{req.customer.phone}</p>

                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-muted font-medium">
                  <span>Revisions: {req.revisions?.length || 0}</span>
                  <span>{new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {new Date(req.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

      {/* Right Details & Revisions Stage */}
      {selectedReq ? (
        <div className="lg:col-span-7 space-y-6 transition-all duration-300">
          <RecordEditor key={selectedReq.id} kind="requests" record={selectedReq} label="Update request status" onSaved={()=>window.location.reload()} fields={[{key:'status',label:'Request status',options:['REQUEST_RECEIVED','UNDER_REVIEW','MORE_DETAILS_REQUIRED','FEASIBILITY_CHECK','DESIGN_IN_PROGRESS','CONCEPT_READY','REVISION_REQUESTED','DESIGN_APPROVED','QUOTATION_PENDING','CLOSED_REJECTED'].map(value=>({value,label:value.replaceAll('_',' ')}))}]}/>
          <div className="bg-white rounded-md p-6 sm:p-8 border border-platinum-border shadow-sm space-y-6">
            <div className="flex items-start justify-between border-b border-platinum-border pb-4 gap-4">
              <div>
                <span className="text-xs font-mono font-medium text-slate-muted">{selectedReq.referenceNumber}</span>
                <h3 className="font-serif text-2xl font-medium text-graphite mt-0.5">
                  {selectedReq.furnitureType}
                </h3>
                <p className="text-xs text-slate-dark mt-0.5">
                  Requested by {selectedReq.customer.fullName} ({selectedReq.customer.phone})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowRevisionForm(!showRevisionForm)}
                  className="px-3 py-1.5 bg-graphite hover:bg-graphite-hover text-white rounded-md text-xs font-medium flex items-center space-x-1.5 transition-colors shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-silver" />
                  <span>Add CAD Revision</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedReq(null)}
                  className="p-1.5 rounded-md bg-platinum-soft hover:bg-platinum text-slate-dark border border-platinum-border transition-colors"
                  title="Close details and expand list"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Customer Reference Photos Gallery */}
            {selectedReq.attachments?.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-dark uppercase tracking-wider block">
                  Uploaded Reference Photographs:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedReq.attachments.map((att: any) => (
                    <div key={att.id} className="relative aspect-[4/3] rounded-md overflow-hidden border border-platinum-border group">
                      <img src={att.fileUrl} alt={att.fileName} className="w-full h-full object-cover" />
                      <div className="absolute bottom-1 inset-x-1 bg-graphite/80 text-white text-[9px] px-1.5 py-0.5 rounded truncate">
                        {att.fileType}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Requirements Summary */}
            <div className="grid grid-cols-2 gap-4 bg-platinum-soft/50 p-4 rounded-md border border-platinum-border text-xs text-slate-dark">
              <div>
                <span className="font-medium text-slate-dark block">Dimensions Summary:</span>
                <span className="font-semibold text-graphite">{selectedReq.dimensionsSummary}</span>
              </div>
              <div>
                <span className="font-medium text-slate-dark block">Fabric &amp; Color:</span>
                <span className="text-graphite">{selectedReq.fabricPreference} ({selectedReq.colorPreference || 'Custom'})</span>
              </div>
              <div>
                <span className="font-medium text-slate-dark block">Frame &amp; Timber:</span>
                <span className="text-graphite">{selectedReq.framePreference || 'Solid CP Teakwood'}</span>
              </div>
              <div>
                <span className="font-medium text-slate-dark block">Quantity:</span>
                <span className="font-semibold text-graphite">{selectedReq.quantity} Unit(s)</span>
              </div>
            </div>

            {/* Revision Drafting Form */}
            {showRevisionForm && (
              <form onSubmit={handleCreateRevision} className="p-5 rounded-md bg-platinum-soft/60 border border-platinum-border space-y-4 text-xs">
                <h4 className="font-serif text-base font-medium text-graphite">
                  Draft New CAD Revision for {selectedReq.referenceNumber}
                </h4>

                <div>
                  <label className="block text-slate-dark font-medium mb-1">
                    Technical Specifications (Frame, Foam, Dimensions Freeze) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={revisionSpecs}
                    onChange={(e) => setRevisionSpecs(e.target.value)}
                    placeholder="e.g. 144''W x 42''D x 30''H. Solid CP Teak frame with 45D HR foam core and feather duvet crown..."
                    className="w-full p-2.5 rounded-md bg-white border border-platinum-border text-graphite focus:outline-none focus:border-graphite"
                  />
                </div>

                <div>
                  <label className="block text-slate-dark font-medium mb-1">Designer Internal Notes</label>
                  <input
                    type="text"
                    value={revisionNotes}
                    onChange={(e) => setRevisionNotes(e.target.value)}
                    placeholder="e.g. Approved during client in-person review on Oct 7. Ready for job card release."
                    className="w-full p-2.5 rounded-md bg-white border border-platinum-border text-graphite focus:outline-none focus:border-graphite"
                  />
                </div>

                <div>
                  <label className="block text-slate-dark font-medium mb-1">Proposed CAD / Blueprint Image URL (optional)</label>
                  <input
                    type="url"
                    value={revisionCadUrl}
                    onChange={(e) => setRevisionCadUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2.5 rounded-md bg-white border border-platinum-border text-graphite focus:outline-none focus:border-graphite"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="freeze-toggle"
                    checked={freezeForJob}
                    onChange={(e) => setFreezeForJob(e.target.checked)}
                    className="rounded border-platinum-border text-graphite focus:ring-0 accent-graphite"
                  />
                  <label htmlFor="freeze-toggle" className="font-medium text-graphite cursor-pointer flex items-center space-x-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-muted" />
                    <span>Freeze this design revision for factory production release</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRevisionForm(false)}
                    className="px-4 py-2 bg-platinum hover:bg-platinum-soft text-graphite border border-platinum-border rounded-md text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingRevision}
                    className="px-5 py-2 bg-graphite hover:bg-graphite-hover text-white rounded-md text-xs font-medium flex items-center space-x-1"
                  >
                    <Send className="w-3.5 h-3.5 text-slate-silver" />
                    <span>{savingRevision ? 'Saving...' : 'Save & Freeze Revision'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Revisions History List */}
            <div className="space-y-3 pt-4 border-t border-platinum-border">
              <h4 className="font-serif font-medium text-sm text-graphite">Design Revisions History</h4>

              {selectedReq.revisions?.length === 0 ? (
                <p className="text-xs text-slate-dark">No CAD revisions drafted yet. Click &apos;Add CAD Revision&apos; above.</p>
              ) : (
                <div className="space-y-3">
                  {selectedReq.revisions.map((rev: any) => (
                    <div key={rev.id} className="p-4 rounded-md bg-platinum-soft/50 border border-platinum-border text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-medium text-graphite">{rev.revisionCode}</span>
                          {rev.isFrozenForJob && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase bg-status-warning/10 text-status-warning flex items-center space-x-1">
                              <Lock className="w-3 h-3" />
                              <span>Frozen for Factory Job</span>
                            </span>
                          )}
                        </div>
                        <span className="font-medium text-status-success uppercase text-[10px] bg-status-success/10 px-2 py-0.5 rounded">
                          {rev.approvalStatus}
                        </span>
                      </div>

                      <p className="text-graphite/90"><strong className="text-slate-dark font-medium">Specifications:</strong> {rev.specifications}</p>
                      {rev.designerNotes && (
                        <p className="text-slate-dark"><strong className="font-medium">Notes:</strong> {rev.designerNotes}</p>
                      )}

                      <div className="pt-1 text-[11px] text-slate-muted flex justify-between">
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
    </div>
  );
}
