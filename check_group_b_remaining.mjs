import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });

  // Groton Towers
  try {
    const page = await browser.newPage();
    await page.goto('https://grotonapartmenthomes.com/available-rentals', { timeout: 30000, waitUntil: 'networkidle' });
    const text = await page.evaluate(() => document.body.innerText);
    console.log('=== GROTON TOWERS ===');
    console.log(text.slice(0, 4000));
    await page.close();
  } catch(e) {
    console.log('GROTON TOWERS ERROR:', e.message.slice(0,300));
  }

  // Reid Hughes
  try {
    const page = await browser.newPage();
    await page.goto('https://reidhughes.com/floor-plans', { timeout: 30000, waitUntil: 'networkidle' });
    const text = await page.evaluate(() => document.body.innerText);
    console.log('=== REID HUGHES ===');
    console.log(text.slice(0, 4000));
    await page.close();
  } catch(e) {
    console.log('REID HUGHES ERROR:', e.message.slice(0,300));
  }

  // Hedgewood - miradorliving.com
  try {
    const page = await browser.newPage();
    await page.goto('https://www.miradorliving.com/apartments-for-rent/ct/groton/hedgewood', { timeout: 20000, waitUntil: 'networkidle' });
    const text = await page.evaluate(() => document.body.innerText);
    console.log('=== HEDGEWOOD ===');
    console.log(text.slice(0, 3000));
    await page.close();
  } catch(e) {
    console.log('HEDGEWOOD ERROR:', e.message.slice(0,300));
  }

  await browser.close();
}
run().catch(console.error);
