import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Users, 
  Sliders, 
  FileText, 
  Wrench, 
  ArrowUpRight, 
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

export const revalidate = 0; // Always fresh for admin operations

export default async function AdminDashboardPage() {
  const [
    leadsCount,
    customRequestsCount,
    quotesCount,
    jobsCount,
    inventoryItems,
    recentLeads,
    activeJobs,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.designRequest.count(),
    prisma.quotation.count(),
    prisma.manufacturingJob.count(),
    prisma.inventoryItem.findMany({
      where: { currentStock: { lte: 40 } },
    }),
    prisma.lead.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
        product: true,
        designRequest: true,
      },
    }),
    prisma.manufacturingJob.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
      },
    }),
    prisma.threeDAsset.count(),
  ]);

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-platinum-border pb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-slate-muted">Executive Command Center</span>
          <h1 className="font-serif text-3xl font-medium text-graphite mt-0.5">Atelier Operations Overview</h1>
          <p className="text-xs text-slate-dark mt-1">Live tracking of leads, CAD design commissions, formal quotations, and Bodla manufacturing jobs.</p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/custom-requests"
            className="px-4 py-2 bg-white border border-platinum-border rounded-md text-xs font-medium text-graphite hover:bg-platinum transition-colors"
          >
            Review Design Requests
          </Link>
          <Link
            href="/admin/quotations"
            className="px-4 py-2 bg-graphite text-white rounded-md text-xs font-medium hover:bg-graphite-hover transition-colors"
          >
            Create New Quote
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Leads */}
        <div className="bg-white p-6 rounded-md border border-platinum-border shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-muted">Active CRM Leads</span>
            <div className="w-8 h-8 rounded bg-platinum-soft text-slate-dark flex items-center justify-center border border-platinum-border">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-graphite">{leadsCount}</div>
          <div className="text-[11px] text-slate-dark flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5 text-status-success" />
            <span>Catalogue &amp; custom studio enquiries</span>
          </div>
        </div>

        {/* Custom Design Requests */}
        <div className="bg-white p-6 rounded-md border border-platinum-border shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-muted">Design Commissions</span>
            <div className="w-8 h-8 rounded bg-platinum-soft text-slate-dark flex items-center justify-center border border-platinum-border">
              <Sliders className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-graphite">{customRequestsCount}</div>
          <div className="text-[11px] text-slate-dark">
            <span>External reference photos &amp; CAD blueprints</span>
          </div>
        </div>

        {/* Quotations */}
        <div className="bg-white p-6 rounded-md border border-platinum-border shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-muted">Issued Quotations</span>
            <div className="w-8 h-8 rounded bg-platinum-soft text-slate-dark flex items-center justify-center border border-platinum-border">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-graphite">{quotesCount}</div>
          <div className="text-[11px] text-slate-dark">
            <span>Offline commercial agreements</span>
          </div>
        </div>

        {/* Factory Jobs */}
        <div className="bg-white p-6 rounded-md border border-platinum-border shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-muted">Workshop Job Cards</span>
            <div className="w-8 h-8 rounded bg-platinum-soft text-slate-dark flex items-center justify-center border border-platinum-border">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-graphite">{jobsCount}</div>
          <div className="text-[11px] text-slate-dark">
            <span>Bodla carpentry &amp; upholstery execution</span>
          </div>
        </div>
      </div>

      {/* Main Section: Recent CRM Leads & Active Factory Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Leads (Left 7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-md p-6 border border-platinum-border shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-platinum-border pb-3">
            <div>
              <h3 className="font-serif text-lg font-medium text-graphite">Recent Leads &amp; Inquiries</h3>
              <p className="text-xs text-slate-dark">Direct customer inquiries awaiting specification</p>
            </div>
            <Link href="/admin/leads" className="text-xs font-medium text-graphite hover:underline flex items-center space-x-1">
              <span>View All Pipeline</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-muted" />
            </Link>
          </div>

          <div className="divide-y divide-platinum-border">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="py-3.5 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-medium text-graphite">{lead.leadCode}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase bg-platinum-soft text-slate-dark border border-platinum-border">
                      {lead.source}
                    </span>
                  </div>
                  <h4 className="font-medium text-graphite mt-1">{lead.customer.fullName}</h4>
                  <p className="text-slate-dark text-[11px]">{lead.customer.city || 'Agra'} • {lead.customer.phone}</p>
                </div>

                <div className="text-right space-y-1">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
                    lead.stage === 'NEW' ? 'bg-status-info/10 text-status-info' :
                    lead.stage === 'QUOTATION_SENT' ? 'bg-status-warning/10 text-status-warning' :
                    'bg-status-success/10 text-status-success'
                  }`}>
                    {lead.stage}
                  </span>
                  <span className="block text-[10px] text-slate-muted">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Factory Jobs Progress (Right 5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-md p-6 border border-platinum-border shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-platinum-border pb-3">
            <div>
              <h3 className="font-serif text-lg font-medium text-graphite">Active Workshop Jobs</h3>
              <p className="text-xs text-slate-dark">Manufacturing shop floor progress</p>
            </div>
            <Link href="/admin/manufacturing" className="text-xs font-medium text-graphite hover:underline flex items-center space-x-1">
              <span>Job Cards</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-muted" />
            </Link>
          </div>

          <div className="space-y-3">
            {activeJobs.map((job) => (
              <div key={job.id} className="p-3.5 rounded-md bg-platinum-soft/50 border border-platinum-border text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-medium text-graphite">{job.jobCardNumber}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase bg-status-success/10 text-status-success">
                    {job.currentStage}
                  </span>
                </div>

                <h4 className="font-medium text-graphite">{job.productTitle}</h4>
                <p className="text-slate-dark text-[11px]">{job.customer.fullName} • Qty: {job.quantity}</p>

                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-dark">
                  <span>Target: {new Date(job.targetCompletionDate).toLocaleDateString()}</span>
                  <span className="font-medium text-graphite">{job.priority} Priority</span>
                </div>
              </div>
            ))}
          </div>

          {/* Raw Material Alert Widget */}
          {inventoryItems.length > 0 && (
            <div className="mt-4 pt-3 border-t border-platinum-border bg-amber-50/70 p-3.5 rounded-md border border-amber-200 text-xs">
              <div className="flex items-center space-x-1.5 text-amber-800 font-medium mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Raw Material Reorder Notice</span>
              </div>
              <p className="text-[11px] text-amber-900">
                {inventoryItems.length} inventory item(s) near reorder threshold (e.g. {inventoryItems[0]?.name}).
              </p>
              <Link href="/admin/inventory" className="text-xs font-medium text-amber-900 underline block mt-1">
                Review Timber &amp; Fabric Stock →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
