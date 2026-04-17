import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Kategorie, KATEGORIE_LABELS } from '@/lib/types';
import { GERMAN_CITIES } from '@/lib/mock-data';

interface FilterBarProps {
  expanded?: boolean;
  onToggle?: () => void;
  sticky?: boolean;
}

const PREIS_PRESETS = [
  { label: 'bis 500€', value: 500 },
  { label: 'bis 1.000€', value: 1000 },
  { label: 'bis 1.500€', value: 1500 },
  { label: 'bis 2.000€', value: 2000 },
];

export function FilterBar({ expanded = false, onToggle, sticky = false }: FilterBarProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [stadt, setStadt] = useState(searchParams.get('stadt') || '');
  const [kategorie, setKategorie] = useState<Kategorie | ''>((searchParams.get('kategorie') as Kategorie) || '');
  const [maxPreis, setMaxPreis] = useState(searchParams.get('maxPreis') || '');
  const [zimmer, setZimmer] = useState(Number(searchParams.get('zimmer')) || 1);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleStadtChange = (value: string) => {
    setStadt(value);
    setSuggestions(value ? GERMAN_CITIES.filter(c => c.toLowerCase().startsWith(value.toLowerCase())).slice(0, 5) : []);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (stadt) params.set('stadt', stadt);
    if (kategorie) params.set('kategorie', kategorie);
    if (maxPreis) params.set('maxPreis', maxPreis);
    if (zimmer > 1) params.set('zimmer', String(zimmer));
    navigate(`/inserate?${params.toString()}`);
    onToggle?.();
  };

  const handleReset = () => {
    setStadt(''); setKategorie(''); setMaxPreis(''); setZimmer(1);
  };

  if (!expanded) {
    return (
      <div className={cn(sticky && 'sticky top-[68px] z-40 bg-background')}>
        <div className="mx-auto max-w-[1200px] px-6 py-4 md:px-12">
          <button
            onClick={onToggle}
            className="inline-flex items-center gap-2 rounded-pill border border-border bg-white px-5 py-3 text-sm font-medium text-foreground-secondary transition-colors hover:border-border-strong"
          >
            <Search className="h-4 w-4" />
            Wo suchst du?
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-background', sticky && 'sticky top-[68px] z-40')}>
      <div className="mx-auto max-w-[1200px] px-6 py-4 md:px-12">
        <div className="rounded-2xl border border-border bg-white p-2 shadow-soft">
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.4fr_1fr_0.9fr_auto] md:divide-x md:divide-border">
            {/* Ort */}
            <div className="relative px-6 py-3.5">
              <p className="label-eyebrow">Wo?</p>
              <input
                placeholder="Stadt oder PLZ"
                value={stadt}
                onChange={e => handleStadtChange(e.target.value)}
                className="mt-1 w-full bg-transparent text-[15px] font-medium text-foreground placeholder:text-foreground-tertiary focus:outline-none"
              />
              {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-border bg-white p-1 shadow-dropdown">
                  {suggestions.map(city => (
                    <button
                      key={city}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-neutral"
                      onClick={() => { setStadt(city); setSuggestions([]); }}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Kategorie */}
            <div className="px-6 py-3.5">
              <p className="label-eyebrow">Kategorie</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {(Object.entries(KATEGORIE_LABELS) as [Kategorie, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setKategorie(kategorie === key ? '' : key)}
                    className={cn(
                      'rounded-pill px-3 py-1 text-[13px] font-medium transition-colors',
                      kategorie === key ? 'bg-primary text-primary-foreground' : 'bg-neutral text-foreground-secondary hover:bg-[hsl(var(--border))]'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preis */}
            <div className="px-6 py-3.5">
              <p className="label-eyebrow">Max. Preis</p>
              <input
                placeholder="bis €"
                type="number"
                value={maxPreis}
                onChange={e => setMaxPreis(e.target.value)}
                className="mt-1 w-full bg-transparent text-[15px] font-medium text-foreground placeholder:text-foreground-tertiary focus:outline-none"
              />
              <div className="mt-2 flex flex-wrap gap-1">
                {PREIS_PRESETS.map(p => (
                  <button
                    key={p.value}
                    onClick={() => setMaxPreis(String(p.value))}
                    className={cn(
                      'rounded-pill px-2.5 py-0.5 text-[11px] font-medium transition-colors',
                      maxPreis === String(p.value) ? 'bg-primary text-primary-foreground' : 'bg-neutral text-foreground-tertiary hover:bg-[hsl(var(--border))]'
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Zimmer */}
            <div className="px-6 py-3.5">
              <p className="label-eyebrow">Zimmer</p>
              <div className="mt-1 flex items-center gap-3">
                <button
                  onClick={() => setZimmer(Math.max(1, zimmer - 0.5))}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground-secondary hover:bg-neutral"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="min-w-[2rem] text-center text-[15px] font-semibold">{zimmer}</span>
                <button
                  onClick={() => setZimmer(Math.min(10, zimmer + 0.5))}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground-secondary hover:bg-neutral"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Action */}
            <div className="flex items-stretch p-2">
              <button
                onClick={handleSearch}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                <Search className="h-4 w-4" /> Suchen
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 flex justify-end">
          <button onClick={handleReset} className="text-[13px] text-foreground-tertiary hover:text-foreground">
            Filter zurücksetzen
          </button>
        </div>
      </div>
    </div>
  );
}

interface FilterChipsProps {
  searchParams: URLSearchParams;
  onRemove: (key: string) => void;
}

export function FilterChips({ searchParams, onRemove }: FilterChipsProps) {
  const chips: { key: string; label: string }[] = [];

  const stadt = searchParams.get('stadt');
  if (stadt) chips.push({ key: 'stadt', label: stadt });
  const kategorie = searchParams.get('kategorie');
  if (kategorie) chips.push({ key: 'kategorie', label: KATEGORIE_LABELS[kategorie as Kategorie] || kategorie });
  const maxPreis = searchParams.get('maxPreis');
  if (maxPreis) chips.push({ key: 'maxPreis', label: `bis ${Number(maxPreis).toLocaleString('de-DE')}€` });
  const zimmer = searchParams.get('zimmer');
  if (zimmer) chips.push({ key: 'zimmer', label: `${zimmer} Zimmer` });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map(chip => (
        <span key={chip.key} className="inline-flex items-center gap-1.5 rounded-pill bg-primary px-3.5 py-1.5 text-[13px] font-medium text-primary-foreground">
          {chip.label}
          <button onClick={() => onRemove(chip.key)} className="opacity-70 hover:opacity-100">
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
    </div>
  );
}
