'use client';

import { useEffect, useMemo, useState } from 'react';

type WheelEntry = { id: string; name: string; createdAt: number };
type WheelData = { weekId: string; entries: WheelEntry[]; draw: { status?: string; winner?: { name: string } } };

const colors = ['#b18c4d', '#211b10', '#d4b878', '#302516', '#8b6b38', '#17130d'];

export default function LiveWheel() {
  const [data, setData] = useState<WheelData>({ weekId: '', entries: [], draw: { status: 'open' } });
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const response = await fetch('/api/wheel', { cache: 'no-store' });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'A szerencsekerék adatai most nem érhetők el.');
        if (active) { setData(result); setError(''); }
      } catch {
        if (active) setError('A résztvevők listája átmenetileg nem frissíthető.');
      }
    };
    refresh();
    const timer = window.setInterval(refresh, 3000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);

  const background = useMemo(() => {
    const count = Math.max(data.entries.length, 1);
    const slices = data.entries.length
      ? data.entries.map((_, i) => `${colors[i % colors.length]} ${i * 360 / count}deg ${(i + 1) * 360 / count}deg`).join(', ')
      : '#292116 0deg 360deg';
    return `conic-gradient(${slices})`;
  }, [data.entries]);

  const winner = data.draw?.winner?.name;
  return (
    <section className="live-wheel-section" aria-live="polite">
      <div className="wheel-heading">
        <div className="eyebrow">A JÁTÉK RÉSZTVEVŐI</div>
        <h2>Élő <em>szerencsekerék</em></h2>
        <p>Az új nevezők neve néhány másodpercen belül megjelenik a keréken.</p>
      </div>
      <div className="wheel-layout">
        <div className={`live-wheel ${data.draw?.status === 'drawing' ? 'spinning' : ''}`} style={{ background }}>
          <span className="wheel-pointer" aria-hidden="true">▼</span>
          {data.entries.map((entry, index) => {
            const angle = (index + 0.5) * 360 / Math.max(data.entries.length, 1);
            const fontSize = data.entries.length > 18 ? 8 : data.entries.length > 10 ? 9 : 11;
            return <span className="wheel-label" key={entry.id} style={{ transform: `translate(-50%,-50%) rotate(${angle}deg) translateY(-112px) rotate(${-angle}deg)`, fontSize }}>
              {entry.name.length > 17 ? `${entry.name.slice(0, 16)}…` : entry.name}
            </span>;
          })}
          <div className="wheel-hub"><strong>VIP</strong><small>KLUB</small></div>
        </div>
        <div className="wheel-entries">
          <div className="wheel-count"><strong>{data.entries.length}</strong><span>résztvevő ezen a héten</span></div>
          {winner ? <div className="wheel-winner">A heti nyertes: <strong>{winner}</strong></div> :
            <div className="wheel-status">{data.draw?.status === 'drawing' ? 'A sorsolás folyamatban van…' : 'A heti nevezés nyitva van.'}</div>}
          {error && <p className="error">{error}</p>}
          <ol>{data.entries.slice(-8).reverse().map((entry) => <li key={entry.id}>{entry.name}</li>)}</ol>
          <small>A lista automatikusan frissül. A sorsolást a szalon adminisztrátora indítja el.</small>
        </div>
      </div>
    </section>
  );
}
