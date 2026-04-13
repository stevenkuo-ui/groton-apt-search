import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });

const jsSites = [
  { name: 'Harbor Heights Beacon', url: 'https://www.hmystic.com/beacon/floor-plans-beacon' },
  { name: 'Harbor Heights Enclave', url: 'https://www.hmystic.com/enclave/floor-plans-enclave' },
  { name: 'Waterford Woods', url: 'https://www.waterfordwoods.com/availability' },
  { name: 'Triton Square', url: 'https://www.tritonsquare.com/availability-map/' },
];

for (const site of jsSites) {
  console.log('\n=== ' + site.name + ' ===');
  const page = await browser.newPage();
  try {
    await page.goto(site.url, { timeout: 20000, waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);
    
    // Get ALL text including hidden elements
    const allText = await page.evaluate(() => {
      return document.body.innerText;
    });
    
    // Get HTML content
    const html = await page.evaluate(() => {
      return document.body.innerHTML;
    });
    
    // Look for price-related HTML
    const priceHtml = html.match(/\$[\d,]+[^<]*/g) || [];
    
    console.log('Unique prices in HTML:', [...new Set(priceHtml)].slice(0, 20));
    console.log('Text sample:', allText.substring(0, 1500));
    
  } catch(e) {
    console.log('Error:', e.message);
  }
  await page.close();
}

await browser.close();
