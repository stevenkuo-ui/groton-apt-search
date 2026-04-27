import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' });
  const results = {};
  
  // Triton Square via Apartments.com
  const tritonUrls = [
    'https://www.apartments.com/triton-square-groton-ct/',
    'https://www.zillow.com/homes/Triton-Square-Groton-CT_rb/',
  ];
  
  for (const url of tritonUrls) {
    const page = await context.newPage();
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(5000);
      const bodyText = await page.evaluate(() => document.body.innerText);
      const priceRe = /\$\s*([1-9][\d,]+)/g;
      const prices = [];
      let m;
      while ((m = priceRe.exec(bodyText.slice(0, 10000))) !== null) {
        const raw = m[1].replace(/,/g, '');
        const price = parseInt(raw);
        if (price >= 1000 && price <= 10000) prices.push(price);
      }
      results[url] = {
        title: await page.title(),
        status: 'success',
        prices: [...new Set(prices)].sort((a, b) => a - b),
        snippet: bodyText.slice(0, 3000),
        errors: errors.slice(0, 3)
      };
      console.log(`${url}: ${[...new Set(prices)].sort((a, b) => a - b).join(', ')}`);
    } catch (err) {
      results[url] = { status: 'error', error: err.message };
      console.log(`${url}: ERROR - ${err.message}`);
    }
    await page.close();
  }
  
  // Check Gull Harbor via Wayback or Zillow
  const gullUrls = [
    'https://www.apartments.com/gull-harbor-new-london-ct/',
    'https://www.zillow.com/b/gull-harbor-ct/',
  ];
  for (const url of gullUrls) {
    const page = await context.newPage();
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(5000);
      const bodyText = await page.evaluate(() => document.body.innerText);
      const priceRe = /\$\s*([1-9][\d,]+)/g;
      const prices = [];
      let m;
      while ((m = priceRe.exec(bodyText.slice(0, 10000))) !== null) {
        const raw = m[1].replace(/,/g, '');
        const price = parseInt(raw);
        if (price >= 1000 && price <= 10000) prices.push(price);
      }
      results[url] = {
        title: await page.title(),
        status: 'success',
        prices: [...new Set(prices)].sort((a, b) => a - b),
        snippet: bodyText.slice(0, 3000),
        errors: errors.slice(0, 3)
      };
      console.log(`${url}: ${[...new Set(prices)].sort((a, b) => a - b).join(', ')}`);
    } catch (err) {
      results[url] = { status: 'error', error: err.message };
      console.log(`${url}: ERROR - ${err.message}`);
    }
    await page.close();
  }
  
  await browser.close();
  
  const fs = await import('fs');
  fs.writeFileSync('/Users/stevenkuo/triton_gull_agg.json', JSON.stringify(results, null, 2));
  console.log('Written to /Users/stevenkuo/triton_gull_agg.json');
})();
