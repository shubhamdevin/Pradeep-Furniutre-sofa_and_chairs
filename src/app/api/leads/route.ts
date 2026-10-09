import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      source = 'PRODUCT_ENQUIRY',
      productId,
      productTitle,
      customerName,
      customerPhone,
      customerEmail,
      city = 'Agra',
      notes,
    } = body;

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { error: 'Name and Phone Number are required.' },
        { status: 400 }
      );
    }

    // Find or create customer
    let customer = await prisma.customer.findFirst({
      where: { phone: customerPhone },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          fullName: customerName,
          phone: customerPhone,
          whatsapp: customerPhone,
          email: customerEmail || null,
          city,
          customerType: 'RESIDENTIAL',
        },
      });
    }

    const count = await prisma.lead.count();
    const leadCode = `LEAD-2026-${String(count + 1).padStart(4, '0')}`;

    const lead = await prisma.lead.create({
      data: {
        leadCode,
        source,
        stage: 'NEW',
        priority: 'MEDIUM',
        customerId: customer.id,
        productId: productId || null,
        tags: `${city}, ${productTitle || 'General Enquiry'}`,
      },
    });

    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        action: 'LEAD_SUBMITTED',
        details: notes || `Direct product inquiry received for ${productTitle || 'Bespoke Atelier'}.`,
      },
    });

    return NextResponse.json({
      success: true,
      leadCode,
      message: 'Enquiry received. Atelier consultant will get in touch.',
    });
  } catch (err: any) {
    console.error('Lead submission error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
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
    });
    return NextResponse.json(leads);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
