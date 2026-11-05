import type { Money, ISODateTime } from './common.js';
export interface ChatRequest {
	message: string;
	conversationId?: string;
	context?: { type: 'forecast'; forecastId: string };
}
export interface DataReference {
	type: 'sales' | 'forecast' | 'inventory';
	id: string;
	dataVersion: string;
	label: string;
}
export interface ChatTable {
	columns: { key: string; label: string }[];
	rows: Record<string, string | number | Money | null>[];
}
export type ChatResponse = {
	id: string;
	conversationId: string;
	generatedAt: ISODateTime;
} & (
	| { status: 'answered'; answer: string; references: DataReference[]; table?: ChatTable }
	| { status: 'insufficient_data' | 'out_of_scope' | 'unavailable'; message: string }
);
export interface ExportRequest {
	type: 'sales_summary' | 'forecast_summary' | 'inventory_snapshot';
	format: 'csv';
	from?: string;
	to?: string;
	dataVersion: string;
}
export interface ExportJob {
	id: string;
	state: 'pending' | 'ready' | 'failed';
	createdAt: ISODateTime;
	expiresAt: ISODateTime | null;
}
