import { PERMISSIONS } from '#lib/types/access.js';
import type { Role, SessionUser } from '#lib/types/access.js';
// Perfiles de muestra: no representan cuentas ni autorizaciones de personas reales.
export const demoProfiles: Record<Role, SessionUser> = {
	administrator: {
		id: 'demo-administrator',
		name: 'Administradora de ejemplo',
		role: 'administrator',
		active: true,
		permissions: [...PERMISSIONS]
	},
	worker: {
		id: 'demo-worker',
		name: 'Trabajador de ejemplo',
		role: 'worker',
		active: true,
		permissions: ['dashboard:read', 'sales:read', 'inventory:read', 'chat:use']
	}
};
