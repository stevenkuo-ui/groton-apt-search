import { chromium } from 'playwright';
async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://grotonapartmenthomes.com/availability', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(5000);
  
  // Get all iframes
  const iframes = await page.$$eval('iframe', iframes => iframes.map(f => ({src: f.src, id: f.id, className: f.className})));
  console.log('IFrames:', JSON.stringify(iframes, null, 2));
  
  // Get HTML
  const html = await page.content();
  
  // Look for snapwidget refs
  const snapMatch = html.match(/snapwidget[^\"\'<>]*/gi);
  console.log('SnapWidget refs:', snapMatch ? snapMatch.slice(0, 10) : 'none');
  
  // Look for price-related content
  const priceRegex = /\$[0-9,]+/g;
  const bodyText = await page.evaluate(() => document.body.innerText);
  const prices = bodyText.match(priceRegex) || [];
  console.log('Prices found:', prices.slice(0, 30));
  
  // Get any links to availability/pricing widgets
  const links = await page.$$eval('a[href]', links => links.map(l => l.href).filter(h => h.includes('pricing') || h.includes('availability') || h.includes('rent') || h.includes('floor')));
  console.log('Relevant links:', links.slice(0, 20));
  
  await browser.close();
}
main().catch(console.error);
