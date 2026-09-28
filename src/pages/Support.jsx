import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DISCORD_URL } from '../data/content.js'
import { createTicket, getTicket, useToast } from '../lib/hooks.jsx'

export default function Support() {
  const toast = useToast()
  const [tab, setTab] = useState('new')
  const [receipt, setReceipt] = useState('')
  const [ticket, setTicket] = useState(null)
  const [thread, setThread] = useState([])

  const submitCreate = (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    if (fd.get('website')) return
    const t = createTicket({ name: fd.get('name'), category: fd.get('category'), subject: fd.get('subject'), message: fd.get('message') })
    setReceipt(t.code)
    toast(`Ticket erstellt: ${t.code}`)
    e.target.reset()
  }

  const submitAccess = (e) => {
    e.preventDefault()
    const code = new FormData(e.target).get('token').trim()
    const t = getTicket(code)
    if (!t) {
      toast('Code nicht gefunden (Demo speichert nur lokal)')
      return
    }
    setTicket(t)
    setThread([{ from: 'du', text: t.msg }, ...t.replies])
    setTimeout(() => document.getElementById('ticketThread')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  const submitReply = (e) => {
    e.preventDefault()
    const ta = e.target.message
    if (ta.value.length < 3) return
    setThread((th) => [...th, { from: 'du', text: ta.value }])
    ta.value = ''
    setTimeout(() => setThread((th) => [...th, { from: 'team', text: 'Danke für deine Nachricht! Im Live-System antwortet hier das echte Team.' }]), 800)
  }

  return (
    <main>
      <section className="mt-8 max-w-3xl">
        <span className="chip">WIR HÖREN DIR ZU</span>
        <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight mt-3">
          Du fragst.
          <br />
          <span className="text-cyan-300">Wir helfen.</span>
        </h1>
        <p className="text-slate-400 text-sm mt-3">Ticket ist nur für dich (mit Code) + berechtigtes Team sichtbar. Demo speichert lokal – Original läuft über Server-Backend.</p>
      </section>

      <div className="mt-8 grid lg:grid-cols-[1.5fr_1fr] gap-6 items-start">
        <section className="glass rounded-3xl p-6 sm:p-8">
          <div className="flex gap-4 border-b border-white/10 pb-4 mb-5 text-sm font-bold">
            <button onClick={() => setTab('new')} className={tab === 'new' ? 'text-cyan-300' : 'text-slate-400'}>
              Neues Ticket
            </button>
            <button onClick={() => setTab('ex')} className={tab === 'ex' ? 'text-cyan-300' : 'text-slate-400'}>
              Mein Ticket öffnen
            </button>
          </div>
          {tab === 'new' ? (
            <form onSubmit={submitCreate} className="grid gap-3">
              <label className="text-xs font-bold">
                Minecraft-Name
                <input name="name" required pattern="[A-Za-z0-9_]{1,16}" maxLength={16} placeholder="Spielername" className="mt-1 w-full bg-black/30 border border-white/15 rounded-xl px-3 py-2.5 text-sm" />
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                <label className="text-xs font-bold">
                  Kategorie
                  <select name="category" className="mt-1 w-full bg-black/30 border border-white/15 rounded-xl px-3 py-2.5 text-sm">
                    <option value="question">Allgemeine Frage</option>
                    <option value="technical">Technisches Problem</option>
                    <option value="report">Spieler / Vorfall melden</option>
                    <option value="other">Sonstiges</option>
                  </select>
                </label>
                <label className="text-xs font-bold">
                  Betreff
                  <input name="subject" required minLength={5} maxLength={100} placeholder="Worum geht es?" className="mt-1 w-full bg-black/30 border border-white/15 rounded-xl px-3 py-2.5 text-sm" />
                </label>
              </div>
              <label className="text-xs font-bold">
                Nachricht
                <textarea name="message" required minLength={20} maxLength={3000} rows={5} placeholder="Zeitpunkt, Fehlermeldung, Schritte davor …" className="mt-1 w-full bg-black/30 border border-white/15 rounded-xl px-3 py-2.5 text-sm" />
              </label>
              <label className="hidden">
                Website
                <input name="website" tabIndex={-1} />
              </label>
              <p className="text-[11px] text-slate-500">
                Verarbeitung siehe <Link to="/datenschutz" className="text-cyan-300">Datenschutz</Link>. Keine Passwörter! Name ist nicht verifiziert.
              </p>
              <button className="rounded-xl bg-cyan-300 text-[#06222b] font-bold py-3 text-sm hover:brightness-110">Ticket absenden ↗</button>
            </form>
          ) : (
            <form onSubmit={submitAccess} className="grid gap-3">
              <label className="text-xs font-bold">
                Dein privater Ticketcode
                <input name="token" required placeholder="Code aus Bestätigung" className="mt-1 w-full bg-black/30 border border-white/15 rounded-xl px-3 py-2.5 text-sm font-mono" />
              </label>
              <p className="text-[11px] text-slate-500">Wer den Code kennt, kann lesen & antworten. Nicht öffentlich teilen.</p>
              <button className="rounded-xl bg-cyan-300 text-[#06222b] font-bold py-3 text-sm">Ticket öffnen ↗</button>
            </form>
          )}
          {receipt && (
            <div className="mt-4 rounded-xl border border-cyan-300/30 bg-cyan-300/10 p-4 text-sm">
              <b>Ticket erstellt (Demo-Modus).</b>
              <br />
              Dein privater Code: <code className="bg-black/40 px-2 py-1 rounded">{receipt}</code>
            </div>
          )}
        </section>

        <aside className="glass rounded-3xl p-6 sm:p-7">
          <span className="text-3xl">✳</span>
          <h2 className="font-display font-bold text-2xl mt-3">
            Eine Frage.
            <br />
            Ein Gespräch.
          </h2>
          <p className="text-sm text-slate-400 mt-2">Code nach Absenden sichern – damit liest du Antworten.</p>
          <div className="mt-5 rounded-2xl bg-white/5 border border-white/10 p-4 text-sm">
            <b>Bereits gebannt?</b>
            <p className="text-slate-400 text-xs mt-1">Eigenes Formular mit Bann-ID nutzen.</p>
            <Link to="/appeal" className="text-cyan-300 font-bold text-sm mt-2 inline-block">
              Entbannungsantrag →
            </Link>
          </div>
          <div className="mt-3 rounded-2xl bg-white/5 border border-white/10 p-4 text-sm">
            <b>Lieber zur Community?</b>
            <p className="text-slate-400 text-xs mt-1">Austausch zwischen Sessions.</p>
            <a target="_blank" rel="noopener noreferrer" href={DISCORD_URL} className="text-cyan-300 font-bold text-sm mt-2 inline-block">
              Discord öffnen ↗
            </a>
          </div>
          <img loading="lazy" src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop" className="rounded-xl mt-4 h-32 w-full object-cover ring-1 ring-white/15" alt="" />
        </aside>
      </div>

      {ticket && (
        <section id="ticketThread" className="glass rounded-3xl p-6 sm:p-8 mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[11px] tracking-widest text-cyan-200 font-bold">
                {ticket.code} · {ticket.cat} · {ticket.name}
              </span>
              <h2 className="font-display font-bold text-2xl">{ticket.subj}</h2>
            </div>
            <button onClick={() => toast('Aktualisiert (Demo)')} className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-bold hover:bg-white/10">
              ↻ Aktualisieren
            </button>
          </div>
          <div className="mt-4">
            {thread.map((m, i) => (
              <div key={i} className={`rounded-xl p-3 mb-2 text-sm ${m.from === 'team' ? 'bg-cyan-500/10 border border-cyan-300/20' : 'bg-white/5 border border-white/10'}`}>
                <b className="text-xs opacity-70">{m.from === 'team' ? 'Team' : 'Du'}</b>
                <br />
                {m.text}
              </div>
            ))}
          </div>
          <form onSubmit={submitReply} className="mt-3 grid gap-2">
            <label className="text-xs font-bold">
              Deine Antwort
              <textarea name="message" required minLength={3} maxLength={3000} rows={3} className="mt-1 w-full bg-black/30 border border-white/15 rounded-xl px-3 py-2.5 text-sm" />
            </label>
            <button className="rounded-xl bg-cyan-300 text-[#06222b] font-bold py-2.5 text-sm">Antwort senden ↗</button>
          </form>
          <p className="text-[11px] text-slate-500 mt-2">Geschlossen? Dann oben ein neues Ticket erstellen.</p>
        </section>
      )}
    </main>
  )
}
