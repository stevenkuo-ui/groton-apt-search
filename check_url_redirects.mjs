import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const urls = [
  'https://grotonestates.com/',
  'https://grotonestates.com/floor-plans/',
  'https://www.tritonsquare.com/availability-map/',
  'https://www.theledgesapartments.com/floorplans',
  'https://gullharborct.com/',
  'https://gullharborct.com/floorplans'
];
for (const url of urls) {
  const page = await browser.newPage();
  try {
    const resp = await page.goto(url, { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    console.log(url, '->', page.url(), '| Status:', resp?.status());
  } catch(e) {
    console.log(url, '-> ERROR:', e.message);
  }
  await page.close();
}
await browser.close();
