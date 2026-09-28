import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCopy } from '../lib/hooks.jsx'

const COMMANDS = [
  { cmd: '/cmi spawn', desc: 'Zurück zum Spawn.' },
  { cmd: '/cmi sethome zuhause', desc: 'Speichert Standort als Home.' },
  { cmd: '/cmi home zuhause', desc: 'Teleport zum Home.' },
  { cmd: '/cmi homes · /cmi delhome', desc: 'Homes zeigen / löschen.', copy: '/cmi homes' },
  { cmd: '/cmi tpa Spielername', desc: 'Teleport-Anfrage senden.' },
  { cmd: '/cmi tpaccept · /cmi tpdeny', desc: 'Anfrage annehmen / ablehnen.', copy: '/cmi tpaccept' },
  { cmd: '/cmi msg · /cmi reply', desc: 'Private Nachricht / antworten.', copy: '/cmi msg Spielername Nachricht' },
  { cmd: '/cmi balance · /cmi pay', desc: 'Kontostand / überweisen.', copy: '/cmi balance' },
  { cmd: '/skills · /stats · /sk help', desc: 'AuraSkills öffnen / Werte / Hilfe.', copy: '/skills' },
]

export default function Faq() {
  const copy = useCopy()
  const [q, setQ] = useState('')
  const match = (t) => !q || t.toLowerCase().includes(q.toLowerCase())

  return (
    <main>
      <section className="mt-8 grid lg:grid-cols-[1fr_.8fr] gap-6 items-stretch">
        <div>
          <span className="chip">DEIN KOMPASS FÜR DIE ERSTEN BLÖCKE</span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight mt-3">
            FAQ & <span className="text-cyan-300">Commands.</span>
          </h1>
          <div className="flex flex-wrap gap-2 mt-5 text-xs font-bold">
            {['Ankommen', 'Commands', 'Skills & Voice', 'Website & Hilfe'].map((t, i) => (
              <a key={t} href={['#start', '#commands', '#extras', '#hilfe'][i]} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 hover:border-cyan-300/50">
                {t}
              </a>
            ))}
          </div>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="FAQ durchsuchen … (z.B. home, grab, ticket)" className="mt-5 w-full max-w-md bg-black/30 border border-white/15 rounded-xl px-4 py-3 text-sm" />
        </div>
        <div className="rounded-3xl overflow-hidden glass relative min-h-[260px]">
          <img src="https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060d18] to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 glass rounded-xl p-4 text-sm">
            <b>Chat öffnen mit T</b> → Befehl mit / eingeben → <b>Tab</b> für Autovervollständigung.
          </div>
        </div>
      </section>

      <section id="start" className="mt-10">
        <h2 className="font-display font-bold text-2xl">Ankommen & Spielen</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {match('beitritt java creatorwave.de regeln') && (
            <div className="glass rounded-2xl p-5">
              <b>Wie trete ich bei?</b>
              <p className="text-sm text-slate-400 mt-2">
                Java 1.21.11 → Mehrspieler → Hinzufügen → <code className="text-cyan-200 font-mono">creatorwave.de</code>. Vorher{' '}
                <Link to="/regeln" className="text-cyan-300">Regeln</Link> lesen. Bei Fehlern Version + Meldung an Support.
              </p>
            </div>
          )}
          {match('zuerst spawn hallo materialien bauplatz') && (
            <div className="glass rounded-2xl p-5">
              <b>Was mache ich zuerst?</b>
              <p className="text-sm text-slate-400 mt-2">Spawn anschauen, Hallo sagen, Materialien sammeln, freien Bauplatz suchen. Abstand zu fremden Builds, Absprachen einhalten.</p>
            </div>
          )}
          {match('griefing pvp cheats x-ray') && (
            <div className="glass rounded-2xl p-5">
              <b>Griefing / PvP erlaubt?</b>
              <p className="text-sm text-slate-400 mt-2">Nein – fremde Sachen tabu, PvP nur mit Zustimmung außerhalb PvP-Zonen. Cheats/X-Ray/Bug-Abuse verboten. Schäden mit Ort+Zeit im Support melden.</p>
            </div>
          )}
        </div>
      </section>

      <section id="commands" className="mt-10">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-display font-bold text-2xl">Die wichtigsten Commands</h2>
          <span className="text-xs text-slate-500">Klick zum Kopieren</span>
        </div>
        <div className="glass rounded-2xl overflow-hidden mt-4 overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-[11px] tracking-widest text-slate-400 border-b border-white/10">
                <th className="p-4">COMMAND</th>
                <th className="p-4">WAS PASSIERT?</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {COMMANDS.filter((c) => match(c.cmd + c.desc)).map((c) => (
                <tr key={c.cmd}>
                  <td className="p-4 font-mono text-cyan-200">{c.cmd}</td>
                  <td className="p-4 text-slate-300">{c.desc}</td>
                  <td className="p-4">
                    <button onClick={() => copy(c.copy || c.cmd.split('·')[0].trim())} className="text-xs border border-white/15 rounded-lg px-3 py-1.5 hover:border-cyan-300/50">
                      Kopieren
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="glass rounded-2xl p-5 text-sm text-slate-300">
            <b>Warum /cmi davor?</b>
            <br />
            <span className="text-slate-400">Eindeutige CMI-Schreibweise. Kurzformen wie /home funktionieren oft, /cmi verhindert Verwechslungen. Rechte/Cooldowns hängen von Rang & Config ab.</span>
          </div>
          <div className="glass rounded-2xl p-5 text-sm text-slate-300">
            <b>Command geht nicht?</b>
            <br />
            <span className="text-slate-400">Schreibweise prüfen, stehen bleiben bei Teleport-Wartezeit, „Keine Berechtigung“ = Rang/Bereich. Befehl + Fehlermeldung in Support (keine Passwörter).</span>
          </div>
        </div>
      </section>

      <section id="extras" className="mt-10">
        <h2 className="font-display font-bold text-2xl">Skills, Gräber & Voice</h2>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <details open className="glass rounded-2xl p-5">
            <summary className="font-bold cursor-pointer list-none">Wie funktionieren Fähigkeiten? <span className="text-cyan-300">+</span></summary>
            <p className="text-sm text-slate-400 mt-2">AuraSkills belohnt Abbauen, Holzfällen, Farmen. <code className="font-mono text-cyan-200">/skills</code> Fortschritt, <code className="font-mono text-cyan-200">/stats</code> Werte. Boni & Speed = Serverconfig.</p>
          </details>
          <details className="glass rounded-2xl p-5">
            <summary className="font-bold cursor-pointer list-none">Was bei Tod mit Items? <span className="text-cyan-300">+</span></summary>
            <p className="text-sm text-slate-400 mt-2">AxGraves kann ein Grab erzeugen – Chatmeldung beachten. Ob/wie lange hängt von Einstellungen & Todesursache ab. Nicht darauf verlassen!</p>
          </details>
          <details className="glass rounded-2xl p-5">
            <summary className="font-bold cursor-pointer list-none">Timber & VeinMiner? <span className="text-cyan-300">+</span></summary>
            <p className="text-sm text-slate-400 mt-2">Erleichtern Abbau zusammenhängender Blöcke – nur an eigenen Ressourcen testen. Kein Abbau fremder Bauwerke!</p>
          </details>
          <details className="glass rounded-2xl p-5">
            <summary className="font-bold cursor-pointer list-none">Sprachchat nutzen? <span className="text-cyan-300">+</span></summary>
            <p className="text-sm text-slate-400 mt-2">Simple Voice Chat braucht Client-Mod für deine Version. Im Spiel mit <b>V</b> Menü öffnen, Mikro + Taste einrichten. Private Gespräche nur mit Zustimmung posten.</p>
          </details>
        </div>
      </section>

      <section id="hilfe" className="mt-10">
        <h2 className="font-display font-bold text-2xl">Website & Hilfe</h2>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="glass rounded-2xl p-5 text-sm">
            <b>Wie funktioniert News?</b>
            <p className="text-slate-400 mt-1">Team postet Bilder/News auf <Link to="/news" className="text-cyan-300">/news</Link>. Kommentieren mit Minecraft-Namen (nicht verifiziert), Freigabe nötig, Löschcode sichern. Ungeprüfte löschen sich nach 7 Tagen.</p>
          </div>
          <div className="glass rounded-2xl p-5 text-sm">
            <b>Wie bekomme ich Hilfe?</b>
            <p className="text-slate-400 mt-1"><Link to="/support" className="text-cyan-300">Support</Link> → Ticket → Code sichern → „Mein Ticket öffnen“ für Antworten. Code nicht teilen!</p>
          </div>
          <div className="glass rounded-2xl p-5 text-sm">
            <b>Entbannungsantrag?</b>
            <p className="text-slate-400 mt-1"><Link to="/appeal" className="text-cyan-300">Entbannung</Link> mit Name + Bann-ID + ehrlicher Erklärung. Statuscode sichern. Hebt Bann nicht automatisch auf.</p>
          </div>
          <div className="glass rounded-2xl p-5 text-sm">
            <b>Account nötig? Status offline?</b>
            <p className="text-slate-400 mt-1">Kein Website-Account nötig (Team-Login nur für Team, nie MS-Passwort eingeben). „Nicht verfügbar“ = Abruf-Fehler, kein sicherer Offline-Beweis – im Spiel testen.</p>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-4">
          Stand: 22. September 2026 · Noch offen? <Link to="/support" className="text-cyan-300 font-bold">Frag unser Team im Support.</Link>
        </p>
      </section>
    </main>
  )
}
