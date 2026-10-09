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
  Plus, 
  ChevronRight,
  Sparkles
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
      // Update locally
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
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-ivory-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search leads by customer, code, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-ivory-50 border border-ivory-300 text-xs focus:outline-none focus:border-gold"
          />
          <Search className="w-4 h-4 text-walnut absolute left-3 top-2.5" />
        </div>

        {/* Stage Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto overflow-x-auto text-xs">
          {STAGES.map((st) => (
            <button
              key={st}
              onClick={() => setFilterStage(st)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                filterStage === st
                  ? 'bg-charcoal text-white shadow-sm'
                  : 'bg-ivory-100 hover:bg-ivory-200 text-charcoal'
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
        <div className="lg:col-span-5 bg-white rounded-2xl border border-ivory-300 shadow-sm overflow-hidden divide-y divide-ivory-200 max-h-[750px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-charcoal/60">
              No leads match this stage filter.
            </div>
          ) : (
            filtered.map((lead) => (
              <div
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedLead?.id === lead.id ? 'bg-cream/40 border-l-4 border-gold' : 'hover:bg-ivory-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono font-bold text-charcoal">{lead.leadCode}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-ivory-200 text-walnut">
                    {lead.stage}
                  </span>
                </div>

                <h4 className="font-serif font-medium text-charcoal text-sm">{lead.customer.fullName}</h4>
                <p className="text-xs text-charcoal/70">{lead.customer.phone} • {lead.customer.city || 'Agra'}</p>

                <div className="mt-2 flex items-center justify-between text-[11px] text-walnut">
                  <span>Source: {lead.source}</span>
                  <span className="font-semibold">{lead.priority} Priority</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Details Panel */}
        {selectedLead ? (
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-ivory-300 shadow-luxury space-y-6">
            <div className="flex items-start justify-between border-b border-ivory-200 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-gold">{selectedLead.leadCode}</span>
                <h3 className="font-serif text-2xl font-semibold text-charcoal mt-0.5">
                  {selectedLead.customer.fullName}
                </h3>
                <p className="text-xs text-charcoal/60 mt-0.5">
                  Lead registered on {new Date(selectedLead.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Stage Transition Selector */}
              <div>
                <label className="block text-[10px] font-semibold text-walnut uppercase tracking-wider mb-1">
                  Lead Pipeline Stage:
                </label>
                <select
                  value={selectedLead.stage}
                  onChange={(e) => handleStageChange(selectedLead.id, e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-ivory-100 border border-ivory-300 text-xs font-bold text-charcoal focus:outline-none focus:border-gold"
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
            <div className="grid grid-cols-2 gap-4 bg-ivory-50 p-4 rounded-xl border border-ivory-200 text-xs text-charcoal/80">
              <div>
                <span className="text-walnut font-medium block">Phone Number:</span>
                <span className="font-semibold text-charcoal">{selectedLead.customer.phone}</span>
              </div>
              <div>
                <span className="text-walnut font-medium block">WhatsApp:</span>
                <span className="font-semibold text-charcoal">{selectedLead.customer.whatsapp || selectedLead.customer.phone}</span>
              </div>
              <div>
                <span className="text-walnut font-medium block">Delivery City:</span>
                <span>{selectedLead.customer.city || 'Agra'}</span>
              </div>
              <div>
                <span className="text-walnut font-medium block">Customer Type:</span>
                <span>{selectedLead.customer.customerType}</span>
              </div>
            </div>

            {/* Design Request or Product Interest */}
            {selectedLead.designRequest && (
              <div className="p-4 rounded-xl bg-cream/40 border border-gold/30 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-walnut uppercase tracking-wider">Linked Custom Request:</span>
                  <span className="font-mono font-bold text-charcoal">{selectedLead.designRequest.referenceNumber}</span>
                </div>
                <p><strong>Silhouette:</strong> {selectedLead.designRequest.furnitureType}</p>
                <p><strong>Dimensions:</strong> {selectedLead.designRequest.dimensionsSummary}</p>
                <p><strong>Fabric:</strong> {selectedLead.designRequest.fabricPreference} ({selectedLead.designRequest.colorPreference})</p>
                {selectedLead.designRequest.attachments?.length > 0 && (
                  <div className="pt-2">
                    <span className="text-walnut font-medium block mb-1">Uploaded References:</span>
                    <div className="flex gap-2">
                      {selectedLead.designRequest.attachments.map((att: any) => (
                        <div key={att.id} className="w-16 h-16 rounded-lg overflow-hidden border border-ivory-300">
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
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Open WhatsApp</span>
              </a>

              <Link
                href={`/admin/quotations?leadId=${selectedLead.id}&customerId=${selectedLead.customer.id}`}
                className="px-4 py-2 bg-charcoal hover:bg-charcoal-light text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-gold" />
                <span>Prepare Quotation PDF</span>
              </Link>
            </div>

            {/* Activity History */}
            <div className="space-y-3 pt-4 border-t border-ivory-200">
              <h4 className="font-serif font-semibold text-sm text-charcoal">Activity History</h4>
              <div className="space-y-2 text-xs">
                {selectedLead.activities?.map((act: any) => (
                  <div key={act.id} className="p-3 rounded-lg bg-ivory-50 border border-ivory-200 flex justify-between items-start">
                    <div>
                      <span className="font-semibold text-walnut uppercase text-[10px] block">{act.action}</span>
                      <p className="text-charcoal/80 mt-0.5">{act.details}</p>
                    </div>
                    <span className="text-[10px] text-charcoal/50 whitespace-nowrap ml-4">
                      {new Date(act.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 bg-white rounded-2xl p-12 text-center border border-ivory-300 text-xs text-charcoal/60">
            Select a lead to inspect details.
          </div>
        )}
      </div>
    </div>
  );
}
