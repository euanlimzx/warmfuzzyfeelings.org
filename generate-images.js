const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Generate random color
function randomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return { r, g, b };
}

// Images to generate
const images = [
  { name: 'hero-bg.jpg', width: 1920, height: 1080 }, // Desktop hero - wide
  { name: 'hero-mobile.jpg', width: 1080, height: 1920 }, // Mobile hero - tall
  { name: 'card-reba.jpg', width: 400, height: 600 },
  { name: 'card-allamerican.jpg', width: 400, height: 600 },
  { name: 'card-shameless.jpg', width: 400, height: 600 },
  { name: 'card-brooklyn99.jpg', width: 400, height: 600 },
  { name: 'card-strangerthings.jpg', width: 400, height: 600 },
  { name: 'card-swat.jpg', width: 400, height: 600 },
  { name: 'card-ozark.jpg', width: 400, height: 600 },
  { name: 'card-youngsheldon.jpg', width: 400, height: 600 },
  { name: 'card-lucifer.jpg', width: 400, height: 600 },
  { name: 'card-theoffice.jpg', width: 400, height: 600 },
  { name: 'card-breakingbad.jpg', width: 400, height: 600 },
  { name: 'card-peakyblinders.jpg', width: 400, height: 600 },
  { name: 'card-thewitcher.jpg', width: 400, height: 600 },
];

const outputDir = path.join(__dirname, 'public', 'images');

// Ensure directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateImages() {
  for (const img of images) {
    const color = randomColor();
    const outputPath = path.join(outputDir, img.name);
    
    await sharp({
      create: {
        width: img.width,
        height: img.height,
        channels: 3,
        background: { r: color.r, g: color.g, b: color.b }
      }
    })
    .jpeg({ quality: 90 })
    .toFile(outputPath);
    
    console.log(`Generated: ${img.name} (${color.r}, ${color.g}, ${color.b})`);
  }
  
  console.log(`\nAll ${images.length} images generated successfully!`);
}

generateImages().catch(console.error);
