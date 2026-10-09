'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  ChevronRight
} from 'lucide-react';

interface Props {
  initialLeads: any[];
  staffUsers: { id: string; name: string; role: string }[];
}

const STAGES = [
  'ALL',
  'NEW',
  'CONTACTED',
  'REQUIREMENTS_COLLECTED',
  'DESIGN_REVIEW',
  'QUOTATION_SENT',
  'NEGOTIATION',
  'CONVERTED',
  'ON_HOLD',
];

export default function LeadsManagerClient({ initialLeads, staffUsers }: Props) {
  const [leads, setLeads] = useState(initialLeads);
  const [filterStage, setFilterStage] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<any | null>(initialLeads[0] || null);

  const [noteText, setNoteText] = useState('');
  const [updating, setUpdating] = useState(false);

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
    setUpdating(true);
    try {
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, stage: newStage } : l))
      );
      if (selectedLead?.id === leadId) {
        setSelectedLead((prev: any) => ({ ...prev, stage: newStage }));
      }
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Filter and Search Bar */}
      <div className="bg-white rounded-md p-4 border border-platinum-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search leads by customer, code, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-md bg-platinum-soft border border-platinum-border text-xs text-graphite focus:outline-none focus:border-graphite"
          />
          <Search className="w-4 h-4 text-slate-muted absolute left-3 top-2.5" />
        </div>

        {/* Stage Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto overflow-x-auto text-xs">
          {STAGES.map((st) => (
            <button
              key={st}
              onClick={() => setFilterStage(st)}
              className={`px-3 py-1.5 rounded-md font-medium text-xs transition-colors ${
                filterStage === st
                  ? 'bg-graphite text-white shadow-sm'
                  : 'bg-platinum-soft hover:bg-platinum text-slate-dark border border-platinum-border'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Two-Column Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left List of Leads */}
        <div className="lg:col-span-5 bg-white rounded-md border border-platinum-border shadow-sm overflow-hidden divide-y divide-platinum-border max-h-[750px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-dark">
              No leads match this stage filter.
            </div>
          ) : (
            filtered.map((lead) => (
              <div
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedLead?.id === lead.id 
                    ? 'bg-platinum-soft/70 border-l-2 border-graphite' 
                    : 'hover:bg-platinum-soft/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono font-medium text-graphite">{lead.leadCode}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase bg-platinum-soft text-slate-dark border border-platinum-border">
                    {lead.stage}
                  </span>
                </div>

                <h4 className="font-medium text-graphite text-sm">{lead.customer.fullName}</h4>
                <p className="text-xs text-slate-dark">{lead.customer.phone} • {lead.customer.city || 'Agra'}</p>

                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-muted">
                  <span>Source: {lead.source}</span>
                  <span className="font-medium text-slate-dark">{lead.priority} Priority</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Details Panel */}
        {selectedLead ? (
          <div className="lg:col-span-7 bg-white rounded-md p-6 sm:p-8 border border-platinum-border shadow-sm space-y-6">
            <div className="flex items-start justify-between border-b border-platinum-border pb-4">
              <div>
                <span className="text-xs font-mono font-medium text-slate-muted">{selectedLead.leadCode}</span>
                <h3 className="font-serif text-2xl font-medium text-graphite mt-0.5">
                  {selectedLead.customer.fullName}
                </h3>
                <p className="text-xs text-slate-muted mt-0.5">
                  Lead registered on {new Date(selectedLead.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Stage Transition Selector */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-dark uppercase tracking-wider mb-1">
                  Lead Pipeline Stage:
                </label>
                <select
                  value={selectedLead.stage}
                  onChange={(e) => handleStageChange(selectedLead.id, e.target.value)}
                  className="px-3 py-1.5 rounded-md bg-platinum-soft border border-platinum-border text-xs font-medium text-graphite focus:outline-none focus:border-graphite"
                >
                  {STAGES.filter((s) => s !== 'ALL').map((s) => (
                    <option key={s} value={s}>
                      {s.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Customer Details Grid */}
            <div className="grid grid-cols-2 gap-4 bg-platinum-soft/50 p-4 rounded-md border border-platinum-border text-xs text-slate-dark">
              <div>
                <span className="font-medium text-slate-dark block">Phone Number:</span>
                <span className="font-semibold text-graphite">{selectedLead.customer.phone}</span>
              </div>
              <div>
                <span className="font-medium text-slate-dark block">WhatsApp:</span>
                <span className="font-semibold text-graphite">{selectedLead.customer.whatsapp || selectedLead.customer.phone}</span>
              </div>
              <div>
                <span className="font-medium text-slate-dark block">Delivery City:</span>
                <span className="text-graphite">{selectedLead.customer.city || 'Agra'}</span>
              </div>
              <div>
                <span className="font-medium text-slate-dark block">Customer Type:</span>
                <span className="text-graphite">{selectedLead.customer.customerType}</span>
              </div>
            </div>

            {/* Design Request or Product Interest */}
            {selectedLead.designRequest && (
              <div className="p-4 rounded-md bg-platinum-soft/60 border border-platinum-border text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-dark uppercase tracking-wider text-[11px]">Linked Custom Request:</span>
                  <span className="font-mono font-medium text-graphite">{selectedLead.designRequest.referenceNumber}</span>
                </div>
                <p><strong className="text-slate-dark font-medium">Silhouette:</strong> {selectedLead.designRequest.furnitureType}</p>
                <p><strong className="text-slate-dark font-medium">Dimensions:</strong> {selectedLead.designRequest.dimensionsSummary}</p>
                <p><strong className="text-slate-dark font-medium">Fabric:</strong> {selectedLead.designRequest.fabricPreference} ({selectedLead.designRequest.colorPreference})</p>
                {selectedLead.designRequest.attachments?.length > 0 && (
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

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={`https://wa.me/${(selectedLead.customer.whatsapp || selectedLead.customer.phone).replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-graphite hover:bg-graphite-hover text-white rounded-md text-xs font-medium flex items-center space-x-1.5 transition-colors shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5 text-slate-silver" />
                <span>Open WhatsApp</span>
              </a>

              <Link
                href={`/admin/quotations?leadId=${selectedLead.id}&customerId=${selectedLead.customer.id}`}
                className="px-4 py-2 bg-platinum hover:bg-platinum-soft text-graphite border border-platinum-border rounded-md text-xs font-medium flex items-center space-x-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-slate-muted" />
                <span>Prepare Quotation PDF</span>
              </Link>
            </div>

            {/* Activity History */}
            <div className="space-y-3 pt-4 border-t border-platinum-border">
              <h4 className="font-serif font-medium text-sm text-graphite">Activity History</h4>
              <div className="space-y-2 text-xs">
                {selectedLead.activities?.map((act: any) => (
                  <div key={act.id} className="p-3 rounded-md bg-platinum-soft/50 border border-platinum-border flex justify-between items-start">
                    <div>
                      <span className="font-medium text-slate-dark uppercase text-[10px] block">{act.action}</span>
                      <p className="text-graphite/90 mt-0.5">{act.details}</p>
                    </div>
                    <span className="text-[10px] text-slate-muted whitespace-nowrap ml-4">
                      {new Date(act.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 bg-white rounded-md p-12 text-center border border-platinum-border text-xs text-slate-dark">
            Select a lead to inspect details.
          </div>
        )}
      </div>
    </div>
  );
}
