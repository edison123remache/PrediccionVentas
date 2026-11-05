/** Puertos para FastAPI: solo contratos, todavía no hay implementaciones conectadas. */
import type { SessionUser } from '#lib/types/access.js';
import type {
	AuthenticatedSession,
	LoginRequest,
	CreateUserRequest,
	UpdateUserRequest
} from '#lib/types/api/auth.js';
import type { CommercialResult, PageResult } from '#lib/types/api/common.js';
import type {
	MonthlySaleRecord,
	SalesFilters,
	ForecastRecord,
	InventorySnapshot,
	InventoryItem,
	DataStatus
} from '#lib/types/api/commercial.js';
import type {
	ImportKind,
	ImportValidation,
	ConfirmImportRequest,
	ImportRecord
} from '#lib/types/api/imports.js';
import type {
	ChatRequest,
	ChatResponse,
	ExportRequest,
	ExportJob
} from '#lib/types/api/assistant.js';
export interface AuthService {
	login(input: LoginRequest): Promise<AuthenticatedSession>;
	session(): Promise<AuthenticatedSession | null>;
	logout(): Promise<void>;
}
export interface UsersService {
	list(cursor?: string): Promise<PageResult<SessionUser>>;
	create(input: CreateUserRequest): Promise<SessionUser>;
	update(id: string, input: UpdateUserRequest): Promise<SessionUser>;
}
export interface SalesApiService {
	list(
		filters: SalesFilters,
		signal?: AbortSignal
	): Promise<CommercialResult<PageResult<MonthlySaleRecord>>>;
}
export interface ForecastService {
	get(id: string, signal?: AbortSignal): Promise<CommercialResult<ForecastRecord>>;
}
export interface InventoryService {
	latest(signal?: AbortSignal): Promise<CommercialResult<InventorySnapshot>>;
	items(
		snapshotId: string,
		search?: string,
		cursor?: string,
		signal?: AbortSignal
	): Promise<PageResult<InventoryItem>>;
}
export interface ImportsService {
	validate(file: File, kind: ImportKind, reportDate?: string): Promise<ImportValidation>;
	validation(id: string): Promise<ImportValidation>;
	confirm(input: ConfirmImportRequest): Promise<ImportRecord>;
	history(cursor?: string): Promise<PageResult<ImportRecord>>;
	status(): Promise<DataStatus>;
}
export interface ChatService {
	send(input: ChatRequest, signal?: AbortSignal): Promise<ChatResponse>;
}
export interface ReportsService {
	create(input: ExportRequest): Promise<ExportJob>;
	status(id: string): Promise<ExportJob>;
	download(id: string): Promise<Blob>;
}
