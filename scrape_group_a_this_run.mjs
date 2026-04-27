import { chromium } from 'playwright';

const PROPERTIES = [
  { name: 'triton-square', url: 'https://www.tritonsquare.com/availability-map/', extractor: 'legacy' },
  { name: 'pleasant-valley', url: 'https://www.pleasantvalley-apts.com/apartments/ct/groton/floor-plans', extractor: 'g5' },
  { name: 'harbor-heights-enclave', url: 'https://www.hmystic.com/enclave/floor-plans-enclave', extractor: 'webflow' },
  { name: 'harbor-heights-beacon', url: 'https://www.hmystic.com/beacon/floor-plans-beacon', extractor: 'webflow' },
  { name: 'waterford-woods', url: 'https://www.waterfordwoods.com/availability', extractor: 'wix' },
  { name: 'groton-estates', url: 'https://grotonestates.com/floor-plans/', extractor: 'standard' },
  { name: 'chester-place', url: 'https://www.b7properties.com/chester-place', extractor: 'b7' },
  { name: 'emerson-place', url: 'https://www.b7properties.com/emerson', extractor: 'b7' },
  { name: 'the-ledges', url: 'https://www.theledgesapartments.com/floorplans', extractor: 'standard' },
  { name: 'gull-harbor', url: 'https://gullharborct.com/floorplans', extractor: 'standard' },
];

const results = {};

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' });

  for (const prop of PROPERTIES) {
    console.log(`\n=== Scraping: ${prop.name} ===`);
    const page = await context.newPage();
    const errors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    try {
      await page.goto(prop.url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(3000);
      
      const title = await page.title();
      const bodyText = await page.evaluate(() => document.body.innerText);
      const html = await page.content();
      
      // Extract pricing with regex patterns
      const priceMatches = [];
      const priceRe = /\$\s*([1-9][\d,]+)\s*(?:\/|per|\.|\s)/g;
      let m;
      while ((m = priceRe.exec(bodyText.slice(0, 8000))) !== null) {
        const raw = m[1].replace(/,/g, '');
        const price = parseInt(raw);
        if (price >= 800 && price <= 10000) {
          priceMatches.push({ price, context: bodyText.slice(Math.max(0, m.index - 40), m.index + 60).replace(/\s+/g, ' ') });
        }
      }

      // Extract floor plan names
      const floorPlanNames = [];
      const fpRe = /(?:Plan|Type|Floor|Bedroom|BR|Studio)[^$\n]{0,60}/gi;
      while ((m = fpRe.exec(bodyText.slice(0, 5000))) !== null) {
        const candidate = m[0].trim();
        if (candidate.length > 5 && candidate.length < 80) floorPlanNames.push(candidate);
      }

      // Check for availability indicators
      const availRe = /(\d+)\s*(?:unit|bed|br|apartment)/gi;
      const availMatches = [];
      while ((m = availRe.exec(bodyText.slice(0, 5000))) !== null) {
        availMatches.push(m[0]);
      }

      results[prop.name] = {
        url: prop.url,
        title,
        status: 'success',
        errors: errors.slice(0, 5),
        priceMatches: [...new Set(priceMatches.map(p => p.price))].sort((a, b) => a - b),
        priceContexts: priceMatches.slice(0, 5),
        floorPlanNames: [...new Set(floorPlanNames)].slice(0, 10),
        availabilityIndicators: [...new Set(availMatches)].slice(0, 10),
        bodySnippet: bodyText.slice(0, 2000),
      };
      
      console.log(`  Title: ${title}`);
      console.log(`  Prices found: ${[...new Set(priceMatches.map(p => p.price))].sort((a, b) => a - b).join(', ') || 'NONE'}`);
      console.log(`  Errors: ${errors.length}`);
      
    } catch (err) {
      results[prop.name] = { url: prop.url, status: 'error', error: err.message };
      console.log(`  ERROR: ${err.message}`);
    }
    
    await page.close();
  }

  await browser.close();
  
  // Write results
  const fs = await import('fs');
  fs.writeFileSync('/Users/stevenkuo/scrape_groupA_results_this_run.json', JSON.stringify(results, null, 2));
  console.log('\n✅ Results written to /Users/stevenkuo/scrape_groupA_results_this_run.json');
})();
