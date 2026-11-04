import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

const BASE = process.env.SMOKE_BASE ?? 'http://localhost:5173';
await mkdir('docs', { recursive: true });

const browser = await chromium.launch({ channel: 'msedge', headless: true });

// Lector con comparación (la visita a /leer también registra la lectura para el dashboard).
const page = await browser.newPage({ viewport: { width: 1440, height: 950 }, colorScheme: 'dark' });
await page.goto(`${BASE}/leer`, { waitUntil: 'networkidle', timeout: 60_000 });
await page.waitForSelector('#chapter-title', { timeout: 30_000 });
await page.waitForTimeout(800);
await page.selectOption('#compare-select', 'NTV');
await page.waitForSelector('.sv-compare-panel', { timeout: 20_000 });
await page.waitForTimeout(900);
await page.screenshot({ path: 'docs/reader-comparison.png', fullPage: false });

// Dashboard con racha y continuar lectura.
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(900);
await page.screenshot({ path: 'docs/dashboard.png', fullPage: true });

// API Explorer con Swagger UI.
await page.goto(`${BASE}/api`, { waitUntil: 'networkidle' });
await page.waitForSelector('.swagger-ui', { timeout: 60_000 });
await page.waitForTimeout(2500);
await page.screenshot({ path: 'docs/api-explorer.png', fullPage: false });

// Lector móvil.
const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  colorScheme: 'dark',
});
await mobile.goto(`${BASE}/leer`, { waitUntil: 'networkidle', timeout: 60_000 });
await mobile.waitForSelector('#chapter-title', { timeout: 30_000 });
await mobile.waitForTimeout(900);
await mobile.screenshot({ path: 'docs/reader-mobile.png', fullPage: false });

await browser.close();
console.log('Capturas guardadas en docs/');
