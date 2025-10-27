#!/usr/bin/env node
/* eslint-env node */
const fs = require('fs');
const path = require('path');

const url = process.argv[2] || 'http://127.0.0.1:4173';

(async () => {
  try {
    // Lazy require so installation can be done separately
    const puppeteer = require('puppeteer');
    const { AxePuppeteer } = require('@axe-core/puppeteer');

    console.log('Launching headless Chrome...');
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    console.log('Navigating to', url);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    console.log('Running axe-core scan...');
    const results = await new AxePuppeteer(page).analyze();

    const outPath = path.resolve(process.cwd(), 'axe-report.json');
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
    console.log(`axe results written to ${outPath}`);

    const violations = results.violations || [];
    console.log(`Found ${violations.length} accessibility violation(s).`);
    if (violations.length > 0) {
      violations.slice(0, 5).forEach((v, i) => {
        console.log(`\n${i + 1}) ${v.id}: ${v.help} (impact: ${v.impact})`);
        console.log(`   Nodes: ${v.nodes.length}`);
      });
      console.log('\nOpen axe-report.json for full details.');
    }

    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('Error running axe scan:', err.message || err);
    console.error(err);
    process.exit(2);
  }
})();
