import React from 'react';
import { prisma } from '@/lib/prisma';
import LeadsManagerClient from '@/components/admin/LeadsManagerClient';

export const revalidate = 0;

export default async function AdminLeadsPage() {
  const [leads, users] = await Promise.all([
    prisma.lead.findMany({
      include: {
        customer: true,
        product: true,
        assignedTo: true,
        designRequest: {
          include: {
            attachments: true,
            revisions: true,
          },
        },
        quotations: true,
        activities: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.findMany({
      select: { id: true, name: true, role: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="border-b border-ivory-300 pb-5">
        <span className="text-xs uppercase font-bold tracking-widest text-gold">Lead Relationship Management</span>
        <h1 className="font-serif text-3xl font-semibold text-charcoal mt-0.5">CRM Leads &amp; Inquiries Pipeline</h1>
        <p className="text-xs text-charcoal/70 mt-1">
          Independent sales &amp; inquiry pipeline managing customer communication prior to quotation and factory release.
        </p>
      </div>

      <LeadsManagerClient initialLeads={leads} staffUsers={users} />
    </div>
  );
}
