import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

test('el modo conectado sin implementar no permite entrar con perfiles demo', async ({
	page,
	baseURL
}) => {
	const dashboard = await page.goto('/');
	expect(dashboard?.status()).toBe(503);
	await expect(page.getByRole('alert')).toContainText('El acceso conectado aún no está disponible');
	await expect(page.locator('.metric')).toHaveCount(0);
	const audit = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
		.analyze();
	expect(
		audit.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.failureSummary) }))
	).toEqual([]);
	await page.goto('/perfiles');
	await expect(page.getByRole('button', { name: 'Explorar como administradora' })).toBeDisabled();
	await expect(page.getByRole('button', { name: 'Explorar como trabajador' })).toBeDisabled();
	const response = await page.request.post('/perfiles', {
		form: { profile: 'administrator' },
		headers: { origin: baseURL! }
	});
	expect(response.status()).toBe(503);
	expect((await page.context().cookies()).some((c) => c.name === 'mh_demo_profile')).toBe(false);
});
