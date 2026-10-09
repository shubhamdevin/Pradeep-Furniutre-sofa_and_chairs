import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { newStage, completedStageNumber } = body;

    const job = await prisma.manufacturingJob.findUnique({
      where: { id: params.id },
      include: { tasks: true },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Update job current stage
    const updated = await prisma.manufacturingJob.update({
      where: { id: params.id },
      data: { currentStage: newStage },
    });

    // Mark task completed if provided
    if (completedStageNumber) {
      await prisma.jobTask.updateMany({
        where: { jobId: params.id, stageNumber: completedStageNumber },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });
      // Mark next stage IN_PROGRESS
      await prisma.jobTask.updateMany({
        where: { jobId: params.id, stageNumber: completedStageNumber + 1 },
        data: { status: 'IN_PROGRESS', startedAt: new Date() },
      });
    }

    return NextResponse.json({
      success: true,
      currentStage: updated.currentStage,
      message: `Job transitioned to ${newStage}`,
    });
  } catch (err: any) {
    console.error('Error updating manufacturing stage:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
