import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DISCORD_URL, SERVER_IP } from '../data/content.js'
import { copyServerIp, createTicket, useCopy, useServerStatus, useToast } from '../lib/hooks.jsx'
import Modal from '../components/Modal.jsx'

function StatusLine({ status }) {
  return (
    <span className="inline-flex items-center gap-2 text-[13px] text-slate-400">
      {status.state === 'online' ? (
        <>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-slate-200 font-medium">Online</span>
          <span className="text-slate-600">·</span>
          <span>{status.online} Spieler</span>
        </>
      ) : status.state === 'offline' ? (
        <>
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>Status gerade nicht abrufbar</span>
        </>
      ) : (
        <span>Status wird geladen …</span>
      )}
    </span>
  )
}

function TicketQuickDialog({ open, onClose }) {
  const toast = useToast()
  const [receipt, setReceipt] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    if (fd.get('website')) return
    const t = createTicket({ name: fd.get('name'), category: fd.get('category'), subject: fd.get('subject'), message: fd.get('message') })
    setReceipt(t.code)
    toast(`Ticket erstellt: ${t.code}`)
    e.target.reset()
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="glass-strong !rounded-2xl p-6 sm:p-7 text-slate-200">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-xl text-white">Neues Ticket</h3>
            <p className="text-sm text-slate-500 mt-1">Volles Formular auf der Support-Seite.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-white/10 text-slate-400 hover:text-white">
            ×
          </button>
        </div>
        <form onSubmit={submit} className="mt-5 grid gap-3">
          <label className="text-xs font-semibold text-slate-400">
            Minecraft-Name
            <input name="name" required pattern="[A-Za-z0-9_]{1,16}" maxLength={16} placeholder="Dein Spielername" className="mt-1.5 w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-200" />
          </label>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="text-xs font-semibold text-slate-400">
              Kategorie
              <select name="category" className="mt-1.5 w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-200">
                <option value="question">Allgemeine Frage</option>
                <option value="technical">Technisches Problem</option>
                <option value="report">Spieler / Vorfall melden</option>
                <option value="other">Sonstiges</option>
              </select>
            </label>
            <label className="text-xs font-semibold text-slate-400">
              Betreff
              <input name="subject" required minLength={5} maxLength={100} placeholder="Worum geht es?" className="mt-1.5 w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-200" />
            </label>
          </div>
          <label className="text-xs font-semibold text-slate-400">
            Nachricht
            <textarea name="message" required minLength={20} maxLength={3000} rows={4} placeholder="Zeitpunkt, Fehlermeldung, Schritte davor …" className="mt-1.5 w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-200" />
          </label>
          <label className="hidden">
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
          <button className="rounded-xl bg-cyan-300 text-[#06222b] font-semibold py-3 text-sm hover:brightness-110">Ticket absenden</button>
        </form>
        {receipt && (
          <div className="mt-4 rounded-xl border border-cyan-300/20 bg-cyan-300/[.06] p-4 text-sm">
            Ticket erstellt. Dein Code: <code className="bg-black/40 px-2 py-1 rounded font-mono">{receipt}</code>
          </div>
        )}
        <p className="text-xs text-slate-600 mt-3">
          Demo-Modus: speichert lokal.{' '}
          <Link to="/support" onClick={onClose} className="text-cyan-300">
            Zur Support-Seite →
          </Link>
        </p>
      </div>
    </Modal>
  )
}

const PREVIEW_POSTS = [
  { img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop', tag: 'Update', date: '22. Sep 2026', title: 'Spawn-Update: Neue Wege & Deko', text: 'Der Spawn hat neue Wege, Laternen und Infotafeln bekommen – perfekt für deinen ersten Moment.' },
  { img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop', tag: 'Community', date: '14. Sep 2026', title: 'Brücke über den Fluss – Gemeinschaftsprojekt', text: 'Vom ersten Block zum Großprojekt: Zeig deine Idee im Discord und bau mit.' },
  { img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop', tag: 'Event', date: '28. Aug 2026', title: 'Event-Rückblick: Bauabend am See', text: 'Hütten, Stege und viele Screenshots – danke an alle, die dabei waren!' },
]

const RULE_TITLES = [
  'Respekt & Grenzen',
  'Fair spielen',
  'Bauwerke achten',
  'PvP mit Zustimmung',
  'Bugs melden',
  'Serverleistung schützen',
  'Chat & Werbung',
  'Privatsphäre',
  'Support sachlich nutzen',
  'Maßnahmen & 2. Chancen',
]

export default function Home() {
  const status = useServerStatus()
  const toast = useToast()
  const copy = useCopy()
  const [ticketOpen, setTicketOpen] = useState(false)

  return (
    <main id="main">
      {/* 01 — HERO */}
      <section className="mt-10 grid lg:grid-cols-2 gap-10 items-center">
        <div className="reveal">
          <span className="chip">Minecraft Java · 1.21.11</span>
          <h1 className="font-display font-bold text-white text-4xl sm:text-[3.4rem] leading-[1.05] tracking-tight mt-4">
            Deine Ideen.
            <br />
            Unsere Welt.
            <br />
            <span className="text-cyan-300">Creator Wave.</span>
          </h1>
          <p className="text-slate-400 mt-5 max-w-md leading-relaxed">
            Blöcke setzen, Ressourcen sammeln, gemeinsam bauen. Lerne neue Leute kennen und mach aus kleinen Ideen etwas Großes.
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <button
              onClick={copyServerIp(toast)}
              className="rounded-xl bg-cyan-300 text-[#06222b] font-semibold px-5 py-3 text-sm hover:brightness-110 active:scale-[.98] transition"
            >
              {SERVER_IP} kopieren
            </button>
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-slate-200 hover:border-white/30 transition">
              Discord beitreten
            </a>
          </div>
          <div className="mt-6">
            <StatusLine status={status} />
          </div>
        </div>
        <div className="reveal relative rounded-2xl overflow-hidden border border-white/[.08]">
          <img src="https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?q=80&w=1400&auto=format&fit=crop" alt="Minecraft-Welt bei Nacht" className="w-full h-[320px] sm:h-[380px] object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 pt-10 pb-4 flex items-end justify-between gap-3">
            <p className="text-[13px] text-slate-300">Spawn, Projekte & Events – alles live.</p>
            <Link to="/news" className="shrink-0 text-[13px] font-semibold text-cyan-300 hover:text-cyan-200">
              Feed →
            </Link>
          </div>
        </div>
      </section>

      {/* 02 — START IN 3 SCHRITTEN */}
      <section className="mt-20 reveal">
        <span className="chip">In drei Schritten dabei</span>
        <h2 className="font-display text-white text-2xl sm:text-3xl font-bold tracking-tight mt-3">Dein Start bei Creator Wave.</h2>
        <div className="grid sm:grid-cols-3 gap-4 mt-6">
          {[
            { n: '01', t: 'Minecraft starten', d: 'Öffne die Java Edition in Version 1.21.11.' },
            { n: '02', t: 'Server hinzufügen', d: `Mehrspieler → Server hinzufügen → ${SERVER_IP} eintragen.` },
            { n: '03', t: 'Verbinden & ankommen', d: 'Tritt bei, sag Hallo und frag nach bei Fragen.' },
          ].map((s) => (
            <div key={s.n} className="glass p-5">
              <p className="font-mono text-cyan-300 text-sm">{s.n}</p>
              <h3 className="font-semibold text-white mt-2">{s.t}</h3>
              <p className="text-sm text-slate-500 mt-1">{s.d}</p>
            </div>
          ))}
        </div>
        <Link to="/regeln" className="inline-block mt-4 text-sm text-slate-400 hover:text-cyan-300 transition">
          Vorher kurz die Regeln lesen →
        </Link>
      </section>

      {/* 03 — FEATURES */}
      <section className="mt-20">
        <div className="reveal">
          <span className="chip">Mehr als nur Blöcke</span>
          <h2 className="font-display text-white text-2xl sm:text-3xl font-bold tracking-tight mt-3">Ein Platz für deine Ideen.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <article className="glass glass-hover p-6 reveal">
            <p className="text-[11px] tracking-[.18em] text-slate-500 font-bold">GEMEINSCHAFT</p>
            <h3 className="font-display font-bold text-white text-lg mt-2">Zusammen macht&apos;s mehr Spaß.</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">Finde Mitspieler, zeig Projekte und tausch dich im Discord aus.</p>
            <a className="text-cyan-300 text-sm font-medium mt-4 inline-block" target="_blank" rel="noopener noreferrer" href={DISCORD_URL}>
              Community entdecken →
            </a>
          </article>
          <article className="glass glass-hover p-6 reveal">
            <p className="text-[11px] tracking-[.18em] text-slate-500 font-bold">FAIR PLAY</p>
            <h3 className="font-display font-bold text-white text-lg mt-2">Klare Regeln. Gutes Miteinander.</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">Zeit, Arbeit und Grenzen anderer respektieren – transparent geregelt.</p>
            <Link className="text-cyan-300 text-sm font-medium mt-4 inline-block" to="/regeln">
              Regeln kennenlernen →
            </Link>
          </article>
          <article className="glass glass-hover p-6 reveal">
            <p className="text-[11px] tracking-[.18em] text-slate-500 font-bold">SUPPORT</p>
            <h3 className="font-display font-bold text-white text-lg mt-2">Ein offenes Ohr für dich.</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">Privates Ticket erstellen und mit dem Team im Gespräch bleiben.</p>
            <div className="flex gap-3 mt-4 text-sm">
              <Link className="text-cyan-300 font-medium" to="/support">
                Ticket erstellen →
              </Link>
              <button onClick={() => setTicketOpen(true)} className="text-slate-400 hover:text-slate-200 transition">
                Schnell-Dialog
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* 04 — NEWS */}
      <section className="mt-20">
        <div className="flex flex-wrap items-end justify-between gap-4 reveal">
          <div>
            <span className="chip">Aus der Community</span>
            <h2 className="font-display text-white text-2xl sm:text-3xl font-bold tracking-tight mt-3">Neues von Creator Wave.</h2>
          </div>
          <Link to="/news" className="text-sm text-slate-400 hover:text-cyan-300 transition">
            Alle Beiträge →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {PREVIEW_POSTS.map((p) => (
            <article key={p.title} className="glass glass-hover overflow-hidden reveal">
              <img loading="lazy" src={p.img} alt="" className="w-full h-40 object-cover" />
              <div className="p-5">
                <p className="text-[11px] tracking-[.14em] text-slate-500 font-bold">
                  {p.tag.toUpperCase()} · {p.date.toUpperCase()}
                </p>
                <h3 className="font-display font-bold text-white mt-1.5">{p.title}</h3>
                <p className="text-sm text-slate-500 mt-1.5 line-clamp-3">{p.text}</p>
                <Link to="/news" className="text-cyan-300 text-sm font-medium mt-3 inline-block">
                  Weiterlesen →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 05 — COMMANDS & FAQ */}
      <section className="mt-20 grid lg:grid-cols-2 gap-4">
        <div className="glass p-6 sm:p-7 reveal">
          <span className="chip">Serveralltag</span>
          <h2 className="font-display text-white text-xl font-bold mt-3">Die wichtigsten Commands.</h2>
          <div className="flex flex-wrap gap-2 mt-4 font-mono text-xs">
            {['/cmi sethome zuhause', '/cmi home zuhause', '/cmi tpa Spielername', '/skills'].map((c) => (
              <button key={c} onClick={() => copy(c)} className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-slate-300 hover:border-cyan-300/40 transition">
                {c}
              </button>
            ))}
          </div>
          <p className="text-[13px] text-slate-600 mt-4">Chat mit T öffnen, mit Tab vervollständigen.</p>
        </div>
        <div className="glass p-6 sm:p-7 reveal flex flex-col justify-between">
          <div>
            <span className="chip">Wissen</span>
            <h2 className="font-display text-white text-xl font-bold mt-3">FAQ: Homes, Skills, Gräber, Voice.</h2>
            <p className="text-sm text-slate-500 mt-2">Ankommen, bauen, zusammenspielen – Hilfe für deinen Alltag auf dem Server.</p>
          </div>
          <Link to="/faq" className="mt-5 inline-flex w-fit rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:border-white/30 transition">
            FAQ & Commands entdecken →
          </Link>
        </div>
      </section>

      {/* 06 — REGELN KOMPAKT */}
      <section className="mt-20">
        <div className="reveal">
          <span className="chip">Fair Play</span>
          <h2 className="font-display text-white text-2xl sm:text-3xl font-bold tracking-tight mt-3">Unsere Regeln im Überblick.</h2>
          <p className="text-sm text-slate-500 mt-2">Stand: 22. September 2026 · Hinter jedem Namen steckt ein Mensch.</p>
        </div>
        <div className="glass p-6 sm:p-7 mt-6 reveal">
          <ol className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm text-slate-400">
            {RULE_TITLES.map((t, i) => (
              <li key={t} className="flex gap-3 border-b border-white/[.06] pb-2.5">
                <span className="font-mono text-slate-600 text-[13px]">{String(i + 1).padStart(2, '0')}</span>
                {t}
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-4 mt-5 text-sm">
            <Link to="/regeln" className="text-cyan-300 font-medium">
              Alle Regeln im Detail →
            </Link>
            <Link to="/appeal" className="text-slate-500 hover:text-slate-300 transition">
              Entbannungsantrag →
            </Link>
          </div>
        </div>
      </section>

      {/* 07 — DISCORD ABSCHLUSS */}
      <section className="mt-20 reveal rounded-2xl border border-white/[.08] bg-[#070d17] px-6 py-10 sm:px-10 text-center">
        <h2 className="font-display text-white text-2xl sm:text-3xl font-bold tracking-tight">Wir sehen uns im Discord.</h2>
        <p className="text-sm text-slate-500 mt-2">Gespräche, Neuigkeiten und Austausch zwischen deinen Spielsessions.</p>
        <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block rounded-xl bg-cyan-300 text-[#06222b] font-semibold px-6 py-3 text-sm hover:brightness-110 transition">
          Discord beitreten
        </a>
      </section>

      <TicketQuickDialog open={ticketOpen} onClose={() => setTicketOpen(false)} />
    </main>
  )
}
