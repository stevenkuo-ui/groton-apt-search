import { chromium } from 'playwright';

const properties = [
  {
    name: 'Groton Towers',
    url: 'https://grotonapartmenthomes.com',
    note: 'JS-rendered SecureCafe portal'
  },
  {
    name: 'Groton Townhomes',
    url: 'https://grotontownhouses.com',
    note: '2 units available'
  },
  {
    name: 'Reid Hughes',
    url: 'https://reidhughes.com',
    note: 'RealPage JS'
  },
  {
    name: 'Meadow Ridge',
    url: 'https://www.meadowridgenorwich.com/floorplans',
    note: 'Norwich property'
  },
  {
    name: 'The Ambrose',
    url: 'https://www.b7properties.com/ambrose',
    note: 'b7 Properties'
  }
];

const browser = await chromium.launch({ headless: true });
const results = [];

for (const prop of properties) {
  const result = { name: prop.name, url: prop.url, status: 'unknown', error: null, prices: [], bedrooms: [], sqft: [], snippet: '', title: '' };
  
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
    page.on('pageerror', err => errors.push(err.message));
    
    try {
      const response = await page.goto(prop.url, { 
        waitUntil: 'networkidle', 
        timeout: 25000 
      });
      
      if (!response || response.status() >= 400) {
        result.status = `HTTP ${response?.status() || 'no response'}`;
      } else {
        await page.waitForTimeout(5000);
        
        const content = await page.content();
        if (content.includes('Cloudflare') || content.includes('Checking your browser') || content.includes('Ray ID')) {
          result.status = 'blocked-cloudflare';
        } else if (content.includes('recaptcha') || content.includes('reCAPTCHA')) {
          result.status = 'blocked-recaptcha';
        } else {
          result.status = 'live';
          result.title = await page.title().catch(() => '');
          
          // Extract info
          const text = await page.evaluate(() => document.body.innerText);
          result.prices = [...new Set(text.match(/\$\d{3,5}(?:\.\d{2})?(?:\s*-\s*\$\d{3,5})?/g) || [])].slice(0, 30);
          result.bedrooms = [...new Set(text.match(/\d+\s*(?:Bed(?:room)?s?|BR)\/?\d*\s*(?:Bath(?:room)?s?|BA)?/gi) || [])].slice(0, 20);
          result.sqft = [...new Set(text.match(/\d{3,4}\s*sq\.?\s*ft\.?|\d{3,4}\s*sf\b/gi) || [])].slice(0, 15);
          result.snippet = text.substring(0, 3000);
          
          if (errors.length > 0) {
            result.consoleErrors = errors.filter(e => !e.includes('favicon') && !e.includes('404'));
          }
        }
      }
    } catch (e) {
      result.status = 'error';
      result.error = e.message;
    }
    
    await context.close();
  } catch (ctxErr) {
    result.status = 'context-error';
    result.error = ctxErr.message;
  }
  
  results.push(result);
  console.log(`[${result.status}] ${prop.name}`);
}

await browser.close();

console.log('\n=== DETAILED RESULTS ===\n');
for (const r of results) {
  console.log(`\n--- ${r.name} (${r.url}) ---`);
  console.log(`Status: ${r.status}`);
  console.log(`Title: ${r.title}`);
  if (r.error) console.log(`Error: ${r.error}`);
  if (r.prices.length) console.log(`Prices: ${r.prices.join(' | ')}`);
  if (r.bedrooms.length) console.log(`Bedrooms: ${r.bedrooms.join(' | ')}`);
  if (r.sqft.length) console.log(`Sqft: ${r.sqft.join(' | ')}`);
  if (r.snippet) console.log(`\nSnippet:\n${r.snippet.substring(0, 1500)}`);
  if (r.consoleErrors?.length) console.log(`Console errors: ${r.consoleErrors.join(', ')}`);
  console.log('\n');
}
