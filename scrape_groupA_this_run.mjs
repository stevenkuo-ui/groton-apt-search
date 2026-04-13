import { chromium } from 'playwright';

const PROPERTIES = [
  {
    name: 'triton-square',
    url: 'https://www.tritonsquare.com/availability-map/',
    notes: 'JS iframe map - pricing in widget, not HTML'
  },
  {
    name: 'pleasant-valley',
    url: 'https://www.pleasantvalley-apts.com/apartments/ct/groton/floor-plans',
    notes: 'G5 platform JS-heavy'
  },
  {
    name: 'harbor-heights-beacon',
    url: 'https://www.hmystic.com/beacon/floor-plans-beacon',
    notes: 'Webflow JS-rendered'
  },
  {
    name: 'harbor-heights-enclave',
    url: 'https://www.hmystic.com/enclave/floor-plans-enclave',
    notes: 'Webflow JS-rendered'
  },
  {
    name: 'waterford-woods',
    url: 'https://www.waterfordwoods.com/availability',
    notes: 'Wix JS-heavy'
  },
  {
    name: 'groton-estates',
    url: 'https://grotonestates.com/floor-plans/',
    notes: 'Interactive map'
  },
  {
    name: 'chester-place',
    url: 'https://www.b7properties.com/chester-place',
    notes: 'Live direct site'
  },
  {
    name: 'emerson-place',
    url: 'https://www.b7properties.com/emerson',
    notes: 'Live direct site'
  },
  {
    name: 'the-ledges',
    url: 'https://www.theledgesapartments.com/floorplans',
    notes: 'Cloudflare may block'
  },
  {
    name: 'gull-harbor',
    url: 'https://gullharborct.com/floorplans',
    notes: 'Was 404 previously'
  }
];

async function scrapeProperty(browser, prop) {
  const page = await browser.newPage();
  const results = {
    name: prop.name,
    url: prop.url,
    success: false,
    prices: {},
    availability: null,
    error: null,
    rawText: ''
  };

  try {
    await page.goto(prop.url, { waitUntil: 'networkidle', timeout: 20000 });
    // Wait extra for JS
    await page.waitForTimeout(3000);

    // Get page text content
    const bodyText = await page.evaluate(() => document.body?.innerText || '');
    results.rawText = bodyText.substring(0, 3000);

    // Try to extract pricing patterns
    const priceRegex = /\$[\d,]+(?:\.\d{2})?(?:\/\w+)?/g;
    const prices = bodyText.match(priceRegex) || [];
    results.prices = [...new Set(prices)].slice(0, 30);

    // Try figure-notes (floor plan notes)
    const figureNotes = await page.evaluate(() => {
      const notes = [];
      document.querySelectorAll('.figure-note').forEach(el => notes.push(el.textContent?.trim()));
      return notes;
    });
    if (figureNotes.length) results.figureNotes = figureNotes;

    // Try data-* attributes for pricing
    const dataPrices = await page.evaluate(() => {
      const vals = [];
      document.querySelectorAll('[data-price], [data-rent], [data-unit], [data-available]').forEach(el => {
        const d = el.dataset;
        if (d.price) vals.push('data-price: ' + d.price);
        if (d.rent) vals.push('data-rent: ' + d.rent);
      });
      return vals;
    });
    if (dataPrices.length) results.dataPrices = dataPrices;

    results.success = true;
  } catch (err) {
    results.error = err.message?.substring(0, 200);
  } finally {
    await page.close();
  }

  return results;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const allResults = [];

  for (const prop of PROPERTIES) {
    console.error(`\n=== Scraping: ${prop.name} ===`);
    const result = await scrapeProperty(browser, prop);
    allResults.push(result);
    console.error(`${prop.name}: success=${result.success}, error=${result.error}`);
    if (result.prices?.length) console.error(`Prices: ${result.prices.slice(0, 10).join(', ')}`);
    if (result.figureNotes?.length) console.error(`Figure notes: ${JSON.stringify(result.figureNotes)}`);
    if (result.dataPrices?.length) console.error(`Data prices: ${result.dataPrices.join(', ')}`);
    if (result.rawText) console.error(`Raw text: ${result.rawText.substring(0, 500)}`);
  }

  await browser.close();

  // Output as JSON for parsing
  console.log(JSON.stringify(allResults, null, 2));
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
