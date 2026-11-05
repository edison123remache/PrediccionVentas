import type { Money, MonthlyPeriod, ISODate, ISODateTime } from './common.js';
export interface SalesFilters {
	from?: MonthlyPeriod;
	to?: MonthlyPeriod;
	cursor?: string;
	limit?: number;
}
export interface MonthlySaleRecord {
	id: string;
	period: MonthlyPeriod;
	revenue: Money;
}
export interface ForecastRecord {
	id: string;
	target: 'total_monthly_revenue';
	horizonMonths: 1;
	period: MonthlyPeriod;
	revenue: Money;
	generatedAt: ISODateTime;
	dataVersion: string;
	modelVersion: string;
	freshness: 'current' | 'outdated';
	interval?: { lower: Money; upper: Money; coverage: number };
	evaluation?: {
		metric: string;
		value: number;
		unit: string;
		from: MonthlyPeriod;
		to: MonthlyPeriod;
		calculatedAt: ISODateTime;
	}[];
}
export interface InventoryItem {
	id: string;
	name: string;
	quantity: number;
	unit: string;
}
export interface InventorySnapshot {
	id: string;
	reportDate: ISODate;
	dataVersion: string;
}
export interface DataStatus {
	sales: {
		dataVersion: string | null;
		updatedAt: ISODateTime | null;
		missingPeriods: MonthlyPeriod[];
	};
	inventory: { latestReportDate: ISODate | null; updatedAt: ISODateTime | null };
	forecast: {
		status: 'not_available' | 'pending' | 'current' | 'outdated' | 'failed';
		forecastId: string | null;
		basedOnDataVersion: string | null;
	};
}
