import { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [kategorie, setKategorie] = useState<Kategorie | ''>(
    (searchParams.get('kategorie') as Kategorie) || ''
  );
  const [maxPreis, setMaxPreis] = useState(searchParams.get('maxPreis') || '');
  const [zimmer, setZimmer] = useState(Number(searchParams.get('zimmer')) || 1);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleStadtChange = (value: string) => {
    setStadt(value);
    if (value.length > 0) {
      setSuggestions(GERMAN_CITIES.filter(c => c.toLowerCase().startsWith(value.toLowerCase())).slice(0, 5));
    } else {
      setSuggestions([]);
    }
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
    setStadt('');
    setKategorie('');
    setMaxPreis('');
    setZimmer(1);
  };

  if (!expanded) {
    return (
      <div className={cn(sticky && 'sticky top-16 z-40 bg-background border-b border-border')}>
        <div className="container mx-auto px-6 py-3">
          <button
            onClick={onToggle}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground hover:bg-secondary transition-colors"
          >
            <Search className="h-4 w-4" />
            Wo suchst du?
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('border-b border-border bg-card', sticky && 'sticky top-16 z-40')}>
      <div className="container mx-auto px-6 py-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Ort */}
          <div className="relative">
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Wo?</label>
            <Input
              placeholder="Stadt oder PLZ"
              value={stadt}
              onChange={e => handleStadtChange(e.target.value)}
              className="rounded-full"
            />
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 rounded-lg border border-border bg-card p-1 shadow-lg z-50">
                {suggestions.map(city => (
                  <button
                    key={city}
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-secondary"
                    onClick={() => { setStadt(city); setSuggestions([]); }}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Kategorie */}
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Kategorie</label>
            <div className="flex gap-2">
              {(Object.entries(KATEGORIE_LABELS) as [Kategorie, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setKategorie(kategorie === key ? '' : key)}
                  className={cn(
                    'rounded-full px-3 py-2 text-sm font-medium transition-colors',
                    kategorie === key
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Preis */}
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Max. Preis</label>
            <Input
              placeholder="bis €"
              type="number"
              value={maxPreis}
              onChange={e => setMaxPreis(e.target.value)}
              className="rounded-full"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {PREIS_PRESETS.map(p => (
                <button
                  key={p.value}
                  onClick={() => setMaxPreis(String(p.value))}
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs transition-colors',
                    maxPreis === String(p.value)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Zimmer */}
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Zimmer</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setZimmer(Math.max(1, zimmer - 0.5))}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-secondary"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[2rem] text-center text-sm font-medium">{zimmer}</span>
              <button
                onClick={() => setZimmer(Math.min(10, zimmer + 0.5))}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-secondary"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Action row */}
        <div className="mt-4 flex items-center justify-between">
          <Button variant="ghost" onClick={handleReset} className="text-muted-foreground">
            Filter zurücksetzen
          </Button>
          <Button className="rounded-full gap-2" onClick={handleSearch}>
            <Search className="h-4 w-4" /> Suchen
          </Button>
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
        <span key={chip.key} className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm">
          {chip.label}
          <button onClick={() => onRemove(chip.key)} className="text-muted-foreground hover:text-foreground">
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
    </div>
  );
}
