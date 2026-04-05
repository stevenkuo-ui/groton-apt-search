import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });

// Check Pleasant Valley for pricing
async function checkPleasantValley() {
  const page = await browser.newPage();
  await page.goto('https://www.pleasantvalley-apts.com/apartments/ct/groton/floor-plans', { waitUntil: 'networkidle', timeout: 25000 });
  const fullText = await page.evaluate(() => document.body.innerText);
  console.log('=== PLEASANT VALLEY FULL TEXT ===');
  console.log(fullText.slice(0, 5000));
  await page.close();
}

// Check Chester Place for specials/pricing
async function checkChesterPlace() {
  const page = await browser.newPage();
  await page.goto('https://www.b7properties.com/chester-place', { waitUntil: 'networkidle', timeout: 25000 });
  const fullText = await page.evaluate(() => document.body.innerText);
  console.log('=== CHESTER PLACE FULL TEXT ===');
  console.log(fullText.slice(0, 3000));
  await page.close();
}

// Check Emerson Place for 2BR pricing
async function checkEmersonPlace() {
  const page = await browser.newPage();
  await page.goto('https://www.b7properties.com/emerson', { waitUntil: 'networkidle', timeout: 25000 });
  const fullText = await page.evaluate(() => document.body.innerText);
  console.log('=== EMERSON PLACE FULL TEXT ===');
  console.log(fullText.slice(0, 4000));
  await page.close();
}

// Check Triton Square via Zillow
async function checkTritonSquareZillow() {
  const page = await browser.newPage();
  await page.goto('https://www.zillow.com/apartments/groton-ct/triton-square/', { waitUntil: 'networkidle', timeout: 25000 });
  const fullText = await page.evaluate(() => document.body.innerText);
  console.log('=== TRITON SQUARE ZILLOW ===');
  console.log(fullText.slice(0, 3000));
  await page.close();
}

// Check Gull Harbor via ApartmentList
async function checkGullHarborAggregators() {
  const page = await browser.newPage();
  await page.goto('https://www.apartmentlist.com/ct/new-london/gull-harbor', { waitUntil: 'networkidle', timeout: 25000 });
  const fullText = await page.evaluate(() => document.body.innerText);
  console.log('=== GULL HARBOR APARTMENTLIST ===');
  console.log(fullText.slice(0, 2000));
  await page.close();
}

// Check Waterford Woods via ApartmentList
async function checkWaterfordWoodsApartmentList() {
  const page = await browser.newPage();
  await page.goto('https://www.apartmentlist.com/ct/waterford/waterford-woods', { waitUntil: 'networkidle', timeout: 25000 });
  const fullText = await page.evaluate(() => document.body.innerText);
  console.log('=== WATERFORD WOODS APARTMENTLIST ===');
  console.log(fullText.slice(0, 2000));
  await page.close();
}

// Check Harbor Heights Beacon via Zillow
async function checkBeaconZillow() {
  const page = await browser.newPage();
  await page.goto('https://www.zillow.com/b/beacon-at-harbor-heights-mystic-ct/', { waitUntil: 'networkidle', timeout: 25000 });
  const fullText = await page.evaluate(() => document.body.innerText);
  console.log('=== BEACON ZILLOW ===');
  console.log(fullText.slice(0, 2000));
  await page.close();
}

// Check The Ledges via ApartmentList
async function checkTheLedgesApartmentList() {
  const page = await browser.newPage();
  await page.goto('https://www.apartmentlist.com/ct/groton/the-ledges', { waitUntil: 'networkidle', timeout: 25000 });
  const fullText = await page.evaluate(() => document.body.innerText);
  console.log('=== THE LEDGES APARTMENTLIST ===');
  console.log(fullText.slice(0, 2000));
  await page.close();
}

await checkPleasantValley();
await checkChesterPlace();
await checkEmersonPlace();
await checkTritonSquareZillow();
await checkGullHarborAggregators();
await checkWaterfordWoodsApartmentList();
await checkBeaconZillow();
await checkTheLedgesApartmentList();

await browser.close();
