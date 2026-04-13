import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('https://grotonestates.com/floor-plans/', { timeout: 20000, waitUntil: 'domcontentloaded' });
await page.waitForTimeout(5000);
const bodyText = await page.evaluate(() => document.body.innerText);
console.log('Body text:');
console.log(bodyText);
await browser.close();
