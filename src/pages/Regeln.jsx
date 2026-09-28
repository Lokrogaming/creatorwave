import { Link } from 'react-router-dom'

const RULES = [
  { n: '01', t: 'Respekt und persönliche Grenzen', d: 'Beleidigungen, Provokationen, Mobbing, Drohungen sowie rassistische, sexistische oder menschenfeindliche Äußerungen sind verboten – auch in Namen, Skins, Schildern, Bauwerken, Nachrichten. „War nur Spaß“ hebt Grenzen nicht auf. Keine sexuellen/gewaltverherrlichenden Inhalte.' },
  { n: '02', t: 'Fair spielen – ohne unerlaubte Vorteile', d: 'Cheatclients, X-Ray, Kill-Aura, Fly/Speed/Reach, Autoclicker, Makros, Bots verboten. Keine AFK-Umgehung. Reine Performance-/Grafikhilfen ok, wenn sie nichts versteckt zeigen. Unsichere Mods vorher im Support klären.' },
  { n: '03', t: 'Bauwerke, Gegenstände & Grundstücke', d: 'Ohne Zustimmung nichts beschädigen, verändern oder mitnehmen – auch nicht aus ungesicherten Kisten. Keine Zugänge blockieren, niemanden einzubauen. Streit rechtfertigt keine Zerstörung.' },
  { n: '04', t: 'PvP und Handel mit Einverständnis', d: 'Außerhalb markierter PvP-Bereiche nur mit Zustimmung kämpfen. Keine Fallen, Spawncamping oder gezielte Tode. Kein Betrug, keine Abzocke, kein Echtgeld-Verkauf von Items/Zugängen.' },
  { n: '05', t: 'Fehler melden statt ausnutzen', d: 'Dupes, Schutz-Umgehung und Bug-Abuse verboten. Nutzung stoppen, privat per Ticket mit Schritten melden, keine Anleitungen veröffentlichen, Vorteile nicht weitergeben.' },
  { n: '06', t: 'Serverleistung schützen', d: 'Keine Lagmaschinen, Abstürze oder Spam-Verbindungen. Farmen/Redstone so bauen, dass andere nicht leiden; ungenutzte Anlagen abschalten. Limits nicht mit Zweitaccounts umgehen.' },
  { n: '07', t: 'Chat, Werbung & Aufnahmen', d: 'Kein Spam/Flood, keine Fremdwerbung ohne Leitungs-OK, Links nur sicher & passend. Gameplay ok ohne Bloßstellung; private Chats/Calls nur mit Zustimmung aller. Kein Team-Fake.' },
  { n: '08', t: 'Privatsphäre & Konten', d: 'Keine Doxxing-Daten/Bilder ohne Einwilligung, kein Phishing, nie Passwörter teilen – Team fragt nie danach. Account schützen, keine Strafumgehung via Zweitaccount.' },
  { n: '09', t: 'Support sachlich nutzen', d: 'Ehrlich + genau: Zeitpunkt, Beteiligte, Belege. Keine Fake-Beweise, keine Massen-Doppeltickets, ein Vorgang pro Anliegen, Code nicht veröffentlichen. Antwort nach Verfügbarkeit.' },
  { n: '10', t: 'Maßnahmen & zweite Chancen', d: 'Bewertung nach Schwere & Wiederholung: Hinweis, Verwarnung, Einschränkung, Kick, Temp-Bann, Perma-Bann. Schwere Fälle direkt Bann. Bei Zweifel: Entbannungsantrag/Support sachlich nutzen.' },
]

export default function Regeln() {
  return (
    <main>
      <section className="mt-8 max-w-3xl">
        <span className="chip">FAIR PLAY STARTET MIT UNS ALLEN</span>
        <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight mt-3">
          Unsere <span className="text-cyan-300">Regeln.</span>
        </h1>
        <p className="text-slate-400 text-sm mt-3">Gelten auf Server + Community. Stand: 22. September 2026. Änderungen werden hier veröffentlicht.</p>
      </section>
      <div className="mt-8 grid lg:grid-cols-[280px_1fr] gap-6 items-start">
        <aside className="glass rounded-2xl p-6 lg:sticky lg:top-24">
          <strong className="font-display">Einfach fair bleiben.</strong>
          <p className="text-sm text-slate-400 mt-2">Hinter jedem Spielernamen steckt ein Mensch. Behandle andere so, dass sie gerne wiederkommen.</p>
          <Link to="/support" className="block mt-4 rounded-xl bg-cyan-400 text-[#06222b] text-sm font-bold px-4 py-2.5 text-center">
            Vorfall melden ↗
          </Link>
          <Link to="/appeal" className="block mt-2 rounded-xl border border-white/20 text-sm font-bold px-4 py-2.5 text-center hover:bg-white/10">
            Bann prüfen lassen ↗
          </Link>
          <img src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600&auto=format&fit=crop" className="rounded-xl mt-4 h-36 w-full object-cover ring-1 ring-white/15" alt="" loading="lazy" />
        </aside>
        <div className="grid gap-4">
          {RULES.map((r, i) => (
            <details key={r.n} open={i === 0} className={`glass rounded-2xl p-5 ${r.n === '10' ? '!border-cyan-300/40' : ''}`}>
              <summary className="flex gap-4 cursor-pointer list-none font-bold">
                <span className="font-mono text-cyan-300 text-sm pt-1">{r.n}</span>
                {r.t}
                <span className="acc-icon ml-auto text-cyan-300 text-xl">+</span>
              </summary>
              <p className="text-sm text-slate-300/80 mt-3">{r.d}</p>
            </details>
          ))}
          <div className="glass rounded-2xl p-5 text-xs text-slate-400">
            Für einzelne Spielbereiche können Zusatzregeln vor Ort gelten. Neue Vorgaben gelten ab Bekanntgabe.
          </div>
        </div>
      </div>
    </main>
  )
}
