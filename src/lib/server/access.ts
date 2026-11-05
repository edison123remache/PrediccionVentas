import { APP_MODE } from '$app/env/private';
import { error } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import { demoProfiles } from '#lib/demo/profiles.js';
import { can } from '#lib/access/policy.js';
import type { AppAccess, Permission } from '#lib/types/access.js';
export const DEMO_PROFILE_COOKIE = 'mh_demo_profile';
export function getAccess(cookies: Cookies): AppAccess {
	// Solo el modo demo está implementado. Cualquier otro valor falla cerrado.
	if (APP_MODE !== 'demo') return { mode: 'unavailable', user: null };
	const role = cookies.get(DEMO_PROFILE_COOKIE) === 'worker' ? 'worker' : 'administrator';
	return { mode: 'demo', user: structuredClone(demoProfiles[role]) };
}
export function requireDemoPermission(cookies: Cookies, permission: Permission): AppAccess {
	const access = getAccess(cookies);
	if (access.mode === 'unavailable') error(503, 'El acceso conectado aún no está disponible.');
	if (!can(access, permission))
		error(403, 'Esta sección no está disponible para el perfil de demostración seleccionado.');
	return access;
}
