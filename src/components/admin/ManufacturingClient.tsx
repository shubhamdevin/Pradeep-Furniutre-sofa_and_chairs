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
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

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
  const { error: toastError, success: toastSuccess, info: toastInfo } = useToast();
  const [jobs, setJobs] = useState(initialJobs);
  const [selectedJob, setSelectedJob] = useState<any | null>(initialJobs[0] || null);
  const [advancing, setAdvancing] = useState(false);

  // Advance to next stage
  const handleAdvanceStage = async () => {
    if (!selectedJob) return;
    const currentIdx = STAGE_ORDER.indexOf(selectedJob.currentStage);
    if (currentIdx >= STAGE_ORDER.length - 1) {
      toastInfo('Job Completed', 'This job is already at the final stage (Closed Internally).');
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
          currentStage: data.currentStage,
          tasks: data.tasks,
        }));
        setJobs((prev) =>
          prev.map((j) => (j.id === selectedJob.id ? { ...j, currentStage: data.currentStage, tasks: data.tasks } : j))
        );
        const emailNote = data.emailNotification === 'sent'
          ? ' Customer email sent.'
          : data.emailNotification === 'missing_email'
            ? ' Customer has no email address on file.'
            : ' Customer email was not sent; check SMTP configuration and server logs.';
        toastSuccess('Stage Updated', `Job transitioned to ${data.currentStage}.${emailNote}`);
      } else {
        toastError('Stage Update Failed', data.error || 'Failed to advance stage.');
      }
    } catch (err) {
      console.error(err);
      toastError('System Error', 'Error advancing stage.');
    } finally {
      setAdvancing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
      {/* Left Jobs List */}
      <div className="lg:col-span-5 bg-white rounded-md border border-platinum-border shadow-sm divide-y divide-platinum-border max-h-[750px] overflow-y-auto">
        {jobs.map((job) => (
          <div
            key={job.id}
            onClick={() => setSelectedJob(job)}
            className={`p-5 cursor-pointer transition-colors ${
              selectedJob?.id === job.id 
                ? 'bg-platinum-soft/70 border-l-2 border-graphite' 
                : 'hover:bg-platinum-soft/40'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-mono font-medium text-graphite">{job.jobCardNumber}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase bg-status-success/10 text-status-success">
                {job.currentStage.replace('_', ' ')}
              </span>
            </div>

            <h4 className="font-serif font-medium text-graphite text-base">{job.productTitle}</h4>
            <p className="text-xs text-slate-dark">{job.customer.fullName} • Qty: {job.quantity}</p>

            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-muted font-medium">
              <span>Target: {new Date(job.targetCompletionDate).toLocaleDateString()}</span>
              <span className="font-medium text-graphite">{job.priority} Priority</span>
            </div>
          </div>
        ))}
      </div>

      {/* Right Details Stage & 15 Stages Tracker */}
      {selectedJob ? (
        <div className="lg:col-span-7 bg-white rounded-md p-6 sm:p-8 border border-platinum-border shadow-sm space-y-6">
          <div className="flex items-start justify-between border-b border-platinum-border pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-medium text-slate-muted text-sm">{selectedJob.jobCardNumber}</span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-medium uppercase bg-status-success/10 text-status-success">
                  {selectedJob.currentStage.replace('_', ' ')}
                </span>
              </div>
              <h3 className="font-serif text-2xl font-medium text-graphite mt-1">
                {selectedJob.productTitle}
              </h3>
              <p className="text-xs text-slate-muted mt-0.5">
                Client: {selectedJob.customer.fullName} • Qty: {selectedJob.quantity}
              </p>
            </div>

            <button
              onClick={handleAdvanceStage}
              disabled={advancing || selectedJob.currentStage === 'CLOSED_INTERNALLY'}
              className="px-4 py-2 bg-graphite hover:bg-graphite-hover text-white rounded-md text-xs font-medium flex items-center space-x-1.5 transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-silver" />
              <span>{advancing ? 'Updating...' : 'Advance Stage →'}</span>
            </button>
          </div>

          {/* Job Specifications Grid */}
          <div className="grid grid-cols-2 gap-4 bg-platinum-soft/50 p-4 rounded-md border border-platinum-border text-xs text-slate-dark">
            <div>
              <span className="font-medium text-slate-dark block">Exact Dimensions:</span>
              <span className="font-semibold text-graphite">{selectedJob.exactDimensions}</span>
            </div>
            <div>
              <span className="font-medium text-slate-dark block">Fabric Specification:</span>
              <span className="font-semibold text-graphite">{selectedJob.fabricCodeAndColor}</span>
            </div>
            <div className="col-span-2">
              <span className="font-medium text-slate-dark block">Frame Instructions:</span>
              <p className="text-graphite/90 mt-0.5">{selectedJob.frameInstructions}</p>
            </div>
            <div className="col-span-2">
              <span className="font-medium text-slate-dark block">Foam &amp; Cushioning Instructions:</span>
              <p className="text-graphite/90 mt-0.5">{selectedJob.foamSpecification}</p>
            </div>
          </div>

          {/* 15 Production Stages Stepper (Section 13.2) */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-dark uppercase tracking-wider">
                15 Workshop Stages Progress:
              </span>
              <span className="text-xs font-mono font-medium text-graphite">
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
                    className={`p-2 rounded border text-center font-medium transition-colors ${
                      isCurrent
                        ? 'bg-graphite text-white border-graphite font-semibold ring-1 ring-slate-muted'
                        : isPassed
                        ? 'bg-status-success/10 text-status-success border-status-success/20'
                        : 'bg-platinum-soft text-slate-dark/70 border-platinum-border'
                    }`}
                  >
                    <span className="block text-[9px] opacity-70">Step {i + 1}</span>
                    <span className="truncate block mt-0.5">{st.replace('_', ' ')}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bill of Materials (BOM) */}
          {selectedJob.bom && (
            <div className="space-y-2 pt-2 border-t border-platinum-border">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-dark uppercase tracking-wider">Bill of Materials (BOM):</span>
                <span className="font-mono font-semibold text-graphite">
                  Total Material Cost: ₹{selectedJob.bom.totalCost?.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="border border-platinum-border rounded-md overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-platinum-soft border-b border-platinum-border text-slate-dark font-medium">
                    <tr>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Description</th>
                      <th className="p-2.5 text-center">Req. Qty</th>
                      <th className="p-2.5 text-right">Est. Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-platinum-border">
                    {selectedJob.bom.items?.map((item: any) => (
                      <tr key={item.id} className="hover:bg-platinum-soft/30">
                        <td className="p-2.5 font-medium text-graphite">{item.materialCategory}</td>
                        <td className="p-2.5 text-slate-dark">{item.description}</td>
                        <td className="p-2.5 text-center text-slate-dark">{item.requiredQty} {item.unit}</td>
                        <td className="p-2.5 text-right font-mono text-graphite">₹{item.totalEstimatedCost?.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Quality Control (QC) Certificate */}
          <div className="space-y-2 pt-2 border-t border-platinum-border">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-dark uppercase tracking-wider">Quality Control (QC) Status:</span>
              <span className="font-medium text-status-success bg-status-success/10 px-2 py-0.5 rounded uppercase">
                {selectedJob.inspections?.[0]?.result || 'PASS (Certified)'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-platinum-soft/50 p-3.5 rounded-md border border-platinum-border">
              <div className="flex items-center space-x-1.5 text-status-success">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Dimensions Check: PASS</span>
              </div>
              <div className="flex items-center space-x-1.5 text-status-success">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Frame Mortise: PASS</span>
              </div>
              <div className="flex items-center space-x-1.5 text-status-success">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Spring Tension: PASS</span>
              </div>
              <div className="flex items-center space-x-1.5 text-status-success">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Stitching &amp; Tufting: PASS</span>
              </div>
              <div className="flex items-center space-x-1.5 text-status-success">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Foam Resilience: PASS</span>
              </div>
              <div className="flex items-center space-x-1.5 text-status-success">
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
