import { test, expect } from '@playwright/test';

async function chooseWorker(page: import('@playwright/test').Page) {
	await page.goto('/perfiles');
	await expect(page.getByText('Esto no es un inicio de sesión')).toBeVisible();
	await page.getByRole('button', { name: 'Explorar como trabajador', exact: true }).click();
	await expect(page).toHaveURL('/');
	await expect(page.locator('.current-profile')).toContainText('Trabajador');
}

test('permite cambiar de perfil y conserva la elección al recargar', async ({ page }) => {
	await chooseWorker(page);
	await expect(page.locator('.metric')).toHaveCount(2);
	await expect(page.getByText('Estimación del próximo mes', { exact: true })).toHaveCount(0);
	await expect(page.locator('canvas')).toHaveCount(0);
	await expect(page.getByRole('heading', { name: 'Lo esencial para tu jornada' })).toBeVisible();
	await expect(page.locator('nav a[href="/administracion/usuarios"]')).toHaveCount(0);
	await expect(page.locator('nav a[href="/predicciones"]')).toHaveCount(0);
	await expect(page.locator('nav a[href="/reportes"]')).toHaveCount(0);
	await page.reload();
	await expect(page.locator('.current-profile')).toContainText('Trabajador');
	await page.getByRole('link', { name: 'Cambiar perfil', exact: true }).click();
	await page.getByRole('button', { name: 'Explorar como administradora', exact: true }).click();
	await expect(page.locator('.current-profile')).toContainText('Administradora');
	await expect(page.locator('.metric')).toHaveCount(3);
	const cookie = (await page.context().cookies()).find((c) => c.name === 'mh_demo_profile');
	expect(cookie?.httpOnly).toBe(true);
	expect(cookie?.sameSite).toBe('Lax');
});

test('el trabajador no abre administración, predicciones o reportes por URL', async ({ page }) => {
	await chooseWorker(page);
	for (const path of [
		'/administracion/usuarios',
		'/administracion/datos',
		'/administracion/importaciones',
		'/predicciones',
		'/reportes'
	]) {
		const response = await page.goto(path);
		expect(response?.status()).toBe(403);
		await expect(
			page.getByRole('heading', { name: 'Esta sección requiere otro permiso' })
		).toBeVisible();
	}
});

test('los módulos autorizados muestran su estado real sin simular funciones', async ({ page }) => {
	await chooseWorker(page);
	for (const path of ['/ventas', '/inventario', '/asistente']) {
		expect((await page.goto(path))?.status()).toBe(200);
		await expect(page.getByText('Módulo planificado', { exact: true })).toBeVisible();
		await expect(page.locator('input[type=file], textarea')).toHaveCount(0);
	}
});

test('la administradora puede revisar los espacios de administración y el flujo de Excel', async ({
	page
}, testInfo) => {
	await page.goto('/administracion/datos');
	await expect(
		page.getByRole('heading', { name: 'Actualización de datos', exact: true })
	).toBeVisible();
	await expect(page.getByText('Excel (.xlsx) o CSV', { exact: false })).toBeVisible();
	await expect(
		page.getByText('No se procesa ni guarda ningún archivo en esta fase.', { exact: false })
	).toBeVisible();
	if (testInfo.project.name === 'movil')
		await page.getByRole('button', { name: 'Abrir menú' }).click();
	await page.locator('nav a[href="/administracion/usuarios"]').click();
	await expect(
		page.getByRole('heading', { name: 'Usuarios y permisos', exact: true })
	).toBeVisible();
	if (testInfo.project.name === 'movil')
		await page.getByRole('button', { name: 'Abrir menú' }).click();
	await expect(page.locator('nav a[href="/administracion/usuarios"]')).toHaveAttribute(
		'aria-current',
		'page'
	);
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('rechaza perfiles inválidos y cambios de origen externo', async ({ page, baseURL }) => {
	await chooseWorker(page);
	const invalid = await page.request.post('/perfiles', {
		form: { profile: 'superadmin' },
		headers: { origin: baseURL! }
	});
	expect(invalid.status()).toBe(400);
	const crossOrigin = await page.request.post('/perfiles', {
		form: { profile: 'administrator' },
		headers: { origin: 'https://otro-origen.example' }
	});
	expect(crossOrigin.status()).toBe(403);
	await page.goto('/');
	await expect(page.locator('.current-profile')).toContainText('Trabajador');
});

test('las rutas de ambos perfiles no desbordan y no producen errores de JavaScript', async ({
	page
}, testInfo) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/perfiles');
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
	await page.screenshot({ path: testInfo.outputPath('perfiles.png'), fullPage: true });
	await page.getByRole('button', { name: 'Explorar como trabajador', exact: true }).click();
	await expect(page.locator('.metric')).toHaveCount(2);
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.screenshot({
		path: testInfo.outputPath('trabajador.png'),
		fullPage: true,
		animations: 'disabled'
	});
	expect(errors).toEqual([]);
});
