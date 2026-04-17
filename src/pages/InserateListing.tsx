import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Minus, Plus, X, SlidersHorizontal } from 'lucide-react';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { InseratCard } from '@/components/inserate/inserat-card';
import { mockInserate, GERMAN_CITIES } from '@/lib/mock-data';
import { Kategorie, KATEGORIE_LABELS } from '@/lib/types';
import { cn } from '@/lib/utils';

type SortBy = 'newest' | 'price_asc' | 'price_desc' | 'size_asc';
type KatFilter = 'alle' | Kategorie;

const KAT_OPTIONS: { key: KatFilter; label: string }[] = [
  { key: 'alle', label: 'Alle' },
  { key: 'mieten', label: 'Mieten' },
  { key: 'wg_zimmer', label: 'WG-Zimmer' },
  { key: 'kaufen', label: 'Kaufen' },
];

const PAGE_SIZE = 9;

const InserateListing = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [ort, setOrt] = useState(searchParams.get('stadt') || '');
  const [kategorie, setKategorie] = useState<KatFilter>((searchParams.get('kategorie') as KatFilter) || 'alle');
  const [maxPreis, setMaxPreis] = useState(searchParams.get('maxPreis') || '');
  const [zimmer, setZimmer] = useState<number>(Number(searchParams.get('zimmer')) || 0);
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync URL
  useEffect(() => {
    const p = new URLSearchParams();
    if (ort) p.set('stadt', ort);
    if (kategorie !== 'alle') p.set('kategorie', kategorie);
    if (maxPreis) p.set('maxPreis', maxPreis);
    if (zimmer > 0) p.set('zimmer', String(zimmer));
    setSearchParams(p, { replace: true });
  }, [ort, kategorie, maxPreis, zimmer, setSearchParams]);

  const handleOrtChange = (v: string) => {
    setOrt(v);
    setSuggestions(v ? GERMAN_CITIES.filter(c => c.toLowerCase().startsWith(v.toLowerCase())).slice(0, 5) : []);
  };

  const filtered = useMemo(() => {
    let result = mockInserate.filter(i => {
      if (ort && !i.stadt.toLowerCase().includes(ort.toLowerCase())) return false;
      if (kategorie !== 'alle' && i.kategorie !== kategorie) return false;
      if (maxPreis && i.preis > Number(maxPreis)) return false;
      if (zimmer > 0 && i.zimmer < zimmer) return false;
      return true;
    });
    switch (sortBy) {
      case 'price_asc': result = [...result].sort((a, b) => a.preis - b.preis); break;
      case 'price_desc': result = [...result].sort((a, b) => b.preis - a.preis); break;
      case 'size_asc': result = [...result].sort((a, b) => a.flaeche - b.flaeche); break;
      default: result = [...result].sort((a, b) => b.created_at.localeCompare(a.created_at));
    }
    return result;
  }, [ort, kategorie, maxPreis, zimmer, sortBy]);

  const visible = showAll ? filtered : filtered.slice(0, PAGE_SIZE);
  const remaining = filtered.length - visible.length;

  const hasActiveFilters = !!(ort || kategorie !== 'alle' || maxPreis || zimmer > 0);

  const resetFilters = () => {
    setOrt(''); setKategorie('alle'); setMaxPreis(''); setZimmer(0); setSuggestions([]);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
  };

  const chips: { key: string; label: string; onRemove: () => void }[] = [];
  if (ort) chips.push({ key: 'ort', label: ort, onRemove: () => setOrt('') });
  if (kategorie !== 'alle') chips.push({ key: 'kat', label: KATEGORIE_LABELS[kategorie], onRemove: () => setKategorie('alle') });
  if (maxPreis) chips.push({ key: 'preis', label: `bis ${Number(maxPreis).toLocaleString('de-DE')} €`, onRemove: () => setMaxPreis('') });
  if (zimmer > 0) chips.push({ key: 'zi', label: `ab ${zimmer} Zimmer`, onRemove: () => setZimmer(0) });

  return (
    <div className="flex min-h-screen flex-col bg-sand">
      <Navbar />

      {/* Filter Bar - Desktop */}
      <div className="sticky top-[68px] z-40 hidden border-b border-border bg-white px-12 py-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] md:block">
        <div className="mx-auto flex max-w-[1200px] overflow-visible rounded-2xl border border-border bg-white shadow-soft">
          {/* Ort */}
          <div className="relative flex-1 px-6 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-foreground-tertiary">Wo?</p>
            <input
              value={ort}
              onChange={e => handleOrtChange(e.target.value)}
              placeholder="Stadt oder PLZ"
              className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-foreground-tertiary focus:outline-none"
            />
            {suggestions.length > 0 && (
              <div className="absolute left-2 right-2 top-full z-50 mt-2 rounded-xl border border-border bg-white p-1 shadow-dropdown">
                {suggestions.map(c => (
                  <button key={c} onClick={() => { setOrt(c); setSuggestions([]); }}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-neutral">{c}</button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px bg-border" />

          {/* Kategorie */}
          <div className="px-6 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-foreground-tertiary">Kategorie</p>
            <div className="mt-1 flex gap-1.5">
              {KAT_OPTIONS.map(opt => (
                <button key={opt.key} onClick={() => setKategorie(opt.key)}
                  className={cn('rounded-pill px-3 py-1 text-xs font-medium transition-colors',
                    kategorie === opt.key ? 'bg-foreground text-background' : 'bg-neutral text-foreground-secondary hover:bg-border')}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="w-px bg-border" />

          {/* Preis */}
          <div className="px-6 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-foreground-tertiary">Max. Preis</p>
            <input
              type="number" value={maxPreis} onChange={e => setMaxPreis(e.target.value)}
              placeholder="bis €"
              className="w-[100px] bg-transparent text-sm font-medium text-foreground placeholder:text-foreground-tertiary focus:outline-none"
            />
          </div>

          <div className="w-px bg-border" />

          {/* Zimmer */}
          <div className="px-6 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-foreground-tertiary">Zimmer</p>
            <div className="mt-0.5 flex items-center gap-2.5">
              <button onClick={() => setZimmer(Math.max(0, zimmer - 0.5))}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral hover:bg-border">
                <Minus className="h-3 w-3" />
              </button>
              <span className="min-w-[1.5rem] text-center text-sm font-medium">{zimmer === 0 ? '–' : zimmer}</span>
              <button onClick={() => setZimmer(Math.min(10, (zimmer || 0.5) + 0.5))}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral hover:bg-border">
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Search button */}
          <button className="flex items-center justify-center bg-foreground px-8 text-[15px] font-semibold text-background transition-colors hover:bg-foreground/90">
            Suchen
          </button>
        </div>

        {/* Active chips */}
        {hasActiveFilters && (
          <div className="mx-auto mt-3 flex max-w-[1200px] flex-wrap items-center gap-2">
            {chips.map(chip => (
              <span key={chip.key} className="inline-flex items-center gap-1.5 rounded-pill bg-foreground px-3.5 py-1.5 text-[13px] font-medium text-background">
                {chip.label}
                <button onClick={chip.onRemove} className="opacity-70 hover:opacity-100"><X className="h-3 w-3" /></button>
              </span>
            ))}
            <button onClick={resetFilters} className="ml-1 text-[13px] text-foreground-secondary underline-offset-2 hover:underline">
              Alle Filter zurücksetzen
            </button>
          </div>
        )}
      </div>

      {/* Mobile filter trigger */}
      <div className="sticky top-[60px] z-40 border-b border-border bg-white px-4 py-3 md:hidden">
        <button onClick={() => setMobileFilterOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-pill bg-neutral px-5 py-3 text-sm font-medium text-foreground-secondary">
          <SlidersHorizontal className="h-4 w-4" /> Filtern
        </button>
      </div>

      {/* Mobile filter overlay */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white md:hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-4">
            <button onClick={() => setMobileFilterOpen(false)} className="text-sm font-medium">← Schließen</button>
            <button onClick={resetFilters} className="text-sm text-foreground-tertiary">Zurücksetzen</button>
          </div>
          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-foreground-tertiary">Wo?</p>
              <input value={ort} onChange={e => setOrt(e.target.value)} placeholder="Stadt oder PLZ"
                className="w-full rounded-lg bg-neutral px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-foreground/10" />
            </div>
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-foreground-tertiary">Kategorie</p>
              <div className="flex flex-wrap gap-2">
                {KAT_OPTIONS.map(opt => (
                  <button key={opt.key} onClick={() => setKategorie(opt.key)}
                    className={cn('rounded-pill px-4 py-2 text-sm font-medium',
                      kategorie === opt.key ? 'bg-foreground text-background' : 'bg-neutral text-foreground-secondary')}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-foreground-tertiary">Max. Preis</p>
              <input type="number" value={maxPreis} onChange={e => setMaxPreis(e.target.value)} placeholder="bis €"
                className="w-full rounded-lg bg-neutral px-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-foreground/10" />
            </div>
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-foreground-tertiary">Zimmer</p>
              <div className="flex items-center gap-4">
                <button onClick={() => setZimmer(Math.max(0, zimmer - 0.5))} className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral"><Minus className="h-4 w-4" /></button>
                <span className="min-w-[2rem] text-center text-base font-semibold">{zimmer === 0 ? '–' : zimmer}</span>
                <button onClick={() => setZimmer(Math.min(10, (zimmer || 0.5) + 0.5))} className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral"><Plus className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
          <div className="border-t border-border p-4">
            <button onClick={() => setMobileFilterOpen(false)}
              className="w-full rounded-pill bg-foreground py-4 text-[15px] font-semibold text-background">
              Suchen ({filtered.length})
            </button>
          </div>
        </div>
      )}

      {/* Results header */}
      <div className="mx-auto w-full max-w-[1200px] px-6 pb-4 pt-8 md:px-12 md:pt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-base font-semibold text-foreground">
            {filtered.length} {filtered.length === 1 ? 'Inserat' : 'Inserate'} gefunden
          </h1>
          <div className="flex items-center gap-2">
            <label className="text-[13px] text-foreground-tertiary">Sortieren:</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as SortBy)}
              className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10">
              <option value="newest">Neueste zuerst</option>
              <option value="price_asc">Preis aufsteigend</option>
              <option value="price_desc">Preis absteigend</option>
              <option value="size_asc">Größe aufsteigend</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid or empty */}
      <div className="mx-auto w-full max-w-[1200px] flex-1 px-6 pb-20 md:px-12">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <Search className="h-12 w-12 text-border-strong" strokeWidth={1.5} />
            <h2 className="mt-6 text-xl font-semibold text-foreground">Keine Inserate gefunden</h2>
            <p className="mt-2 max-w-sm text-[15px] text-foreground-secondary">
              Versuche andere Filter oder setze sie zurück.
            </p>
            <button onClick={resetFilters}
              className="mt-6 rounded-pill bg-neutral px-7 py-3 text-sm font-medium text-foreground hover:bg-border">
              Filter zurücksetzen
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((inserat, i) => (
                <div key={inserat.id} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}>
                  <InseratCard inserat={inserat} isFavorite={favorites.includes(inserat.id)} onFavorite={toggleFavorite} />
                </div>
              ))}
            </div>
            {remaining > 0 && (
              <div className="mt-10 flex justify-center">
                <button onClick={() => setShowAll(true)}
                  className="rounded-pill border-[1.5px] border-foreground bg-transparent px-10 py-3.5 text-[15px] font-semibold text-foreground transition-colors hover:bg-neutral">
                  Weitere Inserate laden ({remaining})
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default InserateListing;
