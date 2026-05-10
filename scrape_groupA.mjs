import { chromium } from 'playwright';

const properties = [
  { name: 'triton-square',      url: 'https://www.tritonsquare.com/availability-map/',                  fallback: 'aggregator' },
  { name: 'pleasant-valley',    url: 'https://www.pleasantvalley-apts.com/apartments/ct/groton/floor-plans' },
  { name: 'harbor-heights',      url: 'https://www.hmystic.com/enclave/floor-plans-enclave' },
  { name: 'harbor-heights-2',    url: 'https://www.hmystic.com/beacon/floor-plans-beacon' },
  { name: 'waterford-woods',     url: 'https://www.waterfordwoods.com/availability' },
  { name: 'groton-estates',      url: 'https://grotonestates.com/floor-plans/' },
  { name: 'chester-place',       url: 'https://www.b7properties.com/chester-place' },
  { name: 'emerson-place',       url: 'https://www.b7properties.com/emerson' },
  { name: 'the-ledges',         url: 'https://www.theledgesapartments.com/floorplans' },
  { name: 'gull-harbor',        url: 'https://gullharborct.com/floorplans' },
];

const results = [];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' });

for (const prop of properties) {
  console.log(`\n=== Checking: ${prop.name} ===`);
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  const errors = [];
  
  try {
    // First try direct URL
    let loaded = false;
    let finalUrl = prop.url;
    
    try {
      const response = await page.goto(prop.url, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await page.waitForTimeout(5000);
      finalUrl = page.url();
      
      const title = await page.title().catch(() => '');
      const bodyText = await page.evaluate(() => document.body ? document.body.innerText.slice(0, 2000) : '');
      
      console.log(`  Status: ${response?.status()}, Title: ${title}`);
      
      results.push({
        property: prop.name,
        url: finalUrl,
        status: response?.status(),
        title,
        bodyText,
        success: true
      });
      loaded = true;
    } catch (e) {
      console.log(`  Direct failed: ${e.message.slice(0, 100)}`);
      
      if (prop.fallback === 'aggregator') {
        // Try Zillow search for the property
        try {
          await page.goto('https://www.zillow.com/homes/for_rent/', { waitUntil: 'domcontentloaded', timeout: 20000 });
          await page.fill('input[id="search-box-input"]', 'Triton Square Groton CT apartments');
          await page.keyboard.press('Enter');
          await page.waitForTimeout(5000);
          const zillowText = await page.evaluate(() => document.body ? document.body.innerText.slice(0, 2000) : '');
          console.log(`  Zillow fallback: ${zillowText.slice(0, 300)}`);
          results.push({ property: prop.name, url: 'zillow-fallback', zillowText, success: true });
        } catch (zf) {
          results.push({ property: prop.name, error: `Direct failed: ${e.message.slice(0,200)}, Zillow fallback failed: ${zf.message.slice(0,100)}`, success: false });
        }
      } else {
        results.push({ property: prop.name, error: e.message.slice(0, 200), success: false });
      }
    }
  } catch (err) {
    console.log(`  Error: ${err.message.slice(0,100)}`);
    results.push({ property: prop.name, error: err.message.slice(0, 200), success: false });
  } finally {
    await page.close();
  }
}

await browser.close();

console.log('\n=== RESULTS ===');
for (const r of results) {
  console.log(JSON.stringify(r, null, 2));
}