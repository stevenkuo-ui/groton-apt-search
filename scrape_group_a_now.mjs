import { chromium } from 'playwright';

const PROPERTIES = [
  {
    name: 'Triton Square',
    url: 'https://www.tritonsquare.com/availability-map/',
    slug: 'triton-square'
  },
  {
    name: 'Pleasant Valley',
    url: 'https://www.pleasantvalley-apts.com/apartments/ct/groton/floor-plans',
    slug: 'pleasant-valley'
  },
  {
    name: 'Harbor Heights Enclave',
    url: 'https://www.hmystic.com/enclave/floor-plans-enclave',
    slug: 'harbor-heights'
  },
  {
    name: 'Harbor Heights Beacon',
    url: 'https://www.hmystic.com/beacon/floor-plans-beacon',
    slug: 'harbor-heights'
  },
  {
    name: 'Waterford Woods',
    url: 'https://www.waterfordwoods.com/availability',
    slug: 'waterford-woods'
  },
  {
    name: 'Groton Estates',
    url: 'https://grotonestates.com/floor-plans/',
    slug: 'groton-estates'
  },
  {
    name: 'Chester Place',
    url: 'https://www.b7properties.com/chester-place',
    slug: 'chester-place'
  },
  {
    name: 'Emerson Place',
    url: 'https://www.b7properties.com/emerson',
    slug: 'emerson-place'
  },
  {
    name: 'The Ledges',
    url: 'https://www.theledgesapartments.com/floorplans',
    slug: 'the-ledges'
  },
  {
    name: 'Gull Harbor',
    url: 'https://gullharborct.com/floorplans',
    slug: 'gull-harbor'
  }
];

async function scrape() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const prop of PROPERTIES) {
    console.log(`\n=== Scraping: ${prop.name} ===`);
    console.log(`URL: ${prop.url}`);
    let status = 'unknown';
    let prices = null;
    let error = null;

    try {
      const page = await browser.newPage();
      await page.goto(prop.url, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      await page.waitForTimeout(5000);

      const content = await page.content();
      const text = await page.evaluate(() => document.body.innerText);

      // Check for Cloudflare/blocking
      if (text.includes('Cloudflare') || text.includes('Attention Required') || text.includes('Checking your browser')) {
        status = 'blocked';
        console.log(`  → BLOCKED by Cloudflare/challenge`);
      } else {
        // Extract prices from page text
        const priceRegex = /\$[\d,]+/g;
        const pricesFound = text.match(priceRegex) || [];
        const uniquePrices = [...new Set(pricesFound)].slice(0, 20);
        console.log(`  → Prices found: ${uniquePrices.join(', ')}`);
        
        // Check for availability counts
        const availMatch = text.match(/(\d+)\s*(units?|available)/i);
        const avail = availMatch ? availMatch[0] : 'unknown';
        console.log(`  → Availability: ${avail}`);

        status = 'ok';
        prices = uniquePrices;
      }

      await page.close();
    } catch (e) {
      error = e.message;
      status = 'error';
      console.log(`  → ERROR: ${e.message}`);
    }

    results.push({
      name: prop.name,
      slug: prop.slug,
      url: prop.url,
      status,
      prices,
      error
    });

    // Delay between requests
    await new Promise(r => setTimeout(r, 2000));
  }

  await browser.close();
  console.log('\n=== DONE ===');
  console.log(JSON.stringify(results, null, 2));
}

scrape().catch(console.error);