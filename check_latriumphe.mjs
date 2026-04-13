import { chromium } from 'playwright';

async function check() {
  // La Triumphe - try via Apartments.com
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://www.apartments.com/la-triumphe-groton-ct/39elk7b/', { timeout: 30000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const text = await page.evaluate(() => document.body.innerText);
    console.log('=== LA TRIUMPHE (Apartments.com) ===');
    console.log(text.substring(0, 3000));
    await browser.close();
  } catch (e) {
    console.log('ERROR:', e.message);
  }
}

check().catch(console.error);
