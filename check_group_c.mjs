import { chromium } from 'playwright';

const properties = [
  {
    name: 'Eagle Pointe',
    url: 'https://www.eaglepointeapts.com/floorplans',
    note: 'Official site - JS rendered'
  }
];

const browser = await chromium.launch({ headless: true });
const results = [];

for (const prop of properties) {
  const result = { name: prop.name, url: prop.url, status: 'unknown', error: null, prices: [], bedrooms: [], sqft: [], snippet: '', title: '' };
  
  try {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      ignoreHTTPSErrors: true
    });
    const page = await context.newPage();
    
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push(err.message));
    
    try {
      await page.goto(prop.url, { waitUntil: 'networkidle', timeout: 20000 });
    } catch (e) {
      try {
        await page.goto(prop.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(5000);
      } catch (e2) {
        throw new Error('Page load failed: ' + e2.message);
      }
    }
    
    const title = await page.title();
    result.title = title;
    
    // Try to extract price info from floor plan cards
    const cards = await page.$$eval('[class*="floorplan"], [class*="plan"], [class*="unit"], .unit-item, .floorplan-item, [class*="availability"]', els => {
      return els.map(el => {
        const text = el.innerText || '';
        const priceMatch = text.match(/\$\d{1,3}(?:,\d{3})*(?:\s*[-–]\s*\$?\d{1,3}(?:,\d{3})*)?/);
        const price = priceMatch ? priceMatch[0] : '';
        return { text: text.trim().slice(0, 200), price };
      }).filter(c => c.price || c.text.length > 20);
    });
    
    result.prices = cards.map(c => c.price).filter(Boolean);
    result.snippet = cards.map(c => c.text).slice(0, 10).join('\n---\n');
    result.status = 'ok';
    result.errors = errors.slice(0, 5);
    
    await context.close();
  } catch (e) {
    result.status = 'error';
    result.error = e.message;
  }
  
  results.push(result);
}

await browser.close();

for (const r of results) {
  console.log(`\n=== ${r.name} ===`);
  console.log(`URL: ${r.url}`);
  console.log(`Status: ${r.status}`);
  if (r.error) console.log(`ERROR: ${r.error}`);
  if (r.title) console.log(`Title: ${r.title}`);
  if (r.prices.length) console.log(`Prices: ${r.prices.join(', ')}`);
  if (r.snippet) console.log(`Snippet:\n${r.snippet}`);
  if (r.errors && r.errors.length) console.log(`JS Errors: ${r.errors.join('; ')}`);
}
