import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });

const results = {};

async function scrape(url, label, waitOpts = { waitUntil: 'domcontentloaded', timeout: 30000 }) {
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);
  try {
    await page.goto(url, waitOpts);
    await page.waitForTimeout(8000);
    const text = await page.evaluate(() => document.body.innerText);
    const title = await page.title();
    results[label] = { success: true, title, text: text.slice(0, 5000) };
  } catch(e) {
    results[label] = { success: false, error: e.message.slice(0, 300) };
  }
  await page.close();
}

// Groton Towers - JS-rendered portal
await scrape('https://grotonapartmenthomes.com/floorplans', 'groton-towers', { waitUntil: 'networkidle', timeout: 30000 });

// Groton Townhomes - JS-rendered
await scrape('https://grotontownhouses.com/available-rentals', 'groton-townhomes', { waitUntil: 'networkidle', timeout: 30000 });

// Reid Hughes - RealPage JS
await scrape('https://www.reidhughes.com/Floor-Plans.aspx', 'reid-hughes', { waitUntil: 'networkidle', timeout: 30000 });

// The Ambrose - direct site
await scrape('https://www.b7properties.com/ambrose', 'the-ambrose', { waitUntil: 'domcontentloaded', timeout: 30000 });

// Meadow Ridge - JS-rendered RentCafe
await scrape('https://www.meadowridgenorwich.com/floorplans', 'meadow-ridge', { waitUntil: 'networkidle', timeout: 30000 });

// Hedgewood - direct site
await scrape('https://www.miradorliving.com/communities/hedgewood', 'hedgewood', { waitUntil: 'domcontentloaded', timeout: 30000 });

await browser.close();
console.log(JSON.stringify(results, null, 2));
