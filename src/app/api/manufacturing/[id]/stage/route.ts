import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendCustomerStatusUpdateEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

const stages = ['JOB_RELEASED','MATERIAL_PLANNING','WOOD_CUTTING','FRAME_ASSEMBLY','SPRING_WEBBING','FOAM_CUTTING','CUSHIONING','FABRIC_CUTTING','STITCHING','UPHOLSTERY','FINAL_FINISHING','QUALITY_INSPECTION','PACKAGING','DISPATCH_READY','CLOSED_INTERNALLY'];

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const update = await prisma.$transaction(async (tx) => {
      const job = await tx.manufacturingJob.findUnique({ where: { id: params.id }, include: { customer: true } });
      if (!job) return { response: NextResponse.json({ error: 'Job not found.' }, { status: 404 }) };

      const index = stages.indexOf(job.currentStage);
      if (index < 0 || index === stages.length - 1 || body.newStage !== stages[index + 1]) {
        return { response: NextResponse.json({ error: 'This stage has changed. Refresh and advance to the next stage.' }, { status: 409 }) };
      }

      const closing = body.newStage === 'CLOSED_INTERNALLY';
      await tx.manufacturingJob.update({ where: { id: job.id }, data: { currentStage: body.newStage, actualCompletionDate: closing ? new Date() : null } });
      await tx.jobTask.updateMany({ where: { jobId: job.id, stageNumber: { lte: index + 1 } }, data: { status: 'COMPLETED', completedAt: new Date() } });
      await tx.jobTask.updateMany({ where: { jobId: job.id, stageNumber: index + 2 }, data: { status: closing ? 'COMPLETED' : 'IN_PROGRESS', startedAt: new Date(), completedAt: closing ? new Date() : null } });
      const tasks = await tx.jobTask.findMany({ where: { jobId: job.id }, orderBy: { stageNumber: 'asc' } });
      return { job, tasks, currentStage: body.newStage };
    });

    if ('response' in update) return update.response;
    const email = await sendCustomerStatusUpdateEmail({
      to: update.job.customer.email,
      customerName: update.job.customer.fullName,
      referenceCode: update.job.jobCardNumber,
      recordType: 'Manufacturing order',
      status: update.currentStage,
      details: `Product: ${update.job.productTitle}. Quantity: ${update.job.quantity}. Your furniture is progressing through our Agra workshop.`,
    });

    return NextResponse.json({
      success: true,
      currentStage: update.currentStage,
      tasks: update.tasks,
      emailNotification: email.sent ? 'sent' : email.reason,
    });
  } catch {
    return NextResponse.json({ error: 'Unable to update job stage. Please retry.' }, { status: 500 });
  }
}
