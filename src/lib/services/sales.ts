import { dashboardDemo } from '#lib/demo/dashboard.js';
import type { SalesService } from '#lib/types/dashboard.js';
// Sustituir esta implementación por una API validada cuando exista el backend.
export const salesService: SalesService = {
	async getDashboard(signal) {
		signal?.throwIfAborted();
		return structuredClone(dashboardDemo);
	}
};
