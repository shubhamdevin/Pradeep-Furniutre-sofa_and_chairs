import { prisma } from '@/lib/prisma';
import ResourceManager from '@/components/admin/ResourceManager';
export const dynamic='force-dynamic';
export default async function Consultations(){const records=await prisma.consultationBooking.findMany({include:{customer:true},orderBy:{preferredDate:'asc'}});return <ResourceManager kind="consultations" title="Consultation bookings" canCreate={false} fields={[{key:'status',label:'Booking status',options:['PENDING','CONFIRMED','COMPLETED','RESCHEDULED','CANCELLED'].map(value=>({value,label:value}))}]} records={records.map(r=>({...r,customerName:r.customer.fullName,customerPhone:r.customer.phone,dateLabel:r.preferredDate.toLocaleDateString('en-IN')}))}/>}
