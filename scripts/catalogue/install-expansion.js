const {PrismaClient}=require('@prisma/client');
const fs=require('fs');const path=require('path');const designs=require('./expansion.json');
async function installExpansion(prisma){
 for(const d of designs){if(!fs.existsSync(path.join(__dirname,'../../public/images/catalogue-expansion',d.slug+'.png')))throw Error('Image missing: '+d.slug);}
 return prisma.$transaction(async tx=>{
  const collections={};
  for(const [type,slug,name,description] of [['CHAIR','wood-and-comfort','Wood & Comfort','50 individually designed wooden-frame chairs with upholstered foam cushioning.'],['SOFA','grand-luxury-edit','The Grand Luxury Edit','50 expressive luxury sofa designs, from sculpted curves to tailored architectural forms.']]){
   collections[type]=await tx.collection.upsert({where:{slug},update:{},create:{slug,name,description,tagline:'50 individual designs',heroImage:'/images/catalogue-expansion/'+designs.find(d=>d.type===type).slug+'.png',isPublished:true,sortOrder:type==='CHAIR'?2:3}});
  }
  const categories=await tx.category.findMany();
  for(const d of designs){
   let category=categories.find(c=>c.slug===d.category);if(!category){category=await tx.category.create({data:{slug:d.category,name:d.category.split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join(' ')}});categories.push(category);}
   const wood=d.design.match(/acacia|walnut|oak|cedar|elm|ash|teak|rosewood|pecan|maple|tamarind|willow|birch|cypress|mahogany|koa|larch|beech|olivewood|basswood/i)?.[0]||'Solid hardwood';
   const upholstery=d.design.match(/leather|velvet|linen|boucle|satin|suede|jacquard/i)?.[0]||'Premium fabric';
   const data={sku:`NEW-${d.type==='CHAIR'?'CHR':'SOF'}-${String(d.index).padStart(3,'0')}`,name:d.name,slug:d.slug,tagline:d.type==='CHAIR'?'Sculpted wood. Cushioned comfort.':'Distinctive luxury, made for your space.',description:d.design[0].toUpperCase()+d.design.slice(1)+'. Made to order with your choice of finish and upholstery. Design imagery illustrates the proposed style; final materials and measurements are confirmed with your quotation.',categoryId:category.id,collectionId:collections[d.type].id,furnitureType:d.type,seatingCapacity:d.type==='CHAIR'?'1 Seater':d.category==='2-seater-sofas'?'2 Seater':d.category==='sectional-sofas'?'Modular seating':'3 Seater',dimensionsSummary:'Made to measure',foamDensity:'High-density foam cushioning; firmness confirmed on quotation',frameMaterial:wood[0].toUpperCase()+wood.slice(1),upholsteryType:upholstery[0].toUpperCase()+upholstery.slice(1),isAvailable:true,isCustomizable:true,isFeatured:false};
   // Existing records keep any subsequent admin changes when this import is repeated.
   const product=await tx.product.upsert({where:{slug:d.slug},update:{},create:data});
   await tx.productImage.upsert({where:{id:'expansion-'+d.slug},update:{},create:{id:'expansion-'+d.slug,productId:product.id,url:'/images/catalogue-expansion/'+d.slug+'.png',altText:d.name+' — '+d.design,isPrimary:true,sortOrder:0,viewAngle:'Design preview'}});
   await tx.productSpecification.upsert({where:{id:'expansion-spec-'+d.slug},update:{},create:{id:'expansion-spec-'+d.slug,productId:product.id,group:'Design',label:'Signature details',value:d.design,sortOrder:0}});
  }
  return {addedChairs:50,addedSofas:50};
 },{timeout:120000});
}
module.exports={installExpansion};
if(require.main===module){const p=new PrismaClient();installExpansion(p).then(console.log).catch(e=>{console.error(e);process.exitCode=1}).finally(()=>p.$disconnect());}
