'use client';
import { useState } from 'react';
import { Crown, ShieldCheck, Ticket, Trophy, Sparkles, Scissors, UserCheck } from 'lucide-react';
import LiveWheel from '@/app/components/live-wheel';

export default function Home() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  async function redeem(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/redeem', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, name, consent }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Nem sikerült a nevezés.');
      setMessage(`Sikeres nevezés! A neved megjelent a ${result.weekId} heti szerencsekeréken.`);
      setMessageType('success'); setCode(''); setName(''); setConsent(false);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Hiba történt. Kérd a fodrászod segítségét.');
      setMessageType('error');
    } finally { setBusy(false); }
  }

  return <main className="site-shell">
    <nav className="topbar"><a className="brand" href="#top"><Crown size={19}/> THE LUXURY <span>BARBER CLUB</span></a><a className="admin-link" href="/admin">ADMINISZTRÁTORI BELÉPÉS</a></nav>
    <section className="hero" id="top"><div className="hero-overlay"/><div className="hero-content">
      <div className="eyebrow"><span/> EXKLUZÍV VIP KLUB <span/></div>
      <h1>A STÍLUSOD.<br/><em>A TE</em> ESÉLYED.</h1>
      <p>A hajvágásod után egy különleges élmény is várhat rád. Kérj egyedi VIP-belépőkódot a fodrászodtól, nevezd be a neved, és kerülj fel a heti szerencsekerékre!</p>
      <a href="#join" className="gold-button">RÉSZT VESZEK A JÁTÉKBAN <span>↗</span></a>
      <div className="hero-foot"><span>PONTOSSÁG · STÍLUS · ÉLMÉNY</span><span>IGAZI URAKNAK</span></div>
    </div></section>
    <section className="benefits">
      <div><Ticket/><h3>EGYEDI VIP-KÓD</h3><p>A fodrászod a hajvágás végén adja át a személyes belépőkódodat.</p></div>
      <div><Trophy/><h3>HETI NYEREMÉNYEK</h3><p>Minden érvényes nevező neve felkerül az aktuális heti szerencsekerékre.</p></div>
      <div><ShieldCheck/><h3>EGYSZERI FELHASZNÁLÁS</h3><p>Egy belépőkód egyszer használható fel, így minden nevezés ellenőrzött.</p></div>
    </section>
    <section className="how-to-play">
      <div className="eyebrow">A JÁTÉK MENETE</div><h2>Három egyszerű <em>lépés</em></h2>
      <div className="steps">
        <article><span>01</span><Scissors/><h3>VÉGE A HAJVÁGÁSNAK</h3><p>Amikor elkészült a hajvágásod, jelezd a fodrászodnak, hogy szeretnél részt venni a VIP-nyereményjátékban.</p></article>
        <article><span>02</span><Ticket/><h3>KÉRD A VIP-KÓDOT</h3><p>A fodrászod létrehoz vagy átad neked egy egyszer használható VIP-belépőkódot. Nyisd meg az oldalt, írd be a neved és a kódot.</p></article>
        <article><span>03</span><UserCheck/><h3>KERÜLJ FEL A KERÉKRE</h3><p>Sikeres nevezés után a neved megjelenik az élő szerencsekeréken. Kövesd az oldalon, majd várd a heti sorsolást!</p></article>
      </div>
    </section>
    <section className="join-section" id="join">
      <div className="join-copy"><div className="eyebrow">CSATLAKOZZ A KLUBHOZ</div><h2>A VIP<br/><em>ÉLMÉNY</em></h2>
        <p>Elkészült a hajvágásod? Szólj a fodrászodnak, hogy szeretnél játszani! Kérd el az egyedi kódodat, majd add meg itt a neveddel együtt.</p>
        <div className="note"><Sparkles size={17}/> Egy érvényes VIP-kód egy nevezésre jogosít.</div>
      </div>
      <form className="vip-form" onSubmit={redeem}>
        <div className="form-kicker">VIP NEVEZÉS</div><h3>Kerülj fel a szerencsekerékre!</h3>
        <label>NEVED<input value={name} onChange={event => setName(event.target.value)} placeholder="Írd be a teljes neved" required minLength={2} maxLength={70}/></label>
        <label>VIP-BELÉPŐKÓD<input value={code} onChange={event => setCode(event.target.value.toUpperCase())} placeholder="LUX-XXXX-XXXX" required maxLength={20}/></label>
        <label className="consent-label"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} required/><span>Tudomásul veszem, hogy a nevem a heti szerencsekeréken és a résztvevők listájában megjelenik, és elfogadom a játékszabályzatot.</span></label>
        <button className="gold-button full" disabled={busy || !consent}>{busy ? 'KÓD ELLENŐRZÉSE…' : 'NEVEZÉS A JÁTÉKBA'} <span>→</span></button>
        {message && <p className={messageType === 'success' ? 'form-message' : 'error'} role="status">{message}</p>}
        <small>A neved a heti játék résztvevői számára látható. Csak akkor nevezz, ha ezt elfogadod. A részletes adatkezelési és játékszabályzatot a szalon végleges adataival kell közzétenni az indulás előtt.</small>
      </form>
    </section>
    <LiveWheel/>
    <footer><div className="brand"><Crown size={18}/> THE LUXURY <span>BARBER CLUB</span></div><span>© {new Date().getFullYear()} · MINDEN JOG FENNTARTVA</span><a href="/admin">ADMINISZTRÁTOR</a></footer>
  </main>;
}
