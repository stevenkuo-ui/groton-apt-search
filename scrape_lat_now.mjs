import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const results = {};
async function scrape(url, label) {
  const page = await browser.newPage();
  page.setDefaultTimeout(25000);
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(8000);
    const text = await page.evaluate(() => document.body.innerText);
    results[label] = { success: true, text: text.slice(0, 4000) };
  } catch(e) {
    results[label] = { success: false, error: e.message.slice(0, 300) };
  }
  await page.close();
}
await scrape('https://www.latriumpheapartments.com/floorplans.aspx', 'la-triumphe-direct');
await scrape('https://www.apartments.com/la-triumphe-groton-ct/2ybkjc6/', 'la-triumphe-aptcom');
await browser.close();
console.log(JSON.stringify(results, null, 2));
