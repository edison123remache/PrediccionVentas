import { dashboardDemo } from '#lib/demo/dashboard.js';
import type { SalesService } from '#lib/types/dashboard.js';
// Sustituir esta implementación por una API validada cuando exista el backend.
export const salesService: SalesService = {
	async getDashboard(signal, permissions = []) {
		signal?.throwIfAborted();
		const result = structuredClone(dashboardDemo);
		if (!permissions.includes('sales:read')) result.sales = [];
		if (!permissions.includes('forecasts:read')) result.forecast = null;
		return result;
	}
};
