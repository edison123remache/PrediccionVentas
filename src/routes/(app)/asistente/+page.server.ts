import { requireDemoPermission } from '#lib/server/access.js';
import { navigation } from '#lib/access/policy.js';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = ({ cookies }) => {
	requireDemoPermission(cookies, 'chat:use');
	return { module: navigation.find((item) => item.href === '/asistente')! };
};
