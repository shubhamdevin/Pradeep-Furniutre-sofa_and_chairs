import React from 'react';
import { prisma } from '@/lib/prisma';
import ManufacturingClient from '@/components/admin/ManufacturingClient';

export const revalidate = 0;

export default async function AdminManufacturingPage() {
  const jobs = await prisma.manufacturingJob.findMany({
    include: {
      customer: true,
      tasks: { orderBy: { stageNumber: 'asc' } },
      bom: { include: { items: true } },
      inspections: true,
      designRevision: true,
      assignments: { include: { user: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-platinum-border pb-5">
        <span className="text-xs uppercase font-bold tracking-widest text-slate-muted">Shop Floor Management</span>
        <h1 className="font-serif text-3xl font-medium text-graphite mt-0.5">Manufacturing &amp; Job Cards</h1>
        <p className="text-xs text-slate-dark mt-1">
          Workshop production floor control in Bodla. Track all 15 stages from wood cutting to upholstery, Bill of Materials (BOM), and QC inspection certificates.
        </p>
      </div>

      <ManufacturingClient initialJobs={jobs} />
    </div>
  );
}
