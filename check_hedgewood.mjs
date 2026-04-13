import { chromium } from 'playwright';

async function check() {
  // Hedgewood - miradorliving.com
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://www.miradorliving.com', { timeout: 30000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const text = await page.evaluate(() => document.body.innerText);
    console.log('=== MIRADOR (miradorliving.com) ===');
    console.log(text.substring(0, 2000));
    await browser.close();
  } catch (e) {
    console.log('ERROR:', e.message);
  }
}

check().catch(console.error);
