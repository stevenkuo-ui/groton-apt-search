#!/usr/bin/env node
import { chromium } from 'playwright';

async function scrape(url, label) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto(url, { timeout: 20000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(8000);
    const text = await page.evaluate(() => document.body?.innerText || '');
    console.log(`\n=== ${label} ===`);
    console.log(`URL: ${url}`);
    console.log(text.substring(0, 3000));
    return 'ok';
  } catch(e) {
    console.log(`\n=== ${label} === FAILED: ${e.message.substring(0, 200)}`);
    return null;
  } finally {
    await browser.close();
  }
}

await scrape('https://www.renewgroton.com/groton/renew-groton/conventional/', 'ReNew Groton');
await scrape('https://www.renewwashingtonpark.com/groton/renew-washington-park/conventional/', 'ReNew Washington Park');
await scrape('https://www.eaglepointeapts.com/floorplans', 'Eagle Pointe');
await scrape('https://www.courtviewct.com/', 'Courtview Square');
await scrape('https://gullharborct.com/floorplans', 'Gull Harbor');
console.log('\n=== DONE ===');