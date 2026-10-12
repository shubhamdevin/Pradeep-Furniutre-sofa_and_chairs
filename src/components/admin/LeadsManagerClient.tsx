'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveAdminRecord } from '@/lib/admin-actions';
import RecordEditor from './RecordEditor';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  FileText, 
  CheckCircle2, 
  ChevronRight,
  RefreshCw,
  X,
  Maximize2,
  Filter,
  Sparkles,
  ArrowUpDown,
  ChevronDown,
  Calendar,
  Tag,
  Check,
} from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

interface Props {
  initialLeads: any[];
  staffUsers: { id: string; name: string; role: string }[];
}

const STAGES = [
  'ALL',
  'NEW',
  'CONTACTED',
  'DESIGN_REVIEW',
  'QUOTATION_SENT',
  'CONVERTED',
  'CLOSED',
];

const STAGE_RANK: Record<string, number> = {
  NEW: 1,
  CONTACTED: 2,
  DESIGN_REVIEW: 3,
  QUOTATION_SENT: 4,
  CONVERTED: 5,
  CLOSED: 6,
};

export default function LeadsManagerClient({ initialLeads, staffUsers }: Props) {
  const router = useRouter();
  const { error: toastError, success: toastSuccess } = useToast();
  const [leads, setLeads] = useState(initialLeads);
  const [filterStage, setFilterStage] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const [noteText, setNoteText] = useState('');
  const [updating, setUpdating] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const fetchLatestLeads = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch('/api/leads', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setLeads(data);
        }
      }
    } catch (e) {
      console.error('Failed to poll leads', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const refreshTimer = window.setInterval(() => {
      fetchLatestLeads();
    }, 5000);
    return () => window.clearInterval(refreshTimer);
  }, []);

  useEffect(() => {
    setLeads(initialLeads);
    setSelectedLead((current: any) => current
      ? initialLeads.find((lead) => lead.id === current.id) || null
      : null);
  }, [initialLeads]);

  // Filtered Leads
  const filtered = leads.filter((l) => {
    if (filterStage !== 'ALL' && l.stage !== filterStage) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchName = l.customer.fullName.toLowerCase().includes(q);
      const matchCode = l.leadCode.toLowerCase().includes(q);
      const matchCity = (l.customer.city || '').toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchCity) return false;
    }
    return true;
  });

  const handleStageChange = async (leadId: string, newStage: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    const currentRank = STAGE_RANK[lead.stage] ?? 1;
    const targetRank = STAGE_RANK[newStage] ?? 1;

    if (targetRank < currentRank) {
      toastError(
        'Forward Progression Only',
        `Lead status cannot go backward from ${lead.stage.replace(/_/g, ' ')} to ${newStage.replace(/_/g, ' ')}.`
      );
      return;
    }

    if (currentRank >= 5 && targetRank !== currentRank) {
      toastError(
        'Locked Stage',
        `This lead is already ${lead.stage.replace(/_/g, ' ')} and cannot be changed.`
      );
      return;
    }

    setUpdating(true);
    try {
      // Update via /api/leads PATCH
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: leadId,
          stage: newStage,
          priority: lead?.priority || 'MEDIUM',
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result?.error || 'Unable to update lead stage.');
      }

      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, stage: newStage } : l))
      );
      if (selectedLead?.id === leadId) {
        const changedAt = new Date().toISOString();
        const activityUpdates = selectedLead.stage === newStage ? [] : [
          { id: `stage-${changedAt}`, action: 'STAGE_CHANGE', details: `Lead updated: ${newStage.replaceAll('_', ' ')}`, createdAt: changedAt },
        ];
        setSelectedLead((prev: any) => ({ ...prev, stage: newStage, activities: [...activityUpdates, ...(prev.activities || [])] }));
      }
      toastSuccess(
        'Lead Updated',
        result.notification || `Stage set to ${newStage}.`
      );
    } catch (error: any) {
      toastError('Lead Update Error', error?.message || 'Unable to save lead.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Executive Command Toolbar */}
      <div className="bg-white rounded-xl border border-platinum-border shadow-xs p-3 sm:p-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left Side: Search + Filter Popover */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Prominent Search Bar */}
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="w-4 h-4 text-slate-muted absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by customer name, phone, lead code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2 rounded-lg bg-platinum-soft/60 border border-platinum-border text-xs text-graphite placeholder:text-slate-muted focus:outline-none focus:border-graphite focus:bg-white transition-all shadow-2xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2.5 p-1 rounded-md text-slate-muted hover:text-graphite hover:bg-platinum"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dedicated Filter Button & Dropdown Menu */}
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => setFilterOpen((prev) => !prev)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium border flex items-center gap-2 transition-all shadow-2xs cursor-pointer ${
                filterStage !== 'ALL'
                  ? 'bg-graphite text-white border-graphite shadow-xs'
                  : 'bg-platinum-soft/70 hover:bg-platinum text-graphite border-platinum-border'
              }`}
              title="Filter by inquiry stage"
            >
              <Filter className={`w-3.5 h-3.5 ${filterStage !== 'ALL' ? 'text-accent-gold' : 'text-slate-muted'}`} />
              <span>
                {filterStage === 'ALL' ? 'Filter' : filterStage.replace(/_/g, ' ')}
              </span>
              {filterStage !== 'ALL' && (
                <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
              )}
              <ChevronDown className={`w-3.5 h-3.5 text-slate-muted transition-transform duration-200 ${filterOpen ? 'rotate-180 text-white' : ''}`} />
            </button>

            {/* Filter Dropdown Popover */}
            {filterOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl border border-platinum-border shadow-xl py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3.5 py-2 border-b border-platinum-border/70 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-graphite uppercase tracking-wider">Filter By Stage</span>
                  {filterStage !== 'ALL' && (
                    <button
                      type="button"
                      onClick={() => {
                        setFilterStage('ALL');
                        setFilterOpen(false);
                      }}
                      className="text-accent-gold hover:underline font-medium cursor-pointer"
                    >
                      Reset All
                    </button>
                  )}
                </div>

                <div className="py-1 max-h-72 overflow-y-auto">
                  {STAGES.map((st) => {
                    const count = st === 'ALL' ? leads.length : leads.filter((l) => l.stage === st).length;
                    const isSelected = filterStage === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          setFilterStage(st);
                          setFilterOpen(false);
                        }}
                        className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-platinum-soft font-semibold text-graphite'
                            : 'text-slate-dark hover:bg-platinum-soft/60 hover:text-graphite'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-4 flex items-center justify-center ${isSelected ? 'text-graphite' : 'opacity-0'}`}>
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </span>
                          <span>{st === 'ALL' ? 'All Inquiries' : st.replace(/_/g, ' ')}</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                            isSelected
                              ? 'bg-graphite text-white font-bold'
                              : 'bg-platinum text-slate-dark'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Active Filter Indicator Badge */}
          {filterStage !== 'ALL' && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-platinum-soft border border-platinum-border text-xs text-graphite animate-in fade-in duration-150">
              <span className="text-slate-muted text-[11px]">Stage:</span>
              <span className="font-semibold text-xs">{filterStage.replace(/_/g, ' ')}</span>
              <button
                type="button"
                onClick={() => setFilterStage('ALL')}
                className="p-0.5 text-slate-muted hover:text-graphite rounded hover:bg-platinum transition-colors"
                title="Remove stage filter"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Right Action Counters & Refresh */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end text-xs border-t md:border-t-0 pt-2.5 md:pt-0 border-platinum-border/70">
          <span className="text-[11px] text-slate-dark font-medium whitespace-nowrap">
            Showing <strong className="text-graphite font-semibold">{filtered.length}</strong> of {leads.length} leads
          </span>

          <button
            type="button"
            onClick={() => {
              fetchLatestLeads();
              router.refresh();
            }}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-lg font-medium text-xs bg-white hover:bg-platinum-soft text-graphite border border-platinum-border inline-flex items-center gap-2 disabled:opacity-50 transition-all shadow-2xs active:scale-98 cursor-pointer"
            title="Refresh leads list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-accent-gold' : 'text-slate-dark'}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Live Sync'}</span>
          </button>
        </div>
      </div>

      {/* Dynamic Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start transition-all duration-300">
        {/* Leads List: Full-width by default, shrinks to col-span-5 when lead selected */}
        <div className={`${selectedLead ? 'lg:col-span-5' : 'lg:col-span-12'} bg-white rounded-xl border border-platinum-border shadow-xs overflow-hidden divide-y divide-platinum-border max-h-[820px] overflow-y-auto transition-all duration-300`}>
          <div className="p-3 bg-platinum-soft/40 border-b border-platinum-border flex items-center justify-between text-xs">
            <span className="font-semibold text-graphite flex items-center gap-2">
              <span>Customer Inquiries</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-platinum text-slate-dark font-mono font-medium">
                {filtered.length}
              </span>
            </span>
            {selectedLead && (
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="text-[11px] text-slate-muted hover:text-graphite flex items-center gap-1 font-medium bg-white px-2 py-1 rounded-md border border-platinum-border shadow-2xs transition-colors"
                title="Expand list to full width"
              >
                <Maximize2 className="w-3 h-3" />
                <span>Full List</span>
              </button>
            )}
          </div>
          {filtered.length === 0 ? (
            <div className="p-16 text-center text-xs text-slate-dark space-y-1">
              <p className="font-medium text-graphite text-sm">No inquiries found</p>
              <p className="text-slate-muted">Try clearing your search query or selecting another stage filter.</p>
            </div>
          ) : (
            filtered.map((lead) => {
              const isSelected = selectedLead?.id === lead.id;
              return (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(isSelected ? null : lead)}
                  className={`p-4 cursor-pointer transition-all duration-150 ${
                    isSelected 
                      ? 'bg-platinum-soft/80 border-l-4 border-graphite shadow-2xs' 
                      : 'hover:bg-platinum-soft/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono font-bold text-graphite tracking-tight">{lead.leadCode}</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${
                        lead.stage === 'NEW' 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : lead.stage === 'CONTACTED' 
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : lead.stage === 'CONVERTED' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-platinum text-slate-dark border border-platinum-border'
                      }`}>
                        {lead.stage.replace(/_/g, ' ')}
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 text-slate-muted transition-transform duration-200 ${isSelected ? 'rotate-90 text-graphite' : ''}`} />
                    </div>
                  </div>

                  <h4 className="font-serif font-medium text-graphite text-base">{lead.customer.fullName}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-dark mt-0.5">
                    <span>{lead.customer.phone}</span>
                    <span className="text-slate-silver">•</span>
                    <span>{lead.customer.city || 'Agra'}</span>
                    {lead.product?.name && (
                      <>
                        <span className="text-slate-silver">•</span>
                        <span className="text-slate-muted truncate max-w-[140px]">{lead.product.name}</span>
                      </>
                    )}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-platinum-border/60 flex items-center justify-between text-[11px] text-slate-muted">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-muted" />
                      <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                    </span>
                    <span className={`font-medium ${lead.priority === 'URGENT' ? 'text-red-600' : 'text-slate-dark'}`}>
                      {lead.priority} Priority
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Details Panel: Appears only when a lead is selected */}
        {selectedLead && (
          <div className="lg:col-span-7 bg-white rounded-xl p-6 sm:p-7 border border-platinum-border shadow-xs space-y-6 transition-all duration-300">
            {/* Header with Quick Stage Changer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-platinum-border pb-5 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-muted">{selectedLead.leadCode}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    selectedLead.stage === 'NEW' 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : selectedLead.stage === 'CONTACTED' 
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : selectedLead.stage === 'CONVERTED' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-platinum text-slate-dark border border-platinum-border'
                  }`}>
                    {selectedLead.stage.replace(/_/g, ' ')}
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-medium text-graphite mt-1">
                  {selectedLead.customer.fullName}
                </h3>
                <p className="text-xs text-slate-muted mt-0.5">
                  Registered {new Date(selectedLead.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-semibold text-slate-muted uppercase tracking-wider">
                      Pipeline Stage
                    </span>
                    {(STAGE_RANK[selectedLead.stage] ?? 1) >= 5 && (
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        Final Stage
                      </span>
                    )}
                  </div>
                  <select
                    disabled={updating || (STAGE_RANK[selectedLead.stage] ?? 1) >= 5}
                    value={selectedLead.stage}
                    onChange={(e) => handleStageChange(selectedLead.id, e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-platinum-soft/80 border border-platinum-border text-xs font-semibold text-graphite focus:outline-none focus:border-graphite shadow-2xs disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                    title={
                      (STAGE_RANK[selectedLead.stage] ?? 1) >= 5
                        ? 'This lead has reached its final stage and cannot be modified.'
                        : 'Stages can only progress forward.'
                    }
                  >
                    {STAGES.filter((s) => s !== 'ALL').map((s) => {
                      const isPast = (STAGE_RANK[s] ?? 1) < (STAGE_RANK[selectedLead.stage] ?? 1);
                      return (
                        <option key={s} value={s} disabled={isPast}>
                          {s.replace(/_/g, ' ')}{isPast ? ' ✕ (Past Stage - Locked)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="p-2 mt-4 rounded-lg bg-platinum-soft hover:bg-platinum text-slate-dark border border-platinum-border transition-colors"
                  title="Close lead details"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Customer Contact Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-platinum-soft/40 p-4 rounded-xl border border-platinum-border text-xs text-slate-dark">
              <div>
                <span className="text-[11px] font-medium text-slate-muted block">Phone</span>
                <span className="font-semibold text-graphite text-xs">{selectedLead.customer.phone}</span>
              </div>
              <div>
                <span className="text-[11px] font-medium text-slate-muted block">Email</span>
                <span className="font-semibold text-graphite text-xs truncate block" title={selectedLead.customer.email || 'None'}>
                  {selectedLead.customer.email || '—'}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-medium text-slate-muted block">Location</span>
                <span className="text-graphite font-medium">{selectedLead.customer.city || 'Agra'}</span>
              </div>
            </div>

            {/* Quick Actions (WhatsApp & PDF) */}
            <div className="flex flex-wrap gap-2.5">
              <a
                href={`https://wa.me/${(selectedLead.customer.whatsapp || selectedLead.customer.phone).replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors shadow-2xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Client</span>
              </a>

              {selectedLead.customer.email && (
                <a
                  href={`mailto:${selectedLead.customer.email}`}
                  className="px-4 py-2 bg-white hover:bg-platinum-soft text-slate-dark border border-platinum-border rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors shadow-2xs"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-muted" />
                  <span>Send Direct Email</span>
                </a>
              )}

              <Link
                href={`/admin/quotations?leadId=${selectedLead.id}&customerId=${selectedLead.customer.id}`}
                className="px-4 py-2 bg-graphite hover:bg-graphite-hover text-white rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors shadow-2xs ml-auto"
              >
                <FileText className="w-3.5 h-3.5 text-slate-silver" />
                <span>Generate Official Quotation</span>
              </Link>
            </div>

            {/* Linked Design Request or Inquiry Detail */}
            {selectedLead.designRequest && (
              <div className="p-4 rounded-xl bg-platinum-soft/30 border border-platinum-border text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-dark uppercase tracking-wider text-[10px]">Linked Design Request</span>
                  <span className="font-mono font-bold text-graphite">{selectedLead.designRequest.referenceNumber}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 text-slate-dark">
                  <p><strong className="text-graphite font-medium">Furniture:</strong> {selectedLead.designRequest.furnitureType}</p>
                  <p><strong className="text-graphite font-medium">Dimensions:</strong> {selectedLead.designRequest.dimensionsSummary || 'Custom'}</p>
                  <p><strong className="text-graphite font-medium">Fabric:</strong> {selectedLead.designRequest.fabricPreference || 'Client Choice'}</p>
                  <p><strong className="text-graphite font-medium">Color:</strong> {selectedLead.designRequest.colorPreference || 'Custom'}</p>
                </div>
                {selectedLead.designRequest.attachments && selectedLead.designRequest.attachments.length > 0 && (
                  <div className="pt-2">
                    <span className="text-slate-dark font-medium block mb-1">Uploaded References:</span>
                    <div className="flex gap-2">
                      {selectedLead.designRequest.attachments.map((att: any) => (
                        <div key={att.id} className="w-16 h-16 rounded border border-platinum-border overflow-hidden">
                          <img src={att.fileUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Lead Activity Timeline */}
            <div className="space-y-3 pt-3 border-t border-platinum-border">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-medium text-sm text-graphite">Activity &amp; Communications History</h4>
                <span className="text-[10px] text-slate-muted font-mono">{selectedLead.activities?.length || 0} Events Logged</span>
              </div>
              <div className="space-y-2 text-xs max-h-60 overflow-y-auto pr-1">
                {selectedLead.activities?.map((act: any) => (
                  <div key={act.id} className="p-3 rounded-lg bg-platinum-soft/40 border border-platinum-border flex justify-between items-start gap-3">
                    <div>
                      <span className="font-bold text-[10px] text-slate-dark tracking-wide uppercase">{act.action.replace(/_/g, ' ')}</span>
                      <p className="text-graphite/90 mt-0.5 text-xs">{act.details}</p>
                    </div>
                    <span className="text-[10px] text-slate-muted whitespace-nowrap">
                      {new Date(act.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
