import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

const BASE = process.env.SMOKE_BASE ?? 'http://localhost:5173';
const OUT = process.env.SMOKE_OUT ?? 'smoke-output';
const ROUTES = [
  ['dashboard', '/'],
  ['reader', '/leer'],
  ['notes', '/notas'],
  ['import', '/importar'],
  ['api', '/api'],
  ['settings', '/ajustes'],
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const errors = [];

for (const [name, path] of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`[${name}] console: ${message.text()}`);
  });
  page.on('pageerror', (error) => errors.push(`[${name}] pageerror: ${error.message}`));

  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 60_000 });
  await page.waitForTimeout(1200);
  const text = await page.locator('body').innerText();
  console.log(`\n=== ${name} (${path}) ===`);
  console.log(text.replace(/\s+/g, ' ').slice(0, 420));
  await page.screenshot({ path: `${OUT}/${name}-desktop.png`, fullPage: true });
  await page.close();
}

// Mobile check
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
mobile.on('pageerror', (error) => errors.push(`[mobile] pageerror: ${error.message}`));
await mobile.goto(`${BASE}/leer`, { waitUntil: 'networkidle', timeout: 60_000 });
await mobile.waitForTimeout(1200);
await mobile.screenshot({ path: `${OUT}/reader-mobile.png`, fullPage: false });
await mobile.close();

await browser.close();

console.log('\n=== ERRORS ===');
if (errors.length === 0) console.log('none');
else for (const error of errors) console.log(error);
