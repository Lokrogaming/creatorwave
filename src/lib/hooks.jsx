import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { SERVER_IP } from '../data/content.js'

/* ---------- Toast (ersetzt #toast aus main.js) ---------- */
const ToastCtx = createContext((msg) => {})

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState('')
  const [visible, setVisible] = useState(false)
  const timer = useRef(null)

  const toast = useCallback((m) => {
    setMsg(m)
    setVisible(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setVisible(false), 2600)
  }, [])

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div
        id="toast"
        role="status"
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] glass-strong rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
          visible ? 'opacity-100 translate-y-0' : 'translate-y-24 opacity-0'
        }`}
      >
        {msg}
      </div>
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)

/* ---------- Copy helpers (copyIP + data-copy aus main.js) ---------- */
export function useCopy() {
  const toast = useToast()
  return useCallback(
    async (text, label) => {
      try {
        await navigator.clipboard.writeText(text)
      } catch {
        const t = document.createElement('textarea')
        t.value = text
        document.body.append(t)
        t.select()
        try {
          document.execCommand('copy')
        } catch {
          /* ignore */
        }
        t.remove()
      }
      toast(label || `Kopiert: ${text}`)
    },
    [toast],
  )
}

export const copyServerIp = (toast) => async () => {
  try {
    await navigator.clipboard.writeText(SERVER_IP)
    toast(`Serveradresse kopiert: ${SERVER_IP}`)
  } catch {
    toast(SERVER_IP)
  }
}

/* ---------- Server status (loadServerStatus aus main.js) ---------- */
export function useServerStatus() {
  const [status, setStatus] = useState({ state: 'loading', online: '—', note: 'Die Spielerzahl kommt direkt vom Minecraft-Server.' })

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const r = await fetch(`https://api.mcsrvstat.us/3/${SERVER_IP}`, { cache: 'no-store' })
        const j = await r.json()
        if (!alive) return
        if (j && j.online) {
          setStatus({
            state: 'online',
            online: `${j.players?.online ?? '—'} / ${j.players?.max ?? '—'}`,
            note: `Live vom Minecraft-Server · Version ${j.version || '1.21.11'}`,
          })
        } else {
          throw new Error('offline')
        }
      } catch {
        if (!alive) return
        setStatus({ state: 'offline', online: '—', note: 'Status gerade nicht abrufbar – versuch es direkt im Spiel.' })
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  return status
}

/* ---------- KI (KI_KB + kiAnswer aus main.js) ---------- */
export const KI_KB = [
  { k: ['beitritt', 'join', 'start', 'ip', 'adresse', 'server hinzufügen', 'version'], a: 'So kommst du drauf: Minecraft Java 1.21.11 starten → Mehrspieler → Server hinzufügen → Adresse `creatorwave.de` eintragen → Verbinden. Bei Fehlern Version + genaue Fehlermeldung im Support nennen.' },
  { k: ['regel', 'fair', 'ban', 'bann', 'cheat', 'x-ray', 'pvp', 'grief'], a: 'Kurzfassung Regeln: 1) Respekt, 2) Keine Cheats/X-Ray/Makros, 3) Fremde Builds/Kisten tabu, 4) PvP nur mit Zustimmung, 5) Bugs melden statt ausnutzen, 6) Kein Lag/Spam, 7) Kein Spam/Werbung, 8) Keine privaten Daten, 9) Support sachlich nutzen, 10) Verstöße → Hinweis bis Bann. Details auf /regeln.' },
  { k: ['command', 'befehl', 'home', 'tpa', 'spawn', 'cmi', 'skill'], a: 'Wichtigste Commands: /cmi spawn, /cmi sethome <name>, /cmi home <name>, /cmi tpa <spieler>, /cmi tpaccept, /cmi msg <spieler> <text>, /skills, /stats. Kurzformen wie /home funktionieren oft auch. Alle Details + Tabelle auf /faq.' },
  { k: ['support', 'ticket', 'hilfe', 'problem', 'melden', 'bug', 'fehler'], a: 'Support: Auf /support „Neues Ticket“ → Name, Kategorie, Betreff, Nachricht → privaten Ticketcode sichern! Damit unter „Mein Ticket öffnen“ Antworten lesen. Keine Passwörter eintragen.' },
  { k: ['entbann', 'appeal', 'bann-id', 'gesperrt'], a: 'Entbannung: Auf /appeal Minecraft-Name + Bann-ID vom Sperrbildschirm + ehrliche Erklärung eintragen. Statuscode sichern und später Status abrufen. Ein Antrag hebt den Bann nicht automatisch auf.' },
  { k: ['news', 'blog', 'bild', 'kommentar', 'post'], a: 'News: Auf /news postet das Team Bilder & Updates. Du kannst mit Minecraft-Namen kommentieren (Freigabe durch Team nötig). Löschcode aus Bestätigung sichern zum Entfernen.' },
  { k: ['discord'], a: 'Discord: https://discord.gg/yKjJM9BV9u – für Gespräche, Neuigkeiten und Austausch zwischen Sessions.' },
  { k: ['voice', 'sprachchat', 'timber', 'veinminer', 'grab', 'tod', 'sterb', 'aura'], a: 'Extras: AuraSkills via /skills, Gräber via AxGraves (nicht garantiert), Timber/VeinMiner nur an eigenen Blöcken, VoiceChat braucht Client-Mod + Taste V. Details auf /faq.' },
]

export function kiAnswer(q) {
  const s = q.toLowerCase()
  for (const e of KI_KB) if (e.k.some((k) => s.includes(k))) return e.a
  return 'Ich habe dich verstanden! Für: Regeln → /regeln, Commands → /faq, Hilfe → /support, Bann → /appeal, News → /news. Stell mir z.B. „Wie joine ich?“ oder „Welche Commands gibt es?“'
}

/* ---------- localStorage helpers (Tickets / Appeals / News aus main.js) ---------- */
const readJSON = (key, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(key) || 'null')
    return v ?? fallback
  } catch {
    return fallback
  }
}

export function createTicket({ name, category, subject, message }) {
  const code = `CW-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Date.now().toString(36).slice(-4).toUpperCase()}`
  const ticket = {
    code,
    name,
    cat: category,
    subj: subject,
    msg: message,
    ts: Date.now(),
    replies: [{ from: 'team', text: `Danke ${name}! Dein Ticket ist angekommen. Das Team meldet sich hier – behalte deinen Code gut.` }],
  }
  localStorage.setItem(`cw-ticket-${code}`, JSON.stringify(ticket))
  localStorage.setItem('cw-last-ticket', code)
  return ticket
}

export const getTicket = (code) => readJSON(`cw-ticket-${code}`, null)

export function createAppeal({ name, ban, text }) {
  const code = `AP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  localStorage.setItem(`cw-appeal-${code}`, JSON.stringify({ name, ban, text, ts: Date.now(), status: 'In Prüfung' }))
  return code
}

export const getAppeal = (code) => readJSON(`cw-appeal-${code}`, null)

export const DEFAULT_POSTS = [
  { id: 'spawn-update', title: 'Spawn-Update: Neue Wege & Deko', date: '22. Sep 2026', tag: 'Update', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop', text: 'Der Spawn hat neue Wege, Laternen und Infotafeln bekommen. Schau vorbei, sag Hallo und lies die Hinweise vor Ort – perfekt für deinen ersten Moment bei Creator Wave.' },
  { id: 'gemeinschaft', title: 'Community-Projekt: Brücke über den Fluss', date: '14. Sep 2026', tag: 'Community', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop', text: 'Vom ersten Block zum Großprojekt: Gemeinsam haben Spieler eine Brücke gebaut. Zeig deine Projekte im Discord und finde Mitbauer für deine Idee.' },
  { id: 'skills', title: 'Guide: AuraSkills, Gräber & Voice', date: '05. Sep 2026', tag: 'Guide', img: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1200&auto=format&fit=crop', text: 'Mit /skills siehst du deine Fähigkeiten, /stats deine Werte. Gräber entstehen nicht immer – verlass dich nicht darauf. VoiceChat braucht die passende Client-Mod (Taste V).' },
  { id: 'event', title: 'Event-Rückblick: Bauabend am See', date: '28. Aug 2026', tag: 'Event', img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop', text: 'Bilder, Updates, gemeinsame Momente: Beim Bauabend sind Hütten, Stege und viele Screenshots entstanden. Danke an alle, die dabei waren!' },
  { id: 'farm', title: 'Fair bleiben: Farmen & Redstone', date: '18. Aug 2026', tag: 'Fair Play', img: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=1200&auto=format&fit=crop', text: 'Betreibe Farmen so, dass andere nicht laggen – ungenutzte Anlagen abschalten. Das Team kann belastende Anlagen begrenzen. Details in Regel 06.' },
  { id: 'start', title: 'Neu hier? Dein Start in 3 Schritten', date: '10. Aug 2026', tag: 'Start', img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200&auto=format&fit=crop', text: '1) Minecraft Java 1.21.11 starten, 2) creatorwave.de als Server hinzufügen, 3) Verbinden & Hallo sagen. Vorher kurz Regeln lesen!' },
]

export const getExtraPosts = () => readJSON('cw-posts', [])
export function addPost({ title, text, img }) {
  const p = { id: `u${Date.now()}`, title, text, tag: 'Community', date: 'Jetzt · Demo', img: img || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop' }
  const extra = getExtraPosts()
  extra.unshift(p)
  localStorage.setItem('cw-posts', JSON.stringify(extra))
  return p
}

export const getComments = (postId) =>
  readJSON('cw-comments', {})[postId] || [{ name: 'Team', text: 'Willkommen in den Kommentaren! Bleib respektvoll – Freigabe durchs Team. (Demo-Kommentar)', id: 'demo' }]

export function addComment(postId, { name, text }) {
  const id = `C-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
  const code = Math.random().toString(36).slice(2, 8)
  const all = readJSON('cw-comments', {})
  all[postId] = [...(all[postId] || []), { name, text, id }]
  localStorage.setItem('cw-comments', JSON.stringify(all))
  localStorage.setItem(`cw-del-${id}`, code)
  return { id, code }
}

export function deleteComment(id, code) {
  if (localStorage.getItem(`cw-del-${id}`) !== code) return false
  const all = readJSON('cw-comments', {})
  for (const k of Object.keys(all)) all[k] = all[k].filter((c) => c.id !== id)
  localStorage.setItem('cw-comments', JSON.stringify(all))
  return true
}
