import { chromium } from 'playwright';

const props = [
  { name: 'triton-square', url: 'https://www.tritonsquare.com/availability-map/', label: 'Triton Square' },
  { name: 'pleasant-valley', url: 'https://www.pleasantvalley-apts.com/apartments/ct/groton/floor-plans', label: 'Pleasant Valley' },
  { name: 'harbor-heights-beacon', url: 'https://www.hmystic.com/beacon/floor-plans-beacon', label: 'Harbor Heights Beacon' },
  { name: 'harbor-heights-enclave', url: 'https://www.hmystic.com/enclave/floor-plans-enclave', label: 'Harbor Heights Enclave' },
  { name: 'waterford-woods', url: 'https://www.waterfordwoods.com/availability', label: 'Waterford Woods' },
  { name: 'groton-estates', url: 'https://grotonestates.com/floor-plans/', label: 'Groton Estates' },
  { name: 'chester-place', url: 'https://www.b7properties.com/chester-place', label: 'Chester Place' },
  { name: 'emerson-place', url: 'https://www.b7properties.com/emerson', label: 'Emerson Place' },
  { name: 'the-ledges', url: 'https://www.theledgesapartments.com/floorplans', label: 'The Ledges' },
  { name: 'gull-harbor', url: 'https://gullharborct.com/floorplans', label: 'Gull Harbor' },
];

const browser = await chromium.launch({ headless: true });
const results = {};

for (const p of props) {
  const page = await browser.newPage();
  try {
    await page.goto(p.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
    const title = await page.title();
    const bodyText = await page.evaluate(() => document.body?.innerText?.slice(0, 3000) ?? '');
    // Try to extract prices
    const priceRegex = /\$[\d,]+/g;
    const prices = (bodyText.match(priceRegex) ?? []).slice(0, 30);
    // Check for availability
    const availRegex = /(\d+)\s*(units?\s*avail|availab(?:le|ility))/i;
    const availMatch = bodyText.match(availRegex);
    results[p.name] = {
      status: 'ok',
      title,
      url: p.url,
      rawText: bodyText.slice(0, 2000),
      prices: prices.filter(p => p.length > 3),
      availability: availMatch ? availMatch[0] : null,
    };
  } catch (e) {
    results[p.name] = { status: 'error', error: e.message.slice(0, 200), url: p.url };
  } finally {
    await page.close();
  }
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
