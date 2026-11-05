export const PERMISSIONS = [
	'dashboard:read',
	'sales:read',
	'forecasts:read',
	'inventory:read',
	'chat:use',
	'reports:export',
	'users:manage',
	'data:manage',
	'imports:read'
] as const;
export type Permission = (typeof PERMISSIONS)[number];
export type Role = 'administrator' | 'worker';
export interface SessionUser {
	id: string;
	name: string;
	role: Role;
	permissions: Permission[];
	active: boolean;
}
// Esta unión impide representar una conexión no implementada como una sesión autenticada.
export type AppAccess = { mode: 'demo'; user: SessionUser } | { mode: 'unavailable'; user: null };

export type WorkerPermission = Extract<
	Permission,
	| 'dashboard:read'
	| 'sales:read'
	| 'forecasts:read'
	| 'inventory:read'
	| 'chat:use'
	| 'reports:export'
>;
