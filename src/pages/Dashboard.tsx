import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, Home, Plus, Bookmark, Send, Sparkles, Building2, Inbox, Eye, LucideIcon } from 'lucide-react';
import { Navbar } from '@/components/shared/navbar';
import { useAuthContext } from '@/contexts/auth-context';
import { mockUsers } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const IMG = (id: string, w = 200) => `https://images.unsplash.com/${id}?w=${w}&auto=format&fit=crop`;

type Mode = 'suchen' | 'anbieten';

const savedListings = [
  { id: '1', price: '€ 1.750 / Monat', title: 'Helle 3-Zimmer in Schwabing', meta: 'München · 78 m² · 3 Zi.', img: IMG('photo-1502672260266-1c1ef2d93688') },
  { id: '2', price: '€ 580 / Monat', title: 'WG-Zimmer Kreuzberg', meta: 'Berlin · 18 m² · 1 Zi.', img: IMG('photo-1545324418-cc1a3fa10c00') },
  { id: '4', price: '€ 1.680 / Monat', title: 'Altbauwohnung am Main', meta: 'Frankfurt · 110 m² · 4 Zi.', img: IMG('photo-1522708323590-d24dbb6b0267') },
];

const myRequests = [
  { title: 'Helle 3-Zimmer in Schwabing', date: '15.03.2025', status: 'beantwortet' as const },
  { title: 'WG-Zimmer Kreuzberg', date: '18.03.2025', status: 'gesehen' as const },
  { title: 'Altbauwohnung am Main', date: '20.03.2025', status: 'offen' as const },
];

const myListings = [
  { id: '1', title: 'Helle 3-Zimmer in Schwabing', meta: 'München · 3 Zi · 78m²', price: '€ 1.750 / Monat', status: 'aktiv' as const, anfragen: 3, img: IMG('photo-1502672260266-1c1ef2d93688') },
  { id: '7', title: 'Kompaktes Studio Maxvorstadt', meta: 'München · 1 Zi · 32m²', price: '€ 890 / Monat', status: 'aktiv' as const, anfragen: 5, img: IMG('photo-1560448204-e02f11c3d0e2') },
  { id: '99', title: 'Gartenhaus Nymphenburg', meta: 'München · 4 Zi · 130m²', price: '€ 2.400 / Monat', status: 'inaktiv' as const, anfragen: 0, img: IMG('photo-1484154218962-a197022b5858') },
];

const newAnfragen = [
  { initials: 'LM', name: 'Lena Müller', sub: 'Anfrage für: Helle 3-Zimmer in Schwabing', date: 'Heute, 14:23' },
  { initials: 'TK', name: 'Thomas Klein', sub: 'Anfrage für: Kompaktes Studio Maxvorstadt', date: 'Heute, 11:05' },
  { initials: 'AS', name: 'Anna Schmidt', sub: 'Anfrage für: Helle 3-Zimmer in Schwabing', date: 'Gestern, 18:42' },
];

const requestStatusStyle: Record<'offen' | 'gesehen' | 'beantwortet', string> = {
  offen: 'bg-status-yellow-bg text-status-yellow-fg',
  gesehen: 'bg-status-blue-bg text-status-blue-fg',
  beantwortet: 'bg-status-green-bg text-status-green-fg',
};
const requestStatusLabel: Record<'offen' | 'gesehen' | 'beantwortet', string> = {
  offen: 'Offen',
  gesehen: 'Gesehen',
  beantwortet: 'Beantwortet',
};

const StatCard = ({ label, value, sub, accent, delay, icon: Icon }: { label: string; value: string; sub?: string; accent?: boolean; delay: number; icon: LucideIcon }) => (
  <div
    className={cn(
      'rounded-2xl border px-7 py-6 opacity-0 animate-fade-in',
      accent ? 'border-[hsl(145_47%_85%)] bg-status-green-bg' : 'border-border bg-surface'
    )}
    style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
  >
    <div className="mb-3 flex items-center justify-between">
      <p className={cn('label-eyebrow', accent && 'text-status-green-fg')}>{label}</p>
      <Icon className={cn('h-[18px] w-[18px]', accent ? 'text-status-green-fg' : 'text-foreground-tertiary')} strokeWidth={1.75} />
    </div>
    <p className="text-[40px] font-bold leading-none tracking-[-0.03em] text-foreground">{value}</p>
    {sub && <p className="mt-2 text-[13px] text-foreground-tertiary">{sub}</p>}
  </div>
);

const Dashboard = () => {
  const { user, signIn } = useAuthContext();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('suchen');
  const [animKey, setAnimKey] = useState(0);

  // Demo: auto-sign-in as Max for preview
  useEffect(() => {
    if (!user) signIn(mockUsers[0].email, 'demo');
  }, [user, signIn]);

  const handleMode = (m: Mode) => {
    if (m === mode) return;
    setMode(m);
    setAnimKey(k => k + 1);
  };

  const firstName = user?.vorname ?? 'Max';

  return (
    <div className="min-h-screen bg-neutral">
      <Navbar />

      {/* Dashboard header */}
      <div>
        <div className="mx-auto flex max-w-[1200px] flex-col gap-5 px-4 py-6 md:flex-row md:items-center md:justify-between md:px-12">
          <div>
            <h1 className="text-[26px] font-bold tracking-[-0.015em] text-foreground">
              Guten Morgen, {firstName} 👋
            </h1>
            <p className="mt-1 text-sm text-foreground-secondary">Was möchtest du heute tun?</p>
          </div>

          <div className="flex w-full rounded-pill bg-surface p-1 md:w-auto">
            {(['suchen', 'anbieten'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => handleMode(m)}
                className={cn(
                  'flex-1 rounded-pill px-7 py-2 text-sm transition-all duration-200 md:flex-none',
                  mode === m
                    ? 'bg-primary font-semibold text-primary-foreground'
                    : 'font-medium text-foreground-tertiary hover:text-foreground'
                )}
              >
                {m === 'suchen' ? 'Suchen' : 'Anbieten'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="mx-auto max-w-[1200px] px-4 py-10 md:px-12">
        <div key={animKey} className="animate-fade-in">
          {mode === 'suchen' ? (
            <SuchenView navigate={navigate} />
          ) : (
            <AnbietenView navigate={navigate} />
          )}
        </div>
      </main>
    </div>
  );
};

/* ───────────────── SUCHEN ───────────────── */
const SuchenView = ({ navigate }: { navigate: ReturnType<typeof useNavigate> }) => (
  <>
    {/* Stats */}
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatCard label="Gespeicherte Inserate" value="12" delay={0} icon={Bookmark} />
      <StatCard label="Gesendete Anfragen" value="5" sub="2 noch offen" delay={80} icon={Send} />
      <StatCard label="Neue Inserate heute" value="24" sub="in deiner Umgebung" delay={160} icon={Sparkles} />
    </div>

    {/* Letzte Suchen */}
    <h2 className="mb-4 text-[18px] font-bold text-foreground">Deine letzten Suchen</h2>
    <div className="mb-8 flex flex-wrap gap-2">
      {['München · Mieten · bis 1.500€', 'Berlin · WG-Zimmer', 'Hamburg · Kaufen'].map(p => (
        <button
          key={p}
          onClick={() => navigate('/inserate')}
          className="inline-flex items-center gap-2 rounded-pill border border-border bg-surface px-[18px] py-2 text-[13px] text-foreground-secondary transition-colors hover:border-foreground"
        >
          <Search className="h-3.5 w-3.5 text-foreground-tertiary" />
          {p}
        </button>
      ))}
    </div>

    {/* Gespeicherte Inserate */}
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-[18px] font-bold text-foreground">Gespeicherte Inserate</h2>
      <Link to="/inserate" className="text-[13px] text-foreground-secondary transition-colors hover:text-foreground">
        Alle ansehen →
      </Link>
    </div>
    <div className="space-y-2">
      {savedListings.map(l => (
        <button
          key={l.id}
          onClick={() => navigate(`/inserate/${l.id}`)}
          className="flex w-full items-center gap-0 overflow-hidden rounded-xl border border-border bg-surface text-left transition-shadow hover:shadow-soft"
        >
          <img src={l.img} alt={l.title} className="h-[76px] w-24 flex-shrink-0 bg-neutral object-cover" />
          <div className="flex-1 px-[14px] py-[14px]">
            <p className="text-[15px] font-bold text-foreground">{l.price}</p>
            <p className="mt-0.5 truncate text-[13px] text-foreground-secondary">{l.title}</p>
            <p className="mt-1 text-[12px] text-foreground-tertiary">{l.meta}</p>
          </div>
          <div className="px-[14px]">
            <Heart className="h-[18px] w-[18px] fill-foreground text-foreground" />
          </div>
        </button>
      ))}
    </div>

    {/* Meine Anfragen */}
    <h2 className="mb-4 mt-8 text-[18px] font-bold text-foreground">Meine Anfragen</h2>
    <div className="space-y-2">
      {myRequests.map((r, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-4 transition-colors hover:bg-background"
        >
          <div>
            <p className="text-sm font-semibold text-foreground">{r.title}</p>
            <p className="mt-1 text-[12px] text-foreground-tertiary">Gesendet am {r.date}</p>
          </div>
          <span className={cn('rounded-pill px-3 py-1 text-[11px] font-semibold', requestStatusStyle[r.status])}>
            {requestStatusLabel[r.status]}
          </span>
        </div>
      ))}
    </div>
  </>
);

/* ───────────────── ANBIETEN ───────────────── */
const AnbietenView = ({ navigate }: { navigate: ReturnType<typeof useNavigate> }) => (
  <>
    {/* Stats */}
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatCard label="Aktive Inserate" value="3" delay={0} icon={Building2} />
      <StatCard label="Neue Anfragen" value="8" sub="seit letzter Woche" accent delay={80} icon={Inbox} />
      <StatCard label="Inserate Aufrufe" value="142" sub="diese Woche" delay={160} icon={Eye} />
    </div>

    {/* Meine Inserate */}
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-[18px] font-bold text-foreground">Meine Inserate</h2>
      <button
        onClick={() => navigate('/inserate/neu')}
        className="inline-flex items-center gap-1.5 rounded-pill bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground transition-all hover:bg-primary-hover hover:-translate-y-px"
      >
        <Plus className="h-3.5 w-3.5" />
        Neues Inserat
      </button>
    </div>

    <div className="space-y-2">
      {myListings.map(l => (
        <div
          key={l.id}
          className="flex items-center gap-4 rounded-xl border border-border bg-surface px-5 py-4 transition-colors hover:bg-background"
        >
          <img src={l.img} alt={l.title} className="h-16 w-20 flex-shrink-0 rounded-lg bg-neutral object-cover" />
          <div className="flex-1 min-w-0">
            <p className="truncate text-[15px] font-semibold text-foreground">{l.title}</p>
            <p className="mt-1 text-[12px] text-foreground-tertiary">{l.meta}</p>
            <p className="mt-1 text-[13px] text-foreground-secondary">{l.price}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className={cn(
                'rounded-pill px-3 py-1 text-[11px] font-semibold',
                l.status === 'aktiv' ? 'bg-status-green-bg text-status-green-fg' : 'bg-neutral text-foreground-secondary'
              )}
            >
              {l.status === 'aktiv' ? 'Aktiv' : 'Inaktiv'}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/inserate/${l.id}/bearbeiten`)}
                className="rounded-pill border border-border bg-transparent px-3.5 py-1 text-[12px] text-foreground-secondary transition-colors hover:border-foreground"
              >
                Bearbeiten
              </button>
              {l.anfragen > 0 && (
                <button
                  onClick={() => navigate('/anfragen')}
                  className="rounded-pill bg-status-blue-bg px-3.5 py-1 text-[12px] font-semibold text-status-blue-fg"
                >
                  Anfragen ({l.anfragen})
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Neue Anfragen */}
    <h2 className="mb-4 mt-8 text-[18px] font-bold text-foreground">Neue Anfragen</h2>
    <div className="space-y-2">
      {newAnfragen.map((a, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-4 transition-colors hover:bg-background"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-neutral text-[13px] font-semibold text-foreground-secondary">
              {a.initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{a.name}</p>
              <p className="mt-0.5 text-[12px] text-foreground-secondary">{a.sub}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-[11px] text-foreground-tertiary">{a.date}</span>
            <button
              onClick={() => navigate('/anfragen')}
              className="rounded-pill border border-border bg-transparent px-3.5 py-1 text-[12px] text-foreground-secondary transition-colors hover:border-foreground"
            >
              Details ansehen
            </button>
          </div>
        </div>
      ))}
    </div>
  </>
);

export default Dashboard;
