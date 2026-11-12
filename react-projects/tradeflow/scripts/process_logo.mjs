import sharp from 'sharp';
import fs from 'fs';

async function processLogo() {
  const inputPath = 'C:/Users/LAM/.gemini/antigravity/brain/79ae0706-a260-4a97-aed7-51c7596d3044/.user_uploaded/media_1794488826163_dd49c9fb.jpg';
  
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;

  let minX = width, maxX = 0, minY = height, maxY = 0;
  let markMinX = width, markMaxX = 0, markMinY = height, markMaxY = 0;

  const transparentBuffer = Buffer.from(data);
  const whiteTextBuffer = Buffer.from(data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      
      if (r > 248 && g > 248 && b > 248) {
        transparentBuffer[idx + 3] = 0;
        whiteTextBuffer[idx + 3] = 0;
      } else if (r > 225 && g > 225 && b > 225) {
        const alpha = Math.max(0, Math.min(255, Math.round(255 - ((brightness - 225) / (255 - 225)) * 255)));
        transparentBuffer[idx + 3] = alpha;
        whiteTextBuffer[idx + 3] = alpha;
      }

      // Check if it's a dark green / black pixel (for the white-inverted version)
      // Dark green has low brightness (e.g. < 80) and low red/blue
      if (brightness < 75) {
        // Change dark green to crisp white in whiteTextBuffer
        whiteTextBuffer[idx] = 255;
        whiteTextBuffer[idx + 1] = 255;
        whiteTextBuffer[idx + 2] = 255;
      }

      if (brightness < 235) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;

        if (x < 325) {
          if (x < markMinX) markMinX = x;
          if (x > markMaxX) markMaxX = x;
          if (y < markMinY) markMinY = y;
          if (y > markMaxY) markMaxY = y;
        }
      }
    }
  }

  // Standard full logo crop
  const padding = 12;
  const cropX = Math.max(0, minX - padding);
  const cropY = Math.max(0, minY - padding);
  const cropW = Math.min(width - cropX, (maxX - minX) + padding * 2);
  const cropH = Math.min(height - cropY, (maxY - minY) + padding * 2);

  await sharp(transparentBuffer, { raw: { width, height, channels: 4 } })
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .png()
    .toFile('src/assets/tradeflow-logo.png');

  await sharp(whiteTextBuffer, { raw: { width, height, channels: 4 } })
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .png()
    .toFile('src/assets/tradeflow-logo-white.png');

  // Mark only crop
  const markPad = 8;
  const mX = Math.max(0, markMinX - markPad);
  const mY = Math.max(0, markMinY - markPad);
  const mW = Math.min(width - mX, (markMaxX - markMinX) + markPad * 2);
  const mH = Math.min(height - mY, (markMaxY - markMinY) + markPad * 2);

  await sharp(transparentBuffer, { raw: { width, height, channels: 4 } })
    .extract({ left: mX, top: mY, width: mW, height: mH })
    .png()
    .toFile('src/assets/tradeflow-mark.png');

  await sharp(whiteTextBuffer, { raw: { width, height, channels: 4 } })
    .extract({ left: mX, top: mY, width: mW, height: mH })
    .png()
    .toFile('src/assets/tradeflow-mark-white.png');

  // Favicon / App Icon (square with subtle transparent margin)
  const size = Math.max(mW, mH) + 16;
  const iconBuffer = await sharp(transparentBuffer, { raw: { width, height, channels: 4 } })
    .extract({ left: mX, top: mY, width: mW, height: mH })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  fs.writeFileSync('src/assets/tradeflow-icon.png', iconBuffer);

  // Also create icon.svg with base64 embedded for 100% fidelity SVG
  const base64Icon = iconBuffer.toString('base64');
  const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <image href="data:image/png;base64,${base64Icon}" width="${size}" height="${size}"/>
</svg>`;
  fs.writeFileSync('src/assets/icon.svg', svgFavicon);

  console.log('Successfully processed all logo assets');
}

processLogo().catch(console.error);
