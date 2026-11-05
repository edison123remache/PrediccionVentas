/** Contratos propuestos. Los tipos no sustituyen la validación de JSON en ejecución. */
export type MonthlyPeriod = string; // YYYY-MM; validar en el adaptador.
export type ISODate = string; // YYYY-MM-DD.
export type ISODateTime = string; // ISO 8601 con zona horaria.
export interface Money {
	amount: string;
	currency: 'USD';
} // Decimal exacto, p. ej. "28100.00".
export interface DataProvenance {
	mode: 'demo' | 'real';
	source: string;
	dataVersion: string;
	updatedAt: ISODateTime;
	coverage: { from: string; to: string };
	importId: string | null;
}
export interface CommercialResult<T> {
	data: T;
	provenance: DataProvenance;
}
export interface PageResult<T> {
	items: T[];
	nextCursor: string | null;
}
export interface ApiError {
	code:
		| 'UNAUTHENTICATED'
		| 'FORBIDDEN'
		| 'VALIDATION_ERROR'
		| 'DATA_CONFLICT'
		| 'NOT_FOUND'
		| 'SERVICE_UNAVAILABLE'
		| 'RATE_LIMITED'
		| 'INTERNAL_ERROR';
	message: string;
	requestId: string;
	fields?: { field: string; message: string }[];
	retryAfterSeconds?: number;
}
