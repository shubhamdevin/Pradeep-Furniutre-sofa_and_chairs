const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const designs = require('./designs.json');

async function installCatalogue(prisma) {
  // Do not publish a partially generated collection.
  for (const design of designs) {
    const file = path.join(__dirname, '../../public/images/catalogue-2026', design.slug + '.png');
    if (!fs.existsSync(file)) throw new Error('Product image is not ready: ' + design.slug);
  }
  const slugs = designs.map(d => d.slug);
  return prisma.$transaction(async tx => {
    const sofaCollection = await tx.collection.upsert({where:{slug:'luxury-sofas-2026'},update:{isPublished:true},create:{slug:'luxury-sofas-2026',name:'The Sofa Edit',tagline:'25 distinct expressions of comfort',description:'Curved silhouettes, tailored classics and statement modular seating.',heroImage:'/images/catalogue-2026/aurelia-crescent-sofa.png',sortOrder:0}});
    const chairCollection = await tx.collection.upsert({where:{slug:'fancy-chairs-2026'},update:{isPublished:true},create:{slug:'fancy-chairs-2026',name:'The Statement Chair Edit',tagline:'25 individual personalities',description:'Sculptural forms, elegant frames and expressive upholstery.',heroImage:'/images/catalogue-2026/elara-petal-chair.png',sortOrder:1}});
    const categories = await tx.category.findMany();
    const categoryIds = new Map(categories.map(c=>[c.slug,c.id]));
    for(const d of designs) {
      if(!categoryIds.has(d.category)){
        const c=await tx.category.create({data:{slug:d.category,name:d.category.split('-').map(v=>v[0].toUpperCase()+v.slice(1)).join(' ')}});categoryIds.set(c.slug,c.id);
      }
      const upholstery = /leather/i.test(d.design)?'Leather':/boucle/i.test(d.design)?'Bouclé':/velvet/i.test(d.design)?'Velvet':/linen/i.test(d.design)?'Linen':/wool|felt/i.test(d.design)?'Wool blend':/canvas/i.test(d.design)?'Canvas':/suede/i.test(d.design)?'Suede':/satin/i.test(d.design)?'Satin':'Custom upholstery';
      const imageUrl='/images/catalogue-2026/'+d.slug+'.png';
      const data={sku:`EDIT-${d.type==='SOFA'?'SOF':'CHR'}-${String(d.index).padStart(3,'0')}`,name:d.name,slug:d.slug,tagline:d.type==='SOFA'?'Luxury seating, individually designed':'A statement from every angle',description:d.design[0].toUpperCase()+d.design.slice(1)+'. Available as a made-to-order design with your choice of size and finish. Design imagery illustrates the proposed style; our atelier confirms materials and measurements with your quotation.',categoryId:categoryIds.get(d.category),collectionId:d.type==='SOFA'?sofaCollection.id:chairCollection.id,furnitureType:d.type,seatingCapacity:d.type==='CHAIR'?'1 Seater':d.category==='2-seater-sofas'?'2 Seater':d.category==='sectional-sofas'?'Modular seating':d.category==='l-shaped-sofas'?'L-Shaped seating':d.category==='u-shaped-sofas'?'U-Shaped seating':'3 Seater',dimensionsSummary:'Made to measure',upholsteryType:upholstery,isAvailable:true,isCustomizable:true,isFeatured:(d.type==='SOFA'&&[1,4].includes(d.index))||(d.type==='CHAIR'&&[1,7].includes(d.index))};
      const product=await tx.product.upsert({where:{slug:d.slug},update:data,create:data});
      await tx.productImage.upsert({where:{id:'catalogue-2026-'+d.slug},update:{url:imageUrl,altText:d.name+' — '+d.design,isPrimary:true},create:{id:'catalogue-2026-'+d.slug,productId:product.id,url:imageUrl,altText:d.name+' — '+d.design,isPrimary:true,viewAngle:'Design preview',sortOrder:0}});
      await tx.productSpecification.upsert({where:{id:'catalogue-spec-'+d.slug},update:{value:d.design},create:{id:'catalogue-spec-'+d.slug,productId:product.id,group:'Design',label:'Signature details',value:d.design,sortOrder:0}});
    }
    // Retain previous records and their CRM relations, removing only demo listings from the public catalogue.
    await tx.product.updateMany({where:{sku:{startsWith:'ATELIER-'},slug:{notIn:slugs}},data:{isAvailable:false,isFeatured:false}});
    return {sofas:25,chairs:25};
  },{timeout:60000});
}
module.exports={installCatalogue};
if(require.main===module){const prisma=new PrismaClient();installCatalogue(prisma).then(result=>console.log('Catalogue published:',result)).catch(error=>{console.error(error);process.exitCode=1}).finally(()=>prisma.$disconnect());}
