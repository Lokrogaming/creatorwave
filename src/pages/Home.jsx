import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DISCORD_URL, SERVER_IP } from '../data/content.js'
import { copyServerIp, createTicket, useCopy, useServerStatus, useToast } from '../lib/hooks.jsx'
import Modal from '../components/Modal.jsx'

function StatusBadge({ status }) {
  if (status.state === 'online')
    return (
      <span className="inline-flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 pulse-dot" />
        <span className="text-emerald-300 font-bold">Online</span> · <b className="text-slate-200">{status.online}</b>
      </span>
    )
  if (status.state === 'offline')
    return (
      <span className="inline-flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <span className="text-amber-300 font-bold">Nicht verfügbar</span> · <b className="text-slate-200">—</b>
      </span>
    )
  return <span className="text-slate-400 text-xs">Status wird geladen …</span>
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
      <div className="glass-strong rounded-3xl p-6 sm:p-8 text-slate-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="chip">SUPPORT · SCHNELL-DIALOG</span>
            <h3 className="font-display font-bold text-2xl mt-2">Neues Ticket</h3>
            <p className="text-sm text-slate-400">Volles Formular auf der Support-Seite.</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl border border-white/15 bg-white/5">
            ×
          </button>
        </div>
        <form onSubmit={submit} className="mt-5 grid gap-3">
          <label className="text-xs font-semibold">
            Minecraft-Name
            <input name="name" required pattern="[A-Za-z0-9_]{1,16}" maxLength={16} placeholder="Dein Spielername" className="mt-1 w-full bg-black/30 border border-white/15 rounded-xl px-3 py-2.5 text-sm" />
          </label>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="text-xs font-semibold">
              Kategorie
              <select name="category" className="mt-1 w-full bg-black/30 border border-white/15 rounded-xl px-3 py-2.5 text-sm">
                <option value="question">Allgemeine Frage</option>
                <option value="technical">Technisches Problem</option>
                <option value="report">Spieler / Vorfall melden</option>
                <option value="other">Sonstiges</option>
              </select>
            </label>
            <label className="text-xs font-semibold">
              Betreff
              <input name="subject" required minLength={5} maxLength={100} placeholder="Worum geht es?" className="mt-1 w-full bg-black/30 border border-white/15 rounded-xl px-3 py-2.5 text-sm" />
            </label>
          </div>
          <label className="text-xs font-semibold">
            Nachricht
            <textarea name="message" required minLength={20} maxLength={3000} rows={4} placeholder="Zeitpunkt, Fehlermeldung, Schritte davor …" className="mt-1 w-full bg-black/30 border border-white/15 rounded-xl px-3 py-2.5 text-sm" />
          </label>
          <label className="hidden">
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
          <button className="rounded-xl bg-cyan-400 text-[#06222b] font-bold py-3 text-sm hover:brightness-110">Ticket absenden ↗</button>
        </form>
        {receipt && (
          <div className="mt-4 rounded-xl border border-cyan-300/30 bg-cyan-400/10 p-4 text-sm">
            <b>Ticket erstellt (Demo-Modus).</b>
            <br />
            Dein privater Code: <code className="bg-black/40 px-2 py-1 rounded">{receipt}</code>
          </div>
        )}
        <p className="text-[11px] text-slate-500 mt-3">
          Demo-Modus: speichert lokal.{' '}
          <Link to="/support" onClick={onClose} className="text-cyan-300 font-bold">
            Zur vollen Support-Seite →
          </Link>
        </p>
      </div>
    </Modal>
  )
}

const PREVIEW_POSTS = [
  { img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop', tag: 'UPDATE', date: '22. SEP 2026 · TEAM', title: 'Spawn-Update: Neue Wege & Deko', text: 'Der Spawn hat neue Wege, Laternen und Infotafeln bekommen – perfekt für deinen ersten Moment.' },
  { img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop', tag: 'COMMUNITY', date: '14. SEP 2026 · TEAM', title: 'Brücke über den Fluss – Gemeinschaftsprojekt', text: 'Vom ersten Block zum Großprojekt: Zeig deine Idee im Discord und bau mit.' },
  { img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop', tag: 'EVENT', date: '28. AUG 2026 · TEAM', title: 'Event-Rückblick: Bauabend am See', text: 'Hütten, Stege und viele Screenshots – danke an alle, die dabei waren!' },
]

export default function Home() {
  const status = useServerStatus()
  const toast = useToast()
  const copy = useCopy()
  const [ticketOpen, setTicketOpen] = useState(false)

  return (
    <main id="main">
      {/* HERO */}
      <section className="mt-6 grid lg:grid-cols-[1.1fr_.9fr] gap-6 items-stretch">
        <div className="glass rounded-3xl p-7 sm:p-10 relative overflow-hidden reveal">
          <div className="hero-grid absolute inset-0" />
          <div className="relative">
            <span className="chip">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" /> DEIN MINECRAFT-PROJEKT · JAVA 1.21.11
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-6xl leading-[1.02] tracking-tight mt-5">
              Deine Ideen.
              <br />
              Unsere Welt.
              <br />
              <span className="text-gradient">Creator Wave.</span>
            </h1>
            <p className="text-slate-300/90 mt-5 max-w-md">
              Blöcke setzen, Ressourcen sammeln und gemeinsam Bauprojekte verwirklichen. Lerne neue Leute kennen und mach aus kleinen Ideen etwas Großes.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <button
                onClick={copyServerIp(toast)}
                className="rounded-xl bg-cyan-400 text-[#06222b] font-bold px-5 py-3.5 text-sm btn-glow hover:brightness-110 active:scale-95 transition"
              >
                Serveradresse kopieren ↗
              </button>
              <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/20 bg-white/5 px-5 py-3.5 text-sm font-bold hover:bg-white/10 backdrop-blur">
                Zum Discord ↗
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="font-mono bg-black/40 border border-white/10 rounded-lg px-3 py-1.5">{SERVER_IP}</span>
              <StatusBadge status={status} />
            </div>
          </div>
        </div>
        <div className="relative rounded-3xl overflow-hidden glass reveal min-h-[340px] group">
          <img src="https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?q=80&w=1400&auto=format&fit=crop" alt="Minecraft-Welt bei Nacht" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-[1.2s]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060d18] via-[#060d18]/30 to-transparent" />
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <span className="chip !bg-black/40 backdrop-blur">CW / 01 · BLOCKWELT</span>
            <span className="text-[10px] font-mono text-cyan-100/80 text-right leading-relaxed bg-black/30 backdrop-blur rounded-lg px-3 py-2 border border-white/10">
              DEINE WELT.
              <br />
              DEIN PROJEKT.
            </span>
          </div>
          <div className="absolute bottom-4 left-4 right-4 glass rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-300 to-violet-500 grid place-items-center text-xl font-bold text-[#06222b]">◈</div>
            <div className="flex-1">
              <p className="text-[10px] tracking-[.2em] text-cyan-200 font-bold">BLOCK FÜR BLOCK. GEMEINSAM.</p>
              <p className="text-sm font-semibold">Spawn, Projekte & Events – alles live.</p>
            </div>
            <Link to="/news" className="text-xs font-bold bg-white/10 border border-white/15 rounded-xl px-3 py-2 hover:bg-white/20">
              Feed →
            </Link>
          </div>
        </div>
      </section>

      {/* STATUS STRIP */}
      <section className="mt-6 glass rounded-2xl p-5 sm:p-6 grid grid-cols-2 lg:grid-cols-4 gap-5 items-center reveal">
        <div>
          <span className="text-[10px] tracking-[.2em] text-slate-400 font-bold">SERVERSTATUS</span>
          <strong className={`block text-lg mt-1 ${status.state === 'online' ? 'text-emerald-300' : status.state === 'offline' ? 'text-amber-300' : ''}`}>
            {status.state === 'loading' ? 'Wird geladen …' : status.state === 'online' ? 'Online' : 'Nicht verfügbar'}
          </strong>
        </div>
        <div>
          <span className="text-[10px] tracking-[.2em] text-slate-400 font-bold">SPIELER ONLINE</span>
          <strong className="block text-lg mt-1">{status.online}</strong>
        </div>
        <div>
          <span className="text-[10px] tracking-[.2em] text-slate-400 font-bold">DEIN WEG ZU UNS</span>
          <strong className="block font-mono text-cyan-200 mt-1">{SERVER_IP}</strong>
        </div>
        <Link to="/support" className="rounded-xl bg-white/5 border border-cyan-300/25 px-4 py-3 text-sm font-bold text-cyan-200 hover:bg-cyan-400/10 text-center">
          Du brauchst Hilfe? ↗
        </Link>
      </section>
      <p className="text-[11px] text-slate-500 text-right mt-2">{status.note}</p>

      {/* NEWS PREVIEW */}
      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-4 reveal">
          <div>
            <span className="chip">ÖFFENTLICH FÜR DIE COMMUNITY</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mt-3">Neues von Creator Wave.</h2>
          </div>
          <Link to="/news" className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold hover:bg-white/10">
            Alle Beiträge & Kommentare ↗
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {PREVIEW_POSTS.map((p) => (
            <article key={p.title} className="glass glass-hover rounded-2xl overflow-hidden reveal">
              <div className="h-44 overflow-hidden relative">
                <img loading="lazy" src={p.img} alt="" className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 chip !py-1">{p.tag}</span>
              </div>
              <div className="p-5">
                <p className="text-[11px] text-cyan-200/70 font-bold tracking-widest">{p.date}</p>
                <h3 className="font-display font-bold text-lg mt-1">{p.title}</h3>
                <p className="text-sm text-slate-300/80 mt-2 line-clamp-3">{p.text}</p>
                <Link to="/news" className="text-cyan-300 text-sm font-bold mt-3 inline-block">
                  Weiterlesen →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mt-14">
        <div className="reveal">
          <span className="chip">MEHR ALS NUR BLÖCKE</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mt-3">Ein Platz für deine Ideen.</h2>
          <p className="text-slate-400 text-sm mt-2 max-w-xl">Gute Ideen, fairer Umgang und die Menschen hinter den Spielernamen zählen bei uns.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5 mt-6">
          <article className="glass glass-hover rounded-2xl p-6 reveal">
            <span className="text-3xl">▧</span>
            <p className="text-[10px] tracking-[.2em] text-cyan-200 font-bold mt-4">01 / GEMEINSCHAFT</p>
            <h3 className="font-display font-bold text-xl mt-2">Zusammen macht&apos;s mehr Spaß.</h3>
            <p className="text-sm text-slate-300/80 mt-2">Finde Mitspieler, zeig Projekte und tausch dich im Discord aus.</p>
            <a className="text-cyan-300 text-sm font-bold mt-4 inline-block" target="_blank" rel="noopener noreferrer" href={DISCORD_URL}>
              Community entdecken ↗
            </a>
          </article>
          <article className="glass glass-hover rounded-2xl p-6 reveal">
            <span className="text-3xl">◇</span>
            <p className="text-[10px] tracking-[.2em] text-cyan-200 font-bold mt-4">02 / FAIR PLAY</p>
            <h3 className="font-display font-bold text-xl mt-2">Klare Regeln. Gutes Miteinander.</h3>
            <p className="text-sm text-slate-300/80 mt-2">Wir respektieren Zeit, Arbeit und Grenzen anderer – transparent geregelt.</p>
            <Link className="text-cyan-300 text-sm font-bold mt-4 inline-block" to="/regeln">
              Regeln kennenlernen ↗
            </Link>
          </article>
          <article className="glass glass-hover rounded-2xl p-6 reveal">
            <span className="text-3xl">✳</span>
            <p className="text-[10px] tracking-[.2em] text-cyan-200 font-bold mt-4">03 / SUPPORT</p>
            <h3 className="font-display font-bold text-xl mt-2">Ein offenes Ohr für dich.</h3>
            <p className="text-sm text-slate-300/80 mt-2">Privates Ticket erstellen und mit dem Team im Gespräch bleiben.</p>
            <div className="flex gap-2 mt-4">
              <Link className="text-cyan-300 text-sm font-bold" to="/support">
                Ticket erstellen ↗
              </Link>
              <span className="text-slate-600">·</span>
              <button onClick={() => setTicketOpen(true)} className="text-cyan-300 text-sm font-bold">
                Schnell-Dialog öffnen
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* STEPS + GALLERY */}
      <section className="mt-14 grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-3xl p-7 sm:p-8 reveal">
          <span className="chip">DREI SCHRITTE · EINE NEUE WELT</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mt-3">
            Dein erster Moment
            <br />
            bei Creator Wave.
          </h2>
          <ol className="mt-6 space-y-0">
            <li className="flex gap-4 py-4 border-t border-white/10">
              <b className="font-mono text-cyan-300 text-sm pt-1">01</b>
              <div>
                <h3 className="font-bold">Minecraft starten</h3>
                <p className="text-sm text-slate-400">Öffne Minecraft Java Edition 1.21.11.</p>
              </div>
            </li>
            <li className="flex gap-4 py-4 border-t border-white/10">
              <b className="font-mono text-cyan-300 text-sm pt-1">02</b>
              <div>
                <h3 className="font-bold">Server hinzufügen</h3>
                <p className="text-sm text-slate-400">
                  Mehrspieler → Server hinzufügen → <code className="font-mono text-cyan-200 bg-black/40 px-1.5 py-0.5 rounded">{SERVER_IP}</code>
                </p>
              </div>
            </li>
            <li className="flex gap-4 py-4 border-y border-white/10">
              <b className="font-mono text-cyan-300 text-sm pt-1">03</b>
              <div>
                <h3 className="font-bold">Verbinden & ankommen</h3>
                <p className="text-sm text-slate-400">Tritt bei, sag Hallo und frag nach, wenn du dich nicht auskennst.</p>
              </div>
            </li>
          </ol>
          <Link to="/regeln" className="mt-5 inline-flex rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-bold hover:bg-white/10">
            Vorher kurz die Regeln lesen ↗
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 reveal">
          <img loading="lazy" src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format&fit=crop" className="rounded-2xl h-48 sm:h-56 w-full object-cover ring-1 ring-white/15 hover:scale-[1.02] transition" alt="Landschaft" />
          <img loading="lazy" src="https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop" className="rounded-2xl h-48 sm:h-56 w-full object-cover ring-1 ring-white/15 mt-6 hover:scale-[1.02] transition" alt="Gaming" />
          <img loading="lazy" src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop" className="rounded-2xl h-48 sm:h-56 w-full object-cover ring-1 ring-white/15 -mt-2 hover:scale-[1.02] transition" alt="Community" />
          <div className="glass rounded-2xl p-5 mt-6 flex flex-col justify-center">
            <p className="text-[10px] tracking-[.2em] text-cyan-200 font-bold">BILDER · UPDATES · MOMENTE</p>
            <h3 className="font-display font-bold text-lg mt-1">Neues aus der Blockwelt.</h3>
            <Link to="/news" className="mt-3 rounded-xl bg-cyan-400 text-[#06222b] text-sm font-bold px-4 py-2.5 text-center hover:brightness-110">
              Zum Feed ↗
            </Link>
          </div>
        </div>
      </section>

      {/* COMMANDS teaser */}
      <section className="mt-12 glass rounded-3xl p-7 sm:p-10 grid lg:grid-cols-[1fr_.9fr] gap-8 items-center reveal overflow-hidden relative">
        <div>
          <span className="chip">VOM LOGIN BIS ZUM BAUPROJEKT</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mt-3">Ein guter Start, Block für Block.</h2>
          <p className="text-sm text-slate-300/80 mt-2">Homes setzen, Mitspieler besuchen, Skills entdecken: Unser FAQ begleitet dich durch den Serveralltag.</p>
          <div className="flex flex-wrap gap-2 mt-4 font-mono text-xs">
            {['/cmi sethome zuhause', '/cmi home zuhause', '/cmi tpa Spielername', '/skills'].map((c) => (
              <button key={c} onClick={() => copy(c)} className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 hover:border-cyan-300/50">
                {c} ⧉
              </button>
            ))}
          </div>
          <Link to="/faq" className="mt-5 inline-flex rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold hover:bg-white/10">
            FAQ & Commands entdecken ↗
          </Link>
        </div>
        <div className="rounded-2xl overflow-hidden ring-1 ring-white/15 relative min-h-[240px]">
          <img loading="lazy" src="https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=1000&auto=format&fit=crop" alt="Abenteuer" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060d18]/90 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 glass rounded-xl px-4 py-3 text-xs">
            Tipp: Mit <b>Tab</b> Befehle & Namen vervollständigen.
          </div>
        </div>
      </section>

      {/* DISCORD */}
      <section className="mt-8 rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 reveal relative overflow-hidden" style={{ background: 'linear-gradient(120deg,rgba(24,59,89,.85),rgba(20,34,55,.85))', border: '1px solid rgba(100,219,233,.3)', backdropFilter: 'blur(18px)' }}>
        <div className="flex-1">
          <span className="chip">DIE COMMUNITY GEHT WEITER</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mt-3">Wir sehen uns im Discord.</h2>
          <p className="text-sm text-cyan-100/80 mt-1">Gespräche, Neuigkeiten und Austausch zwischen deinen Spielsessions.</p>
        </div>
        <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-cyan-400 text-[#06222b] font-bold px-6 py-3.5 text-sm btn-glow hover:brightness-110 shrink-0">
          Discord beitreten ↗
        </a>
      </section>

      {/* RULES preview */}
      <section className="mt-12">
        <div className="reveal">
          <span className="chip">FAIR PLAY STARTET MIT UNS ALLEN</span>
          <h2 className="font-display text-3xl font-bold tracking-tight mt-3">
            Unsere <span className="text-cyan-300">Regeln.</span>
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">Stand: 22. September 2026 · Hinter jedem Spielernamen steckt ein Mensch. Behandle andere so, dass sie gerne wiederkommen.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {[
            { n: '01', t: 'Respekt und persönliche Grenzen', d: 'Keine Beleidigungen, Mobbing, Drohungen oder menschenfeindliche Äußerungen – auch nicht auf Schildern, Skins oder Bauwerken. „War nur Spaß“ hebt Grenzen nicht auf.' },
            { n: '02', t: 'Fair spielen – ohne Cheats', d: 'Cheatclients, X-Ray, Kill-Aura, Fly/Speed-Hacks, Autoclicker und Bots sind verboten. Unsichere Mods vorher im Support klären.' },
            { n: '03', t: 'Bauwerke & Grundstücke achten', d: 'Fremde Builds, Kisten, Tiere und Fahrzeuge nicht anfassen ohne Zustimmung. Ungesicherte Kisten sind keine Freigabe.' },
          ].map((r) => (
            <details key={r.n} className="glass rounded-2xl p-5 reveal">
              <summary className="flex gap-4 cursor-pointer list-none">
                <span className="font-mono text-cyan-300 text-sm">{r.n}</span>
                <b>{r.t}</b>
                <span className="acc-icon ml-auto text-cyan-300 text-xl leading-none">+</span>
              </summary>
              <p className="text-sm text-slate-300/80 mt-3">{r.d}</p>
            </details>
          ))}
          <details className="glass rounded-2xl p-5 reveal">
            <summary className="flex gap-4 cursor-pointer list-none">
              <span className="font-mono text-cyan-300 text-sm">04–10</span>
              <b>PvP, Bugs, Chat, Konten & Maßnahmen</b>
              <span className="acc-icon ml-auto text-cyan-300 text-xl leading-none">+</span>
            </summary>
            <p className="text-sm text-slate-300/80 mt-3">
              PvP nur mit Zustimmung, Bugs melden statt ausnutzen, kein Spam, keine privaten Daten, Support sachlich nutzen. Folgen: Hinweis bis Bann – zweite Chancen via Entbannungsantrag.
            </p>
            <Link to="/regeln" className="text-cyan-300 text-sm font-bold mt-2 inline-block">
              Alle 10 Regeln lesen →
            </Link>
          </details>
        </div>
      </section>

      <TicketQuickDialog open={ticketOpen} onClose={() => setTicketOpen(false)} />
    </main>
  )
}
