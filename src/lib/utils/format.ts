export const money = (value: number) =>
	new Intl.NumberFormat('es-EC', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0
	}).format(value);
export const month = (period: string, short = false) =>
	new Intl.DateTimeFormat('es-EC', {
		month: short ? 'short' : 'long',
		year: 'numeric',
		timeZone: 'UTC'
	}).format(new Date(`${period}-01T12:00:00Z`));
export const date = (value: string) =>
	new Intl.DateTimeFormat('es-EC', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC'
	}).format(new Date(`${value}T12:00:00Z`));
export function variation(current: number, previous: number): number | null {
	return previous === 0 ? null : ((current - previous) / previous) * 100;
}
export function consecutive(previous: string, current: string): boolean {
	const [y, m] = previous.split('-').map(Number);
	const [ny, nm] = current.split('-').map(Number);
	return ny * 12 + nm === y * 12 + m + 1;
}
