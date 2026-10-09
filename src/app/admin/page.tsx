import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  Users, 
  Sliders, 
  FileText, 
  Wrench, 
  Package, 
  Box, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Sparkles,
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
    assetsCount,
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
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ivory-300 pb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-gold">Executive Command Center</span>
          <h1 className="font-serif text-3xl font-semibold text-charcoal mt-0.5">Atelier Operations Overview</h1>
          <p className="text-xs text-charcoal/70 mt-1">Live tracking of leads, design CAD revisions, quotations, and Bodla factory production jobs.</p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/custom-requests"
            className="px-4 py-2 bg-white border border-ivory-300 rounded-xl text-xs font-semibold hover:bg-ivory-100 transition-colors"
          >
            Review Design Requests
          </Link>
          <Link
            href="/admin/quotations"
            className="px-4 py-2 bg-charcoal text-white rounded-xl text-xs font-semibold hover:bg-charcoal-light transition-colors"
          >
            Create New Quote
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Leads */}
        <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-walnut">Active CRM Leads</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-charcoal">{leadsCount}</div>
          <div className="text-[11px] text-charcoal/60 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Organic catalogue &amp; custom studio inquiries</span>
          </div>
        </div>

        {/* Custom Design Requests */}
        <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-walnut">Custom Design Commissions</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-charcoal">{customRequestsCount}</div>
          <div className="text-[11px] text-charcoal/60">
            <span>Reference photos &amp; CAD blueprints</span>
          </div>
        </div>

        {/* Quotations */}
        <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-walnut">Issued Quotations</span>
            <div className="w-8 h-8 rounded-lg bg-gold/20 text-gold-dark flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-charcoal">{quotesCount}</div>
          <div className="text-[11px] text-charcoal/60">
            <span>Offline commercial agreements</span>
          </div>
        </div>

        {/* Factory Jobs */}
        <div className="bg-white p-6 rounded-2xl border border-ivory-300 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-walnut">Workshop Job Cards</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-charcoal">{jobsCount}</div>
          <div className="text-[11px] text-charcoal/60">
            <span>Bodla carpentry &amp; upholstery works</span>
          </div>
        </div>
      </div>

      {/* Main Section: Recent CRM Leads & Active Factory Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Leads (Left 7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-ivory-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
            <div>
              <h3 className="font-serif text-lg font-semibold text-charcoal">Recent Leads &amp; Inquiries</h3>
              <p className="text-xs text-charcoal/60">Direct customer inquiries awaiting design or quote</p>
            </div>
            <Link href="/admin/leads" className="text-xs font-semibold text-gold hover:text-gold-dark flex items-center space-x-1">
              <span>View All Pipeline</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-ivory-200">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-semibold text-charcoal">{lead.leadCode}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-ivory-100 text-walnut">
                      {lead.source}
                    </span>
                  </div>
                  <h4 className="font-serif font-medium text-charcoal mt-1">{lead.customer.fullName}</h4>
                  <p className="text-charcoal/60 text-[11px]">{lead.customer.city || 'Agra'} • {lead.customer.phone}</p>
                </div>

                <div className="text-right space-y-1">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    lead.stage === 'NEW' ? 'bg-blue-100 text-blue-800' :
                    lead.stage === 'QUOTATION_SENT' ? 'bg-amber-100 text-amber-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {lead.stage}
                  </span>
                  <span className="block text-[10px] text-charcoal/50">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Factory Jobs Progress (Right 5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-ivory-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
            <div>
              <h3 className="font-serif text-lg font-semibold text-charcoal">Active Production Jobs</h3>
              <p className="text-xs text-charcoal/60">Workshop floor progress</p>
            </div>
            <Link href="/admin/manufacturing" className="text-xs font-semibold text-gold hover:text-gold-dark flex items-center space-x-1">
              <span>Job Cards</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {activeJobs.map((job) => (
              <div key={job.id} className="p-3.5 rounded-xl bg-ivory-50 border border-ivory-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-charcoal">{job.jobCardNumber}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                    {job.currentStage}
                  </span>
                </div>

                <h4 className="font-serif font-medium text-charcoal">{job.productTitle}</h4>
                <p className="text-charcoal/70 text-[11px]">{job.customer.fullName} • Qty: {job.quantity}</p>

                <div className="pt-1 flex items-center justify-between text-[11px] text-walnut font-medium">
                  <span>Target: {new Date(job.targetCompletionDate).toLocaleDateString()}</span>
                  <span className="font-semibold text-charcoal">{job.priority} Priority</span>
                </div>
              </div>
            ))}
          </div>

          {/* Raw Material Alert Widget */}
          {inventoryItems.length > 0 && (
            <div className="mt-4 pt-3 border-t border-ivory-200 bg-amber-50/60 p-3.5 rounded-xl border border-amber-200 text-xs">
              <div className="flex items-center space-x-1.5 text-amber-800 font-semibold mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Low Raw Material Warning</span>
              </div>
              <p className="text-[11px] text-amber-900">
                {inventoryItems.length} inventory item(s) near reorder threshold (e.g. {inventoryItems[0]?.name}).
              </p>
              <Link href="/admin/inventory" className="text-xs font-semibold text-amber-900 underline block mt-1">
                Review Timber &amp; Fabric Stock →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
