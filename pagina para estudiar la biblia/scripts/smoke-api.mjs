import { chromium } from 'playwright-core';

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
const logs = [];
page.on('console', (message) => logs.push(`${message.type()}: ${message.text()}`));
page.on('pageerror', (error) => logs.push(`pageerror: ${error.message}`));
page.on('requestfailed', (request) => logs.push(`requestfailed: ${request.url()} ${request.failure()?.errorText ?? ''}`));

await page.goto('http://localhost:5173/api', { waitUntil: 'domcontentloaded', timeout: 60_000 });
await page.waitForTimeout(20_000);
const text = await page.locator('body').innerText();
console.log('--- TEXT ---');
console.log(text.replace(/\s+/g, ' ').slice(0, 1200));
console.log('--- HAS SWAGGER ---', await page.locator('.swagger-ui').count());
console.log('--- LOGS ---');
for (const log of logs) console.log(log);
await page.screenshot({ path: 'smoke-output/api-wait.png', fullPage: true });
await browser.close();
