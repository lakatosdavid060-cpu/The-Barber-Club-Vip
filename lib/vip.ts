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
  const raw = error instanceof Error ? error.message : '';
  const message = raw === 'UNAUTHORIZED'
    ? 'A művelethez be kell jelentkezned.'
    : raw === 'FORBIDDEN'
      ? 'Ehhez a művelethez nincs adminisztrátori jogosultságod.'
      : raw.includes('FIREBASE_SERVICE_ACCOUNT_JSON')
        ? 'A szerver Firebase-hitelesítése nincs beállítva a Vercelben.'
        : 'Váratlan hiba történt a szerveren. Ellenőrizd a Vercel naplóját.';
  const status = raw === 'UNAUTHORIZED' ? 401 : raw === 'FORBIDDEN' ? 403 : 500;
  return Response.json({ error: message }, { status });
}
