'use server';
import { cookies } from 'next/headers';
import { validSession } from '@/lib/admin-session';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { sendCustomerStatusUpdateEmail } from '@/lib/email';

const leadStages = ['NEW','CONTACTED','REQUIREMENTS_COLLECTED','DESIGN_REVIEW','QUOTATION_SENT','NEGOTIATION','CONVERTED','LOST','ON_HOLD'];
function text(value: unknown, required = false) { const s = String(value ?? '').trim(); if (required && !s) throw new Error('Please fill all required fields.'); return s; }
function number(value: unknown, min = 0) { const n = Number(value); if (!Number.isFinite(n) || n < min) throw new Error('Enter a valid non-negative number.'); return n; }
function choice(value: unknown, options: string[]) { const s = text(value); if (!options.includes(s)) throw new Error('Invalid status selected.'); return s; }
async function notifyStatusChange(input: { customer: { email: string | null; fullName: string }; referenceCode: string; recordType: string; status: string; details?: string }) {
 const result = await sendCustomerStatusUpdateEmail({ to: input.customer.email, customerName: input.customer.fullName, referenceCode: input.referenceCode, recordType: input.recordType, status: input.status, details: input.details });
 if (result.sent) return 'Status updated and email sent to the customer.';
 if (result.reason === 'missing_email') return 'Status updated, but this customer has no email address on file.';
 if (result.reason === 'smtp_not_configured') return 'Status updated, but email was not sent because SMTP is not configured.';
 return 'Status updated, but the email could not be delivered. Check the server mail logs.';
}

export async function saveAdminRecord(kind: string, id: string | null, values: Record<string, unknown>) {
 try {
  if (!await validSession(cookies().get('atelier_admin')?.value)) throw new Error('Please sign in again.');
  let notification: string | undefined;
  if (kind === 'products') {
   const data = { name: text(values.name,true), sku: text(values.sku,true), slug: text(values.slug,true), description: text(values.description,true), categoryId: text(values.categoryId,true), furnitureType: choice(values.furnitureType,['SOFA','CHAIR','LOUNGE','SECTIONAL','ACCENT']), seatingCapacity: text(values.seatingCapacity), dimensionsSummary: text(values.dimensionsSummary), frameMaterial: text(values.frameMaterial), upholsteryType: text(values.upholsteryType), isAvailable: values.isAvailable === true, isFeatured: values.isFeatured === true };
   if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) throw new Error('Use lowercase words separated by hyphens for the URL slug.');
   const imageUrl = text(values.imageUrl,true);
   if (!/^\/(?!\/)/.test(imageUrl) && !/^https?:\/\//.test(imageUrl)) throw new Error('Use a local image path or an https image URL.');
   await prisma.$transaction(async tx => {
    const p = id ? await tx.product.update({where:{id},data}) : await tx.product.create({data});
    const image = await tx.productImage.findFirst({where:{productId:p.id},orderBy:[{isPrimary:'desc'},{sortOrder:'asc'}]});
    if(image) await tx.productImage.update({where:{id:image.id},data:{url:imageUrl,altText:data.name,isPrimary:true}});
    else await tx.productImage.create({data:{productId:p.id,url:imageUrl,altText:data.name,isPrimary:true}});
   });
  } else if (kind === 'leads' && id) {
   const stage = choice(values.stage,leadStages);
   const date = text(values.nextFollowUpAt); if(date && Number.isNaN(Date.parse(date))) throw new Error('Choose a valid follow-up date.');
   const result = await prisma.$transaction(async tx => {
    const before = await tx.lead.findUniqueOrThrow({where:{id},include:{customer:true,product:true}});
    const STAGE_RANK: Record<string, number> = { NEW: 1, CONTACTED: 2, REQUIREMENTS_COLLECTED: 2.5, DESIGN_REVIEW: 3, QUOTATION_SENT: 4, NEGOTIATION: 4.5, CONVERTED: 5, LOST: 6, CLOSED: 6, ON_HOLD: 6 };
    if ((STAGE_RANK[stage] ?? 1) < (STAGE_RANK[before.stage] ?? 1)) {
      throw new Error(`Lead status cannot move backward from ${before.stage} to ${stage}. Status can only advance forward.`);
    }
    const updated = await tx.lead.update({where:{id},data:{stage,priority:choice(values.priority,['LOW','MEDIUM','HIGH','URGENT']),assignedToId:text(values.assignedToId)||null,nextFollowUpAt:date?new Date(date):null},include:{customer:true,product:true}});
    await tx.leadActivity.create({data:{leadId:id,action:before.stage!==stage?'STAGE_CHANGE':'NOTE_ADDED',details:text(values.note)||`Lead updated: ${stage.replaceAll('_',' ')}`}});
    return { before, updated };
   });
   if (result.before.stage !== stage) {
    notification = await notifyStatusChange({customer:result.updated.customer,referenceCode:result.updated.leadCode,recordType:'Enquiry',status:stage,details:result.updated.product?.name ? `Furniture design: ${result.updated.product.name}` : undefined});
    await prisma.leadActivity.create({data:{leadId:id,action:'CUSTOMER_EMAIL',details:notification}});
   }
  } else if (kind === 'inventory') {
   const amount=number(values.currentStock); const reserved=number(values.reservedStock);
   if(reserved>amount) throw new Error('Reserved stock cannot exceed available stock.');
   const data={name:text(values.name,true),itemCode:text(values.itemCode,true),category:text(values.category,true),unit:text(values.unit,true),currentStock:amount,reservedStock:reserved,minimumLevel:number(values.minimumLevel),unitCost:number(values.unitCost),locationBin:text(values.locationBin),supplierId:text(values.supplierId)||null};
   await prisma.$transaction(async tx=>{
    const before=id?await tx.inventoryItem.findUniqueOrThrow({where:{id}}):null;
    const item=id?await tx.inventoryItem.update({where:{id},data}):await tx.inventoryItem.create({data});
    const delta=amount-(before?.currentStock||0);
    if(delta!==0) await tx.inventoryMovement.create({data:{inventoryItemId:item.id,movementType:'ADJUSTMENT_AUDIT',quantity:delta,remarks:text(values.note)||'Stock updated by administrator'}});
   });
  } else if(kind==='suppliers') {
   const data={name:text(values.name,true),category:text(values.category,true),phone:text(values.phone),email:text(values.email),city:text(values.city),leadTimeDays:number(values.leadTimeDays)};
   if(!Number.isInteger(data.leadTimeDays)) throw new Error('Lead time must be a whole number.');
   if(id) await prisma.supplier.update({where:{id},data}); else await prisma.supplier.create({data});
  } else if(kind==='requests' && id) {
   const status=choice(values.status,['REQUEST_RECEIVED','UNDER_REVIEW','MORE_DETAILS_REQUIRED','FEASIBILITY_CHECK','DESIGN_IN_PROGRESS','CONCEPT_READY','REVISION_REQUESTED','DESIGN_APPROVED','QUOTATION_PENDING','CLOSED_REJECTED']);
   const before=await prisma.designRequest.findUniqueOrThrow({where:{id},include:{customer:true,product:true}});
   const updated=await prisma.designRequest.update({where:{id},data:{status},include:{customer:true,product:true}});
   if(before.status!==status) notification=await notifyStatusChange({customer:updated.customer,referenceCode:updated.referenceNumber,recordType:'Design request',status,details:updated.product?.name?`Furniture design: ${updated.product.name}`:undefined});
  } else if(kind==='quotations' && id) {
   const status=choice(values.status,['DRAFT','UNDER_REVIEW','SENT','REVISION_REQUESTED','ACCEPTED','REJECTED','EXPIRED']);
   const result=await prisma.$transaction(async tx=>{
    const before=await tx.quotation.findUniqueOrThrow({where:{id},include:{customer:true}});
    const quote=await tx.quotation.update({where:{id},data:{status},include:{customer:true,items:true}});
    if(quote.leadId){
     if(status==='SENT'||status==='ACCEPTED')await tx.lead.update({where:{id:quote.leadId},data:{stage:status==='SENT'?'QUOTATION_SENT':'CONVERTED'}});
     await tx.leadActivity.create({data:{leadId:quote.leadId,action:'QUOTE_STATUS',details:quote.quoteNumber+' marked '+status}});
    }
    return {before,quote};
   });
   if(result.before.status!==status) notification=await notifyStatusChange({customer:result.quote.customer,referenceCode:result.quote.quoteNumber,recordType:'Quotation',status,details:`Quotation revision ${result.quote.revisionCode}. ${result.quote.items.length} furniture ${result.quote.items.length===1?'design':'designs'} included.`});
  } else if(kind==='consultations' && id) {
   const status=choice(values.status,['PENDING','CONFIRMED','COMPLETED','RESCHEDULED','CANCELLED']);
   const before=await prisma.consultationBooking.findUniqueOrThrow({where:{id},include:{customer:true}});
   const updated=await prisma.consultationBooking.update({where:{id},data:{status},include:{customer:true}});
   if(before.status!==status) notification=await notifyStatusChange({customer:updated.customer,referenceCode:`BOOK-${updated.id.slice(-6).toUpperCase()}`,recordType:'Consultation booking',status,details:`Preferred appointment: ${updated.preferredDate.toLocaleDateString()} · ${updated.preferredTime}`});
  } else throw new Error('This record cannot be updated.');
  revalidatePath('/', 'layout');
  return {success:true,notification};
 } catch(error:any) { return {success:false,error:error.code==='P2002'?'This SKU, code or URL already exists.':error.code==='P2025'?'Record no longer exists. Refresh the page.':error.code==='P2003'?'Please select a valid related record.':error.message||'Unable to save changes.'}; }
}
