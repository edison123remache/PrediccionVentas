import { test, expect } from '@playwright/test';

test('muestra cifras demostrativas, gráfico, tabla y alcance del asistente', async ({
	page
}, testInfo) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Resumen comercial' })).toBeVisible();
	await expect(page.getByText('Estás viendo datos de demostración')).toBeVisible();
	const metrics = page.locator('.metric');
	await expect(metrics).toHaveCount(3);
	await expect(metrics.nth(0)).toContainText('28.100');
	await expect(metrics.nth(1)).toContainText('26.300');
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
	await page.screenshot({ path: testInfo.outputPath('dashboard.png'), fullPage: true });
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
