import { createHash, randomBytes } from 'node:crypto';
export const BRAND = 'THE LUXURY BARBER CLUB';
export function hashCode(code: string) { return createHash('sha256').update(code.trim().toUpperCase()).digest('hex'); }
export function makeCode() {
  const raw = randomBytes(5).toString('hex').toUpperCase();
  return `LUX-${raw.slice(0,4)}-${raw.slice(4,8)}`;
}
export function currentWeekId(date = new Date()) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7; d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}
export function jsonError(error: unknown) {
  const message = error instanceof Error ? error.message : 'SERVER_ERROR';
  const status = message === 'UNAUTHORIZED' ? 401 : message === 'FORBIDDEN' ? 403 : 500;
  return Response.json({ error: message }, { status });
}
