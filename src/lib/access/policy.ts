import type { AppAccess, Permission, Role } from '#lib/types/access.js';
export const roleLabels: Record<Role, string> = {
	administrator: 'Administradora',
	worker: 'Trabajador'
};
export const can = (access: AppAccess, permission: Permission): boolean =>
	access.mode === 'demo' && access.user.active && access.user.permissions.includes(permission);
export interface NavigationItem {
	href: string;
	label: string;
	permission: Permission;
	group: 'commercial' | 'administration';
	description: string;
	phase: string;
}
export const navigation: NavigationItem[] = [
	{
		href: '/',
		label: 'Inicio',
		permission: 'dashboard:read',
		group: 'commercial',
		description: 'Resumen comercial adaptado al perfil.',
		phase: 'Disponible en demostración'
	},
	{
		href: '/ventas',
		label: 'Ventas históricas',
		permission: 'sales:read',
		group: 'commercial',
		description: 'Filtros por período, tabla y evolución mensual de ingresos.',
		phase: 'Fase 2 · Consultas comerciales'
	},
	{
		href: '/predicciones',
		label: 'Predicciones',
		permission: 'forecasts:read',
		group: 'commercial',
		description:
			'Ingresos totales estimados para el siguiente mes, fecha de generación y versión de datos.',
		phase: 'Fase 2 · Consultas comerciales'
	},
	{
		href: '/inventario',
		label: 'Inventario',
		permission: 'inventory:read',
		group: 'commercial',
		description:
			'Consulta de existencias del último reporte, con su fecha y búsqueda por producto.',
		phase: 'Fase 2 · Consultas comerciales'
	},
	{
		href: '/asistente',
		label: 'Asistente',
		permission: 'chat:use',
		group: 'commercial',
		description:
			'Preguntas comerciales limitadas a las fuentes autorizadas. Sin respuestas inventadas.',
		phase: 'Fase 5 · Asistente y exportaciones'
	},
	{
		href: '/reportes',
		label: 'Reportes',
		permission: 'reports:export',
		group: 'commercial',
		description: 'Descarga de resúmenes comerciales autorizados, con filtros y procedencia.',
		phase: 'Fase 5 · Asistente y exportaciones'
	},
	{
		href: '/administracion/usuarios',
		label: 'Usuarios y permisos',
		permission: 'users:manage',
		group: 'administration',
		description: 'Creación y desactivación de usuarios; permisos de consulta por módulo.',
		phase: 'Fase 4 · Administración'
	},
	{
		href: '/administracion/datos',
		label: 'Actualización de datos',
		permission: 'data:manage',
		group: 'administration',
		description:
			'Carga de Excel o CSV, validación, vista previa y confirmación. Ventas e inventario se importarán por separado.',
		phase: 'Fase 4 · Administración'
	},
	{
		href: '/administracion/importaciones',
		label: 'Historial de importaciones',
		permission: 'imports:read',
		group: 'administration',
		description:
			'Registro de responsable, archivo, fecha, incidencias y resultado de cada importación.',
		phase: 'Fase 4 · Administración'
	}
];
