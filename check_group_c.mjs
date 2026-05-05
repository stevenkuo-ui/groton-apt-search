// Group C - Check properties
import { chromium } from 'playwright';
import { execSync } from 'child_process';
import fs from 'fs';

const BASE = '/Users/stevenkuo/Documents/apartment_search_groton_ct_site_2026-03-21';

async function fetchWithPlaywright(url, label) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(3000);
    const title = await page.title();
    const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 2000));
    console.log(`\n=== ${label} (${url}) ===`);
    console.log(`Title: ${title}`);
    console.log(`Text: ${bodyText.slice(0, 800)}`);
  } catch(e) {
    console.log(`\n=== ${label} === ERROR: ${e.message.slice(0,200)}`);
  } finally {
    await browser.close();
  }
}

async function bingSearch(query) {
  const encoded = encodeURIComponent(query);
  const url = `https://www.bing.com/search?q=${encoded}`;
  try {
    const result = execSync(`curl -s "${url}" -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" --max-time 15`, { timeout: 20000 });
    return result.toString();
  } catch(e) {
    return `ERROR: ${e.message}`;
  }
}

function extractFromBing(html) {
  const results = [];
  // Try to extract text from Bing result snippets
  const clean = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  const snippetRegex = /class="b_algo"[^>]*>[\s\S]*?<h2[^>]*>[\s\S]*?<\/h2>[\s\S]*?<p>([\s\S]*?)<\/p>/g;
  let match;
  while ((match = snippetRegex.exec(clean)) !== null && results.length < 5) {
    const text = match[1].replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
    if (text.length > 30) results.push(text);
  }
  return results;
}

(async () => {
  console.log('=== Playwright checks ===\n');

  // Live sites
  await fetchWithPlaywright('https://www.eaglepointeapts.com/floorplans', 'Eagle Pointe');
  await fetchWithPlaywright('https://www.renewgroton.com', 'ReNew Groton');
  await fetchWithPlaywright('https://www.renewwashingtonpark.com', 'ReNew Washington Park');
  await fetchWithPlaywright('https://www.courtviewct.com', 'Courtview Square');
  await fetchWithPlaywright('https://www.wm-management.com', 'Crocker House (WM)');

  console.log('\n=== Bing search results ===\n');

  const queries = [
    ['ReNew Groton CT apartments price availability 2026', 'ReNew Groton'],
    ['ReNew Washington Park Groton CT for rent 2026', 'ReNew Washington Park'],
    ['Eagle Pointe 8B Michael Road New London CT rent', 'Eagle Pointe'],
    ['Blackstone Apartments Norwich CT 206 Washington St rent', 'Blackstone'],
    ['Courtview Square 309 Crystal Ave New London CT rent', 'Courtview Square'],
    ['Crocker House 35 Union St New London CT apartments', 'Crocker House'],
    ['120 Broad St New London CT apartments for rent 2026', '120 Broad St'],
    ['Colonial Efficiency 2350 Gold Star Hwy Mystic CT rent', 'Colonial Efficiency'],
    ['30 Nichols Lane Waterford CT sold or off market 2026', '30 Nichols Ln'],
    ['302 Boston Post Road Waterford CT apartments for rent', '302 Boston Post'],
  ];

  for (const [q, label] of queries) {
    const html = await bingSearch(q);
    const snippets = extractFromBing(html);
    console.log(`\n=== ${label}: "${q}" ===`);
    if (snippets.length === 0) {
      console.log('No results found');
    } else {
      snippets.forEach((s, i) => console.log(`${i+1}. ${s.slice(0, 300)}`));
    }
  }
})();