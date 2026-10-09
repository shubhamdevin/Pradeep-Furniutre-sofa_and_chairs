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
    <div className="space-y-6">
      <div className="border-b border-ivory-300 pb-5">
        <span className="text-xs uppercase font-bold tracking-widest text-gold">Section 10 Designer Workflow</span>
        <h1 className="font-serif text-3xl font-semibold text-charcoal mt-0.5">Custom Requests &amp; Design Approvals</h1>
        <p className="text-xs text-charcoal/70 mt-1">
          Review customer external reference photos, draft CAD drawing revisions, and freeze technical specifications for manufacturing release.
        </p>
      </div>

      <CustomRequestsClient initialRequests={requests} />
    </div>
  );
}
