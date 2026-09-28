import { useState } from 'react'
import { Link } from 'react-router-dom'
import { createAppeal, getAppeal, useToast } from '../lib/hooks.jsx'

export default function Appeal() {
  const toast = useToast()
  const [receipt, setReceipt] = useState('')
  const [status, setStatus] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    const code = createAppeal({ name: fd.get('name'), ban: fd.get('ban'), text: fd.get('text') })
    setReceipt(code)
    toast('Entbannungsantrag erstellt')
    e.target.reset()
  }

  const check = (e) => {
    e.preventDefault()
    const code = new FormData(e.target).get('code').trim()
    const a = getAppeal(code)
    setStatus(a ? `Status für ${code}: ${a.status} (Demo)` : 'Code nicht gefunden (Demo speichert nur lokal).')
  }

  return (
    <main>
      <section className="mt-8 max-w-3xl">
        <span className="chip">ZWEITE CHANCEN · FAIR GEPRÜFT</span>
        <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight mt-3">
          Entbannungs<span className="text-cyan-300">antrag.</span>
        </h1>
        <p className="text-slate-400 text-sm mt-3">Ehrlich erklären, was passiert ist. Bann-ID vom Sperrbildschirm + Statuscode sichern. Antrag hebt Bann nicht automatisch auf.</p>
      </section>
      <div className="mt-8 grid lg:grid-cols-2 gap-6 items-start">
        <form onSubmit={submit} className="glass rounded-3xl p-6 sm:p-8 grid gap-3">
          <label className="text-xs font-bold">
            Minecraft-Name
            <input name="name" required pattern="[A-Za-z0-9_]{1,16}" className="mt-1 w-full bg-black/30 border border-white/15 rounded-xl px-3 py-2.5 text-sm" placeholder="Spielername" />
          </label>
          <label className="text-xs font-bold">
            Bann-ID (vom Sperrbildschirm)
            <input name="ban" required minLength={3} maxLength={60} className="mt-1 w-full bg-black/30 border border-white/15 rounded-xl px-3 py-2.5 text-sm font-mono" placeholder="z.B. CW-2026-XXXX" />
          </label>
          <label className="text-xs font-bold">
            Deine Erklärung
            <textarea name="text" required minLength={30} maxLength={3000} rows={6} className="mt-1 w-full bg-black/30 border border-white/15 rounded-xl px-3 py-2.5 text-sm" placeholder="Was ist passiert? Was hast du verstanden? Warum sollte es weitergehen?" />
          </label>
          <button className="rounded-xl bg-cyan-400 text-[#06222b] font-bold py-3 text-sm">Antrag absenden ↗</button>
          {receipt && (
            <div className="rounded-xl border border-cyan-300/30 bg-cyan-400/10 p-4 text-sm">
              Antrag gespeichert (Demo). Dein Statuscode: <code className="bg-black/40 px-2 py-1 rounded">{receipt}</code> – sichere ihn!
            </div>
          )}
          <p className="text-[11px] text-slate-500">
            Demo speichert lokal. Regeln zu Maßnahmen: <Link to="/regeln" className="text-cyan-300">Regel 10</Link>.
          </p>
        </form>
        <div className="grid gap-5">
          <div className="glass rounded-3xl p-6 sm:p-8">
            <h2 className="font-display font-bold text-xl">Status abrufen</h2>
            <p className="text-xs text-slate-500 mt-1">Mit privatem Statuscode aus deiner Bestätigung.</p>
            <form onSubmit={check} className="flex gap-2 mt-3">
              <input name="code" required placeholder="AP-XXXXXX" className="flex-1 bg-black/30 border border-white/15 rounded-xl px-3 py-2.5 text-sm font-mono" />
              <button className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-bold hover:bg-white/10">Prüfen</button>
            </form>
            {status && <p className="text-sm text-cyan-200 mt-3">{status}</p>}
          </div>
          <div className="rounded-3xl overflow-hidden relative min-h-[220px] glass">
            <img src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060d18] to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 glass rounded-xl p-4 text-sm">
              <b>Tipp:</b> Sachlich bleiben, Sicht + Belege nennen. Beschwerden über Team prüft die Leitung.
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
