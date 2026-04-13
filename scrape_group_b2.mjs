// Follow-up scrapes for Group B
import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });

  // Groton Townhomes - try the available rentals page
  try {
    const page = await browser.newPage();
    await page.goto('https://grotontownhouses.com/available-rentals', { timeout: 20000, waitUntil: 'networkidle' });
    const text = await page.evaluate(() => document.body.innerText);
    console.log('=== GROTON TOWNHOMES AVAILABLE RENTALS ===');
    console.log(text.slice(0, 4000));
    await page.close();
  } catch(e) {
    console.log('GROTON TOWNHOMES AVAIL ERROR:', e.message.slice(0,200));
  }

  // The Ambrose - longer timeout, try direct URL
  try {
    const page = await browser.newPage();
    await page.goto('https://www.b7properties.com/ambrose', { timeout: 30000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    const text = await page.evaluate(() => document.body.innerText);
    console.log('=== THE AMBROSE (retry) ===');
    console.log(text.slice(0, 4000));
    await page.close();
  } catch(e) {
    console.log('THE AMBROSE RETRY ERROR:', e.message.slice(0,200));
  }

  // Meadow Ridge - try with domcontentloaded + wait
  try {
    const page = await browser.newPage();
    await page.goto('https://www.meadowridgenorwich.com/floorplans', { timeout: 30000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(8000);
    const text = await page.evaluate(() => document.body.innerText);
    console.log('=== MEADOW RIDGE (retry) ===');
    console.log(text.slice(0, 4000));
    await page.close();
  } catch(e) {
    console.log('MEADOW RIDGE RETRY ERROR:', e.message.slice(0,200));
  }

  await browser.close();
}

run().catch(console.error);