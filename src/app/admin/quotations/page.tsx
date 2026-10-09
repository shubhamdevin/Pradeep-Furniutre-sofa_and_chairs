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
    <div className="space-y-6">
      <div className="border-b border-ivory-300 pb-5">
        <span className="text-xs uppercase font-bold tracking-widest text-gold">Section 12 Quotation System</span>
        <h1 className="font-serif text-3xl font-semibold text-charcoal mt-0.5">Quotations &amp; Customer Agreements</h1>
        <p className="text-xs text-charcoal/70 mt-1">
          Draft official estimates, manage line items, generate printable customer PDFs (with internal margins hidden), and convert accepted quotes into factory job cards.
        </p>
      </div>

      <QuotationsClient
        initialQuotations={quotations}
        customers={customers}
        leads={leads}
      />
    </div>
  );
}
