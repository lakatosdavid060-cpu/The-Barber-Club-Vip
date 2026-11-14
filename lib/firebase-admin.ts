import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';

function getAdminApp() {
  if (getApps().length) return getApps()[0];
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_JSON');
  const serviceAccount = JSON.parse(raw);
  if (serviceAccount.private_key) serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  return initializeApp({ credential: cert(serviceAccount), databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL });
}

export function adminAuth() { return getAuth(getAdminApp()); }
export function adminDb() { return getDatabase(getAdminApp()); }

export async function requireAdmin(request: Request) {
  const header = request.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) throw new Error('UNAUTHORIZED');
  const decoded = await adminAuth().verifyIdToken(token);
  const email = (decoded.email || '').toLowerCase();
  const allowed = (process.env.ADMIN_EMAILS || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
  if (!decoded.email_verified || !allowed.includes(email)) throw new Error('FORBIDDEN');
  return { uid: decoded.uid, email };
}
