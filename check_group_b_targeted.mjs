import { chromium } from 'playwright';

const results = {};

async function checkReidHughes() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://reidhughes.com', { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(3000);
  
  const text = await page.evaluate(() => document.body.innerText);
  const prices = [...new Set(text.match(/\$\d{3,5}(?:\.\d{2})?(?:\s*-\s*\$\d{3,5})?/g) || [])];
  const floorPlanLinks = [...new Set(text.match(/\/floorplans[^\s]*/gi) || [])];
  
  console.log('Reid Hughes prices:', prices);
  console.log('Reid Hughes floor plan links:', floorPlanLinks);
  
  // Try clicking floor plans
  try {
    const fpLink = await page.$('a[href*="floorplan"]');
    if (fpLink) {
      await fpLink.click();
      await page.waitForTimeout(3000);
      const fpText = await page.evaluate(() => document.body.innerText);
      const fpPrices = [...new Set(fpText.match(/\$\d{3,5}(?:\.\d{2})?(?:\s*-\s*\$\d{3,5})?/g) || [])];
      console.log('Reid Hughes floor plan prices:', fpPrices);
    }
  } catch(e) {
    console.log('Floor plan click failed:', e.message);
  }
  
  await browser.close();
  return { prices, floorPlanLinks };
}

async function checkMeadowRidge() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Try the main page first
  await page.goto('https://www.meadowridgenorwich.com/', { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(4000);
  
  const text = await page.evaluate(() => document.body.innerText);
  const prices = [...new Set(text.match(/\$\d{3,5}(?:\.\d{2})?(?:\s*-\s*\$\d{3,5})?/g) || [])];
  console.log('Meadow Ridge prices:', prices);
  console.log('Meadow Ridge snippet:', text.substring(0, 2000));
  
  await browser.close();
  return { prices };
}

async function checkGrotonTowers() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://www.grotonapartmenthomes.com', { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(5000);
  
  const text = await page.evaluate(() => document.body.innerText);
  const prices = [...new Set(text.match(/\$\d{3,5}(?:\.\d{2})?(?:\s*-\s*\$\d{3,5})?/g) || [])];
  console.log('Groton Towers prices:', prices);
  console.log('Groton Towers snippet:', text.substring(0, 2000));
  
  await browser.close();
  return { prices };
}

async function checkMiradorHedgewood() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://www.miradorliving.com', { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(5000);
  
  const text = await page.evaluate(() => document.body.innerText);
  const prices = [...new Set(text.match(/\$\d{3,5}(?:\.\d{2})?(?:\s*-\s*\$\d{3,5})?/g) || [])];
  console.log('Mirador/Hedgewood prices:', prices);
  console.log('Mirador/Hedgewood snippet:', text.substring(0, 2000));
  
  await browser.close();
  return { prices };
}

console.log('=== CHECKING REID HUGHES ===');
results.reidHughes = await checkReidHughes();

console.log('\n=== CHECKING MEADOW RIDGE ===');
results.meadowRidge = await checkMeadowRidge();

console.log('\n=== CHECKING GROTON TOWERS ===');
results.grotonTowers = await checkGrotonTowers();

console.log('\n=== CHECKING MIRADOR/HEDGEWOOD ===');
results.mirador = await checkMiradorHedgewood();

console.log('\n=== FINAL RESULTS ===');
console.log(JSON.stringify(results, null, 2));
