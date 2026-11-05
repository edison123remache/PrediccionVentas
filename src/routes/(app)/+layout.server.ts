import { getAccess } from '#lib/server/access.js';
import type { LayoutServerLoad } from './$types';
export const load: LayoutServerLoad = ({ cookies }) => ({ access: getAccess(cookies) });
