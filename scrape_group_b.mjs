// Group B: Groton Towers, Groton Townhomes, Reid Hughes, La Triumphe, Meadow Ridge, Hedgewood, The Ambrose
import { chromium } from 'playwright';

const SCRAPE_DATE = new Date().toISOString().slice(0,10);
const RESULTS = [];

async function run() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });

  // --- Groton Towers ---
  try {
    const page = await browser.newPage();
    await page.goto('https://grotonapartmenthomes.com/floorplans/', { timeout: 15000, waitUntil: 'networkidle' });
    const html = await page.content();
    // Extract pricing from page text
    const text = await page.evaluate(() => document.body.innerText);
    console.log('=== GROTON TOWERS ===');
    console.log(text.slice(0, 3000));
    await page.close();
  } catch(e) {
    console.log('GROTON TOWERS ERROR:', e.message);
  }

  // --- Groton Townhomes ---
  try {
    const page = await browser.newPage();
    await page.goto('https://grotontownhouses.com/', { timeout: 15000, waitUntil: 'networkidle' });
    const text = await page.evaluate(() => document.body.innerText);
    console.log('=== GROTON TOWNHOMES ===');
    console.log(text.slice(0, 3000));
    await page.close();
  } catch(e) {
    console.log('GROTON TOWNHOMES ERROR:', e.message);
  }

  // --- Reid Hughes ---
  try {
    const page = await browser.newPage();
    await page.goto('https://reidhughes.com/Floor-Plans.aspx', { timeout: 15000, waitUntil: 'networkidle' });
    const text = await page.evaluate(() => document.body.innerText);
    console.log('=== REID HUGHES ===');
    console.log(text.slice(0, 3000));
    await page.close();
  } catch(e) {
    console.log('REID HUGHES ERROR:', e.message);
  }

  // --- The Ambrose ---
  try {
    const page = await browser.newPage();
    await page.goto('https://www.b7properties.com/ambrose', { timeout: 15000, waitUntil: 'networkidle' });
    const text = await page.evaluate(() => document.body.innerText);
    console.log('=== THE AMBROSE ===');
    console.log(text.slice(0, 3000));
    await page.close();
  } catch(e) {
    console.log('THE AMBROSE ERROR:', e.message);
  }

  // --- Meadow Ridge ---
  try {
    const page = await browser.newPage();
    await page.goto('https://www.meadowridgenorwich.com/floorplans', { timeout: 15000, waitUntil: 'networkidle' });
    const text = await page.evaluate(() => document.body.innerText);
    console.log('=== MEADOW RIDGE ===');
    console.log(text.slice(0, 3000));
    await page.close();
  } catch(e) {
    console.log('MEADOW RIDGE ERROR:', e.message);
  }

  await browser.close();
}

run().catch(console.error);