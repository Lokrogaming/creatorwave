import { Link } from 'react-router-dom'

export function Impressum() {
  return (
    <main className="max-w-3xl mx-auto py-10 w-full">
      <span className="chip">ANBIETERKENNZEICHNUNG</span>
      <h1 className="font-display text-5xl font-bold mt-3">Impressum.</h1>
      <div className="glass rounded-3xl p-7 mt-6 grid gap-4 text-sm text-slate-300">
        <div>
          <h2 className="font-bold text-white">Betreiber</h2>
          <p className="mt-1">
            <b>Christoph Herbst</b>
            <br />
            Trutzenweiler 47
            <br />
            88213 Ravensburg
            <br />
            Deutschland
            <br />
            E-Mail: <a className="text-cyan-300" href="mailto:christophh246@web.de">christophh246@web.de</a>
            <br />
            Creator Wave · creatorwave.de
          </p>
        </div>
        <div>
          <h2 className="font-bold text-white">Kontakt</h2>
          <p className="text-slate-400">
            Per E-Mail oder über unser <Link className="text-cyan-300" to="/support">Support-Ticketsystem</Link>.
          </p>
        </div>
        <div>
          <h2 className="font-bold text-white">Unabhängiges Projekt</h2>
          <p className="text-slate-400">Kein offizielles Minecraft-Angebot, weder von Mojang noch Microsoft unterstützt. Minecraft ist Marke der Rechteinhaber.</p>
        </div>
      </div>
      <p className="text-[11px] text-slate-500 mt-3 text-right">Stand: 22. September 2026</p>
    </main>
  )
}

export function Datenschutz() {
  return (
    <main className="max-w-3xl mx-auto py-10 w-full">
      <span className="chip">DEINE DATEN BEI CREATOR WAVE</span>
      <h1 className="font-display text-5xl font-bold mt-3">Datenschutz.</h1>
      <p className="text-sm text-slate-400 mt-2">Kurzfassung des Originals (22.09.2026). Volltext auf Anfrage / Original-Seite.</p>
      <div className="glass rounded-3xl p-7 mt-6 grid gap-5 text-sm text-slate-300">
        <div>
          <h2 className="font-bold text-white">1. Verantwortlicher</h2>
          <p className="text-slate-400 mt-1">Christoph Herbst, Trutzenweiler 47, 88213 Ravensburg – christophh246@web.de. Betrifft Website, Support-/Bannportal + Minecraft-Server.</p>
        </div>
        <div>
          <h2 className="font-bold text-white">2. Hosting</h2>
          <p className="text-slate-400 mt-1">IP, Zeitpunkt, URL, Status, Browserdaten für Betrieb/Fehler/Abwehr (Art. 6 Abs.1 f DSGVO). Hosting: netcup GmbH, Nürnberg/Deutschland.</p>
        </div>
        <div>
          <h2 className="font-bold text-white">3. Support & Anträge</h2>
          <p className="text-slate-400 mt-1">Name, Kategorie, Betreff, Nachricht + Codes zur Zuordnung. Keine Passwörter eintragen! Minecraft-Name ist nicht verifiziert.</p>
        </div>
        <div>
          <h2 className="font-bold text-white">4. News & Kommentare</h2>
          <p className="text-slate-400 mt-1">Beiträge öffentlich sichtbar. Kommentare mit Namen erst nach Freigabe; Löschcode sichern. Ungeprüfte werden nach 7 Tagen bereinigt.</p>
        </div>
        <div>
          <h2 className="font-bold text-white">5. Deine Rechte</h2>
          <p className="text-slate-400 mt-1">Auskunft, Berichtigung, Löschung, Einschränkung, Übertragbarkeit, Widerspruch + Beschwerde bei Aufsichtsbehörde. Kontakt siehe Impressum.</p>
        </div>
      </div>
    </main>
  )
}
