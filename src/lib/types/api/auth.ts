import type { WorkerPermission, SessionUser } from '../access.js';
import type { ISODateTime } from './common.js';
export interface LoginRequest {
	identifier: string;
	password: string;
}
export interface AuthenticatedSession {
	user: SessionUser;
	expiresAt: ISODateTime;
}
export interface CreateUserRequest {
	name: string;
	identifier: string;
	role: 'worker';
	permissions: WorkerPermission[];
}
export interface UpdateUserRequest {
	active?: boolean;
	permissions?: WorkerPermission[];
}
// El alta inicial de administradora y la entrega de credenciales deberán definirse con el backend.
