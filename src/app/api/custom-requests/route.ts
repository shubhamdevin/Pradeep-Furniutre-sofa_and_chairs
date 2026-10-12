import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateVerificationToken } from '@/lib/otp-store';
import { sendSubmissionConfirmationEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      referenceType = 'EXTERNAL_REFERENCE',
      productId,
      furnitureType,
      customizationChecklist = [],
      customizationDetails = '',
      dimensionsKnown = true,
      length,
      depth,
      height,
      seatingCapacity,
      measurementUnit = 'Inches',
      fabricPreference,
      colorPreference,
      framePreference,
      foamFirmness,
      legFinish,
      quantity = 1,
      budgetRange,
      intendedUsage,
      timeline,
      deliveryCity,
      deliveryPincode,
      customerName,
      customerPhone,
      customerWhatsapp,
      customerEmail,
      verificationToken,
      referenceImages = [],
      referenceLinks,
      roomPhotos = [],
      specialInstructions,
    } = body;

    if (!customerName || !customerPhone || !furnitureType) {
      return NextResponse.json(
        { error: 'Customer Name, Phone number, and Furniture Type are required.' },
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

    // 1. Generate unique Reference ID (e.g. CFR-2026-XXXX)
    const count = await prisma.designRequest.count();
    const referenceNumber = `CFR-2026-${String(count + 1).padStart(4, '0')}`;

    // 2. Find or create Customer record
    let customer = await prisma.customer.findFirst({
      where: { phone: customerPhone },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          fullName: customerName,
          phone: customerPhone,
          whatsapp: customerWhatsapp || customerPhone,
          email: customerEmail || null,
          city: deliveryCity || null,
          pincode: deliveryPincode || null,
          customerType: 'RESIDENTIAL',
        },
      });
    }

    // Form dimensions summary string
    const dimensionsSummary = dimensionsKnown
      ? `${length || 'Custom'}L x ${depth || 'Custom'}D x ${height || 'Custom'}H ${measurementUnit} (${seatingCapacity || 'Custom Seater'})`
      : 'Customer requested atelier site measurement visit / unknown dimensions';

    // 3. Create Custom Design Request
    const designRequest = await prisma.designRequest.create({
      data: {
        referenceNumber,
        requestType: referenceType,
        customerId: customer.id,
        productId: productId || null,
        furnitureType,
        customizationReqs: JSON.stringify({
          checklist: customizationChecklist,
          details: customizationDetails,
          referenceLinks: referenceLinks || null,
        }),
        dimensionsSummary,
        fabricPreference: fabricPreference || null,
        colorPreference: colorPreference || null,
        framePreference: framePreference || null,
        foamFirmness: foamFirmness || null,
        legFinish: legFinish || null,
        quantity: Number(quantity) || 1,
        budgetRange: budgetRange || null,
        intendedUsage: intendedUsage || null,
        requiredTimeline: timeline || null,
        deliveryCity: deliveryCity || null,
        deliveryPincode: deliveryPincode || null,
        specialInstructions: specialInstructions || customizationDetails || null,
        status: 'REQUEST_RECEIVED',
      },
    });

    // 4. Attach Reference Images
    const attachmentsToCreate = [];

    if (Array.isArray(referenceImages) && referenceImages.length > 0) {
      for (const imgUrl of referenceImages) {
        attachmentsToCreate.push({
          designRequestId: designRequest.id,
          fileUrl: imgUrl,
          fileName: `Reference_Photo_${Date.now()}.jpg`,
          fileType: 'CUSTOMER_REFERENCE',
        });
      }
    }

    if (Array.isArray(roomPhotos) && roomPhotos.length > 0) {
      for (const roomUrl of roomPhotos) {
        attachmentsToCreate.push({
          designRequestId: designRequest.id,
          fileUrl: roomUrl,
          fileName: `Room_Space_${Date.now()}.jpg`,
          fileType: 'ROOM_PHOTO',
        });
      }
    }

    if (attachmentsToCreate.length > 0) {
      await prisma.designRequestAttachment.createMany({
        data: attachmentsToCreate,
      });
    }

    // 5. Create Lead in CRM Pipeline (Section 11)
    const leadCode = `LEAD-2026-${String(count + 1).padStart(4, '0')}`;
    const lead = await prisma.lead.create({
      data: {
        leadCode,
        source: 'CUSTOM_COMMISSION',
        stage: 'NEW',
        priority: 'HIGH',
        customerId: customer.id,
        productId: productId || null,
        designRequestId: designRequest.id,
        budgetRange: budgetRange || null,
        tags: `${furnitureType}, Custom Order, ${deliveryCity || 'Agra'}`,
      },
    });

    // Lead Activity log
    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        action: 'CUSTOM_REQUEST_SUBMITTED',
        details: `Customer submitted custom design request ${referenceNumber} with ${attachmentsToCreate.length} uploaded files.`,
      },
    });

    // Send confirmation email asynchronously if customer email was provided
    if (customerEmail) {
      sendSubmissionConfirmationEmail({
        to: customerEmail,
        customerName,
        referenceCode: referenceNumber,
        requestType: `Bespoke ${furnitureType} Commission`,
        summary: `${furnitureType} (${quantity} unit) for ${deliveryCity || 'Agra'}. Dimensions: ${dimensionsSummary}`,
      }).catch((err) => console.error('Failed to send confirmation email:', err));
    }

    return NextResponse.json({
      success: true,
      referenceNumber,
      leadCode,
      message: 'Custom furniture design request created successfully.',
    });
  } catch (error: any) {
    console.error('Error creating custom design request:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const requests = await prisma.designRequest.findMany({
      include: {
        customer: true,
        product: true,
        attachments: true,
        revisions: {
          include: {
            designer: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(requests);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
