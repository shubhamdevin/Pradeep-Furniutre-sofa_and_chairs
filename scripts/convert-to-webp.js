const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');

async function convertDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await convertDir(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        const webpPath = fullPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        if (!fs.existsSync(webpPath)) {
          try {
            await sharp(fullPath)
              .webp({ quality: 82, effort: 4 })
              .toFile(webpPath);
            const origSize = fs.statSync(fullPath).size;
            const newSize = fs.statSync(webpPath).size;
            console.log(`Converted: ${entry.name} (${Math.round(origSize / 1024)}KB -> ${Math.round(newSize / 1024)}KB)`);
          } catch (err) {
            console.error(`Error converting ${entry.name}:`, err.message);
          }
        }
      }
    }
  }
}

async function main() {
  console.log('Starting image conversion to .webp in', IMAGES_DIR);
  await convertDir(IMAGES_DIR);
  console.log('Finished converting images to .webp');
}

main().catch(console.error);
