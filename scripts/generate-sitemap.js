import fs from 'fs';
import path from 'path';

const siteUrl = 'https://ryanfishermd.com';
const outPath = path.resolve('public', 'sitemap.xml');
const insightsDir = path.resolve('src', 'content', 'insights');

function listMarkdownFiles(dir) {
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
}

function parseFrontMatter(file) {
  const content = fs.readFileSync(path.join(insightsDir, file), 'utf8');
  const m = /^---\n([\s\S]*?)\n---/m.exec(content);
  const data = {};
  if (m) {
    m[1].split('\n').forEach((line) => {
      const i = line.indexOf(':');
      if (i > -1) {
        const key = line.slice(0, i).trim();
        const val = line.slice(i + 1).trim().replace(/^"|"$/g, '');
        data[key] = val;
      }
    });
  }
  return data;
}

const files = listMarkdownFiles(insightsDir).filter((f) => {
  const data = parseFrontMatter(f);
  return !(data.draft === 'true' || data.draft === true);
});

const urls = [
  `${siteUrl}/`,
  `${siteUrl}/insights`,
  ...files.map((f) => `${siteUrl}/insights/${f.replace(/\.md$/, '')}`),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map((u) => `  <url>\n    <loc>${u}</loc>\n  </url>`)
  .join('\n')}\n</urlset>`;

fs.writeFileSync(outPath, xml, 'utf8');
console.log('Sitemap written to', outPath);
