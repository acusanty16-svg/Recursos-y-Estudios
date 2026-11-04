import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

const BASE = process.env.SMOKE_BASE ?? 'http://localhost:5173';
const OUT = 'smoke-output';
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const errors = [];
const check = (label, condition) => {
  console.log(`${condition ? 'OK ' : 'FAIL'} ${label}`);
  if (!condition) process.exitCode = 1;
};

const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(`console: ${message.text()}`);
});
page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));

await page.goto(`${BASE}/leer`, { waitUntil: 'networkidle', timeout: 60_000 });
await page.waitForSelector('#chapter-title', { timeout: 30_000 });

// Selector de referencia
await page.getByRole('button', { name: 'Elegir libro y capítulo' }).click();
await page.waitForSelector('#reference-search');
check('diálogo de referencia abierto', await page.getByText('Ir a una referencia').isVisible());
await page.fill('#reference-search', 'Juan 3:16');
await page.waitForTimeout(250);
check('salto directo visible', await page.getByText('Ir directo').isVisible());
await page.getByText('Ir directo').click();
await page.waitForTimeout(3000);
check('capítulo cambiado a Juan 3', (await page.locator('#chapter-title').innerText()).includes('Juan 3'));

const verse16 = await page.evaluate(() => {
  const element = document.getElementById('v16');
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  return { top: rect.top, bottom: rect.bottom, active: element.getAttribute('aria-current') };
});
check('versículo 16 en pantalla', Boolean(verse16 && verse16.top >= 0 && verse16.top < 950));
check('versículo 16 marcado como activo', verse16?.active === 'location');
await page.screenshot({ path: `${OUT}/reader-reference-jump.png` });

// Selector de versículo
await page.getByRole('button', { name: /^Versículo \d+$/ }).click();
await page.waitForTimeout(300);
check('selector de versículo visible', await page.getByText('Ir a versículo').isVisible());
await page.locator('.sv-popover').getByRole('button', { name: '20', exact: true }).click();
await page.waitForTimeout(900);
const verse20 = await page.evaluate(() => {
  const element = document.getElementById('v20');
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  return { top: rect.top, active: element.getAttribute('aria-current') };
});
check('salto al versículo 20', Boolean(verse20 && verse20.top >= 0 && verse20.top < 950));
check('versículo 20 activo', verse20?.active === 'location');

// Panel de notas bajo demanda
await page.getByRole('button', { name: 'Ver notas' }).click();
await page.waitForTimeout(400);
check('panel de notas abierto', await page.getByText('Notas del capítulo').isVisible());
await page.screenshot({ path: `${OUT}/reader-notes-drawer.png` });
await page.getByRole('button', { name: 'Cerrar' }).click();
await page.waitForTimeout(300);
check('panel de notas cerrado', !(await page.getByText('Notas del capítulo').isVisible()));

// Modo enfoque
await page.getByRole('button', { name: 'Modo enfoque' }).click();
await page.waitForTimeout(400);
check('modo enfoque activo', await page.getByRole('button', { name: 'Salir del enfoque' }).isVisible());
await page.screenshot({ path: `${OUT}/reader-focus.png` });
await page.getByRole('button', { name: 'Salir del enfoque' }).click();
await page.waitForTimeout(300);

// Tema claro y vuelta a oscuro
await page.getByRole('button', { name: /Tema/ }).first().click();
await page.waitForTimeout(400);
check('tema claro', ((await page.locator('html').getAttribute('class')) ?? '').includes('light'));
await page.screenshot({ path: `${OUT}/reader-light.png` });
await page.getByRole('button', { name: /Tema/ }).first().click();
await page.waitForTimeout(300);
check('tema oscuro', ((await page.locator('html').getAttribute('class')) ?? '').includes('dark'));

// Móvil
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
mobile.on('console', (message) => {
  if (message.type() === 'error') errors.push(`mobile console: ${message.text()}`);
});
mobile.on('pageerror', (error) => errors.push(`mobile pageerror: ${error.message}`));
await mobile.goto(`${BASE}/leer`, { waitUntil: 'networkidle', timeout: 60_000 });
await mobile.waitForSelector('#chapter-title', { timeout: 30_000 });
check('barra móvil con referencia', await mobile.getByRole('button', { name: 'Elegir libro y capítulo' }).isVisible());
await mobile.getByRole('button', { name: /^Versículo \d+$/ }).click();
await mobile.waitForTimeout(300);
check('selector de versículo móvil visible', await mobile.getByText('Ir a versículo').isVisible());
await mobile.locator('.sv-popover').getByRole('button', { name: '12', exact: true }).click();
await mobile.waitForTimeout(900);
const mobileVerse12 = await mobile.evaluate(() => {
  const element = document.getElementById('v12');
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  return { top: rect.top, active: element.getAttribute('aria-current') };
});
check('salto a versículo 12 en móvil', Boolean(mobileVerse12 && mobileVerse12.top >= 0 && mobileVerse12.top < 844));
check('versículo 12 activo en móvil', mobileVerse12?.active === 'location');
await mobile.screenshot({ path: `${OUT}/reader-mobile-verse.png` });
await mobile.getByRole('button', { name: 'Ver notas' }).click();
await mobile.waitForTimeout(400);
check('panel de notas móvil', await mobile.getByText('Notas del capítulo').isVisible());
await mobile.screenshot({ path: `${OUT}/reader-mobile-notes.png` });
await mobile.getByRole('button', { name: 'Cerrar' }).click();
await mobile.waitForTimeout(300);
check('panel de notas móvil cerrado', !(await mobile.getByText('Notas del capítulo').isVisible()));

// Nota en móvil: el botón debe quedar por encima de la barra inferior.
await mobile.getByRole('button', { name: 'Añadir nota' }).first().click();
await mobile.waitForSelector('#note-body');
const mobileSaveNote = mobile.getByRole('button', { name: 'Guardar nota' });
check('botón guardar nota visible en móvil', await mobileSaveNote.isVisible());
await mobile.fill('#note-body', 'Nota móvil de regresión.');
await mobileSaveNote.click();
await mobile.waitForTimeout(600);
check('nota guardada desde móvil', await mobile.getByText('Nota móvil de regresión.').first().isVisible());

console.log('\n--- ERRORS ---');
if (errors.length === 0) console.log('none');
else for (const error of errors) console.log(error);

await browser.close();
