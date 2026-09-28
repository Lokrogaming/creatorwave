import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DEFAULT_POSTS, addComment, addPost, deleteComment, getComments, getExtraPosts } from '../lib/hooks.jsx'
import { useToast } from '../lib/hooks.jsx'
import Modal from '../components/Modal.jsx'

export default function News() {
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('alle')
  const [extra, setExtra] = useState(() => getExtraPosts())
  const [active, setActive] = useState(null)
  const [comments, setComments] = useState([])
  const [newOpen, setNewOpen] = useState(false)
  const [hint, setHint] = useState('')

  const posts = useMemo(() => {
    const all = [...extra, ...DEFAULT_POSTS]
    const q = query.toLowerCase()
    return all.filter((p) => (filter === 'alle' || p.tag === filter) && (!q || (p.title + p.text).toLowerCase().includes(q)))
  }, [extra, query, filter])

  const openPost = (p) => {
    setActive(p)
    setComments(getComments(p.id))
    setHint('')
  }

  const submitComment = (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    const { id, code } = addComment(active.id, { name: fd.get('name'), text: fd.get('text') })
    setComments(getComments(active.id))
    setHint(`Kommentar gespeichert (Demo, „Freigabe“ simuliert). ID: ${id} · Löschcode: ${code} – gut sichern!`)
    toast(`Kommentar erstellt: ${id}`)
    e.target.reset()
  }

  const submitDelete = (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    const ok = deleteComment(fd.get('cid').trim(), fd.get('ccode').trim())
    toast(ok ? 'Kommentar entfernt' : 'ID/Code passt nicht (Demo)')
    if (ok && active) setComments(getComments(active.id))
  }

  const submitPost = (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    addPost({ title: fd.get('title'), text: fd.get('text'), img: fd.get('img') })
    setExtra(getExtraPosts())
    setNewOpen(false)
    toast('Beitrag veröffentlicht (Demo)')
  }

  return (
    <main>
      <section className="mt-8 glass rounded-3xl p-7 sm:p-10 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-25" alt="" />
        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="chip">MOMENTE AUS UNSERER BLOCKWELT</span>
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mt-3">
                News & <span className="text-cyan-300">Community.</span>
              </h1>
              <p className="text-slate-300/90 text-sm mt-3 max-w-xl">
                Bauprojekte, Updates und Geschichten vom Server – mit Bildern und Platz für Kommentare. Kommentare erscheinen nach Team-Freigabe.
              </p>
            </div>
            <button onClick={() => setNewOpen(true)} className="rounded-xl bg-cyan-400 text-[#06222b] text-xs font-bold px-4 py-2.5 hover:brightness-110">
              + Beitrag
            </button>
          </div>
          <div className="flex flex-wrap gap-3 mt-5">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Beiträge suchen …" className="bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm w-64" />
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm">
              <option value="alle">Alle Kategorien</option>
              <option>Update</option>
              <option>Community</option>
              <option>Guide</option>
              <option>Event</option>
              <option>Fair Play</option>
              <option>Start</option>
            </select>
            <button onClick={() => { setExtra(getExtraPosts()); toast('Aktualisiert') }} className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-bold hover:bg-white/10">
              ↻ Aktualisieren
            </button>
          </div>
        </div>
      </section>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {posts.map((p) => (
          <article key={p.id} className="glass glass-hover rounded-2xl overflow-hidden flex flex-col reveal visible">
            <div className="relative h-48 overflow-hidden">
              <img src={p.img} alt="" loading="lazy" className="w-full h-full object-cover hover:scale-105 transition duration-700" />
              <span className="absolute top-3 left-3 chip !py-1 !px-3">{p.tag}</span>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <span className="text-[11px] tracking-widest text-cyan-200/70 font-bold">{p.date} · TEAM</span>
              <h3 className="font-display font-bold text-lg mt-1 mb-2">{p.title}</h3>
              <p className="text-sm text-slate-300/90 line-clamp-3 flex-1">{p.text}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => openPost(p)} className="flex-1 rounded-xl bg-cyan-400 text-[#06222b] font-bold text-sm py-2.5 hover:brightness-110">
                  Lesen & Kommentare
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="grid md:grid-cols-2 gap-5 mt-10">
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display font-bold text-xl">Mehr als ein Server.</h2>
          <p className="text-sm text-slate-400 mt-2">
            Bleib respektvoll, teile keine privaten Daten und beachte die <Link to="/regeln" className="text-cyan-300 font-bold">Regeln</Link>.
          </p>
          <Link to="/faq" className="mt-3 inline-block text-sm font-bold text-cyan-300">
            Neu hier? Zum FAQ →
          </Link>
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display font-bold text-xl">Problem melden?</h2>
          <p className="text-sm text-slate-400 mt-2">Persönliches gehört ins private Ticket – nenne Beitrag + Kommentar.</p>
          <Link to="/support" className="mt-3 inline-block rounded-xl bg-cyan-400 text-[#06222b] text-sm font-bold px-4 py-2">
            Support öffnen →
          </Link>
        </div>
      </section>

      <section className="glass rounded-2xl p-6 mt-5">
        <h2 className="font-display font-bold text-lg">Eigenen Kommentar entfernen</h2>
        <p className="text-xs text-slate-400">Nutze ID + privaten Löschcode aus deiner Bestätigung. Bei Verlust hilft der Support.</p>
        <form onSubmit={submitDelete} className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 mt-3">
          <input name="cid" required placeholder="Kommentar-ID (z.B. C-AB12)" className="bg-black/30 border border-white/15 rounded-xl px-3 py-2.5 text-sm" />
          <input name="ccode" required placeholder="Privater Löschcode" className="bg-black/30 border border-white/15 rounded-xl px-3 py-2.5 text-sm" />
          <button className="rounded-xl border border-rose-300/40 text-rose-200 text-sm font-bold px-4 py-2.5 hover:bg-rose-500/10">Entfernen</button>
        </form>
      </section>

      {/* Post-Dialog */}
      <Modal open={!!active} onClose={() => setActive(null)} wide>
        {active && (
          <div className="glass-strong rounded-3xl overflow-hidden max-h-[88vh] flex flex-col text-slate-100">
            <img src={active.img} className="h-56 w-full object-cover" alt="" />
            <div className="p-6 overflow-auto">
              <p className="text-[11px] tracking-widest text-cyan-200 font-bold">{active.date} · {active.tag} · Team</p>
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display font-bold text-2xl">{active.title}</h3>
                <button onClick={() => setActive(null)} className="w-9 h-9 shrink-0 rounded-xl border border-white/15">
                  ×
                </button>
              </div>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">{active.text}</p>
              <div className="pixel-divider my-5" />
              <h4 className="font-bold text-sm">
                Kommentare <span className="text-xs font-normal text-slate-500">(Freigabe durch Team · Demo speichert lokal)</span>
              </h4>
              <div className="grid gap-2 mt-3">
                {comments.map((c) => (
                  <div key={c.id} className="rounded-xl bg-white/5 border border-white/10 p-3 text-sm">
                    <b className="text-cyan-200">{c.name}</b> <span className="text-[11px] opacity-60">#{c.id}</span>
                    <br />
                    {c.text}
                  </div>
                ))}
              </div>
              <form onSubmit={submitComment} className="grid gap-2 mt-4">
                <div className="grid sm:grid-cols-2 gap-2">
                  <input name="name" required pattern="[A-Za-z0-9_]{1,16}" maxLength={16} placeholder="Minecraft-Name" className="bg-black/30 border border-white/15 rounded-xl px-3 py-2.5 text-sm" />
                  <input name="code" placeholder="Löschcode merken (optional)" className="bg-black/30 border border-white/15 rounded-xl px-3 py-2.5 text-sm" />
                </div>
                <textarea name="text" required minLength={2} maxLength={500} rows={2} placeholder="Dein Kommentar …" className="bg-black/30 border border-white/15 rounded-xl px-3 py-2.5 text-sm" />
                <button className="rounded-xl bg-cyan-400 text-[#06222b] font-bold text-sm py-2.5">Kommentar senden (mit Freigabe)</button>
                {hint && <p className="text-xs text-cyan-200">{hint}</p>}
              </form>
            </div>
          </div>
        )}
      </Modal>

      {/* Neuer Beitrag */}
      <Modal open={newOpen} onClose={() => setNewOpen(false)}>
        <div className="glass-strong rounded-3xl p-6 sm:p-8 text-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <span className="chip">TEAM · NEUE GESCHICHTE</span>
              <h3 className="font-display font-bold text-2xl mt-2">Beitrag erstellen</h3>
            </div>
            <button onClick={() => setNewOpen(false)} className="w-9 h-9 rounded-xl border border-white/15">
              ×
            </button>
          </div>
          <form onSubmit={submitPost} className="grid gap-3 mt-4">
            <label className="text-xs font-bold">
              Titel
              <input name="title" required minLength={4} maxLength={80} placeholder="Titel" className="mt-1 w-full bg-black/30 border border-white/15 rounded-xl px-3 py-2.5 text-sm" />
            </label>
            <label className="text-xs font-bold">
              Beitrag
              <textarea name="text" required minLength={10} maxLength={2000} rows={4} placeholder="Deine Geschichte …" className="mt-1 w-full bg-black/30 border border-white/15 rounded-xl px-3 py-2.5 text-sm" />
            </label>
            <label className="text-xs font-bold">
              Bild-URL (optional)
              <input name="img" placeholder="https://…" className="mt-1 w-full bg-black/30 border border-white/15 rounded-xl px-3 py-2.5 text-sm" />
            </label>
            <p className="text-[11px] text-slate-500">Teile nur Bilder, die du veröffentlichen darfst. Demo speichert lokal.</p>
            <div className="flex gap-2">
              <button className="flex-1 rounded-xl bg-cyan-400 text-[#06222b] font-bold py-3 text-sm">Veröffentlichen</button>
              <button type="button" onClick={() => setNewOpen(false)} className="rounded-xl border border-white/20 px-5 py-3 text-sm font-bold">
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </main>
  )
}
