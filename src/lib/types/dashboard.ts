import type { Permission } from './access.js';
export interface MonthlySale {
	period: string;
	revenue: number;
}
export interface SalesForecast {
	period: string;
	revenue: number;
	generatedAt: string;
}
export interface DatasetMetadata {
	source: string;
	updatedAt: string;
	demonstration: boolean;
}
export interface DashboardData {
	sales: MonthlySale[];
	forecast: SalesForecast | null;
	metadata: DatasetMetadata;
}
export interface SalesService {
	getDashboard(signal?: AbortSignal, permissions?: readonly Permission[]): Promise<DashboardData>;
}
