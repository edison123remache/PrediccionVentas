import { requireDemoPermission } from '#lib/server/access.js';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = ({ cookies }) => {
	requireDemoPermission(cookies, 'dashboard:read');
	return {};
};
