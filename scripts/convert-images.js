import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
const exts = ['.png', '.jpg', '.jpeg'];

async function convertFile(file) {
  const ext = path.extname(file).toLowerCase();
  const base = path.basename(file, ext);
  const input = path.join(publicDir, file);

  try {
    const webpOut = path.join(publicDir, `${base}.webp`);
    const avifOut = path.join(publicDir, `${base}.avif`);
    const at2xPng = path.join(publicDir, `${base}@2x.png`);
    const at2xWebp = path.join(publicDir, `${base}@2x.webp`);
    const at2xAvif = path.join(publicDir, `${base}@2x.avif`);

    // skip if outputs are newer than source
    const srcStat = fs.statSync(input);

    // read metadata once to make sizing decisions
    const img = sharp(input).rotate();
    const metadata = await img.metadata();
    const width = metadata.width || null;
    const height = metadata.height || null;

    // safety caps to avoid creating enormous files or upscaling
    const MAX_DIM = 4096; // largest allowed dimension
    const MAX_PIXELS = 50_000_000; // roughly a 7k x 7k limit
    const pixels = (width || 0) * (height || 0);
    if (pixels > MAX_PIXELS) {
      console.warn(`Skipping ${file}: image is too large (${width}x${height}), conversion skipped`);
      return;
    }

    const make = async (outPath, format) => {
      let doIt = true;
      if (fs.existsSync(outPath)) {
        const outStat = fs.statSync(outPath);
        doIt = outStat.mtimeMs < srcStat.mtimeMs;
      }
      if (!doIt) return;

      console.log(`Converting ${file} -> ${path.basename(outPath)}`);

      // create a fresh pipeline each time to avoid reusing state
      let pipeline = sharp(input).rotate();

      // if image is bigger than our cap, downscale (fit inside bounds)
      if (width && height && (width > MAX_DIM || height > MAX_DIM)) {
        pipeline = pipeline.resize({ width: MAX_DIM, height: MAX_DIM, fit: 'inside' });
      }

      if (format === 'webp') {
        await pipeline.webp({ quality: 80 }).toFile(outPath);
      } else if (format === 'avif') {
        await pipeline.avif({ quality: 50 }).toFile(outPath);
      }
    };

    await make(webpOut, 'webp');
    await make(avifOut, 'avif');

    // generate @2x versions for logos: do NOT upscale source; only downscale if needed
    if (base.startsWith('logo-tree')) {
      try {
        // desired width: the source width but capped by MAX_DIM
        const desired = width ? Math.min(width, MAX_DIM) : null;
        if (desired) {
          await sharp(input).rotate().resize({ width: desired, fit: 'inside' }).png().toFile(at2xPng);
          await sharp(input).rotate().resize({ width: desired, fit: 'inside' }).webp({ quality: 80 }).toFile(at2xWebp);
          await sharp(input).rotate().resize({ width: desired, fit: 'inside' }).avif({ quality: 50 }).toFile(at2xAvif);
        }
      } catch (e) {
        console.warn('Failed to generate @2x outputs for', file, e.message || e);
      }
    }
  } catch (err) {
    console.error('Failed to convert', file, err);
  }
}

async function run() {
  if (!fs.existsSync(publicDir)) {
    console.error('public/ directory not found, skipping image conversion');
    process.exit(0);
  }
  const files = fs.readdirSync(publicDir).filter((f) => exts.includes(path.extname(f).toLowerCase()));
  for (const f of files) {
    await convertFile(f);
  }
  console.log('Image conversion complete');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
