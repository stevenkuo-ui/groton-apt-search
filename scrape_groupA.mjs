import { chromium } from 'playwright';

const props = [
  { name: 'triton-square',     url: 'https://www.tritonsquare.com/availability-map/' },
  { name: 'pleasant-valley',   url: 'https://www.pleasantvalley-apts.com/apartments/ct/groton/floor-plans' },
  { name: 'harbor-heights-enclave', url: 'https://www.hmystic.com/enclave/floor-plans-enclave' },
  { name: 'harbor-heights-beacon',  url: 'https://www.hmystic.com/beacon/floor-plans-beacon' },
  { name: 'waterford-woods',   url: 'https://www.waterfordwoods.com/availability' },
  { name: 'groton-estates',    url: 'https://grotonestates.com/floor-plans/' },
  { name: 'chester-place',     url: 'https://www.b7properties.com/chester-place' },
  { name: 'emerson-place',     url: 'https://www.b7properties.com/emerson' },
  { name: 'the-ledges',        url: 'https://www.theledgesapartments.com/floorplans' },
];

const results = [];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36',
  });

  for (const p of props) {
    const r = { name: p.name, url: p.url, status: 'unknown', content: '', error: '' };
    try {
      const page = await context.newPage();
      page.on('console', m => { if (m.type() === 'error') r.error += m.text() + '\n'; });
      await page.goto(p.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(5000);
      const title = await page.title().catch(() => '');
      const body = await page.innerText('body').catch(() => '');
      r.title = title;
      r.status = 'ok';
      // Extract floor plan / pricing text
      const text = body.slice(0, 3000);
      r.content = text;
      console.log(`\n=== ${p.name} (${title}) ===`);
      console.log(text);
      await page.close();
    } catch (e) {
      r.status = 'error';
      r.error = e.message;
      console.error(`\n=== ${p.name} ERROR: ${e.message.slice(0, 200)} ===`);
    }
    results.push(r);
  }

  await browser.close();

  // Print summary
  console.log('\n\n=== RESULTS SUMMARY ===');
  for (const r of results) {
    console.log(`${r.name}: ${r.status} | ${r.title || 'no title'}`);
    if (r.error) console.log(`  ERR: ${r.error.slice(0, 150)}`);
  }
})();