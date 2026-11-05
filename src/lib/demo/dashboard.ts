import type { DashboardData } from '#lib/types/dashboard.js';
// Valores inventados exclusivamente para probar la interfaz. No representan a Mundo Hogar.
export const dashboardDemo: DashboardData = {
	metadata: {
		source: 'Conjunto de ejemplo para desarrollo',
		updatedAt: '2026-01-05',
		demonstration: true
	},
	sales: [
		{ period: '2025-01', revenue: 16700 },
		{ period: '2025-02', revenue: 18100 },
		{ period: '2025-03', revenue: 17400 },
		{ period: '2025-04', revenue: 19800 },
		{ period: '2025-05', revenue: 22300 },
		{ period: '2025-06', revenue: 20500 },
		{ period: '2025-07', revenue: 18200 },
		{ period: '2025-08', revenue: 20150 },
		{ period: '2025-09', revenue: 19400 },
		{ period: '2025-10', revenue: 22750 },
		{ period: '2025-11', revenue: 24500 },
		{ period: '2025-12', revenue: 28100 }
	],
	forecast: { period: '2026-01', revenue: 26300, generatedAt: '2026-01-05' }
};
