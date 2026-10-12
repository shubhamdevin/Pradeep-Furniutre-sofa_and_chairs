import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateVerificationToken } from '@/lib/otp-store';
import { sendSubmissionConfirmationEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      whatsapp,
      email,
      verificationToken,
      city = 'Agra',
      address,
      preferredDate,
      preferredTime = 'Morning (10 AM - 1 PM)',
      consultationType = 'SHOWROOM_VISIT',
      message,
    } = body;

    if (!name || !phone || !preferredDate) {
      return NextResponse.json(
        { error: 'Name, Phone number, and Preferred Date are required.' },
        { status: 400 }
      );
    }

    // Email OTP Verification Check
    if (email) {
      const isVerified = validateVerificationToken(email, verificationToken);
      if (!isVerified) {
        return NextResponse.json(
          { error: 'Email verification required. Please complete OTP verification to prevent spam submissions.' },
          { status: 403 }
        );
      }
    }

    // Find or create customer
    let customer = await prisma.customer.findFirst({
      where: { phone },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          fullName: name,
          phone,
          whatsapp: whatsapp || phone,
          email: email || null,
          city,
          address: address || null,
          customerType: 'RESIDENTIAL',
        },
      });
    } else if (email && !customer.email) {
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: { email },
      });
    }

    // Create Consultation Booking
    const booking = await prisma.consultationBooking.create({
      data: {
        customerId: customer.id,
        preferredDate: new Date(preferredDate),
        preferredTime,
        consultationType,
        address: address || null,
        message: message || null,
        status: 'PENDING',
      },
    });

    // Create Lead activity
    const count = await prisma.lead.count();
    const lead = await prisma.lead.create({
      data: {
        leadCode: `LEAD-2026-${String(count + 1).padStart(4, '0')}`,
        source: 'CONSULTATION',
        stage: 'NEW',
        priority: 'HIGH',
        customerId: customer.id,
        tags: `${consultationType}, Appointment Booking`,
      },
    });

    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        action: 'CONSULTATION_BOOKED',
        details: `Customer booked ${consultationType} for ${preferredDate} (${preferredTime}). Notes: ${message || 'None'}`,
      },
    });

    // Send confirmation email asynchronously if email was provided
    if (email) {
      sendSubmissionConfirmationEmail({
        to: email,
        customerName: name,
        referenceCode: `BOOK-${booking.id.slice(-6).toUpperCase()}`,
        requestType: `Private Atelier Consultation (${consultationType})`,
        summary: `Appointment requested for ${new Date(preferredDate).toLocaleDateString()} (${preferredTime}). Format: ${consultationType}`,
      }).catch((err) => console.error('Failed to send confirmation email:', err));
    }

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      message: 'Consultation appointment booked successfully.',
    });
  } catch (err: any) {
    console.error('Error booking consultation:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const bookings = await prisma.consultationBooking.findMany({
      include: { customer: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(bookings);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
