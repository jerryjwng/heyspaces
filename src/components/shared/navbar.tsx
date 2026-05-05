import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search, Minus, Plus, LayoutDashboard, UserCog, LogOut,
  PlusCircle, MessageSquare, User as UserIcon,
} from 'lucide-react';
import { useAuthContext } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';

interface NavbarProps {
  /** kept for backwards compat — ignored */
  onSearchClick?: () => void;
  hideSearch?: boolean;
}

type KatFilter = 'alle' | 'mieten' | 'wg_zimmer' | 'kaufen';

interface Draft {
  ort: string;
  kategorie: KatFilter;
  maxPreis: string;
  zimmer: number;
}

const KAT_OPTIONS: { key: KatFilter; label: string }[] = [
  { key: 'alle', label: 'Alle' },
  { key: 'mieten', label: 'Mieten' },
  { key: 'wg_zimmer', label: 'WG-Zimmer' },
  { key: 'kaufen', label: 'Kaufen' },
];

const PREIS_PRESETS = [
  { label: 'bis 500€', value: '500' },
  { label: 'bis 1.000€', value: '1000' },
  { label: 'bis 1.500€', value: '1500' },
  { label: 'bis 2.000€', value: '2000' },
  { label: '2.000€+', value: '99999' },
];

export function Navbar(_props: NavbarProps = {}) {
  const { user, signOut } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>({ ort: '', kategorie: 'alle', maxPreis: '', zimmer: 0 });
  const ortRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => ortRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // close profile dropdown on outside click
  useEffect(() => {
    if (!profileOpen) return;
    const onClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [profileOpen]);

  // close everything on route change
  useEffect(() => { setOpen(false); setProfileOpen(false); }, [location.pathname]);

  const handleSignOut = async () => {
    setProfileOpen(false);
    await signOut();
    navigate('/');
  };

  const apply = () => {
    const p = new URLSearchParams();
    if (draft.ort) p.set('stadt', draft.ort);
    if (draft.kategorie !== 'alle') p.set('kategorie', draft.kategorie);
    if (draft.maxPreis) p.set('maxPreis', draft.maxPreis);
    if (draft.zimmer > 0) p.set('zimmer', String(draft.zimmer));
    setOpen(false);
    navigate(`/inserate${p.toString() ? `?${p.toString()}` : ''}`);
  };

  const reset = () => setDraft({ ort: '', kategorie: 'alle', maxPreis: '', zimmer: 0 });

  const initials = user ? `${user.vorname[0] ?? ''}${user.nachname[0] ?? ''}`.toUpperCase() : '';

  // Result count is approximate UI hint — real count is filtered on /inserate.
  // We just say "Suchen" with no count to avoid misleading numbers across pages.

  return (
    <>
      <header className="sticky top-0 z-[100] h-[64px] border-b border-border bg-white/95 backdrop-blur-md md:h-[68px]">
        <div className="mx-auto flex h-full max-w-[1280px] items-center gap-4 px-4 md:px-8">
          {/* LEFT — Logo */}
          <Link to="/" className="shrink-0 text-[18px] font-bold tracking-[-0.025em] text-foreground">
            HeySpaces
          </Link>

          {/* CENTER — Search pill */}
          <div className="flex flex-1 justify-center">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="group flex h-11 w-full max-w-[480px] items-center gap-2.5 rounded-full border border-border bg-neutral px-5 text-left transition-colors hover:border-border-strong hover:bg-white"
            >
              <Search className="h-4 w-4 shrink-0 text-foreground-tertiary" />
              <span className="truncate text-[15px] text-foreground-tertiary">Wo möchtest du wohnen?</span>
            </button>
          </div>

          {/* RIGHT */}
          <div className="flex shrink-0 items-center gap-2">
            {!user ? (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="hidden rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-neutral md:inline-flex"
                >
                  Anmelden
                </button>
                <button
                  onClick={() => navigate('/registrieren')}
                  className="hidden rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-all hover:bg-primary-hover hover:-translate-y-px active:scale-[0.98] md:inline-flex"
                >
                  Registrieren
                </button>
                {/* Mobile: avatar icon goes to login */}
                <button
                  onClick={() => navigate('/login')}
                  aria-label="Anmelden"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-neutral text-foreground-secondary md:hidden"
                >
                  <UserIcon className="h-4 w-4" />
                </button>
              </>
            ) : (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen(o => !o)}
                  aria-label="Profilmenü"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-neutral text-[14px] font-semibold text-foreground-secondary transition-colors hover:border-border-strong"
                >
                  {initials}
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-[calc(100%+12px)] z-[110] min-w-[240px] rounded-2xl border border-border bg-white p-2 shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
                    <div className="flex items-center gap-3 px-3 py-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral text-[13px] font-semibold text-foreground-secondary">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{user.vorname} {user.nachname}</p>
                        <p className="truncate text-xs text-foreground-tertiary">{user.email}</p>
                      </div>
                    </div>
                    <div className="my-1 h-px bg-border" />
                    <MenuItem onClick={() => navigate('/dashboard')} icon={LayoutDashboard} label="Mein Dashboard" />
                    <MenuItem onClick={() => navigate('/inserate/neu')} icon={PlusCircle} label="Inserat erstellen" />
                    <MenuItem onClick={() => navigate('/anfragen')} icon={MessageSquare} label="Meine Anfragen" />
                    <MenuItem onClick={() => navigate('/profil')} icon={UserCog} label="Profil bearbeiten" />
                    <div className="my-1 h-px bg-border" />
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-status-red-fg transition-colors hover:bg-[hsl(var(--status-red-bg))]"
                    >
                      <LogOut className="h-4 w-4" /> Abmelden
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* SEARCH PANEL */}
      {open && (
        <>
          <div className="fixed inset-0 z-[120] animate-fade-in bg-black/40" onClick={() => setOpen(false)} />
          <div className="fixed inset-0 z-[130] flex h-full flex-col bg-white md:inset-x-auto md:left-1/2 md:top-[88px] md:h-auto md:max-h-[calc(100vh-110px)] md:w-[680px] md:-translate-x-1/2 md:overflow-y-auto md:rounded-[20px] md:shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
            {/* Mobile header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-4 md:hidden">
              <button onClick={() => setOpen(false)} className="text-sm font-medium text-foreground">← Schließen</button>
              <button onClick={reset} className="text-sm text-foreground-tertiary">Zurücksetzen</button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              {/* Wo */}
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.08em] text-foreground-tertiary">
                  Wo möchtest du wohnen?
                </label>
                <input
                  ref={ortRef}
                  value={draft.ort}
                  onChange={e => setDraft(d => ({ ...d, ort: e.target.value }))}
                  placeholder="Stadt, Stadtteil oder PLZ"
                  className="w-full rounded-xl bg-neutral px-[18px] py-[14px] text-[15px] text-foreground placeholder:text-foreground-tertiary focus:bg-white focus:outline-none focus:ring-2 focus:ring-foreground/10 border border-transparent focus:border-foreground"
                />
              </div>

              {/* Kategorie */}
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.08em] text-foreground-tertiary">Kategorie</label>
                <div className="flex flex-wrap gap-2">
                  {KAT_OPTIONS.map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => setDraft(d => ({ ...d, kategorie: opt.key }))}
                      className={cn(
                        'rounded-full px-5 py-2 text-sm font-medium transition-colors',
                        draft.kategorie === opt.key ? 'bg-foreground text-background' : 'bg-neutral text-foreground-secondary hover:bg-border',
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preis */}
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.08em] text-foreground-tertiary">Max. Preis</label>
                <div className="flex flex-wrap gap-2">
                  {PREIS_PRESETS.map(p => (
                    <button
                      key={p.value}
                      onClick={() => setDraft(d => ({ ...d, maxPreis: d.maxPreis === p.value ? '' : p.value }))}
                      className={cn(
                        'rounded-full px-5 py-2 text-sm font-medium transition-colors',
                        draft.maxPreis === p.value ? 'bg-foreground text-background' : 'bg-neutral text-foreground-secondary hover:bg-border',
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Zimmer */}
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.08em] text-foreground-tertiary">Zimmer</label>
                <div className="flex items-center gap-5">
                  <button
                    onClick={() => setDraft(d => ({ ...d, zimmer: Math.max(0, d.zimmer - 0.5) }))}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral text-foreground hover:bg-border disabled:opacity-40"
                    disabled={draft.zimmer === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-[3rem] text-center text-xl font-semibold text-foreground">
                    {draft.zimmer === 0 ? 'Beliebig' : draft.zimmer}
                  </span>
                  <button
                    onClick={() => setDraft(d => ({ ...d, zimmer: Math.min(10, (d.zimmer || 0) + 0.5) }))}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral text-foreground hover:bg-border"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 border-t border-border bg-white p-4 md:p-5">
              <button onClick={reset} className="text-[13px] text-foreground-secondary underline-offset-2 hover:text-foreground hover:underline">
                Zurücksetzen
              </button>
              <button
                onClick={apply}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-[15px] font-semibold text-background transition-colors hover:bg-primary-hover"
              >
                <Search className="h-4 w-4" />
                Suchen
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function MenuItem({ icon: Icon, label, onClick }: { icon: React.ComponentType<{ className?: string }>; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-foreground-secondary transition-colors hover:bg-neutral hover:text-foreground"
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}
