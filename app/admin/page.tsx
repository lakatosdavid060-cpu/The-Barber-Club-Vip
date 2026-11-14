'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User, type Auth } from 'firebase/auth';
import { Crown, LogOut, Ticket, Users, Trophy, RefreshCw, Copy, Play } from 'lucide-react';
import { getFirebaseAuth } from '@/lib/firebase-client';
import LiveWheel from '@/app/components/live-wheel';

type Stats = { guests: number; unusedCodes: number; usedCodes: number; weekId: string; entries: number; draw: { status?: string; winner?: { name: string; createdAt: number } } | null };

export default function AdminPage() {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState('luxurybarber@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [codes, setCodes] = useState('');
  const [count, setCount] = useState(1);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [drawWinner, setDrawWinner] = useState('');

  useEffect(() => {
    try {
      const clientAuth = getFirebaseAuth();
      setAuth(clientAuth);
      return onAuthStateChanged(clientAuth, (currentUser) => { setUser(currentUser); setReady(true); });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'A Firebase nem indítható el.');
      setReady(true);
    }
  }, []);

  async function token() {
    if (!user) throw new Error('Először jelentkezz be.');
    return user.getIdToken();
  }
  async function api(url: string, body?: unknown) {
    const idToken = await token();
    const response = await fetch(url, {
      method: body !== undefined ? 'POST' : 'GET',
      headers: { Authorization: `Bearer ${idToken}`, 'Content-Type': 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Hiba történt a kérés feldolgozásakor.');
    return result;
  }
  async function load() {
    try { const result = await api('/api/admin/stats'); setStats(result); }
    catch (err) { setError(err instanceof Error ? err.message : 'Nem sikerült betölteni az adatokat.'); }
  }
  useEffect(() => { if (user) { load(); const timer = window.setInterval(load, 10000); return () => window.clearInterval(timer); } }, [user]);
  async function login(event: React.FormEvent) {
    event.preventDefault(); setError('');
    if (!auth) { setError('A Firebase még nem áll készen. Ellenőrizd a beállításokat.'); return; }
    try { await signInWithEmailAndPassword(auth, email.trim(), password); }
    catch { setError('Sikertelen belépés. Ellenőrizd az email-címet és a jelszót, valamint a Firebase beállításait.'); }
  }
  async function generate() {
    setBusy(true); setError(''); setNotice('');
    try { const result = await api('/api/admin/codes', { count }); setCodes(result.codes.join('\n')); setNotice(`${result.codes.length} új belépőkód elkészült.`); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Nem sikerült kódot létrehozni.'); }
    finally { setBusy(false); }
  }
  async function draw() {
    if (!window.confirm('Biztosan elindítod az aktuális heti sorsolást? A heti nevezés ezután lezárul.')) return;
    setBusy(true); setSpinning(true); setDrawWinner(''); setError('');
    try {
      const [result] = await Promise.all([api('/api/admin/draw', {}), new Promise(resolve => window.setTimeout(resolve, 4200))]);
      setDrawWinner(result.winner.name); setNotice(`A heti nyertes: ${result.winner.name}`); await load();
    } catch (err) { setError(err instanceof Error ? err.message : 'Nem sikerült a sorsolás.'); }
    finally { setSpinning(false); setBusy(false); }
  }

  if (!ready) return <main className="admin-wrap"><p>Betöltés…</p></main>;
  if (!user) return <main className="admin-wrap"><form className="login-card" onSubmit={login}>
    <div className="brand"><Crown/> THE LUXURY <span>KEZELŐ</span></div>
    <div className="eyebrow">ADMINISZTRÁTORI BELÉPÉS</div><h1>Belépés</h1>
    <label>EMAIL-CÍM<input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="username"/></label>
    <label>JELSZÓ<input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password"/></label>
    <button className="gold-button full" disabled={!auth}>BELÉPÉS →</button>
    {error && <p className="error">{error}</p>}
  </form></main>;

  return <main className="admin-wrap">
    <header className="admin-header"><div className="brand"><Crown/> THE LUXURY <span>KEZELŐ</span></div><button className="subtle-button" onClick={() => auth && signOut(auth)}><LogOut size={16}/> Kijelentkezés</button></header>
    <div className="admin-title"><div><div className="eyebrow">VEZÉRLŐPULT</div><h1>VIP kezelőfelület</h1><p>Bejelentkezve: {user.email}</p></div><button className="subtle-button" onClick={load}><RefreshCw size={16}/> Frissítés</button></div>
    {error && <p className="error">{error}</p>}{notice && <p className="success">{notice}</p>}
    <div className="stat-grid">
      <div className="stat-card"><Users/><span>Vendégek összesen</span><strong>{stats?.guests ?? '—'}</strong></div>
      <div className="stat-card"><Ticket/><span>Fel nem használt kódok</span><strong>{stats?.unusedCodes ?? '—'}</strong></div>
      <div className="stat-card"><Trophy/><span>E heti nevezők</span><strong>{stats?.entries ?? '—'}</strong></div>
    </div>
    <section className="admin-panel"><div><div className="eyebrow">BELÉPŐKÓDOK</div><h2>Új VIP-belépőkódok</h2><p>Hozz létre egyszer használható kódot annak a vendégnek, aki a hajvágás után részt szeretne venni a játékban.</p></div>
      <div className="generator-controls"><label>DARABSZÁM<input type="number" min="1" max="50" value={count} onChange={event => setCount(Math.max(1, Math.min(50, Number(event.target.value))))}/></label><button className="gold-button" disabled={busy} onClick={generate}>KÓDOK LÉTREHOZÁSA +</button></div>
      {codes && <div className="generated"><pre>{codes}</pre><button className="subtle-button" onClick={() => navigator.clipboard.writeText(codes)}><Copy size={16}/> Másolás</button></div>}
    </section>
    <section className="admin-panel draw-panel"><div><div className="eyebrow">HETI JÁTÉK · {stats?.weekId || '—'}</div><h2>Heti sorsolás</h2><p>{stats?.draw?.status === 'completed' ? 'Az e heti sorsolás már lezárult.' : 'A sorsolás lezárja az e heti nevezést, majd véletlenszerűen kiválaszt egy nyertest.'}</p>
      {stats?.draw?.winner && <div className="winner"><Trophy/> Heti nyertes: <strong>{stats.draw.winner.name}</strong></div>}
      {drawWinner && <div className="winner"><Trophy/> KISORSOLT NYERTES: <strong>{drawWinner}</strong></div>}
    </div><div className="draw-action"><div className={`draw-wheel ${spinning ? 'spinning' : ''}`}><span>VIP</span><small>SORSOLÁS</small></div><button className="gold-button" disabled={busy || !stats?.entries || stats?.draw?.status === 'completed'} onClick={draw}><Play size={17}/> {busy ? 'SORSOLÁS…' : 'SZERENCSEKERÉK INDÍTÁSA'}</button></div></section>
    <LiveWheel/>
    <p className="admin-foot">A nyertes kiválasztása a szerveren történik. A lezárt heti játékba új nevezés már nem adható hozzá.</p>
  </main>;
}
