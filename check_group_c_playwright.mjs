#!/usr/bin/env node
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';

const WORKDIR = '/Users/stevenkuo/Documents/apartment_search_groton_ct_site_2026-03-21/';

async function scrape(url, label, waitStrategy = 'networkidle') {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto(url, { timeout: 15000, waitUntil: waitStrategy });
    await page.waitForTimeout(3000);
    const content = await page.content();
    console.log(`\n=== ${label} ===`);
    console.log(`URL: ${url}`);
    console.log(`Content length: ${content.length}`);
    // Extract key data
    const text = await page.evaluate(() => document.body?.innerText || '');
    console.log(text.substring(0, 2000));
    return text.substring(0, 3000);
  } catch(e) {
    console.log(`\n=== ${label} === FAILED: ${e.message}`);
    return null;
  } finally {
    await browser.close();
  }
}

const checks = [
  { url: 'https://www.eaglepointeapts.com/floorplans', label: 'Eagle Pointe (direct)' },
  { url: 'https://www.courtviewct.com/', label: 'Courtview Square (direct)' },
  { url: 'https://www.renewgroton.com/groton/renew-groton/conventional/', label: 'ReNew Groton (direct)' },
  { url: 'https://www.renewwashingtonpark.com/groton/renew-washington-park/conventional/', label: 'ReNew Washington Park (direct)' },
  { url: 'https://www.apartments.com/eagle-pointe-new-london-ct/qg2gmsx/', label: 'Eagle Pointe (Apartments.com)' },
  { url: 'https://www.apartments.com/courtview-square-apartments-new-london-ct/gpepnvw/', label: 'Courtview Square (Apartments.com)' },
];

for (const check of checks) {
  await scrape(check.url, check.label);
}

console.log('\n=== SCRAPING COMPLETE ===');