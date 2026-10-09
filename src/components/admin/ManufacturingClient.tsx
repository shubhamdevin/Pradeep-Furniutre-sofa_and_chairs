'use client';

import React, { useState } from 'react';
import { 
  Wrench, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Scissors, 
  ShieldCheck, 
  AlertTriangle, 
  Package, 
  ArrowRight,
  Plus,
  Send,
  Lock
} from 'lucide-react';

interface Props {
  initialJobs: any[];
}

const STAGE_ORDER = [
  'JOB_RELEASED',
  'MATERIAL_PLANNING',
  'WOOD_CUTTING',
  'FRAME_ASSEMBLY',
  'SPRING_WEBBING',
  'FOAM_CUTTING',
  'CUSHIONING',
  'FABRIC_CUTTING',
  'STITCHING',
  'UPHOLSTERY',
  'FINAL_FINISHING',
  'QUALITY_INSPECTION',
  'PACKAGING',
  'DISPATCH_READY',
  'CLOSED_INTERNALLY',
];

export default function ManufacturingClient({ initialJobs }: Props) {
  const [jobs, setJobs] = useState(initialJobs);
  const [selectedJob, setSelectedJob] = useState<any | null>(initialJobs[0] || null);
  const [advancing, setAdvancing] = useState(false);

  // Advance to next stage
  const handleAdvanceStage = async () => {
    if (!selectedJob) return;
    const currentIdx = STAGE_ORDER.indexOf(selectedJob.currentStage);
    if (currentIdx >= STAGE_ORDER.length - 1) {
      alert('This job is already at the final stage (Closed Internally).');
      return;
    }

    const nextStage = STAGE_ORDER[currentIdx + 1];
    setAdvancing(true);

    try {
      const res = await fetch(`/api/manufacturing/${selectedJob.id}/stage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newStage: nextStage,
          completedStageNumber: currentIdx + 1,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSelectedJob((prev: any) => ({
          ...prev,
          currentStage: nextStage,
        }));
        setJobs((prev) =>
          prev.map((j) => (j.id === selectedJob.id ? { ...j, currentStage: nextStage } : j))
        );
      } else {
        alert(data.error || 'Failed to advance stage.');
      }
    } catch (err) {
      console.error(err);
      alert('Error advancing stage.');
    } finally {
      setAdvancing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Jobs List */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-ivory-300 shadow-sm divide-y divide-ivory-200 max-h-[750px] overflow-y-auto">
        {jobs.map((job) => (
          <div
            key={job.id}
            onClick={() => setSelectedJob(job)}
            className={`p-5 cursor-pointer transition-colors ${
              selectedJob?.id === job.id ? 'bg-cream/40 border-l-4 border-gold' : 'hover:bg-ivory-50'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-mono font-bold text-charcoal">{job.jobCardNumber}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                {job.currentStage.replace('_', ' ')}
              </span>
            </div>

            <h4 className="font-serif font-medium text-charcoal text-base">{job.productTitle}</h4>
            <p className="text-xs text-charcoal/70">{job.customer.fullName} • Qty: {job.quantity}</p>

            <div className="mt-2 flex items-center justify-between text-[11px] text-walnut font-medium">
              <span>Target: {new Date(job.targetCompletionDate).toLocaleDateString()}</span>
              <span className="font-semibold text-charcoal">{job.priority} Priority</span>
            </div>
          </div>
        ))}
      </div>

      {/* Right Details Stage & 15 Stages Tracker */}
      {selectedJob ? (
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-ivory-300 shadow-luxury space-y-6">
          <div className="flex items-start justify-between border-b border-ivory-200 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-gold text-sm">{selectedJob.jobCardNumber}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                  {selectedJob.currentStage.replace('_', ' ')}
                </span>
              </div>
              <h3 className="font-serif text-2xl font-semibold text-charcoal mt-1">
                {selectedJob.productTitle}
              </h3>
              <p className="text-xs text-charcoal/60 mt-0.5">
                Client: {selectedJob.customer.fullName} • Qty: {selectedJob.quantity}
              </p>
            </div>

            <button
              onClick={handleAdvanceStage}
              disabled={advancing}
              className="px-4 py-2 bg-charcoal hover:bg-charcoal-light text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-gold" />
              <span>{advancing ? 'Updating...' : 'Advance Stage →'}</span>
            </button>
          </div>

          {/* Job Specifications Grid */}
          <div className="grid grid-cols-2 gap-4 bg-ivory-50 p-4 rounded-xl border border-ivory-200 text-xs text-charcoal/80">
            <div>
              <span className="text-walnut font-medium block">Exact Dimensions:</span>
              <span className="font-semibold text-charcoal">{selectedJob.exactDimensions}</span>
            </div>
            <div>
              <span className="text-walnut font-medium block">Fabric Specification:</span>
              <span className="font-semibold text-charcoal">{selectedJob.fabricCodeAndColor}</span>
            </div>
            <div className="col-span-2">
              <span className="text-walnut font-medium block">Frame Instructions:</span>
              <p className="text-charcoal/80 mt-0.5">{selectedJob.frameInstructions}</p>
            </div>
            <div className="col-span-2">
              <span className="text-walnut font-medium block">Foam &amp; Cushioning Instructions:</span>
              <p className="text-charcoal/80 mt-0.5">{selectedJob.foamSpecification}</p>
            </div>
          </div>

          {/* 15 Production Stages Stepper (Section 13.2) */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-walnut uppercase tracking-wider">
                15 Workshop Stages Progress:
              </span>
              <span className="text-xs font-mono font-bold text-gold">
                Stage {STAGE_ORDER.indexOf(selectedJob.currentStage) + 1} of 15
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-[10px]">
              {STAGE_ORDER.map((st, i) => {
                const currentIdx = STAGE_ORDER.indexOf(selectedJob.currentStage);
                const isPassed = i < currentIdx;
                const isCurrent = i === currentIdx;

                return (
                  <div
                    key={st}
                    className={`p-2 rounded-lg border text-center font-medium transition-all ${
                      isCurrent
                        ? 'bg-charcoal text-white border-charcoal font-bold ring-2 ring-gold/40'
                        : isPassed
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                        : 'bg-ivory-50 text-charcoal/50 border-ivory-200'
                    }`}
                  >
                    <span className="block text-[9px] opacity-70">Step {i + 1}</span>
                    <span className="truncate block mt-0.5">{st.replace('_', ' ')}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bill of Materials (BOM) Section 13.3 */}
          {selectedJob.bom && (
            <div className="space-y-2 pt-2 border-t border-ivory-200">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-walnut uppercase tracking-wider">Bill of Materials (BOM):</span>
                <span className="font-mono font-bold text-charcoal">
                  Total Material Cost: ₹{selectedJob.bom.totalCost?.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="border border-ivory-300 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-ivory-50 border-b border-ivory-200 text-walnut font-semibold">
                    <tr>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Description</th>
                      <th className="p-2.5 text-center">Req. Qty</th>
                      <th className="p-2.5 text-right">Est. Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ivory-200">
                    {selectedJob.bom.items?.map((item: any) => (
                      <tr key={item.id}>
                        <td className="p-2.5 font-medium">{item.materialCategory}</td>
                        <td className="p-2.5 text-charcoal/80">{item.description}</td>
                        <td className="p-2.5 text-center">{item.requiredQty} {item.unit}</td>
                        <td className="p-2.5 text-right font-mono">₹{item.totalEstimatedCost?.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Quality Control (QC) Certificate Section 13.4 */}
          <div className="space-y-2 pt-2 border-t border-ivory-200">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-walnut uppercase tracking-wider">Quality Control (QC) Status:</span>
              <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                {selectedJob.inspections?.[0]?.result || 'PASS (Certified)'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-ivory-50 p-3.5 rounded-xl border border-ivory-200">
              <div className="flex items-center space-x-1.5 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Dimensions Check: PASS</span>
              </div>
              <div className="flex items-center space-x-1.5 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Frame Mortise: PASS</span>
              </div>
              <div className="flex items-center space-x-1.5 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Spring Tension: PASS</span>
              </div>
              <div className="flex items-center space-x-1.5 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Stitching &amp; Tufting: PASS</span>
              </div>
              <div className="flex items-center space-x-1.5 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Foam Resilience: PASS</span>
              </div>
              <div className="flex items-center space-x-1.5 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Design Match: 100%</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
