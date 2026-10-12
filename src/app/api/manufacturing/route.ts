import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendCustomerStatusUpdateEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await prisma.$transaction(async (tx) => {
    const {
      customerId,
      quotationId,
      designRequestId,
      designRevisionId,
      productTitle,
      quantity = 1,
      exactDimensions,
      frameInstructions,
      foamSpecification,
      fabricCodeAndColor,
      priority = 'STANDARD',
      targetCompletionWeeks = 3,
      notes,
    } = body;

    if (!customerId || !productTitle || !exactDimensions) {
      return NextResponse.json(
        { error: 'Customer, Product Title, and Exact Dimensions are required.' },
        { status: 400 }
      );
    }

    if (quotationId) {
      const quote = await tx.quotation.findUnique({where:{id:quotationId},include:{manufacturingJobs:true}});
      if (!quote || quote.customerId !== customerId) return NextResponse.json({error:'Quotation does not match this customer.'},{status:400});
      if (quote.status !== 'ACCEPTED') return NextResponse.json({error:'Accept the quotation before releasing a factory job.'},{status:400});
      if (quote.manufacturingJobs.length) return NextResponse.json({error:'A factory job already exists for this quotation.'},{status:409});
    }
    if (!Number.isInteger(Number(quantity)) || Number(quantity)<1 || !Number.isFinite(Number(targetCompletionWeeks)) || Number(targetCompletionWeeks)<=0) return NextResponse.json({error:'Enter valid quantity and delivery weeks.'},{status:400});
    const jobCardNumber = `JOB-${new Date().getFullYear()}-${crypto.randomUUID().slice(0,8).toUpperCase()}`;

    const targetCompletionDate = new Date(Date.now() + targetCompletionWeeks * 7 * 24 * 60 * 60 * 1000);

    const job = await tx.manufacturingJob.create({
      data: {
        jobCardNumber,
        customerId,
        quotationId: quotationId || null,
        designRequestId: designRequestId || null,
        designRevisionId: designRevisionId || null,
        productTitle,
        quantity: Number(quantity) || 1,
        exactDimensions,
        frameInstructions: frameInstructions || 'Grade-A Kiln-dried CP Teakwood frame with mortise and tenon joinery.',
        foamSpecification: foamSpecification || 'Base 50D ortho-support, middle 45D HR foam, top microfiber down wrap.',
        fabricCodeAndColor: fabricCodeAndColor || 'Selected Atelier Luxe Fabric',
        priority,
        currentStage: 'JOB_RELEASED',
        targetCompletionDate,
        notes: notes || null,
      },
      include: { customer: true },
    });

    // Initialize 15 standard stages tasks
    const stages = [
      { name: 'Job Released & Order Blueprint Freeze', num: 1, status: 'COMPLETED' },
      { name: 'Material Planning & Allocation', num: 2, status: 'PENDING' },
      { name: 'Wood Cutting & Milling', num: 3, status: 'PENDING' },
      { name: 'Frame Assembly & Mortise Joinery', num: 4, status: 'PENDING' },
      { name: 'Spring & Webbing Sub-Structure', num: 5, status: 'PENDING' },
      { name: 'Foam Cutting & Density Stacking', num: 6, status: 'PENDING' },
      { name: 'Cushioning & Feather Envelope Wrap', num: 7, status: 'PENDING' },
      { name: 'Fabric Laser Cutting & Pattern Alignment', num: 8, status: 'PENDING' },
      { name: 'Stitching & French Seam Tailoring', num: 9, status: 'PENDING' },
      { name: 'Hand Upholstery & Channel Pleating', num: 10, status: 'PENDING' },
      { name: 'Final Finishing & Brass Base Mounting', num: 11, status: 'PENDING' },
      { name: 'Quality Inspection & Load Testing', num: 12, status: 'PENDING' },
      { name: 'Protective Packaging & Corner Guards', num: 13, status: 'PENDING' },
      { name: 'Dispatch Ready & Logistics Scheduling', num: 14, status: 'PENDING' },
      { name: 'Closed Internally (Post Installation)', num: 15, status: 'PENDING' },
    ];

    for (const st of stages) {
      await tx.jobTask.create({
        data: {
          jobId: job.id,
          stageName: st.name,
          stageNumber: st.num,
          status: st.status,
        },
      });
    }

    return {
      success: true,
      jobCardNumber,
      jobId: job.id,
      message: 'Manufacturing Job Card created successfully.',
      job,
    };
    });
    if (result instanceof NextResponse) return result;
    const email = await sendCustomerStatusUpdateEmail({
      to: result.job.customer.email,
      customerName: result.job.customer.fullName,
      referenceCode: result.jobCardNumber,
      recordType: 'Manufacturing order',
      status: result.job.currentStage,
      details: `Product: ${result.job.productTitle}. Quantity: ${result.job.quantity}. Your furniture has been released to our Agra workshop.`,
    });
    return NextResponse.json({
      success: result.success,
      jobCardNumber: result.jobCardNumber,
      jobId: result.jobId,
      message: result.message,
      emailNotification: email.sent ? 'sent' : email.reason,
    });
  } catch (err: any) {
    console.error('Error creating job card:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const jobs = await prisma.manufacturingJob.findMany({
      include: {
        customer: true,
        tasks: { orderBy: { stageNumber: 'asc' } },
        bom: { include: { items: true } },
        inspections: true,
        assignments: { include: { user: true } },
        designRevision: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(jobs);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
