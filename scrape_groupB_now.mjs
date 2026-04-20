import { chromium } from 'playwright';

const results = {};

async function scrapeWithPlaywright(url, label) {
  console.log(`\n=== Scraping: ${label} ===`);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
    const title = await page.title();
    const bodyText = await page.evaluate(() => document.body.innerText);
    const html = await page.content();
    console.log(`[${label}] Title: ${title}`);
    console.log(`[${label}] Body text (first 3000 chars):\n${bodyText.substring(0, 3000)}`);
    results[label] = { title, bodyText, html, url, success: true };
  } catch (e) {
    console.log(`[${label}] ERROR: ${e.message}`);
    results[label] = { error: e.message, url, success: false };
  }
  await browser.close();
}

async function main() {
  // Groton Towers - new site, JS-rendered portal
  await scrapeWithPlaywright('https://grotonapartmenthomes.com/availability', 'Groton Towers');

  // Groton Townhomes - direct available-rentals URL
  await scrapeWithPlaywright('https://grotontownhouses.com/available-rentals', 'Groton Townhomes');

  // Reid Hughes - RealPage JS
  await scrapeWithPlaywright('https://reidhughes.com/floor-plans', 'Reid Hughes');

  // Meadow Ridge
  await scrapeWithPlaywright('https://meadowridgenorwich.com/floor-plans', 'Meadow Ridge');

  // Hedgewood - miradorliving.com (generic portal)
  await scrapeWithPlaywright('https://miradorliving.com', 'Hedgewood');

  // The Ambrose
  await scrapeWithPlaywright('https://b7properties.com/ambrose', 'The Ambrose');

  console.log('\n=== ALL RESULTS ===');
  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
