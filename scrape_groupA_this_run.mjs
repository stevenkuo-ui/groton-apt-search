#!/usr/bin/env node
import { chromium } from 'playwright';

const WORKDIR = '/Users/stevenkuo/Documents/apartment_search_groton_ct_site_2026-03-21/';
const results = {};

async function scrapePage(url, waitType = 'networkidle', waitMs = 5000) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const data = { url, text: '', error: null };
  try {
    await page.goto(url, { waitUntil: waitType, timeout: 30000 });
    if (waitMs > 0) await page.waitForTimeout(waitMs);
    data.text = await page.evaluate(() => document.body.innerText);
    data.html = await page.content();
  } catch (e) {
    data.error = e.message;
  }
  await browser.close();
  return data;
}

async function extractPricing(text, label) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const matches = [];
  const priceRe = /\$[\d,]+/g;
  for (const line of lines) {
    const prices = line.match(priceRe);
    if (prices && prices.length > 0) {
      matches.push({ line, prices });
    }
  }
  return matches;
}

console.log('=== SCRAPING GROUP A PROPERTIES ===\n');


// 1. PLEASANT VALLEY - G5 platform, Playwright
console.log('--- Pleasant Valley ---');
try {
  const pv = await scrapePage('https://www.pleasantvalley-apts.com/apartments/ct/groton/floor-plans', 'domcontentloaded', 6000);
  if (pv.error) {
    results['pleasant-valley'] = { error: pv.error, status: 'failed' };
  } else {
    const pricing = await extractPricing(pv.text, 'pleasant-valley');
    const availMatch = pv.text.match(/(\d+)\s+unit/i);
    const styleMatches = pv.text.matchAll(/(Style\s+\d+[A-Z]?)[^$]*?\$[\d,]+/gi);
    results['pleasant-valley'] = { 
      status: 'ok', 
      rawText: pv.text.substring(0, 3000),
      pricing: pricing.slice(0, 20),
      availability: availMatch ? availMatch[1] : null
    };
  }
} catch(e) { results['pleasant-valley'] = { error: e.message, status: 'exception' }; }
console.log(JSON.stringify(results['pleasant-valley'], null, 2));

// 2. CHESTER PLACE - b7properties
console.log('\n--- Chester Place ---');
try {
  const cp = await scrapePage('https://www.b7properties.com/chester-place', 'networkidle', 3000);
  if (cp.error) {
    results['chester-place'] = { error: cp.error, status: 'failed' };
  } else {
    const pricing = await extractPricing(cp.text, 'chester-place');
    const availMatch = cp.text.match(/(\d+)\s+unit/i);
    results['chester-place'] = { 
      status: 'ok', 
      rawText: cp.text.substring(0, 3000),
      pricing: pricing.slice(0, 20),
      availability: availMatch ? availMatch[1] : null
    };
  }
} catch(e) { results['chester-place'] = { error: e.message, status: 'exception' }; }
console.log(JSON.stringify(results['chester-place'], null, 2));

// 3. EMERSON PLACE - b7properties
console.log('\n--- Emerson Place ---');
try {
  const ep = await scrapePage('https://www.b7properties.com/emerson', 'networkidle', 3000);
  if (ep.error) {
    results['emerson-place'] = { error: ep.error, status: 'failed' };
  } else {
    const pricing = await extractPricing(ep.text, 'emerson-place');
    results['emerson-place'] = { 
      status: 'ok', 
      rawText: ep.text.substring(0, 3000),
      pricing: pricing.slice(0, 20)
    };
  }
} catch(e) { results['emerson-place'] = { error: e.message, status: 'exception' }; }
console.log(JSON.stringify(results['emerson-place'], null, 2));

// 4. TRITON SQUARE - JS iframe, try direct availability map page
console.log('\n--- Triton Square ---');
try {
  const ts = await scrapePage('https://www.tritonsquare.com/availability-map/', 'domcontentloaded', 6000);
  if (ts.error) {
    results['triton-square'] = { error: ts.error, status: 'failed' };
  } else {
    const pricing = await extractPricing(ts.text, 'triton-square');
    results['triton-square'] = { 
      status: 'ok', 
      rawText: ts.text.substring(0, 3000),
      pricing: pricing.slice(0, 20)
    };
  }
} catch(e) { results['triton-square'] = { error: e.message, status: 'exception' }; }
console.log(JSON.stringify(results['triton-square'], null, 2));

// 5. GROTON ESTATES - direct site floor plans
console.log('\n--- Groton Estates ---');
try {
  const ge = await scrapePage('https://grotonestates.com/floor-plans/', 'networkidle', 3000);
  if (ge.error) {
    results['groton-estates'] = { error: ge.error, status: 'failed' };
  } else {
    const pricing = await extractPricing(ge.text, 'groton-estates');
    const availMatch = ge.text.match(/(\d+)\s+unit/i);
    results['groton-estates'] = { 
      status: 'ok', 
      rawText: ge.text.substring(0, 3000),
      pricing: pricing.slice(0, 20),
      availability: availMatch ? availMatch[1] : null
    };
  }
} catch(e) { results['groton-estates'] = { error: e.message, status: 'exception' }; }
console.log(JSON.stringify(results['groton-estates'], null, 2));

// 6. THE LEDGES - direct floor plans URL (may be Cloudflare-blocked)
console.log('\n--- The Ledges ---');
try {
  const tl = await scrapePage('https://www.theledgesapartments.com/floorplans', 'networkidle', 3000);
  if (tl.error) {
    results['the-ledges'] = { error: tl.error, status: 'failed' };
  } else {
    const pricing = await extractPricing(tl.text, 'the-ledges');
    results['the-ledges'] = { 
      status: 'ok', 
      rawText: tl.text.substring(0, 3000),
      pricing: pricing.slice(0, 20)
    };
  }
} catch(e) { results['the-ledges'] = { error: e.message, status: 'exception' }; }
console.log(JSON.stringify(results['the-ledges'], null, 2));

// 7. HARBOR HEIGHTS BEACON
console.log('\n--- Harbor Heights Beacon ---');
try {
  const hb = await scrapePage('https://www.hmystic.com/beacon/floor-plans-beacon', 'networkidle', 3000);
  if (hb.error) {
    results['harbor-heights-beacon'] = { error: hb.error, status: 'failed' };
  } else {
    const pricing = await extractPricing(hb.text, 'harbor-heights-beacon');
    results['harbor-heights-beacon'] = { 
      status: 'ok', 
      rawText: hb.text.substring(0, 3000),
      pricing: pricing.slice(0, 20)
    };
  }
} catch(e) { results['harbor-heights-beacon'] = { error: e.message, status: 'exception' }; }
console.log(JSON.stringify(results['harbor-heights-beacon'], null, 2));

// 8. HARBOR HEIGHTS ENCLAVE
console.log('\n--- Harbor Heights Enclave ---');
try {
  const he = await scrapePage('https://www.hmystic.com/enclave/floor-plans-enclave', 'networkidle', 3000);
  if (he.error) {
    results['harbor-heights-enclave'] = { error: he.error, status: 'failed' };
  } else {
    const pricing = await extractPricing(he.text, 'harbor-heights-enclave');
    results['harbor-heights-enclave'] = { 
      status: 'ok', 
      rawText: he.text.substring(0, 3000),
      pricing: pricing.slice(0, 20)
    };
  }
} catch(e) { results['harbor-heights-enclave'] = { error: e.message, status: 'exception' }; }
console.log(JSON.stringify(results['harbor-heights-enclave'], null, 2));

// 9. WATERFORD WOODS - Wix JS-heavy
console.log('\n--- Waterford Woods ---');
try {
  const ww = await scrapePage('https://www.waterfordwoods.com/availability', 'domcontentloaded', 6000);
  if (ww.error) {
    results['waterford-woods'] = { error: ww.error, status: 'failed' };
  } else {
    const pricing = await extractPricing(ww.text, 'waterford-woods');
    results['waterford-woods'] = { 
      status: 'ok', 
      rawText: ww.text.substring(0, 3000),
      pricing: pricing.slice(0, 20)
    };
  }
} catch(e) { results['waterford-woods'] = { error: e.message, status: 'exception' }; }
console.log(JSON.stringify(results['waterford-woods'], null, 2));

// 10. GULL HARBOR - floorplans URL
console.log('\n--- Gull Harbor ---');
try {
  const gh = await scrapePage('https://gullharborct.com/floorplans', 'networkidle', 3000);
  if (gh.error) {
    results['gull-harbor'] = { error: gh.error, status: 'failed' };
  } else {
    const pricing = await extractPricing(gh.text, 'gull-harbor');
    results['gull-harbor'] = { 
      status: 'ok', 
      rawText: gh.text.substring(0, 3000),
      pricing: pricing.slice(0, 20)
    };
  }
} catch(e) { results['gull-harbor'] = { error: e.message, status: 'exception' }; }
console.log(JSON.stringify(results['gull-harbor'], null, 2));

// Write results to file
import { writeFileSync } from 'fs';
writeFileSync('/Users/stevenkuo/Documents/apartment_search_groton_ct_site_2026-03-21/scrape_groupA_results.json', JSON.stringify(results, null, 2));
console.log('\nResults written to scrape_groupA_results.json');
