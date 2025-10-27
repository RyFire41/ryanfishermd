import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
const backupDir = path.join(publicDir, '_backup_images');
const MAX_WIDTH = 1200;

function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

function isImage(f) {
  return /\.(png|jpg|jpeg)$/i.test(f);
}

async function process() {
  ensureDir(backupDir);
  const files = fs.readdirSync(publicDir);

  for (const f of files) {
    const full = path.join(publicDir, f);
    if (!fs.statSync(full).isFile()) continue;

    // remove duplicated multi-@2x name patterns like '@2x@2x@2x'
    if (/(@2x){2,}/.test(f)) {
      console.log('Removing duplicate file:', f);
      const dest = path.join(backupDir, f);
      fs.renameSync(full, dest);
      continue;
    }

    if (isImage(f)) {
      try {
        const img = sharp(full);
        const meta = await img.metadata();
        if (meta.width && meta.width > MAX_WIDTH) {
          console.log(`Downscaling ${f} from ${meta.width}px -> ${MAX_WIDTH}px`);
          const dest = path.join(backupDir, f);
          // backup original
          fs.renameSync(full, dest);
          // write new downscaled file at original path
          await sharp(dest).rotate().resize({ width: MAX_WIDTH, fit: 'inside' }).toFile(full);
        }
      } catch (e) {
        console.warn('Failed to process', f, e.message || e);
      }
    }
  }

  console.log('Image cleanup complete. Originals moved to', backupDir);
}

process().catch((e) => {
  console.error(e);
  process.exit(1);
});
