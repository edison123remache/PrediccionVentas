import type { ISODateTime, Money } from './common.js';
export type ImportKind = 'monthly_sales' | 'inventory_snapshot';
export type ImportFormat = 'xlsx' | 'csv';
export interface ImportIssue {
	row: number | null;
	column: string | null;
	code: string;
	message: string;
	severity: 'error' | 'warning';
}
export interface SalesPreviewRow {
	row: number;
	period: string;
	revenue: Money;
}
export interface InventoryPreviewRow {
	row: number;
	productName: string;
	quantity: number;
	unit: string;
}
export interface ImportValidation {
	id: string;
	kind: ImportKind;
	format: ImportFormat;
	fileName: string;
	state: 'processing' | 'valid' | 'invalid' | 'failed' | 'expired';
	baseDataVersion: string | null;
	expiresAt: ISODateTime;
	totalRows: number;
	validRows: number;
	invalidRows: number;
	issues: ImportIssue[];
	conflicts: { key: string; message: string }[];
	preview: SalesPreviewRow[] | InventoryPreviewRow[];
	inventoryReportDate: string | null;
}
export interface ConfirmImportRequest {
	validationId: string;
	baseDataVersion: string | null;
	idempotencyKey: string;
	// No se sobrescriben conflictos automáticamente; se resuelven antes de confirmar.
}
export interface ImportRecord {
	id: string;
	kind: ImportKind;
	fileName: string;
	actor: { id: string; name: string };
	createdAt: ISODateTime;
	completedAt: ISODateTime | null;
	status: 'pending' | 'completed' | 'failed';
	acceptedRows: number;
	rejectedRows: number;
	resultingDataVersion: string | null;
	requestId: string;
}
