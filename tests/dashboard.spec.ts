import { test, expect } from '@playwright/test';

test('muestra cifras demostrativas, gráfico, tabla y alcance del asistente', async ({
	page
}, testInfo) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Una mirada a tu negocio.' })).toBeVisible();
	await expect(page.getByText('Estás viendo datos de demostración')).toBeVisible();
	const metrics = page.locator('.metric');
	await expect(metrics).toHaveCount(3);
	await expect(metrics.nth(0).locator('.metric-value [aria-hidden=true]')).toContainText('28.100');
	await expect(metrics.nth(1).locator('.metric-value [aria-hidden=true]')).toContainText('26.300');
	await expect(metrics.nth(2)).toContainText('+14,7 %');
	await expect(page.locator('canvas')).toBeVisible();
	await expect
		.poll(() => page.locator('canvas').evaluate((el: HTMLCanvasElement) => el.width))
		.toBeGreaterThan(100);
	await page.locator('canvas').hover();
	await page.getByText('Consultar valores en tabla').click();
	await expect(page.getByRole('table')).toBeVisible();
	await expect(page.getByRole('row')).toHaveCount(8);
	await page.getByRole('button', { name: 'Conocer el asistente' }).click();
	await expect(page.getByRole('status')).toContainText('Aún no está conectado');
	await page.getByRole('button', { name: 'Ocultar detalles' }).click();
	await expect(page.locator('#assistant-info')).toHaveCount(0);
	if (testInfo.project.name === 'movil') {
		await expect(page.getByRole('navigation')).toBeHidden();
		await page.getByRole('button', { name: 'Abrir menú' }).click();
		await expect(page.getByRole('navigation')).toBeVisible();
		await page.getByRole('link', { name: 'Inicio', exact: true }).click();
		await expect(page.getByRole('navigation')).toBeHidden();
	}
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
		true
	);
	expect(errors).toEqual([]);
	await page.evaluate(() => {
		(document.activeElement as HTMLElement)?.blur();
		window.scrollTo(0, 0);
	});
	await page.screenshot({
		path: testInfo.outputPath('dashboard.png'),
		fullPage: true,
		animations: 'disabled'
	});
});

test('muestra el estado sin datos sin inventar importes', async ({ page }) => {
	await page.route('**/src/lib/services/sales.ts*', (route) =>
		route.fulfill({
			contentType: 'application/javascript',
			body: `export const salesService = { async getDashboard() { return { sales: [], forecast: null, metadata: { demonstration: true, source: 'Prueba', updatedAt: '2026-01-05' } }; } };`
		})
	);
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Aún no hay ventas disponibles' })).toBeVisible();
	await expect(page.locator('.metric')).toHaveCount(0);
});

test('informa un error y permite reintentar la consulta', async ({ page }) => {
	await page.route('**/src/lib/services/sales.ts*', (route) =>
		route.fulfill({
			contentType: 'application/javascript',
			body: `let first = true; export const salesService = { async getDashboard() { if (first) { first = false; throw new Error('Fallo de prueba'); } return { sales: [], forecast: null, metadata: { demonstration: true, source: 'Prueba', updatedAt: '2026-01-05' } }; } };`
		})
	);
	await page.goto('/');
	await expect(page.getByRole('alert')).toContainText('No pudimos cargar el resumen');
	await page.getByRole('button', { name: 'Volver a intentar' }).click();
	await expect(page.getByRole('heading', { name: 'Aún no hay ventas disponibles' })).toBeVisible();
});

test('mantiene visible la carga mientras la consulta está pendiente', async ({ page }) => {
	await page.route('**/src/lib/services/sales.ts*', (route) =>
		route.fulfill({
			contentType: 'application/javascript',
			body: `export const salesService = { getDashboard() { return new Promise(() => {}); } };`
		})
	);
	await page.goto('/');
	await expect(page.getByRole('status')).toContainText('Cargando el resumen');
	await expect(page.locator('.metric')).toHaveCount(0);
});

test('los filtros, el tipo de gráfico y el mes actualizan los datos', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('.metric').first()).toContainText('28.100');
	await page.getByRole('button', { name: '3 meses', exact: true }).click();
	await expect(page.locator('.chart-overview')).toContainText('75.350');
	await page.getByText('Consultar valores en tabla').click();
	await expect(page.getByRole('row')).toHaveCount(5);
	await page.getByRole('button', { name: 'Barras', exact: true }).click();
	await expect(page.getByRole('button', { name: 'Barras', exact: true })).toHaveAttribute(
		'aria-pressed',
		'true'
	);
	await page.getByRole('checkbox', { name: 'Mostrar estimación' }).uncheck();
	await expect(page.getByRole('row')).toHaveCount(4);
	await expect(page.getByRole('cell', { name: 'Estimación ilustrativa', exact: true })).toHaveCount(
		0
	);
	await page
		.getByRole('combobox', { name: 'Mes del resumen', exact: true })
		.selectOption('2025-10');
	await expect(page.locator('.metric').first()).toContainText('22.750');
	await expect(page.locator('.month-reading')).toContainText('22.750');
	await expect(page.locator('.metric').nth(2)).toContainText('+17,3 %');
	await page.getByRole('button', { name: '12 meses', exact: true }).click();
	await expect(page.getByRole('row')).toHaveCount(13);
	await expect(
		page.getByRole('combobox', { name: 'Mes del resumen', exact: true }).locator('option')
	).toHaveCount(12);
	await page.getByRole('button', { name: 'Líneas', exact: true }).click();
	await page.getByRole('checkbox', { name: 'Mostrar estimación' }).check();
	await expect(page.getByRole('row')).toHaveCount(14);
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('respeta movimiento reducido y permite explorar con teclado', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/');
	await expect(page.locator('.metric').first()).toContainText('28.100');
	expect(
		await page
			.locator('.metric')
			.first()
			.evaluate((el) => getComputedStyle(el).animationName)
	).toBe('none');
	await page.keyboard.press('Tab');
	await expect(page.getByRole('link', { name: 'Saltar al contenido' })).toBeFocused();
	await page.keyboard.press('Enter');
	await expect(page.locator('main')).toBeFocused();
	await page.getByRole('combobox', { name: 'Mes del resumen', exact: true }).focus();
	await page.keyboard.press('Home');
	await page.keyboard.press('Enter');
	await expect(page.locator('.month-reading')).toContainText('18.200');
});
