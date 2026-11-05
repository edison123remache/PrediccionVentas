import { fail, redirect } from '@sveltejs/kit';
import { DEMO_PROFILE_COOKIE, getAccess } from '#lib/server/access.js';
import type { Actions, PageServerLoad } from './$types';
export const load: PageServerLoad = ({ cookies }) => ({ access: getAccess(cookies) });
export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		if (request.headers.get('origin') !== url.origin)
			return fail(403, { message: 'No se permite cambiar de perfil desde otro origen.' });
		if (getAccess(cookies).mode !== 'demo')
			return fail(503, {
				message:
					'El modo conectado todavía no está implementado. No se puede iniciar una sesión real.'
			});
		const form = await request.formData();
		const role = form.get('profile');
		if (role !== 'administrator' && role !== 'worker')
			return fail(400, { message: 'Selecciona un perfil de demostración válido.' });
		cookies.set(DEMO_PROFILE_COOKIE, role, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: url.protocol === 'https:',
			maxAge: 60 * 60 * 8
		});
		redirect(303, '/');
	}
};
