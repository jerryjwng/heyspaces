import { useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MapPin, CheckCircle2, ChevronLeft, X, Check, Images } from 'lucide-react';
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

const formatPrice = (preis: number, kategorie: string) =>
  kategorie === 'kaufen'
    ? `€ ${preis.toLocaleString('de-DE')}`
    : `€ ${preis.toLocaleString('de-DE')} / Monat`;

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

  const priceLabel = formatPrice(inserat.preis, inserat.kategorie);
  const periodLabel = inserat.kategorie === 'kaufen' ? 'Kaufpreis' : 'pro Monat';

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAF8]">
      <Navbar hideSearch />

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 pb-32 md:px-12 md:pb-20">
        {/* Breadcrumb */}
        <nav className="flex items-center justify-between py-4 text-[13px]">
          <p className="truncate text-foreground-tertiary">
            <Link to="/inserate" className="hover:text-foreground">Inserate</Link>
            <span className="mx-1.5">→</span>
            <span>{inserat.stadt}</span>
            <span className="mx-1.5">→</span>
            <span className="text-foreground-secondary">{inserat.titel}</span>
          </p>
          <button
            onClick={() => navigate('/inserate')}
            className="hidden items-center gap-1 text-[14px] text-foreground-secondary transition-colors hover:text-foreground sm:flex"
          >
            <ChevronLeft className="h-4 w-4" /> Zurück zu Inseraten
          </button>
        </nav>

        {/* Photo Gallery */}
        <section className="relative mb-10 overflow-hidden rounded-[20px]">
          {/* Mobile: single image + scroll */}
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

          {/* Desktop: grid */}
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
            <span className="mb-4 inline-block rounded-full bg-[#E8F0FE] px-3 py-1 text-[11px] font-semibold text-[#1A3FAB]">
              {KATEGORIE_LABELS[inserat.kategorie]}
            </span>
            <h1 className="mb-2 text-[32px] font-bold leading-tight tracking-[-0.5px] text-foreground">
              {inserat.titel}
            </h1>
            <p className="mb-8 flex items-center gap-1.5 text-[15px] text-foreground-secondary">
              <MapPin className="h-4 w-4" />
              {inserat.strasse}, {inserat.plz} {inserat.stadt}
            </p>

            {/* Stats row */}
            <div className="mb-10 grid grid-cols-3 gap-3">
              {[
                { label: 'ZIMMER', value: String(inserat.zimmer) },
                { label: 'WOHNFLÄCHE', value: `${inserat.flaeche} m²` },
                { label: 'VERFÜGBAR AB', value: formatDate(inserat.verfuegbar_ab) },
              ].map(s => (
                <div key={s.label} className="rounded-xl bg-[#F5F5F3] px-5 py-4">
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground-tertiary">{s.label}</p>
                  <p className="text-[18px] font-bold text-foreground">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="mb-10 h-px bg-[#EBEBEB]" />

            {/* Description */}
            <section className="mb-10">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground-tertiary">BESCHREIBUNG</p>
              <p className="whitespace-pre-line text-[16px] leading-[1.7] text-foreground-secondary">
                {inserat.beschreibung}
              </p>
            </section>

            <div className="mb-10 h-px bg-[#EBEBEB]" />

            {/* Details */}
            <section>
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground-tertiary">DETAILS</p>
              <dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                {[
                  ['Kategorie', KATEGORIE_LABELS[inserat.kategorie]],
                  ['Preis', priceLabel],
                  ['Wohnfläche', `${inserat.flaeche} m²`],
                  ['Zimmer', String(inserat.zimmer)],
                  ['Verfügbar ab', formatDate(inserat.verfuegbar_ab)],
                  ['Adresse', `${inserat.plz} ${inserat.stadt}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between border-b border-[#F5F5F3] py-3.5">
                    <dt className="text-[14px] text-foreground-tertiary">{k}</dt>
                    <dd className="text-[14px] font-semibold text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>

          {/* RIGHT — sticky price card (desktop only) */}
          <aside className="hidden md:block">
            <div className="sticky top-[88px]">
              <div className="rounded-[20px] border border-[#EBEBEB] bg-white p-7">
                <p className="text-[28px] font-bold tracking-[-0.5px] text-foreground">{priceLabel}</p>
                <p className="mb-6 mt-1 text-[14px] text-foreground-tertiary">{periodLabel}</p>

                <div className="mb-6 h-px bg-[#EBEBEB]" />

                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#EBEBEB] bg-[#F5F5F3] text-[14px] font-semibold text-foreground-secondary">
                    {initials}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-foreground">{ownerName}</p>
                    <p className="text-[12px] text-foreground-tertiary">Mitglied seit {memberSince}</p>
                  </div>
                </div>

                <button
                  onClick={() => setModalOpen(true)}
                  className="mb-3 w-full rounded-full bg-foreground px-4 py-4 text-[15px] font-semibold text-background transition-colors hover:bg-foreground/90"
                >
                  Anfrage senden
                </button>
                <button className="mb-6 w-full rounded-full border-[1.5px] border-foreground bg-transparent px-4 py-3.5 text-[15px] font-semibold text-foreground transition-colors hover:bg-neutral">
                  Anbieter anrufen
                </button>

                <div className="rounded-xl bg-[#F5F5F3] p-4">
                  {[
                    'Kostenlos & ohne Provision',
                    'Direkte Kommunikation',
                    'Sicher & transparent',
                  ].map((t, i, a) => (
                    <div key={t} className={cn('flex items-center gap-2 text-[13px] text-foreground-secondary', i < a.length - 1 && 'mb-2')}>
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
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-[#EBEBEB] bg-white px-6 py-4 md:hidden">
        <div>
          <p className="text-[20px] font-bold leading-none text-foreground">€ {inserat.preis.toLocaleString('de-DE')}</p>
          <p className="mt-0.5 text-[13px] text-foreground-tertiary">{periodLabel}</p>
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
   AnfrageModal — inline custom design per spec
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

  const inputClass = 'w-full rounded-[10px] border-[1.5px] border-transparent bg-[#F5F5F3] px-[18px] py-3.5 text-[15px] text-foreground transition-colors placeholder:text-foreground-tertiary focus:border-foreground focus:bg-white focus:outline-none';
  const labelClass = 'mb-2 block text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground-tertiary';

  return (
    <>
      <div className="fixed inset-0 z-50 animate-fade-in bg-black/50" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="fixed left-1/2 top-1/2 z-[51] w-[calc(100vw-32px)] max-w-[520px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.16)]"
        style={{ maxHeight: '90vh' }}
      >
        <button
          onClick={onClose}
          aria-label="Schließen"
          className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F5F3] text-foreground-secondary transition-colors hover:bg-[#EBEBEB]"
        >
          <X className="h-4 w-4" />
        </button>

        {sent ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1A6B3C]/10">
              <Check className="h-7 w-7 text-[#1A6B3C]" />
            </div>
            <h3 className="text-[20px] font-bold text-foreground">Anfrage gesendet!</h3>
            <p className="mt-1.5 text-[14px] text-foreground-secondary">{ownerName} wurde benachrichtigt.</p>
            <button
              onClick={onClose}
              className="mt-6 rounded-full bg-[#F5F5F3] px-6 py-3 text-[14px] font-semibold text-foreground transition-colors hover:bg-[#EBEBEB]"
            >
              Schließen
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-[22px] font-bold text-foreground">Anfrage senden</h2>
            <p className="mb-7 mt-1.5 text-[14px] text-foreground-tertiary">{titel}</p>

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
