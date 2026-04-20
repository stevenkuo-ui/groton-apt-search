import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

// Check Triton Square on Zillow
console.log('=== TRITON SQUARE - ZILLOW ===');
try {
  await page.goto('https://www.zillow.com/apartments/groton-ct/triton-square/', { 
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
} catch(e) {
  console.log('Error:', e.message);
}

console.log('\n=== HARBOR HEIGHTS - ZILLOW ===');
try {
  await page.goto('https://www.zillow.com/b/harbor-heights-mystic-ct/', { 
    waitUntil: 'domcontentloaded', timeout: 30000 
  });
  await page.waitForTimeout(5000);
  const text = await page.evaluate(() => document.body?.innerText?.slice(0, 3000) || '(empty)');
  console.log(text);
} catch(e) {
  console.log('Error:', e.message);
}

console.log('\n=== GULL HARBOR - SEARCH ===');
try {
  await page.goto('https://www.zillow.com/b/gull-harbor-new-london-ct/', { 
    waitUntil: 'domcontentloaded', timeout: 30000 
  });
  await page.waitForTimeout(5000);
  const text = await page.evaluate(() => document.body?.innerText?.slice(0, 3000) || '(empty)');
  console.log(text);
} catch(e) {
  console.log('Error:', e.message);
}

console.log('\n=== WATERFORD WOODS - SEARCH ===');
try {
  await page.goto('https://www.zillow.com/b/waterford-woods-waterford-ct/', { 
    waitUntil: 'domcontentloaded', timeout: 30000 
  });
  await page.waitForTimeout(5000);
  const text = await page.evaluate(() => document.body?.innerText?.slice(0, 3000) || '(empty)');
  console.log(text);
} catch(e) {
  console.log('Error:', e.message);
}

// Check for Gull Harbor new URL
console.log('\n=== GULL HARBOR - HOMES Website ===');
try {
  await page.goto('https://www.gullharborhomes.com/floorplans', { 
    waitUntil: 'domcontentloaded', timeout: 30000 
  });
  await page.waitForTimeout(5000);
  const text = await page.evaluate(() => document.body?.innerText?.slice(0, 2000) || '(empty)');
  console.log(text);
} catch(e) {
  console.log('Error:', e.message);
}

await browser.close();
