const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Inspecting SQLite database for image URLs...');

  // 1. ProductImage
  const productImages = await prisma.productImage.findMany();
  console.log(`Found ${productImages.length} product images.`);
  let updatedProductImages = 0;
  for (const img of productImages) {
    if (img.url && /\.(png|jpg|jpeg)$/i.test(img.url)) {
      const webpUrl = img.url.replace(/\.(png|jpg|jpeg)$/i, '.webp');
      const localPath = path.join(__dirname, '..', 'public', webpUrl.replace(/^\//, ''));
      if (fs.existsSync(localPath)) {
        await prisma.productImage.update({
          where: { id: img.id },
          data: { url: webpUrl }
        });
        updatedProductImages++;
      } else {
        console.warn(`WebP file does not exist for: ${img.url} -> ${localPath}`);
      }
    }
  }
  console.log(`Updated ${updatedProductImages} product images to .webp.`);

  // 2. Category
  const categories = await prisma.category.findMany();
  console.log(`Found ${categories.length} categories.`);
  let updatedCategories = 0;
  for (const cat of categories) {
    if (cat.imageUrl && /\.(png|jpg|jpeg)$/i.test(cat.imageUrl)) {
      const webpUrl = cat.imageUrl.replace(/\.(png|jpg|jpeg)$/i, '.webp');
      const localPath = path.join(__dirname, '..', 'public', webpUrl.replace(/^\//, ''));
      if (fs.existsSync(localPath)) {
        await prisma.category.update({
          where: { id: cat.id },
          data: { imageUrl: webpUrl }
        });
        updatedCategories++;
      }
    }
  }
  console.log(`Updated ${updatedCategories} category images to .webp.`);

  // 3. Collection
  const collections = await prisma.collection.findMany();
  console.log(`Found ${collections.length} collections.`);
  let updatedCollections = 0;
  for (const col of collections) {
    if (col.heroImage && /\.(png|jpg|jpeg)$/i.test(col.heroImage)) {
      const webpUrl = col.heroImage.replace(/\.(png|jpg|jpeg)$/i, '.webp');
      const localPath = path.join(__dirname, '..', 'public', webpUrl.replace(/^\//, ''));
      if (fs.existsSync(localPath)) {
        await prisma.collection.update({
          where: { id: col.id },
          data: { heroImage: webpUrl }
        });
        updatedCollections++;
      }
    }
  }
  console.log(`Updated ${updatedCollections} collection images to .webp.`);

  // 4. ProjectPortfolio
  const portfolios = await prisma.projectPortfolio.findMany();
  console.log(`Found ${portfolios.length} project portfolios.`);
  let updatedPortfolios = 0;
  for (const port of portfolios) {
    let changed = false;
    let coverImage = port.coverImage;
    if (coverImage && /\.(png|jpg|jpeg)$/i.test(coverImage)) {
      const webpUrl = coverImage.replace(/\.(png|jpg|jpeg)$/i, '.webp');
      const localPath = path.join(__dirname, '..', 'public', webpUrl.replace(/^\//, ''));
      if (fs.existsSync(localPath)) {
        coverImage = webpUrl;
        changed = true;
      }
    }
    if (changed) {
      await prisma.projectPortfolio.update({
        where: { id: port.id },
        data: { coverImage }
      });
      updatedPortfolios++;
    }
  }
  console.log(`Updated ${updatedPortfolios} project portfolio images to .webp.`);

  // 5. ThreeDAsset
  const assets = await prisma.threeDAsset.findMany();
  console.log(`Found ${assets.length} 3D assets.`);
  let updatedAssets = 0;
  for (const asset of assets) {
    if (asset.posterImageUrl && /\.(png|jpg|jpeg)$/i.test(asset.posterImageUrl)) {
      const webpUrl = asset.posterImageUrl.replace(/\.(png|jpg|jpeg)$/i, '.webp');
      const localPath = path.join(__dirname, '..', 'public', webpUrl.replace(/^\//, ''));
      if (fs.existsSync(localPath)) {
        await prisma.threeDAsset.update({
          where: { id: asset.id },
          data: { posterImageUrl: webpUrl }
        });
        updatedAssets++;
      }
    }
  }
  console.log(`Updated ${updatedAssets} 3D assets posters to .webp.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
