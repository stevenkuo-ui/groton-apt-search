import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

const results = {};

// Harbor Heights availability page
console.log('=== HARBOR HEIGHTS AVAILABILITY ===');
try {
  await page.goto('https://www.hmystic.com/enclave/availability-enclave', { 
    waitUntil: 'domcontentloaded', timeout: 30000 
  });
  await page.waitForTimeout(5000);
  const text = await page.evaluate(() => document.body?.innerText?.slice(0, 3000) || '(empty)');
  console.log(text);
  results['harbor-heights-avail'] = text.slice(0, 2000);
} catch(e) {
  console.log('Error:', e.message);
  results['harbor-heights-avail'] = { error: e.message };
}

console.log('\n=== HARBOR HEIGHTS BEACON AVAILABILITY ===');
try {
  await page.goto('https://www.hmystic.com/beacon/availability-beacon', { 
    waitUntil: 'domcontentloaded', timeout: 30000 
  });
  await page.waitForTimeout(5000);
  const text = await page.evaluate(() => document.body?.innerText?.slice(0, 3000) || '(empty)');
  console.log(text);
  results['harbor-heights-beacon-avail'] = text.slice(0, 2000);
} catch(e) {
  console.log('Error:', e.message);
  results['harbor-heights-beacon-avail'] = { error: e.message };
}

// Triton Square on Apartments.com
console.log('\n=== TRITON SQUARE - APARTMENTS.COM ===');
try {
  await page.goto('https://www.apartments.com/triton-square-groton-ct/', { 
    waitUntil: 'domcontentloaded', timeout: 30000 
  });
  await page.waitForTimeout(5000);
  const text = await page.evaluate(() => document.body?.innerText?.slice(0, 3000) || '(empty)');
  console.log(text);
  const prices = await page.evaluate(() => {
    const t = document.body?.innerText || '';
    const m = t.match(/\$[\d,]+/g) || [];
    return [...new Set(m)].slice(0, 20);
  });
  console.log('Prices:', prices);
  results['triton-aptscom'] = { text: text.slice(0, 2000), prices };
} catch(e) {
  console.log('Error:', e.message);
  results['triton-aptscom'] = { error: e.message };
}

// The Ledges - try the homepage which may have floor plans
console.log('\n=== THE LEDGES - HOMEPAGE ===');
try {
  await page.goto('https://www.theledgesapartments.com/', { 
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
  results['the-ledges-home'] = { text: text.slice(0, 2000), prices };
} catch(e) {
  console.log('Error:', e.message);
  results['the-ledges-home'] = { error: e.message };
}

// Gull Harbor - try their homepage
console.log('\n=== GULL HARBOR - HOMEPAGE ===');
try {
  await page.goto('https://gullharborct.com/', { 
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
  results['gull-harbor-home'] = { text: text.slice(0, 2000), prices };
} catch(e) {
  console.log('Error:', e.message);
  results['gull-harbor-home'] = { error: e.message };
}

await browser.close();
console.log('\n=== RESULTS ===');
console.log(JSON.stringify(results, null, 2));
