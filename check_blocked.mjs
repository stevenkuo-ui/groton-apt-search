import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

const results = {};

// Try The Ledges availability (RentCafe likely backend)
console.log('=== THE LEDGES - RentCafe ===');
try {
  await page.goto('https://www.rentcafe.com/apartments/ct/groton/the-ledges-apartment-homes/default.aspx', { 
    waitUntil: 'networkidle', timeout: 30000 
  });
  const text = await page.evaluate(() => document.body?.innerText?.slice(0, 3000) || '(empty)');
  console.log(text.slice(0, 2000));
  const prices = await page.evaluate(() => {
    const t = document.body?.innerText || '';
    const m = t.match(/\$[\d,]+/g) || [];
    return [...new Set(m)].slice(0, 20);
  });
  console.log('Prices:', prices);
  results['the-ledges-rentcafe'] = { text: text.slice(0, 2000), prices };
} catch(e) {
  console.log('Error:', e.message);
  results['the-ledges-rentcafe'] = { error: e.message };
}

// Try Gull Harbor 1BR floorplan page
console.log('\n=== GULL HARBOR 1BR ===');
try {
  await page.goto('https://www.gullharborct.com/floorplans/1-bedroom', { 
    waitUntil: 'domcontentloaded', timeout: 30000 
  });
  await page.waitForTimeout(5000);
  const text = await page.evaluate(() => document.body?.innerText?.slice(0, 3000) || '(empty)');
  console.log(text.slice(0, 2000));
  const prices = await page.evaluate(() => {
    const t = document.body?.innerText || '';
    const m = t.match(/\$[\d,]+/g) || [];
    return [...new Set(m)].slice(0, 20);
  });
  console.log('Prices:', prices);
  results['gull-harbor-1br'] = { text: text.slice(0, 2000), prices };
} catch(e) {
  console.log('Error:', e.message);
  results['gull-harbor-1br'] = { error: e.message };
}

// Try Harbor Heights direct availability
console.log('\n=== HARBOR HEIGHTS AVAIL - HMISTIC ===');
try {
  await page.goto('https://www.hmystic.com/enclave', { 
    waitUntil: 'domcontentloaded', timeout: 30000 
  });
  await page.waitForTimeout(3000);
  const text = await page.evaluate(() => document.body?.innerText?.slice(0, 2000) || '(empty)');
  console.log(text.slice(0, 1500));
  // Check if there's pricing in data attributes
  const data = await page.evaluate(() => {
    const scripts = [...document.querySelectorAll('script')];
    const pricingData = scripts.map(s => s.innerText).join('\n').match(/\$[\d,]+/g) || [];
    return [...new Set(pricingData)].slice(0, 20);
  });
  console.log('Script prices:', data);
  results['harbor-heights-enclave'] = { text: text.slice(0, 1500), scriptPrices: data };
} catch(e) {
  console.log('Error:', e.message);
  results['harbor-heights-enclave'] = { error: e.message };
}

// Try Waterford Woods on Zumper
console.log('\n=== WATERFORD WOODS - ZUMPER ===');
try {
  await page.goto('https://www.zumper.com/apartment-buildings/p812777/waterford-woods-waterford-ct', { 
    waitUntil: 'domcontentloaded', timeout: 30000 
  });
  await page.waitForTimeout(5000);
  const text = await page.evaluate(() => document.body?.innerText?.slice(0, 3000) || '(empty)');
  console.log(text.slice(0, 2000));
  const prices = await page.evaluate(() => {
    const t = document.body?.innerText || '';
    const m = t.match(/\$[\d,]+/g) || [];
    return [...new Set(m)].slice(0, 20);
  });
  console.log('Prices:', prices);
  results['waterford-woods-zumper'] = { text: text.slice(0, 2000), prices };
} catch(e) {
  console.log('Error:', e.message);
  results['waterford-woods-zumper'] = { error: e.message };
}

await browser.close();
console.log('\n=== RESULTS ===');
console.log(JSON.stringify(results, null, 2));
