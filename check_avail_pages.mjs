import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });

const pages = [
  { name: 'Harbor Heights Beacon Availability', url: 'https://www.hmystic.com/beacon/availability' },
  { name: 'Harbor Heights Enclave Availability', url: 'https://www.hmystic.com/enclave/availability' },
  { name: 'Harbor Heights Beacon', url: 'https://www.hmystic.com/beacon/floor-plans-beacon' },
  { name: 'Harbor Heights Enclave', url: 'https://www.hmystic.com/enclave/floor-plans-enclave' },
];

for (const p of pages) {
  console.log('\n=== ' + p.name + ' ===');
  const page = await browser.newPage();
  try {
    await page.goto(p.url, { timeout: 20000, waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);
    const text = await page.evaluate(() => document.body.innerText);
    const priceRegex = /\$[\d,]+/g;
    const prices = text.match(priceRegex) || [];
    console.log('Prices:', [...new Set(prices)].slice(0, 20));
    console.log('Text snippet:', text.substring(0, 2000));
  } catch(e) {
    console.log('Error:', e.message);
  }
  await page.close();
}
await browser.close();
