import React from 'react';
import { prisma } from '@/lib/prisma';
import QuotationsClient from '@/components/admin/QuotationsClient';

export const revalidate = 0;

export default async function AdminQuotationsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [quotations, customers, leads] = await Promise.all([
    prisma.quotation.findMany({
      include: {
        customer: true,
        items: true,
        lead: true,
        designRevision: true,
        createdBy: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.customer.findMany({
      orderBy: { fullName: 'asc' },
    }),
    prisma.lead.findMany({
      where: { stage: { not: 'CONVERTED' } },
      include: { customer: true },
    }),
  ]);

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-platinum-border pb-5">
        <span className="text-xs uppercase font-bold tracking-widest text-slate-muted">Commercial Quotation Engine</span>
        <h1 className="font-serif text-3xl font-medium text-graphite mt-0.5">Quotations &amp; Customer Agreements</h1>
        <p className="text-xs text-slate-dark mt-1">
          Draft official estimates, manage line items, generate printable customer PDFs (with internal margins hidden), and convert accepted quotes into factory job cards.
        </p>
      </div>

      <QuotationsClient
        initialQuotations={quotations}
        customers={customers}
        leads={leads}
        initialLeadId={typeof searchParams.leadId === 'string' ? searchParams.leadId : undefined}
        initialCustomerId={typeof searchParams.customerId === 'string' ? searchParams.customerId : undefined}
      />
    </div>
  );
}
