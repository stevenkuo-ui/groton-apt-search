import { chromium } from 'playwright';

async function check() {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    // Try Zillow
    await page.goto('https://www.zillow.com/apartments/groton-ct/5-bed/', { timeout: 30000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    let text = await page.evaluate(() => document.body.innerText);
    // Look for La Triumphe
    if (text.includes('Triumphe') || text.includes('triumphe')) {
      console.log('=== ZILLOW - La Triumphe found ===');
      const idx = text.indexOf('Triumphe');
      console.log(text.substring(Math.max(0, idx-200), idx+2000));
    } else {
      console.log('=== ZILLOW text (first 1000) ===');
      console.log(text.substring(0, 1000));
    }
    await browser.close();
  } catch (e) {
    console.log('ERROR:', e.message);
  }
}

check().catch(console.error);
