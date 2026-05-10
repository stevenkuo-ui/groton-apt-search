#!/usr/bin/env node
const { chromium } = require('playwright');

const PROPERTIES = [
  { name: 'triton-square', url: 'https://www.tritonsquare.com/availability-map/' },
  { name: 'pleasant-valley', url: 'https://www.pleasantvalley-apts.com/apartments/ct/groton/floor-plans' },
  { name: 'harbor-heights-enclave', url: 'https://www.hmystic.com/enclave/floor-plans-enclave' },
  { name: 'harbor-heights-beacon', url: 'https://www.hmystic.com/beacon/floor-plans-beacon' },
  { name: 'waterford-woods', url: 'https://www.waterfordwoods.com/availability' },
  { name: 'groton-estates', url: 'https://grotonestates.com/floor-plans/' },
  { name: 'chester-place', url: 'https://www.b7properties.com/chester-place' },
  { name: 'emerson-place', url: 'https://www.b7properties.com/emerson' },
  { name: 'the-ledges', url: 'https://www.theledgesapartments.com/floorplans' },
  { name: 'gull-harbor', url: 'https://gullharborct.com/floorplans' }
];

async function scrapeProperty(browser, prop) {
  const result = { name: prop.name, url: prop.url, status: 'unknown', error: null, units: [], bodyText: '', pricingData: null, httpStatus: null };
  let page;
  try {
    page = await browser.newPage();
    page.setDefaultTimeout(20000);
    
    const response = await page.goto(prop.url, { waitUntil: 'domcontentloaded', timeout: 25000 })
      .catch(() => page.goto(prop.url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => null));

    if (!response || response.status() >= 400) {
      result.status = 'http_error';
      result.httpStatus = response ? response.status() : 'no_response';
      if (page) await page.close();
      return result;
    }

    await page.waitForTimeout(5000);
    const bodyText = await page.evaluate(() => document.body.innerText);
    
    const pricingData = await page.evaluate(() => {
      const allText = document.body.innerText;
      const priceRegex = /\$[\d,]+/g;
      const prices = allText.match(priceRegex) || [];
      const headings = [];
      document.querySelectorAll('h1,h2,h3,h4').forEach(h => { const t = h.innerText.trim(); if (t) headings.push(t); });
      const tables = [];
      document.querySelectorAll('table').forEach(t => {
        const rows = [];
        t.querySelectorAll('tr').forEach(r => {
          const cells = [];
          r.querySelectorAll('td,th').forEach(c => cells.push(c.innerText.trim()));
          rows.push(cells.join(' | '));
        });
        if (rows.length > 0) tables.push(rows.join('\n'));
      });
      return { prices: [...new Set(prices)].slice(0, 50), headings, tables, rawLength: allText.length };
    });

    result.status = 'success';
    result.httpStatus = response.status();
    result.bodyText = bodyText.substring(0, 8000);
    result.pricingData = pricingData;
    
  } catch (err) {
    result.status = 'error';
    result.error = err.message;
  } finally {
    if (page) await page.close();
  }
  return result;
}

async function main() {
  console.error('Starting Group A scrape...');
  const browser = await chromium.launch({ headless: true });
  const results = {};
  
  for (const prop of PROPERTIES) {
    console.error(`Scraping: ${prop.name}...`);
    try {
      const r = await scrapeProperty(browser, prop);
      results[prop.name] = r;
      await new Promise(r => setTimeout(r, 2000));
    } catch (err) {
      results[prop.name] = { name: prop.name, status: 'crash', error: err.message };
    }
  }
  
  await browser.close();
  console.log(JSON.stringify(results, null, 2));
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });