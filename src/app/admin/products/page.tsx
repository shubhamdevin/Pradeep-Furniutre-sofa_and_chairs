import { prisma } from '@/lib/prisma';
import ResourceManager from '@/components/admin/ResourceManager';
import { Field } from '@/components/admin/RecordEditor';
export const dynamic='force-dynamic';
export default async function ProductsAdmin(){
 const [products,categories]=await Promise.all([prisma.product.findMany({include:{images:true,category:true},orderBy:{createdAt:'desc'}}),prisma.category.findMany({orderBy:{sortOrder:'asc'}})]);
 const fields:Field[]=[{key:'name',label:'Product name',required:true},{key:'sku',label:'SKU',required:true},{key:'slug',label:'URL slug',required:true},{key:'categoryId',label:'Category',options:categories.map(c=>({value:c.id,label:c.name}))},{key:'furnitureType',label:'Furniture type',options:['SOFA','CHAIR','LOUNGE','SECTIONAL','ACCENT'].map(value=>({value,label:value}))},{key:'seatingCapacity',label:'Seating capacity'},{key:'dimensionsSummary',label:'Dimensions'},{key:'frameMaterial',label:'Frame material'},{key:'upholsteryType',label:'Upholstery'},{key:'imageUrl',label:'Primary photo URL or /images/ path',required:true},{key:'description',label:'Description',type:'textarea',required:true},{key:'isAvailable',label:'Publish in catalogue',type:'checkbox'},{key:'isFeatured',label:'Feature on homepage',type:'checkbox'}];
 return <ResourceManager kind="products" title="Furniture catalogue" fields={fields} records={products.map(p=>({...p,imageUrl:p.images.find(i=>i.isPrimary)?.url||p.images[0]?.url||''}))}/>;
}
