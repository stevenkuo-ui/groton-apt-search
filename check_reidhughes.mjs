import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const result = { name: 'Reid Hughes', url: 'https://www.reidhughes.com/Floor-Plans.aspx', status: 'unknown', prices: [], snippet: '', title: '' };

try {
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    ignoreHTTPSErrors: true
  });
  const page = await context.newPage();
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  
  const response = await page.goto('https://www.reidhughes.com/Floor-Plans.aspx', { 
    waitUntil: 'networkidle', 
    timeout: 25000 
  });
  
  result.status = `HTTP ${response?.status() || 'none'}`;
  await page.waitForTimeout(5000);
  
  const content = await page.content();
  if (content.includes('Cloudflare') || content.includes('Checking your browser')) {
    result.status = 'blocked-cloudflare';
  } else {
    result.title = await page.title().catch(() => '');
    const text = await page.evaluate(() => document.body.innerText);
    result.prices = [...new Set(text.match(/\$\d{3,5}(?:\.\d{2})?(?:\s*-\s*\$\d{3,5})?/g) || [])].slice(0, 30);
    result.snippet = text.substring(0, 3000);
    if (errors.length > 0) result.consoleErrors = errors.filter(e => !e.includes('favicon') && !e.includes('404'));
  }
  
  await context.close();
} catch (e) {
  result.status = 'error';
  result.error = e.message;
}

await browser.close();

console.log(`\n--- ${result.name} ---`);
console.log(`Status: ${result.status}`);
console.log(`Title: ${result.title}`);
if (result.prices.length) console.log(`Prices: ${result.prices.join(' | ')}`);
console.log(`\nSnippet:\n${result.snippet.substring(0, 2000)}`);
