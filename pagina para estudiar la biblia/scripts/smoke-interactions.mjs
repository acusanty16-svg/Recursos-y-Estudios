import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

const BASE = process.env.SMOKE_BASE ?? 'http://localhost:5173';
const OUT = 'smoke-output';
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
const errors = [];
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(`console: ${message.text()}`);
});
page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));

const check = (label, condition) => {
  console.log(`${condition ? 'OK ' : 'FAIL'} ${label}`);
  if (!condition) process.exitCode = 1;
};

await page.goto(`${BASE}/leer`, { waitUntil: 'networkidle', timeout: 60_000 });
await page.waitForSelector('#chapter-title', { timeout: 30_000 });
check('capítulo visible', (await page.locator('#chapter-title').innerText()).includes('Juan'));

// Nota en el primer versículo
await page.getByRole('button', { name: 'Añadir nota' }).first().click();
await page.waitForSelector('#note-body');
await page.fill('#note-body', 'Señor, ayúdame a habitar tu Palabra cada día.');
await page.fill('#note-tags', 'fe, gratitud');
await page.getByRole('button', { name: 'Guardar nota' }).click();
await page.waitForTimeout(600);
check('nota visible en el versículo', await page.getByText('Señor, ayúdame a habitar').first().isVisible());

// Subrayado
await page.locator('summary[aria-label="Subrayar"]').first().click();
await page.getByRole('button', { name: 'Subrayar: gold' }).click();
await page.waitForTimeout(300);

// Guardado
await page.getByRole('button', { name: 'Guardar', exact: true }).first().click();
await page.waitForTimeout(300);

// Comparación NTV
await page.selectOption('#compare-select', 'NTV');
await page.waitForTimeout(3500);
const bodyText = await page.locator('body').innerText();
check('comparación NTV cargada', bodyText.includes('la Palabra ya existía'));
check('texto sin HTML crudo', !bodyText.includes('<br>'));

await page.screenshot({ path: `${OUT}/reader-with-note.png`, fullPage: false });

// Mis notas
await page.goto(`${BASE}/notas`, { waitUntil: 'networkidle' });
check('nota aparece en Mis notas', await page.getByText('Señor, ayúdame a habitar').first().isVisible());
check('etiqueta visible', await page.locator('ul li').filter({ hasText: '#fe' }).first().isVisible());

// Tema claro
const themeButton = page.getByRole('button', { name: /Tema/ }).first();
await themeButton.click();
await page.waitForTimeout(400);
check('tema claro aplicado', (await page.locator('html').getAttribute('class'))?.includes('light') ?? false);
await page.screenshot({ path: `${OUT}/notes-light.png`, fullPage: true });

// Idioma EN
await page.getByRole('button', { name: 'Switch to English' }).first().click();
await page.waitForTimeout(500);
check('idioma inglés aplicado', (await page.locator('body').innerText()).includes('My notes'));
await page.screenshot({ path: `${OUT}/notes-light-en.png`, fullPage: true });

// Volver a español
await page.getByRole('button', { name: 'Cambiar a español' }).first().click();
await page.waitForTimeout(300);

console.log('\n--- ERRORS ---');
if (errors.length === 0) console.log('none');
else for (const error of errors) console.log(error);

await browser.close();
