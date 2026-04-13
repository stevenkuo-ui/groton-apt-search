// La Triumphe Tavily search + aggregator check
import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });

  // La Triumphe - try direct site
  try {
    const page = await browser.newPage();
    await page.goto('https://www.latriumpheapartments.com/floorplans.aspx', { timeout: 20000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    const text = await page.evaluate(() => document.body.innerText);
    console.log('=== LA TRIUMPHE (direct site) ===');
    console.log(text.slice(0, 4000));
    await page.close();
  } catch(e) {
    console.log('LA TRIUMPHE ERROR:', e.message.slice(0,200));
  }

  // La Triumphe - try Apartments.com
  try {
    const page = await browser.newPage();
    await page.goto('https://www.apartments.com/la-triumphe-groton-ct/2ybkjc6/', { timeout: 20000, waitUntil: 'networkidle' });
    const text = await page.evaluate(() => document.body.innerText);
    console.log('=== LA TRIUMPHE APARTMENTS.COM ===');
    console.log(text.slice(0, 4000));
    await page.close();
  } catch(e) {
    console.log('LA TRIUMPHE APARTMENTS.COM ERROR:', e.message.slice(0,200));
  }

  // Hedgewood - try Zillow
  try {
    const page = await browser.newPage();
    await page.goto('https://www.zillow.com/homes/Hedgewood-Norwich-ct_rb/', { timeout: 20000, waitUntil: 'networkidle' });
    const text = await page.evaluate(() => document.body.innerText);
    console.log('=== HEDGEWOOD ZILLOW ===');
    console.log(text.slice(0, 4000));
    await page.close();
  } catch(e) {
    console.log('HEDGEWOOD ZILLOW ERROR:', e.message.slice(0,200));
  }

  await browser.close();
}

run().catch(console.error);