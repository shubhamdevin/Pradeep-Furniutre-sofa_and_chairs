import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendCustomerStatusUpdateEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await prisma.$transaction(async (tx) => {
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

    if (!Array.isArray(items) || items.some((item:any)=>!String(item.itemDescription||'').trim() || !Number.isInteger(Number(item.quantity)) || Number(item.quantity)<1 || !Number.isFinite(Number(item.unitEstimate)) || Number(item.unitEstimate)<0) || !Number.isFinite(Number(taxPercent)) || Number(taxPercent)<0 || Number(taxPercent)>100 || !Number.isFinite(Number(shippingCost)) || Number(shippingCost)<0) return NextResponse.json({error:'Enter valid line items, quantities, prices and tax.'},{status:400});
    const leadForNotification=leadId?await tx.lead.findUnique({where:{id:leadId},include:{customer:true,product:true}}):null;
    if(leadId&&(!leadForNotification||leadForNotification.customerId!==customerId))return NextResponse.json({error:'Select a lead belonging to the chosen customer.'},{status:400});
    const quoteNumber = `QTE-${new Date().getFullYear()}-${crypto.randomUUID().slice(0,8).toUpperCase()}`;

    const computedSubtotal = items.reduce((acc: number, item: any) => acc + Number(item.unitEstimate) * Number(item.quantity), 0);
    const taxAmount = (computedSubtotal * Number(taxPercent)) / 100;
    const totalEstimate = computedSubtotal + taxAmount + (Number(shippingCost) || 0);

    // Get default admin user
    const defaultUser = await tx.user.findFirst({where:{role:'SUPER_ADMIN',isActive:true}});

    const quotation = await tx.quotation.create({
      data: {
        quoteNumber,
        revisionCode: 'REV-01',
        customerId,
        leadId: leadId || null,
        designRevisionId: designRevisionId || null,
        createdById: defaultUser?.id || 'user-admin-1',
        status: 'DRAFT',
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
      await tx.quotationItem.create({
        data: {
          quotationId: quotation.id,
          itemDescription: item.itemDescription,
          dimensions: item.dimensions || null,
          upholsterySpec: item.upholsterySpec || null,
          frameSpec: item.frameSpec || null,
          quantity: Number(item.quantity) || 1,
          unitEstimate: Number(item.unitEstimate) || 0,
          totalLineAmount: Number(item.unitEstimate) * Number(item.quantity),
        },
      });
    }

    // Update lead stage if leadId present
    if (leadId) {
      await tx.lead.update({
        where: { id: leadId },
        data: { stage: 'NEGOTIATION' },
      });
      await tx.leadActivity.create({
        data: {
          leadId,
          action: 'QUOTE_GENERATED',
          details: `Quotation ${quoteNumber} generated for amount ₹${totalEstimate.toLocaleString('en-IN')}`,
        },
      });
    }

    return {
      success: true,
      quoteNumber,
      quotationId: quotation.id,
      message: 'Quotation generated successfully.',
      leadForNotification,
    };
    });
    if (!(result instanceof NextResponse) && result.leadForNotification?.stage !== 'NEGOTIATION') {
      const lead = result.leadForNotification;
      if (lead) {
        const email = await sendCustomerStatusUpdateEmail({
          to: lead.customer.email,
          customerName: lead.customer.fullName,
          referenceCode: lead.leadCode,
          recordType: 'Enquiry',
          status: 'NEGOTIATION',
          details: `A quotation (${result.quoteNumber}) has been prepared for your furniture enquiry${lead.product?.name ? ` about ${lead.product.name}` : ''}.`,
        });
        return NextResponse.json({ ...result, leadForNotification: undefined, emailNotification: email.sent ? 'sent' : email.reason });
      }
    }
    if (result instanceof NextResponse) return result;
    return NextResponse.json({ ...result, leadForNotification: undefined });
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
