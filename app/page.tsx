'use client';
import { useState } from 'react';
import { Crown, ShieldCheck, Ticket, Trophy, Sparkles } from 'lucide-react';

export default function Home() {
  const [code, setCode] = useState(''); const [name, setName] = useState('');
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState('');
  async function redeem(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMessage('');
    try {
      const res = await fetch('/api/redeem', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ code, name }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.error || 'Nem sikerült a regisztráció.');
      setMessage(`Sikeres VIP-regisztráció! Bekerültél a ${data.weekId} heti sorsolásba.`); setCode(''); setName('');
    } catch (err) { setMessage(err instanceof Error ? err.message : 'Hiba történt.'); }
    finally { setBusy(false); }
  }
  return <main className="site-shell">
    <nav className="topbar"><a className="brand" href="#top"><Crown size={19}/> THE LUXURY <span>BARBER CLUB</span></a><a className="admin-link" href="/admin">ADMIN LOGIN</a></nav>
    <section className="hero" id="top"><div className="hero-overlay"/><div className="hero-content"><div className="eyebrow"><span/> EXCLUSIVE MEMBERS CLUB <span/></div><h1>YOUR STYLE.<br/><em>YOUR</em> CHANCE.</h1><p>A hajvágásod most többet ér. Regisztrálj egyedi VIP-kódoddal, és vegyél részt exkluzív heti nyereménysorsolásunkon.</p><a href="#join" className="gold-button">BELÉPEK A VIP KLUBBA <span>↗</span></a><div className="hero-foot"><span>PRECISION · STYLE · EXPERIENCE</span><span>EST. FOR GENTLEMEN</span></div></div></section>
    <section className="benefits"><div><Ticket/><h3>EGYEDI VIP-KÓD</h3><p>A kódot személyesen, a szalonban kapod meg.</p></div><div><Trophy/><h3>HETI NYEREMÉNYEK</h3><p>Értékes barber élmények és exkluzív ajándékok.</p></div><div><ShieldCheck/><h3>ELLENŐRZÖTT BELÉPÉS</h3><p>Minden kód egyszer használható fel.</p></div></section>
    <section className="join-section" id="join"><div className="join-copy"><div className="eyebrow">THE INNER CIRCLE</div><h2>THE VIP<br/><em>EXPERIENCE</em></h2><p>Írd be a borbélyodtól kapott kódot, add meg a neved, és máris részt veszel az aktuális heti sorsolásban.</p><div className="note"><Sparkles size={17}/> Egy látogatás = egy egyedi belépőkód.</div></div>
      <form className="vip-form" onSubmit={redeem}><div className="form-kicker">MEMBER REGISTRATION</div><h3>Csatlakozz a klubhoz</h3><label>NEVED<input value={name} onChange={e=>setName(e.target.value)} placeholder="Teljes neved" required minLength={2} maxLength={70}/></label><label>EGYEDI VIP-KÓD<input value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="LUX-XXXX-XXXX" required maxLength={20}/></label><button className="gold-button full" disabled={busy}>{busy ? 'ELLENŐRZÉS…' : 'KÓD ELLENŐRZÉSE'} <span>→</span></button>{message && <p className="form-message" role="status">{message}</p>}<small>A regisztrációval elfogadod a közzétett játékszabályzatot és adatkezelési tájékoztatót. Ezeket éles indulás előtt ki kell tölteni és közzé kell tenni.</small></form>
    </section>
    <footer><div className="brand"><Crown size={18}/> THE LUXURY <span>BARBER CLUB</span></div><span>© {new Date().getFullYear()} · ALL RIGHTS RESERVED</span><a href="/admin">ADMIN</a></footer>
  </main>;
}
