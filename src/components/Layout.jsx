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
      <div className="glass-strong !rounded-2xl overflow-hidden text-slate-100">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
          <b className="text-sm font-semibold">CreatorWave · KI-Assistent</b>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-white/10 text-slate-400 hover:text-white" aria-label="Schließen">
            ×
          </button>
        </div>
        <div className="p-4 max-h-[50vh] overflow-auto">
          {messages.map((m, i) => (
            <p
              key={i}
              className={`rounded-xl px-3 py-2 text-sm leading-relaxed mb-2 ${
                m.me ? 'bg-cyan-300/10 border border-cyan-300/20 ml-8' : 'bg-white/[.04] border border-white/10 mr-8'
              }`}
            >
              {m.text}
            </p>
          ))}
          {thinking && <p className="text-xs text-slate-500">Denkt nach…</p>}
        </div>
        <form onSubmit={send} className="p-4 border-t border-white/10">
          <textarea
            id="cw-ai-question"
            required
            maxLength={800}
            rows={2}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Was möchtest du wissen?"
            className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2.5 text-sm"
          />
          <div className="flex gap-2 mt-2">
            <button className="flex-1 rounded-xl bg-cyan-300 text-[#06222b] font-semibold py-2.5 text-sm hover:brightness-110">Senden</button>
            <Link to="/faq" onClick={onClose} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300">
              FAQ
            </Link>
          </div>
          <p className="text-[10px] text-slate-600 mt-2">KI kann Fehler machen. Keine Passwörter / Ticketcodes eingeben.</p>
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
    <div className="text-slate-200 antialiased min-h-screen flex flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-cyan-300 focus:text-black focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Zum Inhalt
      </a>

      <header className="sticky top-0 z-50 border-b border-white/[.07] bg-[#04070d]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="CreatorWave Logo" className="w-8 h-8 rounded-lg" />
            <span className="font-display font-bold tracking-wide text-[15px] text-white">
              CREATOR <span className="text-cyan-300">WAVE</span>
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-6 mx-auto text-sm text-slate-400" aria-label="Hauptnavigation">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? 'text-white font-medium' : 'hover:text-white transition-colors')}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto lg:ml-0 flex items-center gap-2">
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex text-[13px] font-semibold rounded-lg bg-cyan-300 text-[#06222b] px-4 py-2 hover:brightness-110 transition"
            >
              Discord
            </a>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden w-9 h-9 grid place-items-center rounded-lg border border-white/10 text-slate-300"
              aria-label="Menü"
            >
              ☰
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="lg:hidden border-t border-white/[.07] px-4 py-3 grid gap-1 text-sm text-slate-300">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className="px-3 py-2 rounded-lg hover:bg-white/5">
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <ScrollToTop />
      <Reveal className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <Outlet />
      </Reveal>

      <footer className="border-t border-white/[.07]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row gap-4 sm:items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo.png" className="w-7 h-7 rounded-lg" alt="" />
            <span className="font-display font-bold text-sm text-white">
              CREATOR <span className="text-cyan-300">WAVE</span>
            </span>
          </Link>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-slate-500 sm:ml-auto">
            <Link to="/regeln" className="hover:text-slate-200">Regeln</Link>
            <Link to="/support" className="hover:text-slate-200">Support</Link>
            <Link to="/appeal" className="hover:text-slate-200">Entbannung</Link>
            <Link to="/news" className="hover:text-slate-200">News</Link>
            <Link to="/faq" className="hover:text-slate-200">FAQ</Link>
            <Link to="/impressum" className="hover:text-slate-200">Impressum</Link>
            <Link to="/datenschutz" className="hover:text-slate-200">Datenschutz</Link>
          </nav>
        </div>
        <p className="text-center text-[11px] text-slate-600 pb-6">Unabhängiges Community-Projekt. Nicht mit Mojang oder Microsoft verbunden.</p>
      </footer>

      <button
        onClick={() => setKiOpen(true)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full pl-1.5 pr-4 py-1.5 bg-[#0b1320] border border-white/10 hover:border-cyan-300/40 transition shadow-lg shadow-black/50"
        aria-label="KI-Assistent öffnen"
      >
        <span className="w-8 h-8 rounded-full grid place-items-center bg-cyan-300/15 text-cyan-300 text-sm font-bold">✦</span>
        <span className="text-[13px] font-semibold text-slate-200">Frag die KI</span>
      </button>
      <KiDialog open={kiOpen} onClose={() => setKiOpen(false)} />
    </div>
  )
}
