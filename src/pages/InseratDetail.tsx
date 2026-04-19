import { useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MapPin, CheckCircle2, ChevronLeft, X, Check, Images, Calendar, Square, DoorOpen, Building2, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { mockInserate } from '@/lib/mock-data';
import { KATEGORIE_LABELS } from '@/lib/types';
import { cn } from '@/lib/utils';

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop',
];

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatEUR = (n?: number, decimals = 0) =>
  typeof n === 'number'
    ? `€ ${n.toLocaleString('de-DE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
    : '–';

const ANGEBOTSTYP_LABELS: Record<string, string> = {
  miete: 'Zur Miete',
  kauf: 'Zum Kauf',
  wg: 'WG-Zimmer',
};

const InseratDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const inserat = useMemo(() => mockInserate.find(i => i.id === id) ?? mockInserate[0], [id]);

  const ownerName = inserat.owner ? `${inserat.owner.vorname} ${inserat.owner.nachname}` : 'Anbieter';
  const initials = inserat.owner ? `${inserat.owner.vorname[0]}${inserat.owner.nachname[0]}` : '··';
  const memberSince = inserat.owner?.created_at
    ? new Date(inserat.owner.created_at).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })
    : 'Januar 2023';

  const isKauf = inserat.angebotstyp === 'kauf' || inserat.kategorie === 'kaufen';
  const kaltLabel = isKauf ? 'Kaufpreis' : 'Kaltmiete';
  const periodLabel = isKauf ? 'Kaufpreis' : 'pro Monat';

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar hideSearch />

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 pb-32 md:px-12 md:pb-20">
        {/* Breadcrumb */}
        <nav className="flex items-center justify-between py-4 text-[13px]">
          <p className="truncate text-muted-foreground">
            <Link to="/inserate" className="hover:text-foreground">Inserate</Link>
            <span className="mx-1.5">→</span>
            <span>{inserat.stadt}</span>
            <span className="mx-1.5">→</span>
            <span className="text-foreground">{inserat.titel}</span>
          </p>
          <button
            onClick={() => navigate('/inserate')}
            className="hidden items-center gap-1 text-[14px] text-muted-foreground transition-colors hover:text-foreground sm:flex"
          >
            <ChevronLeft className="h-4 w-4" /> Zurück zu Inseraten
          </button>
        </nav>

        {/* Photo Gallery */}
        <section className="relative mb-10 overflow-hidden rounded-[20px]">
          <div className="md:hidden">
            <div className="h-[260px] overflow-hidden rounded-[20px]">
              <img src={GALLERY_IMAGES[0]} alt={inserat.titel} className="h-full w-full object-cover" />
            </div>
            <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
              {GALLERY_IMAGES.slice(1).map((src, i) => (
                <img key={i} src={src} alt="" className="h-[120px] w-[180px] flex-shrink-0 rounded-xl object-cover" />
              ))}
            </div>
          </div>

          <div className="hidden h-[480px] gap-2 md:grid md:grid-cols-5">
            <div className="col-span-3 overflow-hidden rounded-l-[20px]">
              <img src={GALLERY_IMAGES[0]} alt={inserat.titel} className="h-full w-full object-cover" />
            </div>
            <div className="col-span-2 grid grid-cols-2 grid-rows-2 gap-2">
              {GALLERY_IMAGES.slice(1, 5).map((src, i) => (
                <div key={i} className={cn(
                  'overflow-hidden',
                  i === 1 && 'rounded-tr-[20px]',
                  i === 3 && 'rounded-br-[20px]',
                )}>
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
            <button className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/90 px-[18px] py-2 text-[13px] font-semibold text-foreground backdrop-blur-md transition-transform hover:scale-[1.02]">
              <Images className="h-4 w-4" /> Alle Fotos ansehen
            </button>
          </div>
        </section>

        {/* Two-column content */}
        <div className="grid grid-cols-1 gap-14 md:grid-cols-[1fr_380px]">
          {/* LEFT */}
          <div>
            {/* 2. Badges */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {inserat.objekttyp && (
                <span className="inline-block rounded-full bg-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-foreground">
                  {inserat.objekttyp}
                </span>
              )}
              <span className="inline-block rounded-full bg-[#E8F0FE] px-3 py-1 text-[11px] font-semibold text-[#1A3FAB]">
                {ANGEBOTSTYP_LABELS[inserat.angebotstyp ?? 'miete'] ?? KATEGORIE_LABELS[inserat.kategorie]}
              </span>
            </div>

            {/* 3. Titel */}
            <h1 className="mb-2 text-[32px] font-bold leading-tight tracking-[-0.5px] text-foreground">
              {inserat.titel}
            </h1>

            {/* 4. Standort */}
            <p className="mb-8 flex items-center gap-1.5 text-[15px] text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {inserat.strasse}{inserat.hausnummer ? ` ${inserat.hausnummer}` : ''}, {inserat.plz} {inserat.stadt}
              {inserat.stadtteil ? ` · ${inserat.stadtteil}` : ''}
            </p>

            {/* 5. Five key facts */}
            <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {[
                { Icon: DoorOpen, label: 'ZIMMER', value: String(inserat.zimmer) },
                { Icon: Square, label: 'FLÄCHE', value: `${inserat.flaeche} m²` },
                { Icon: Building2, label: 'ETAGE', value: inserat.etage != null ? `${inserat.etage}${inserat.gesamtgeschosse ? `/${inserat.gesamtgeschosse}` : ''}` : '–' },
                { Icon: Calendar, label: 'VERFÜGBAR', value: formatDate(inserat.verfuegbar_ab) },
                { Icon: Sparkles, label: 'ZUSTAND', value: inserat.objektzustand ?? '–' },
              ].map(s => (
                <div key={s.label} className="rounded-xl bg-muted px-4 py-4">
                  <s.Icon className="mb-2 h-4 w-4 text-muted-foreground" />
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{s.label}</p>
                  <p className="text-[15px] font-bold text-foreground">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="mb-10 h-px bg-border" />

            {/* 6. Beschreibung */}
            <section className="mb-10">
              <h2 className="mb-4 text-[18px] font-bold text-foreground">Beschreibung</h2>
              <p className="whitespace-pre-line text-[16px] leading-[1.7] text-muted-foreground">
                {inserat.beschreibung}
              </p>
            </section>

            <div className="mb-10 h-px bg-border" />

            {/* 7. Ausstattung */}
            {(inserat.ausstattung_innen?.length || inserat.ausstattung_aussen?.length) ? (
              <>
                <section className="mb-10">
                  <h2 className="mb-5 text-[18px] font-bold text-foreground">Ausstattung</h2>
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    {[
                      { title: 'Innen', items: inserat.ausstattung_innen ?? [] },
                      { title: 'Außen', items: inserat.ausstattung_aussen ?? [] },
                    ].map(group => (
                      <div key={group.title}>
                        <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{group.title}</p>
                        <ul className="space-y-2.5">
                          {group.items.map(item => (
                            <li key={item} className="flex items-center gap-2.5 text-[14px] text-foreground">
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#1A6B3C]" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
                <div className="mb-10 h-px bg-border" />
              </>
            ) : null}

            {/* 8. Kostenübersicht */}
            <section className="mb-10">
              <h2 className="mb-5 text-[18px] font-bold text-foreground">Kostenübersicht</h2>
              <div className="overflow-hidden rounded-xl bg-muted">
                {[
                  { label: kaltLabel, value: formatEUR(inserat.preis), bold: false },
                  { label: 'Nebenkosten', value: formatEUR(inserat.nebenkosten), bold: false },
                  { label: 'Heizkosten', value: formatEUR(inserat.heizkosten), bold: false },
                  ...(inserat.warmmiete != null ? [{ label: 'Warmmiete', value: formatEUR(inserat.warmmiete), bold: true }] : []),
                  { label: 'Preis / m²', value: inserat.preis_pro_qm != null ? `€ ${inserat.preis_pro_qm.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '–', bold: false },
                  { label: 'Kaution', value: formatEUR(inserat.kaution), bold: false },
                ].map((row, i, arr) => (
                  <div key={row.label} className={cn('flex items-center justify-between px-5 py-3.5', i < arr.length - 1 && 'border-b border-background/60')}>
                    <span className={cn('text-[14px]', row.bold ? 'font-bold text-foreground' : 'text-muted-foreground')}>{row.label}</span>
                    <span className={cn('text-[14px] tabular-nums', row.bold ? 'font-bold text-foreground' : 'font-semibold text-foreground')}>{row.value}</span>
                  </div>
                ))}
              </div>
            </section>

            <div className="mb-10 h-px bg-border" />

            {/* 9. Bausubstanz */}
            <section className="mb-10">
              <h2 className="mb-5 text-[18px] font-bold text-foreground">Bausubstanz</h2>
              <dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                {[
                  ['Baujahr', inserat.baujahr ? String(inserat.baujahr) : '–'],
                  ['Heizung', inserat.heizungsart ?? '–'],
                  ['Energieträger', inserat.energietraeger ?? '–'],
                  ['Zustand', inserat.objektzustand ?? '–'],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between border-b border-border py-3.5">
                    <dt className="text-[14px] text-muted-foreground">{k}</dt>
                    <dd className="text-[14px] font-semibold text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <div className="mb-10 h-px bg-border" />

            {/* 10. Energieausweis */}
            {(inserat.energieklasse || inserat.energieverbrauch != null) && (
              <>
                <section className="mb-10">
                  <h2 className="mb-5 text-[18px] font-bold text-foreground">Energieausweis</h2>
                  <div className="flex flex-wrap items-center gap-6 rounded-xl bg-muted p-6">
                    {inserat.energieklasse && (
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#1A6B3C] text-[40px] font-bold text-white">
                        {inserat.energieklasse}
                      </div>
                    )}
                    <div className="flex-1">
                      {inserat.energieverbrauch != null && (
                        <p className="text-[24px] font-bold text-foreground">
                          {inserat.energieverbrauch.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}{' '}
                          <span className="text-[14px] font-medium text-muted-foreground">kWh / (m²·a)</span>
                        </p>
                      )}
                      {inserat.energieausweis_typ && (
                        <p className="mt-1 text-[13px] text-muted-foreground">{inserat.energieausweis_typ}</p>
                      )}
                    </div>
                  </div>
                </section>
                <div className="mb-10 h-px bg-border" />
              </>
            )}

            {/* 11. Stichwörter */}
            {inserat.stichwoerter && inserat.stichwoerter.length > 0 && (
              <>
                <section className="mb-10">
                  <h2 className="mb-5 text-[18px] font-bold text-foreground">Stichwörter</h2>
                  <div className="flex flex-wrap gap-2">
                    {inserat.stichwoerter.map(tag => (
                      <span key={tag} className="rounded-full bg-muted px-4 py-2 text-[13px] font-medium text-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>
                <div className="mb-10 h-px bg-border" />
              </>
            )}

            {/* 12. Besichtigungshinweise */}
            {inserat.besichtigungshinweise && (
              <section>
                <h2 className="mb-3 text-[18px] font-bold text-foreground">Besichtigungshinweise</h2>
                <p className="text-[15px] leading-[1.7] text-muted-foreground">{inserat.besichtigungshinweise}</p>
              </section>
            )}
          </div>

          {/* RIGHT — sticky price card */}
          <aside className="hidden md:block">
            <div className="sticky top-[88px]">
              <div className="rounded-[20px] bg-card p-7 shadow-card">
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[13px] text-muted-foreground">{kaltLabel}</span>
                    <span className="text-[20px] font-bold text-foreground">{formatEUR(inserat.preis)}</span>
                  </div>
                  {inserat.warmmiete != null && !isKauf && (
                    <div className="flex items-baseline justify-between">
                      <span className="text-[13px] text-muted-foreground">Warmmiete</span>
                      <span className="text-[28px] font-bold tracking-[-0.5px] text-foreground">{formatEUR(inserat.warmmiete)}</span>
                    </div>
                  )}
                </div>
                <p className="mb-6 mt-1 text-[14px] text-muted-foreground">{periodLabel}</p>

                <div className="mb-6 h-px bg-border" />

                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-[14px] font-semibold text-foreground">
                    {initials}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-foreground">{ownerName}</p>
                    <p className="text-[12px] text-muted-foreground">Mitglied seit {memberSince}</p>
                  </div>
                </div>

                <button
                  onClick={() => setModalOpen(true)}
                  className="mb-3 w-full rounded-full bg-foreground px-4 py-4 text-[15px] font-semibold text-background transition-colors hover:bg-foreground/90"
                >
                  Anfrage senden
                </button>
                <button className="mb-6 w-full rounded-full border-[1.5px] border-foreground bg-transparent px-4 py-3.5 text-[15px] font-semibold text-foreground transition-colors hover:bg-muted">
                  Anbieter anrufen
                </button>

                <div className="rounded-xl bg-muted p-4">
                  {[
                    'Kostenlos & ohne Provision',
                    'Direkte Kommunikation',
                    'Sicher & transparent',
                  ].map((t, i, a) => (
                    <div key={t} className={cn('flex items-center gap-2 text-[13px] text-muted-foreground', i < a.length - 1 && 'mb-2')}>
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#1A6B3C]" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile sticky bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-border bg-card px-6 py-4 md:hidden">
        <div>
          <p className="text-[20px] font-bold leading-none text-foreground">
            {formatEUR(inserat.warmmiete ?? inserat.preis)}
          </p>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            {inserat.warmmiete ? 'Warmmiete' : periodLabel}
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-full bg-foreground px-6 py-3 text-[14px] font-semibold text-background"
        >
          Anfrage senden
        </button>
      </div>

      <Footer />

      {modalOpen && (
        <AnfrageModal
          titel={inserat.titel}
          ownerName={ownerName}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

/* ============================================================
   AnfrageModal
   ============================================================ */
function AnfrageModal({ titel, ownerName, onClose }: { titel: string; ownerName: string; onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    vorname: '', nachname: '', email: '', telefon: '', einzug_ab: '', nachricht: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const inputClass = 'w-full rounded-[10px] border-[1.5px] border-transparent bg-muted px-[18px] py-3.5 text-[15px] text-foreground transition-colors placeholder:text-muted-foreground focus:border-foreground focus:bg-background focus:outline-none';
  const labelClass = 'mb-2 block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground';

  return (
    <>
      <div className="fixed inset-0 z-50 animate-fade-in bg-black/50" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="fixed left-1/2 top-1/2 z-[51] w-[calc(100vw-32px)] max-w-[520px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-card p-8 shadow-card"
        style={{ maxHeight: '90vh' }}
      >
        <button
          onClick={onClose}
          aria-label="Schließen"
          className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-border"
        >
          <X className="h-4 w-4" />
        </button>

        {sent ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1A6B3C]/10">
              <Check className="h-7 w-7 text-[#1A6B3C]" />
            </div>
            <h3 className="text-[20px] font-bold text-foreground">Anfrage gesendet!</h3>
            <p className="mt-1.5 text-[14px] text-muted-foreground">{ownerName} wurde benachrichtigt.</p>
            <button
              onClick={onClose}
              className="mt-6 rounded-full bg-muted px-6 py-3 text-[14px] font-semibold text-foreground transition-colors hover:bg-border"
            >
              Schließen
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-[22px] font-bold text-foreground">Anfrage senden</h2>
            <p className="mb-7 mt-1.5 text-[14px] text-muted-foreground">{titel}</p>

            <form onSubmit={submit} className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Vorname</label>
                  <input required className={inputClass} value={form.vorname} onChange={e => setForm({ ...form, vorname: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Nachname</label>
                  <input required className={inputClass} value={form.nachname} onChange={e => setForm({ ...form, nachname: e.target.value })} />
                </div>
              </div>
              <div>
                <label className={labelClass}>E-Mail</label>
                <input required type="email" className={inputClass} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Telefon (optional)</label>
                <input type="tel" className={inputClass} value={form.telefon} onChange={e => setForm({ ...form, telefon: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Einzug ab (optional)</label>
                <input type="date" className={inputClass} value={form.einzug_ab} onChange={e => setForm({ ...form, einzug_ab: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Nachricht</label>
                <textarea
                  required
                  className={cn(inputClass, 'min-h-[120px] resize-y')}
                  placeholder="Hallo, ich interessiere mich für Ihre Wohnung und würde gerne mehr erfahren..."
                  value={form.nachricht}
                  onChange={e => setForm({ ...form, nachricht: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="mt-6 w-full rounded-full bg-foreground px-4 py-4 text-[15px] font-semibold text-background transition-colors hover:bg-foreground/90"
              >
                Anfrage senden
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
}

export default InseratDetail;
