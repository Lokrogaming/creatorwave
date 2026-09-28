import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { DISCORD_URL, NAV_LINKS } from '../data/content.js'
import { kiAnswer } from '../lib/hooks.jsx'
import Modal from './Modal.jsx'
import Reveal from './Reveal.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function KiDialog({ open, onClose }) {
  const [messages, setMessages] = useState([
    { me: false, text: 'Hallo! Ich bin der CreatorWave-Assistent. Frag z.B. nach Join, Commands, Regeln oder Support.' },
  ])
  const [q, setQ] = useState('')
  const [thinking, setThinking] = useState(false)

  const send = (e) => {
    e.preventDefault()
    const text = q.trim()
    if (text.length < 2 || thinking) return
    setMessages((m) => [...m, { me: true, text }])
    setQ('')
    setThinking(true)
    setTimeout(() => {
      setMessages((m) => [...m, { me: false, text: kiAnswer(text) }])
      setThinking(false)
    }, 450)
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="glass-strong rounded-3xl overflow-hidden text-slate-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <b className="text-sm">CreatorWave · KI-Assistent</b>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-white/15" aria-label="Schließen">
            ×
          </button>
        </div>
        <div className="p-4 max-h-[50vh] overflow-auto">
          {messages.map((m, i) => (
            <p
              key={i}
              className={`rounded-xl px-3 py-2 text-sm leading-relaxed mb-2 ${
                m.me ? 'bg-cyan-500/20 border border-cyan-300/30 ml-8' : 'bg-white/5 border border-white/10 mr-8'
              }`}
            >
              {m.text}
            </p>
          ))}
          {thinking && <p className="text-xs text-cyan-200">Denkt nach…</p>}
        </div>
        <form onSubmit={send} className="p-4 border-t border-white/10">
          <label htmlFor="cw-ai-question" className="text-xs font-bold text-slate-400">
            DEINE FRAGE
          </label>
          <textarea
            id="cw-ai-question"
            required
            maxLength={800}
            rows={2}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Was möchtest du wissen?"
            className="mt-1 w-full bg-black/30 border border-white/15 rounded-xl px-3 py-2.5 text-sm"
          />
          <div className="flex gap-2 mt-2">
            <button className="flex-1 rounded-xl bg-cyan-400 text-[#06222b] font-bold py-2.5 text-sm">Senden</button>
            <Link to="/faq" onClick={onClose} className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-bold">
              FAQ
            </Link>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">KI kann Fehler machen. Keine Passwörter / Ticketcodes eingeben.</p>
        </form>
      </div>
    </Modal>
  )
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [kiOpen, setKiOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <div className="text-slate-100 antialiased min-h-screen flex flex-col">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="blob absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full bg-cyan-500/30" />
        <div className="blob absolute top-40 -right-24 w-[480px] h-[480px] rounded-full bg-violet-500/25" />
        <div className="blob absolute bottom-0 left-1/3 w-[500px] h-[300px] rounded-full bg-emerald-500/10" />
      </div>

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-cyan-400 focus:text-black focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Zum Inhalt
      </a>

      <header className="sticky top-3 z-50 mx-3 sm:mx-6">
        <div className="glass rounded-2xl max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="CreatorWave Logo" className="w-10 h-10 rounded-xl ring-1 ring-white/20" />
            <span className="font-display font-bold tracking-wide leading-none">
              CREATOR <span className="text-cyan-300">WAVE</span>
              <small className="block text-[9px] tracking-[.25em] text-slate-400 font-semibold mt-1">MINECRAFT COMMUNITY</small>
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-6 mx-auto text-sm text-slate-300" aria-label="Hauptnavigation">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? 'text-cyan-300 font-semibold' : 'hover:text-cyan-300')}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto lg:ml-0 flex items-center gap-2">
            <Link
              to="/support"
              className="hidden md:inline-flex text-xs font-bold border border-white/20 rounded-xl px-4 py-2.5 hover:bg-white/10"
            >
              Team-Login ↗
            </Link>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden w-10 h-10 grid place-items-center rounded-xl border border-white/15 bg-white/5"
              aria-label="Menü"
            >
              ☰
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="lg:hidden max-w-6xl mx-auto mt-2 glass rounded-2xl p-4 grid gap-1 text-sm">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className="px-3 py-2.5 rounded-xl hover:bg-white/10">
                {l.label}
              </NavLink>
            ))}
            <div className="flex gap-2 pt-2">
              <Link to="/support" className="flex-1 text-center rounded-xl bg-cyan-400 text-[#06222b] font-bold py-2.5">
                Support
              </Link>
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center rounded-xl border border-white/20 py-2.5 font-bold"
              >
                Discord ↗
              </a>
            </div>
          </div>
        )}
      </header>

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 mt-4 flex items-center justify-between text-[11px] tracking-widest text-slate-400 font-semibold">
        <span>MINECRAFT · GEMEINSAM BAUEN. GEMEINSAM ERLEBEN.</span>
        <span className="hidden sm:flex gap-4">
          <Link to="/impressum" className="hover:text-cyan-300">
            Impressum
          </Link>
          <Link to="/datenschutz" className="hover:text-cyan-300">
            Datenschutz
          </Link>
        </span>
      </div>

      <ScrollToTop />
      <Reveal className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <Outlet />
      </Reveal>

      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid gap-6 md:grid-cols-[1fr_2fr]">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" className="w-10 h-10 rounded-xl" alt="" />
            <span className="font-display font-bold">
              CREATOR <span className="text-cyan-300">WAVE</span>
              <small className="block text-[9px] tracking-[.25em] text-slate-400">GEMEINSAM. FAIR. KREATIV.</small>
            </span>
          </Link>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-300">
            <Link to="/regeln" className="hover:text-cyan-300">Regeln</Link>
            <Link to="/support" className="hover:text-cyan-300">Kontakt & Support</Link>
            <Link to="/appeal" className="hover:text-cyan-300">Entbannung</Link>
            <Link to="/news" className="hover:text-cyan-300">News & Community</Link>
            <Link to="/faq" className="hover:text-cyan-300">FAQ</Link>
            <Link to="/impressum" className="hover:text-cyan-300">Impressum</Link>
            <Link to="/datenschutz" className="hover:text-cyan-300">Datenschutz</Link>
          </nav>
        </div>
        <p className="text-center text-[11px] text-slate-500 pb-6">Ein unabhängiges Community-Projekt. Nicht mit Mojang oder Microsoft verbunden.</p>
      </footer>

      <button
        onClick={() => setKiOpen(true)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full pl-2 pr-5 py-2 glass-strong !border-cyan-300/40 hover:scale-105 transition"
        aria-label="KI-Assistent öffnen"
      >
        <span className="w-9 h-9 rounded-full grid place-items-center bg-gradient-to-br from-cyan-300 to-violet-500 text-[#06222b] font-bold">
          ✦
        </span>
        <span className="text-sm font-bold">Frag die KI</span>
      </button>
      <KiDialog open={kiOpen} onClose={() => setKiOpen(false)} />
    </div>
  )
}
