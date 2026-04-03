import { chromium } from 'playwright';
import { readFileSync } from 'fs';

const priceHistory = JSON.parse(readFileSync('/Users/stevenkuo/Documents/apartment_search_groton_ct_site_2026-03-21/price_history.json', 'utf8'));

const PROPERTIES = [
  {
    name: 'Triton Square',
    url: 'https://www.tritonsquare.com/availability-map/',
    key: 'triton-square',
    historyKey: 'triton-square',
    longerWait: true,
  },
  {
    name: 'Pleasant Valley',
    url: 'https://www.pleasantvalley-apts.com/apartments/ct/groton/floor-plans',
    key: 'pleasant-valley',
    historyKey: 'pleasant-valley',
    longerWait: true,
    hashRoute: true,
  },
  {
    name: 'Harbor Heights Enclave',
    url: 'https://www.hmystic.com/enclave/floor-plans-enclave',
    key: 'harbor-heights-enclave',
    historyKey: 'harbor-heights',
    longerWait: false,
  },
  {
    name: 'Harbor Heights Beacon',
    url: 'https://www.hmystic.com/beacon/floor-plans-beacon',
    key: 'harbor-heights-beacon',
    historyKey: 'harbor-heights',
    longerWait: false,
  },
  {
    name: 'Waterford Woods',
    url: 'https://www.waterfordwoods.com/availability',
    key: 'waterford-woods',
    historyKey: 'waterford-woods',
    longerWait: true,
  },
  {
    name: 'Groton Estates',
    url: 'https://grotonestates.com/floor-plans/',
    key: 'groton-estates',
    historyKey: 'groton-estates',
    longerWait: false,
  },
  {
    name: 'Chester Place',
    url: 'https://www.b7properties.com/chester-place',
    key: 'chester-place',
    historyKey: 'chester-place',
    longerWait: false,
  },
  {
    name: 'Emerson Place',
    url: 'https://www.b7properties.com/emerson',
    key: 'emerson-place',
    historyKey: 'emerson-place',
    longerWait: false,
  },
  {
    name: 'The Ledges',
    url: 'https://www.theledgesapartments.com/floorplans',
    key: 'the-ledges',
    historyKey: 'the-ledges',
    longerWait: false,
    cloudflare: true,
  },
  {
    name: 'Gull Harbor',
    url: 'https://gullharborct.com/floorplans',
    key: 'gull-harbor',
    historyKey: 'gull-harbor',
    longerWait: false,
    likely404: true,
  },
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();

const results = {};

for (const prop of PROPERTIES) {
  console.log(`\n=== Checking: ${prop.name} ===`);
  const page = await context.newPage();
  
  // Capture console messages
  const consoleLogs = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleLogs.push(`[ERROR] ${msg.text()}`);
  });
  
  try {
    await page.goto(prop.url, { timeout: 30000, waitUntil: 'domcontentloaded' });
    
    // Hash-routing wait
    if (prop.hashRoute) {
      await page.waitForTimeout(3000);
      await page.evaluate(() => {
        // Try clicking floor plans tab
        const tabs = document.querySelectorAll('[class*="tab"], [class*="plan"]');
        tabs.forEach(t => t.addEventListener('click', () => {}));
      });
    }
    
    await page.waitForTimeout(prop.longerWait ? 8000 : 5000);
    
    const title = await page.title();
    const url = page.url();
    const bodyText = await page.evaluate(() => document.body.innerText);
    
    // Get all text content with $ prices
    const allText = bodyText;
    
    // Price patterns with more context
    const priceRegex = /\$[\d,]+/g;
    const prices = [...new Set(allText.match(priceRegex) || [])];
    
    // Look for floor plan blocks with prices
    const floorPlanBlocks = await page.evaluate(() => {
      // Try various selectors
      const selectors = [
        '.floor-plan',
        '.fp-card', 
        '.figure-card',
        '.unit',
        '[class*="floor"]',
        '[class*="plan"]',
        '[class*="unit"]',
        'article',
        '.listing',
      ];
      
      let allCards = [];
      for (const sel of selectors) {
        const els = document.querySelectorAll(sel);
        if (els.length > 0) {
          allCards = [...allCards, ...Array.from(els).map(el => ({
            tag: sel,
            text: el.innerText.trim().substring(0, 300),
            hasPrice: /\$[\d,]+/.test(el.innerText),
          })).filter(c => c.text.length > 10)];
        }
      }
      
      // Also get all heading + price combos
      const headings = [];
      document.querySelectorAll('h1,h2,h3,h4').forEach(h => {
        const text = h.innerText.trim();
        if (text.length > 0 && text.length < 200) headings.push(text);
      });
      
      return { cards: allCards.slice(0, 20), headings };
    });
    
    // Try to find pricing tables
    const pricingTable = await page.evaluate(() => {
      const tables = document.querySelectorAll('table');
      return Array.from(tables).map(t => t.innerText.trim().substring(0, 500));
    });
    
    // Get full body HTML for analysis
    const fullHTML = await page.evaluate(() => document.body.innerHTML);
    
    // Look for availability-specific content
    const availSection = await page.evaluate(() => {
      const sections = document.querySelectorAll('section, div[class*="avail"], div[class*="unit"], div[class*="floor"]');
      let best = '';
      for (const s of sections) {
        const txt = s.innerText.trim();
        if (txt.includes('$') && txt.includes('sq') && txt.length > 50 && txt.length < 1000) {
          best += '\n---\n' + txt;
        }
      }
      return best.trim() || null;
    });

    results[prop.key] = {
      name: prop.name,
      url: prop.url,
      status: 'success',
      title,
      finalUrl: url,
      prices: prices.slice(0, 50),
      floorPlanBlocks,
      pricingTable,
      availSection,
      consoleErrors: consoleLogs.slice(0, 10),
      fullHTML: fullHTML.substring(0, 15000),
      bodyText: bodyText.substring(0, 5000),
    };

    console.log(`  Title: ${title}`);
    console.log(`  Prices found: ${prices.slice(0, 10).join(', ')}`);
    console.log(`  Body (500): ${bodyText.substring(0, 500)}`);
    if (floorPlanBlocks.cards.length) console.log(`  Floor plan cards: ${floorPlanBlocks.cards.length}`);
    if (floorPlanBlocks.headings.length) console.log(`  Headings: ${floorPlanBlocks.headings.slice(0,5).join(' | ')}`);
    if (pricingTable.length) console.log(`  Tables: ${pricingTable.length}`);
    if (availSection) console.log(`  Avail section: ${availSection.substring(0, 300)}`);
    if (consoleLogs.length) console.log(`  Console errors: ${consoleLogs.slice(0,3).join('; ')}`);
    
    if (prop.cloudflare) {
      console.log(`  [CLOUDFLARE BLOCKED]`);
    }

  } catch (err) {
    results[prop.key] = {
      name: prop.name,
      url: prop.url,
      status: 'error',
      error: err.message,
    };
    console.log(`  ERROR: ${err.message}`);
  }

  await page.close();
}

await browser.close();

import { writeFileSync } from 'fs';
writeFileSync('/Users/stevenkuo/apartment_group_a_deep.json', JSON.stringify(results, null, 2));
console.log('\n\nResults written to /Users/stevenkuo/apartment_group_a_deep.json');
