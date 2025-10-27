/* eslint-env node */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
const sources = ['logo-tree.png', 'logo-tree-name.png', 'logo-tree-solid.png'];
const sizes = [300, 600]; // 1x, 2x widths

async function ensure(src) {
  if (!fs.existsSync(path.join(publicDir, src))) {
    console.warn('Source not found:', src);
    return false;
  }
  return true;
}

async function run() {
  for (const src of sources) {
    if (!(await ensure(src))) continue;
    const input = path.join(publicDir, src);
    const base = path.basename(src, path.extname(src));
    for (const w of sizes) {
      const pngOut = path.join(publicDir, `${base}-${w}.png`);
      const webpOut = path.join(publicDir, `${base}-${w}.webp`);
      const avifOut = path.join(publicDir, `${base}-${w}.avif`);
      console.log(`Generating ${pngOut}`);
      try {
        await sharp(input).rotate().resize({ width: w, fit: 'inside' }).png().toFile(pngOut);
        await sharp(input).rotate().resize({ width: w, fit: 'inside' }).webp({ quality: 80 }).toFile(webpOut);
        await sharp(input).rotate().resize({ width: w, fit: 'inside' }).avif({ quality: 50 }).toFile(avifOut);
      } catch (e) {
        console.warn('Failed to generate for', src, e.message || e);
      }
    }
  }
  console.log('Logo generation complete');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
