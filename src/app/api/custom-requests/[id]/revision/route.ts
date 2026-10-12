import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendCustomerStatusUpdateEmail } from '@/lib/email';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const {
      specifications,
      designerNotes,
      proposedCadUrl,
      approvalStatus = 'APPROVED',
      freezeForJob = false,
    } = body;

    const request = await prisma.designRequest.findUnique({
      where: { id: params.id },
      include: { revisions: true },
    });

    if (!request) {
      return NextResponse.json({ error: 'Design Request not found' }, { status: 404 });
    }

    const versionNumber = request.revisions.length + 1;
    const revisionCode = `REV-${String(versionNumber).padStart(2, '0')}`;

    const defaultUser = await prisma.user.findFirst();

    const revision = await prisma.designRevision.create({
      data: {
        designRequestId: request.id,
        revisionCode,
        versionNumber,
        designerId: defaultUser?.id || 'user-designer-1',
        proposedCadUrl: proposedCadUrl || null,
        specifications: specifications || 'Updated structural specs and CAD blueprint freeze.',
        designerNotes: designerNotes || null,
        approvalStatus,
        isFrozenForJob: freezeForJob,
        approvedAt: approvalStatus === 'APPROVED' ? new Date() : null,
      },
    });

    // Update request status
    let emailNotification: string | undefined;
    if (approvalStatus === 'APPROVED') {
      const updatedRequest = await prisma.designRequest.update({
        where: { id: request.id },
        data: { status: 'DESIGN_APPROVED' },
        include: { customer: true },
      });
      if (request.status !== 'DESIGN_APPROVED') {
        const email = await sendCustomerStatusUpdateEmail({
          to: updatedRequest.customer.email,
          customerName: updatedRequest.customer.fullName,
          referenceCode: updatedRequest.referenceNumber,
          recordType: 'Design request',
          status: updatedRequest.status,
          details: `Revision ${revisionCode} has been approved by our atelier design team.`,
        });
        emailNotification = email.sent ? 'sent' : email.reason;
      }
    }

    return NextResponse.json({
      success: true,
      revisionCode,
      versionNumber,
      message: `Revision ${revisionCode} created successfully.`,
      emailNotification,
    });
  } catch (err: any) {
    console.error('Error creating design revision:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
