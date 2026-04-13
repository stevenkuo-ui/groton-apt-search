import { chromium } from 'playwright';

async function check() {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    // Try RentCafe direct
    await page.goto('https://www.latriumpheapartments.com/floorplans.aspx', { timeout: 30000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    const text = await page.evaluate(() => document.body.innerText);
    console.log('=== LA TRIUMPHE (direct RentCafe) ===');
    console.log(text.substring(0, 4000));
    await browser.close();
  } catch (e) {
    console.log('ERROR:', e.message);
  }
}

check().catch(console.error);
