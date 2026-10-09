import React from 'react';
import { prisma } from '@/lib/prisma';
import CustomRequestsClient from '@/components/admin/CustomRequestsClient';

export const revalidate = 0;

export default async function AdminCustomRequestsPage() {
  const requests = await prisma.designRequest.findMany({
    include: {
      customer: true,
      product: true,
      attachments: true,
      revisions: {
        include: {
          designer: true,
        },
        orderBy: { versionNumber: 'desc' },
      },
      manufacturingJobs: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-platinum-border pb-5">
        <span className="text-xs uppercase font-bold tracking-widest text-slate-muted">Designer Studio Workflow</span>
        <h1 className="font-serif text-3xl font-medium text-graphite mt-0.5">Custom Requests &amp; CAD Approvals</h1>
        <p className="text-xs text-slate-dark mt-1">
          Review client reference photos, draft CAD drawing revisions, and freeze technical specifications for manufacturing release.
        </p>
      </div>

      <CustomRequestsClient initialRequests={requests} />
    </div>
  );
}
