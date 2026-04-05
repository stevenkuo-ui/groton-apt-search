import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });

async function scrape(url, label) {
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    const text = await page.evaluate(() => document.body.innerText);
    console.log(`\n=== ${label} ===`);
    console.log(text.slice(0, 2500));
  } catch(e) {
    console.log(`\n=== ${label} ERROR: ${e.message.slice(0, 200)} ===`);
  } finally {
    await page.close();
  }
}

// Triton Square - HotPads
await scrape('https://hotpads.com/triton-square-groton-ct/bedrooms-any/', 'TRITON SQUARE HOTPADS');

// Harbor Heights Beacon - ApartmentList
await scrape('https://www.apartmentlist.com/ct/mystic/beacon-at-harbor-heights', 'BEACON APARTMENTLIST');

// Gull Harbor - Apartments.com
await scrape('https://www.apartments.com/gull-harbor-new-london-ct/', 'GULL HARBOR APARTMENTS.COM');

// Waterford Woods - ApartmentList
await scrape('https://www.apartmentlist.com/ct/waterford/waterford-woods', 'WATERFORD WOODS APARTMENTLIST');

// The Ledges - Apartments.com
await scrape('https://www.apartments.com/the-ledges-groton-ct/', 'THE LEDGES APARTMENTS.COM');

// Harbor Heights Enclave - ApartmentList
await scrape('https://www.apartmentlist.com/ct/mystic/enclave-at-harbor-heights', 'ENCLAVE APARTMENTLIST');

await browser.close();
