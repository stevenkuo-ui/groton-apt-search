import { chromium } from 'playwright';

const results = {};

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' });

// Triton Square - availability page
{
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  try {
    await page.goto('https://www.tritonsquare.com/availability-map/', { waitUntil: 'networkidle', timeout: 25000 });
    const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 3000));
    results['triton-square'] = { url: page.url(), status: 200, bodyText };
  } catch (e) {
    results['triton-square'] = { error: e.message.slice(0, 200) };
  }
  await page.close();
}

// Harbor Heights Enclave - try networkidle for JS pricing
{
  const page = await context.newPage();
  page.setDefaultTimeout(40000);
  try {
    await page.goto('https://www.hmystic.com/enclave/floor-plans-enclave', { waitUntil: 'networkidle', timeout: 35000 });
    const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 5000));
    results['harbor-heights-enclave'] = { url: page.url(), status: 200, bodyText };
  } catch (e) {
    results['harbor-heights-enclave'] = { error: e.message.slice(0, 200) };
  }
  await page.close();
}

// Harbor Heights Beacon - try networkidle for JS pricing
{
  const page = await context.newPage();
  page.setDefaultTimeout(40000);
  try {
    await page.goto('https://www.hmystic.com/beacon/floor-plans-beacon', { waitUntil: 'networkidle', timeout: 35000 });
    const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 5000));
    results['harbor-heights-beacon'] = { url: page.url(), status: 200, bodyText };
  } catch (e) {
    results['harbor-heights-beacon'] = { error: e.message.slice(0, 200) };
  }
  await page.close();
}

// The Ledges - get all prices with networkidle
{
  const page = await context.newPage();
  page.setDefaultTimeout(40000);
  try {
    await page.goto('https://www.theledgesapartments.com/floorplans', { waitUntil: 'networkidle', timeout: 35000 });
    const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 8000));
    results['the-ledges-full'] = { url: page.url(), status: 200, bodyText };
  } catch (e) {
    results['the-ledges-full'] = { error: e.message.slice(0, 200) };
  }
  await page.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));