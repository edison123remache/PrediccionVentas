import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

const routes = [
	'/',
	'/informacion',
	'/perfiles',
	'/ventas',
	'/predicciones',
	'/inventario',
	'/asistente',
	'/reportes',
	'/administracion/usuarios',
	'/administracion/datos',
	'/administracion/importaciones'
];

async function prepare(page: import('@playwright/test').Page, path: string) {
	await page.goto(path);
	if (path === '/') {
		await expect(page.locator('.metric')).toHaveCount(3);
		await page.getByText('Consultar valores en tabla').click();
	}
}

async function assertReflow(page: import('@playwright/test').Page) {
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
		true
	);
	// Las únicas regiones que pueden necesitar desplazamiento horizontal son las tablas.
	const clipped = await page.locator('main').evaluate((main) => {
		return Array.from(main.querySelectorAll('h1,h2,p,button,a,select,label,summary,caption'))
			.filter((el) => {
				if (
					el.closest('svg,.sr-only') ||
					el.closest('.table-scroll') ||
					!(el instanceof HTMLElement)
				)
					return false;
				const style = getComputedStyle(el),
					rect = el.getBoundingClientRect();
				if (
					!rect.width ||
					!rect.height ||
					style.display === 'none' ||
					style.visibility === 'hidden'
				)
					return false;
				return el.scrollWidth > el.clientWidth + 2 && ['hidden', 'clip'].includes(style.overflowX);
			})
			.map((el) => el.textContent?.trim());
	});
	expect(clipped).toEqual([]);
	const overlaps = await page.evaluate(() => {
		const failures: string[] = [];
		for (const group of document.querySelectorAll(
			'.topbar,.profile-toolbar,.page-heading,.chart-toolbar,.panel-heading,.metric-top,.metric-bottom,.phase-actions,.segmented,.chart-overview'
		)) {
			const children = Array.from(group.children).filter((el) => {
				const r = el.getBoundingClientRect();
				return r.width && r.height;
			});
			for (let i = 0; i < children.length; i++)
				for (let j = i + 1; j < children.length; j++) {
					const a = children[i].getBoundingClientRect(),
						b = children[j].getBoundingClientRect();
					if (
						Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 &&
						Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2
					)
						failures.push(group.className);
				}
		}
		return failures;
	});
	expect(overlaps).toEqual([]);
}

test('contraste AA y tamaños legibles en todas las pantallas existentes', async ({
	page
}, testInfo) => {
	test.setTimeout(120_000);
	await page.emulateMedia({ reducedMotion: 'reduce' });
	for (const path of routes) {
		await prepare(page, path);
		if (testInfo.project.name === 'movil' && path !== '/perfiles') {
			await page.getByRole('button', { name: 'Abrir menú' }).click();
			await expect(page.getByRole('navigation')).toBeVisible();
		}
		const results = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
			.analyze();
		expect(
			results.violations.map((v) => ({
				id: v.id,
				nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary }))
			})),
			path
		).toEqual([]);
		const smallText = await page.locator('body').evaluate((body) =>
			Array.from(body.querySelectorAll('*'))
				.filter((el) => {
					if (el.closest('svg,.sr-only') || !(el instanceof HTMLElement)) return false;
					const rect = el.getBoundingClientRect();
					if (!rect.width || !rect.height || getComputedStyle(el).visibility === 'hidden')
						return false;
					const hasOwnText = Array.from(el.childNodes).some(
						(n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim()
					);
					return hasOwnText && parseFloat(getComputedStyle(el).fontSize) < 13;
				})
				.map((el) => ({ text: el.textContent?.trim(), size: getComputedStyle(el).fontSize }))
		);
		expect(smallText, path).toEqual([]);
		await assertReflow(page);
		if (['/', '/informacion', '/perfiles', '/administracion/datos'].includes(path)) {
			if (testInfo.project.name === 'movil' && path !== '/perfiles')
				await page.getByRole('button', { name: 'Cerrar menú' }).click();
			await page.evaluate(() => {
				(document.activeElement as HTMLElement)?.blur();
				window.scrollTo(0, 0);
			});
			await page.screenshot({
				path: testInfo.outputPath(`legibilidad-${path.replaceAll('/', '-') || 'inicio'}.png`),
				fullPage: true,
				animations: 'disabled'
			});
		}
	}
});

test('reflujo equivalente a 200 por ciento y ampliación de texto sin recortes', async ({
	page
}, testInfo) => {
	test.setTimeout(90_000);
	await page.emulateMedia({ reducedMotion: 'reduce' });
	// Una ventana de 1440 px al 200 % dispone de 720 px CSS para el contenido.
	await page.setViewportSize({ width: 720, height: 500 });
	for (const path of routes) {
		await prepare(page, path);
		await assertReflow(page);
		// Además comprobar texto duplicado por preferencia del navegador (32 px de base).
		await page.evaluate(() => {
			document.documentElement.style.fontSize = '200%';
		});
		await assertReflow(page);
		await expect(page.locator('h1')).toBeVisible();
		if (path === '/informacion')
			await page.screenshot({
				path: testInfo.outputPath('texto-doble-720.png'),
				fullPage: true,
				animations: 'disabled'
			});
	}
	await page.goto('/');
	await expect(page.locator('.metric')).toHaveCount(3);
	await page
		.getByRole('combobox', { name: 'Mes del resumen', exact: true })
		.selectOption('2025-11');
	await expect(page.locator('.month-reading')).toContainText('24.500');
});

test('texto y foco de tabla accesibles con el perfil trabajador y en errores', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/');
	await expect(page.locator('.metric')).toHaveCount(3);
	await page.getByText('Consultar valores en tabla').click();
	const region = page.getByRole('region', {
		name: 'Tabla de ingresos mensuales, desplazable horizontalmente'
	});
	await region.focus();
	await expect(region).toBeFocused();
	await page.goto('/perfiles');
	await page.getByRole('button', { name: 'Explorar como trabajador' }).click();
	await expect(page.locator('.metric')).toHaveCount(2);
	for (const path of ['/', '/administracion/datos']) {
		await page.goto(path);
		if (path === '/') await expect(page.locator('.metric')).toHaveCount(2);
		else await expect(page.getByRole('alert')).toBeVisible();
		const results = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
			.analyze();
		expect(
			results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.failureSummary) }))
		).toEqual([]);
		await assertReflow(page);
	}
});

test('las pantallas pequeñas conservan el contenido a 320 px', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.setViewportSize({ width: 320, height: 720 });
	for (const path of ['/', '/informacion', '/perfiles', '/administracion/datos']) {
		await prepare(page, path);
		await assertReflow(page);
	}
});
