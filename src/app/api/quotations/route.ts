import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerId,
      leadId,
      designRevisionId,
      items = [],
      subtotal,
      taxPercent = 18.0,
      shippingCost = 0.0,
      deliveryLeadWeeks = 4,
      internalEstimatedCost,
      internalProfitMargin,
      clientNotes,
      termsAndConditions,
      warrantyTerms,
    } = body;

    if (!customerId || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Customer and at least one item are required to generate a quotation.' },
        { status: 400 }
      );
    }

    const count = await prisma.quotation.count();
    const quoteNumber = `QTE-2026-${String(count + 1).padStart(4, '0')}`;

    const computedSubtotal = Number(subtotal) || items.reduce((acc: number, item: any) => acc + (Number(item.totalLineAmount) || 0), 0);
    const taxAmount = (computedSubtotal * Number(taxPercent)) / 100;
    const totalEstimate = computedSubtotal + taxAmount + (Number(shippingCost) || 0);

    // Get default admin user
    const defaultUser = await prisma.user.findFirst();

    const quotation = await prisma.quotation.create({
      data: {
        quoteNumber,
        revisionCode: 'REV-01',
        customerId,
        leadId: leadId || null,
        designRevisionId: designRevisionId || null,
        createdById: defaultUser?.id || 'user-admin-1',
        status: 'SENT',
        subtotal: computedSubtotal,
        taxPercent: Number(taxPercent),
        taxAmount,
        shippingCost: Number(shippingCost) || 0,
        totalEstimate,
        internalEstimatedCost: internalEstimatedCost ? Number(internalEstimatedCost) : null,
        internalProfitMargin: internalProfitMargin ? Number(internalProfitMargin) : null,
        deliveryLeadWeeks: Number(deliveryLeadWeeks) || 4,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        termsAndConditions: termsAndConditions || '1. Offline business agreement. 50% mobilization advance upon production release, 50% before dispatch.\n2. Delivery includes white-glove living room installation.',
        warrantyTerms: warrantyTerms || '10-Year Solid Hardwood Structural Guarantee & 5-Year Cushion Foam Resilience Warranty.',
        clientNotes: clientNotes || null,
      },
    });

    // Create line items
    for (const item of items) {
      await prisma.quotationItem.create({
        data: {
          quotationId: quotation.id,
          itemDescription: item.itemDescription,
          dimensions: item.dimensions || null,
          upholsterySpec: item.upholsterySpec || null,
          frameSpec: item.frameSpec || null,
          quantity: Number(item.quantity) || 1,
          unitEstimate: Number(item.unitEstimate) || 0,
          totalLineAmount: Number(item.totalLineAmount) || (Number(item.unitEstimate) * Number(item.quantity)),
        },
      });
    }

    // Update lead stage if leadId present
    if (leadId) {
      await prisma.lead.update({
        where: { id: leadId },
        data: { stage: 'QUOTATION_SENT' },
      });
      await prisma.leadActivity.create({
        data: {
          leadId,
          action: 'QUOTE_SENT',
          details: `Quotation ${quoteNumber} generated for amount ₹${totalEstimate.toLocaleString('en-IN')}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      quoteNumber,
      quotationId: quotation.id,
      message: 'Quotation generated successfully.',
    });
  } catch (err: any) {
    console.error('Error generating quotation:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const quotes = await prisma.quotation.findMany({
      include: {
        customer: true,
        items: true,
        lead: true,
        designRevision: true,
        createdBy: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(quotes);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
