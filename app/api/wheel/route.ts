import { adminDb } from '@/lib/firebase-admin';
import { currentWeekId } from '@/lib/vip';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const weekId = currentWeekId();
    const snapshot = await adminDb().ref(`luxuryVip/weeks/${weekId}`).get();
    const week = snapshot.val() || {};
    const entries = Object.entries(week.entries || {}).map(([id, value]: [string, any]) => ({
      id,
      name: String(value.name || 'Névtelen résztvevő'),
      createdAt: Number(value.createdAt || 0),
    }));
    return Response.json(
      { weekId, entries, draw: week.draw || { status: 'open' } },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } },
    );
  } catch {
    return Response.json({ error: 'A szerencsekerék jelenleg nem érhető el.' }, { status: 503 });
  }
}
