import sharp from 'sharp';
import fs from 'fs';

async function createFavicons() {
  const src = 'src/assets/tradeflow-icon.png';
  
  // High-res png buffers
  const png16 = await sharp(src).resize(16, 16).png().toBuffer();
  const png32 = await sharp(src).resize(32, 32).png().toBuffer();
  const png48 = await sharp(src).resize(48, 48).png().toBuffer();
  const png180 = await sharp(src).resize(180, 180).png().toBuffer();
  const png192 = await sharp(src).resize(192, 192).png().toBuffer();
  const png512 = await sharp(src).resize(512, 512).png().toBuffer();

  // Create favicon.ico containing 16, 32, 48
  const images = [
    { width: 16, height: 16, buffer: png16 },
    { width: 32, height: 32, buffer: png32 },
    { width: 48, height: 48, buffer: png48 }
  ];

  const headerSize = 6;
  const dirEntrySize = 16;
  const numImages = images.length;
  let offset = headerSize + numImages * dirEntrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = ICO
  header.writeUInt16LE(numImages, 4);

  const dirEntries = [];
  for (const img of images) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(img.width, 0);
    entry.writeUInt8(img.height, 1);
    entry.writeUInt8(0, 2); // color palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(img.buffer.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    dirEntries.push(entry);
    offset += img.buffer.length;
  }

  const icoBuffer = Buffer.concat([header, ...dirEntries, ...images.map(i => i.buffer)]);
  
  // Write to public/
  fs.writeFileSync('public/favicon.ico', icoBuffer);
  fs.writeFileSync('public/favicon-16x16.png', png16);
  fs.writeFileSync('public/favicon-32x32.png', png32);
  fs.writeFileSync('public/apple-touch-icon.png', png180);
  fs.writeFileSync('public/icon-192.png', png192);
  fs.writeFileSync('public/icon-512.png', png512);
  fs.writeFileSync('public/icon.png', png512);

  // Overwrite old generic icon.png in src/assets/ and public/
  fs.writeFileSync('src/assets/icon.png', png512);
  if (fs.existsSync('public/all-images/icon-images/icon.png')) {
    fs.writeFileSync('public/all-images/icon-images/icon.png', png512);
  }
  if (fs.existsSync('src/assets/all-images/icon-images/icon.png')) {
    fs.writeFileSync('src/assets/all-images/icon-images/icon.png', png512);
  }

  // Generate crisp SVG favicon with high-res embedded mark
  const base64 = png512.toString('base64');
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image href="data:image/png;base64,${base64}" width="512" height="512"/>
</svg>\n`;
  fs.writeFileSync('public/favicon.svg', svgContent);
  fs.writeFileSync('src/assets/icon.svg', svgContent);

  console.log('All favicons and web icons generated successfully!');
}

createFavicons().catch(console.error);
