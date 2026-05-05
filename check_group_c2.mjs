// Group C targeted checks using domcontentloaded
import { chromium } from 'playwright';

const URLS = [
  ['https://www.renewgroton.com', 'ReNew Groton'],
  ['https://www.renewwashingtonpark.com', 'ReNew Washington Park'],
  ['https://www.eaglepointeapts.com/floorplans', 'Eagle Pointe'],
  ['https://www.courtviewct.com', 'Courtview Square'],
  ['https://www.baystateproperties.com', 'Baystate Properties'],
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  for (const [url, label] of URLS) {
    const page = await browser.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(5000);
      const title = await page.title();
      const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 1500));
      console.log(`\n=== ${label} (${url}) ===`);
      console.log(`Title: ${title}`);
      console.log(`Text: ${bodyText.replace(/\n+/g, '\n').slice(0, 800)}`);
    } catch(e) {
      console.log(`\n=== ${label} === ERROR: ${e.message.slice(0, 200)}`);
    } finally {
      await page.close();
    }
  }
  await browser.close();
})();