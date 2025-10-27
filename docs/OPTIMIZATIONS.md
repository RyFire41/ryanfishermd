Performance & SEO optimizations applied and next steps

What I implemented:
- Added lazy loading for markdown images and header logo fallback to WebP if available.
- Added font preconnects in `index.html`.
- Added `scripts/generate-sitemap.js` and `postbuild` script to create `public/sitemap.xml` at build time.
- Added `rollup-plugin-visualizer` to help analyze bundle size.
- Added `.github/workflows/ci.yml` to run lint and build on push/PR.
- Added responsive `.table-scroll` utility and accessibility roles/skip link.

Recommended manual steps (can't run here):
- Convert PNG/JPEG assets to efficient formats (WebP/AVIF). Example using `cwebp`:
  cwebp -q 80 public/logo-tree.png -o public/logo-tree.webp
- Configure hosting (Netlify/Vercel/Cloudflare) to enable Brotli/Gzip and long cache TTLs for static assets.
- Add automated image generation (sharp) in your build pipeline to produce multiple sizes and formats.

How to generate the sitemap locally:
- Run `npm run build` (this will run `postbuild` which generates `public/sitemap.xml`).

Bundle analysis:
- Run `npm run analyze` and open the generated `dist/stats.html` to inspect large modules.
