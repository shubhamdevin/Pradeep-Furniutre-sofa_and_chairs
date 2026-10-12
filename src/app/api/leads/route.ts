import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateVerificationToken } from '@/lib/otp-store';
import { sendSubmissionConfirmationEmail, sendCustomerStatusUpdateEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

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
      verificationToken,
      city = 'Agra',
      notes,
    } = body;

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { error: 'Name and Phone Number are required.' },
        { status: 400 }
      );
    }

    // Email OTP Verification Check
    if (customerEmail) {
      const isVerified = validateVerificationToken(customerEmail, verificationToken);
      if (!isVerified) {
        return NextResponse.json(
          { error: 'Email verification required. Please complete OTP verification to prevent spam submissions.' },
          { status: 403 }
        );
      }
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
    } else if (customerEmail && !customer.email) {
      // Update email if not previously set
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: { email: customerEmail },
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

    // Send confirmation email asynchronously if customer email was provided
    if (customerEmail) {
      sendSubmissionConfirmationEmail({
        to: customerEmail,
        customerName,
        referenceCode: leadCode,
        requestType: `Quotation Request for ${productTitle || 'Bespoke Atelier Furniture'}`,
        summary: `Enquiry logged for ${productTitle || 'Custom Furniture'} in ${city}. Notes: ${notes || 'Standard enquiry'}`,
      }).catch((err) => console.error('Failed to send confirmation email:', err));
    }

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

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, stage, priority, assignedToId, nextFollowUpAt, note } = body;

    if (!id) {
      return NextResponse.json({ error: 'Lead id is required.' }, { status: 400 });
    }

    const before = await prisma.lead.findUnique({
      where: { id },
      include: { customer: true, product: true },
    });

    if (!before) {
      return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
    }

    const STAGE_RANK: Record<string, number> = {
      NEW: 1,
      CONTACTED: 2,
      REQUIREMENTS_COLLECTED: 2.5,
      DESIGN_REVIEW: 3,
      QUOTATION_SENT: 4,
      NEGOTIATION: 4.5,
      CONVERTED: 5,
      LOST: 6,
      CLOSED: 6,
      ON_HOLD: 6,
    };

    if (stage && before.stage !== stage) {
      const currentRank = STAGE_RANK[before.stage] ?? 1;
      const targetRank = STAGE_RANK[stage] ?? 1;
      if (targetRank < currentRank) {
        return NextResponse.json(
          {
            error: `Progression Rule: Lead status cannot move backward from ${before.stage} to ${stage}. Status can only advance forward.`,
          },
          { status: 400 }
        );
      }
    }

    const updateData: any = {};
    if (stage) updateData.stage = stage;
    if (priority) updateData.priority = priority;
    if (assignedToId !== undefined) updateData.assignedToId = assignedToId || null;
    if (nextFollowUpAt !== undefined) {
      updateData.nextFollowUpAt = nextFollowUpAt ? new Date(nextFollowUpAt) : null;
    }

    const updated = await prisma.lead.update({
      where: { id },
      data: updateData,
      include: { customer: true, product: true },
    });

    const isStageChanged = stage && before.stage !== stage;
    await prisma.leadActivity.create({
      data: {
        leadId: id,
        action: isStageChanged ? 'STAGE_CHANGE' : 'NOTE_ADDED',
        details: note || `Lead updated: ${(stage || before.stage).replaceAll('_', ' ')}`,
      },
    });

    let emailNotification = '';
    if (isStageChanged && updated.customer?.email) {
      const emailResult = await sendCustomerStatusUpdateEmail({
        to: updated.customer.email,
        customerName: updated.customer.fullName,
        referenceCode: updated.leadCode,
        recordType: 'Enquiry',
        status: stage,
        details: updated.product?.name ? `Design: ${updated.product.name}` : undefined,
      });

      if (emailResult.sent) {
        emailNotification = ' Status update email sent to customer.';
        await prisma.leadActivity.create({
          data: {
            leadId: id,
            action: 'CUSTOMER_EMAIL',
            details: `Status update email sent to ${updated.customer.email}.`,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      lead: updated,
      notification: isStageChanged
        ? `Lead stage set to ${stage.replaceAll('_', ' ')}.${emailNotification}`
        : 'Lead record updated successfully.',
    });
  } catch (err: any) {
    console.error('Lead update error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update lead' }, { status: 500 });
  }
}

