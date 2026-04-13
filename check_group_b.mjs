import { chromium } from 'playwright';

async function checkGroupB() {
  const browser = await chromium.launch({ headless: true });
  const results = {};

  // 1. Groton Towers - grotonapartmenthomes.com
  try {
    const page = await browser.newPage();
    await page.goto('https://grotonapartmenthomes.com/floorplans', { timeout: 30000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    const content = await page.content();
    // Extract pricing from the page
    const text = await page.evaluate(() => document.body.innerText);
    results['groton-towers'] = { status: 'OK', text: text.substring(0, 3000) };
    await page.close();
  } catch (e) {
    results['groton-towers'] = { status: 'ERROR', error: e.message };
  }

  // 2. The Ambrose - b7properties.com/ambrose
  try {
    const page = await browser.newPage();
    await page.goto('https://www.b7properties.com/ambrose', { timeout: 30000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    const text = await page.evaluate(() => document.body.innerText);
    results['the-ambrose'] = { status: 'OK', text: text.substring(0, 2000) };
    await page.close();
  } catch (e) {
    results['the-ambrose'] = { status: 'ERROR', error: e.message };
  }

  // 3. Reid Hughes - reidhughes.com
  try {
    const page = await browser.newPage();
    await page.goto('https://reidhughes.com/Floor-Plans.aspx', { timeout: 30000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    const text = await page.evaluate(() => document.body.innerText);
    results['reid-hughes'] = { status: 'OK', text: text.substring(0, 2000) };
    await page.close();
  } catch (e) {
    results['reid-hughes'] = { status: 'ERROR', error: e.message };
  }

  // 4. Meadow Ridge - meadowridgenorwich.com/floorplans
  try {
    const page = await browser.newPage();
    await page.goto('https://www.meadowridgenorwich.com/floorplans', { timeout: 30000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    const text = await page.evaluate(() => document.body.innerText);
    results['meadow-ridge'] = { status: 'OK', text: text.substring(0, 2000) };
    await page.close();
  } catch (e) {
    results['meadow-ridge'] = { status: 'ERROR', error: e.message };
  }

  // 5. Groton Townhomes - grotontownhouses.com
  try {
    const page = await browser.newPage();
    await page.goto('https://grotontownhouses.com/available-rentals', { timeout: 30000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    const text = await page.evaluate(() => document.body.innerText);
    results['groton-townhomes'] = { status: 'OK', text: text.substring(0, 2000) };
    await page.close();
  } catch (e) {
    results['groton-townhomes'] = { status: 'ERROR', error: e.message };
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
}

checkGroupB().catch(console.error);
