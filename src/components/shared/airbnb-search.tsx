import { useEffect, useRef, useState } from 'react';
import { Search, Minus, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GERMAN_CITIES } from '@/lib/mock-data';
import { Kategorie, KATEGORIE_LABELS } from '@/lib/types';

export type KatFilter = 'alle' | Kategorie;

export interface AirbnbSearchValues {
  ort: string;
  kategorie: KatFilter;
  maxPreis: string;
  zimmer: number;
}

interface Props {
  values: AirbnbSearchValues;
  onApply: (v: AirbnbSearchValues) => void;
  onReset: () => void;
  resultCount: number;
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

export function AirbnbSearch({ values, onApply, onReset, resultCount }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState<AirbnbSearchValues>(values);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const ortInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(values);
  }, [values]);

  useEffect(() => {
    if (expanded) {
      setTimeout(() => ortInputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [expanded]);

  const hasActive = !!(values.ort || values.kategorie !== 'alle' || values.maxPreis || values.zimmer > 0);

  const handleOrtChange = (v: string) => {
    setDraft(d => ({ ...d, ort: v }));
    setSuggestions(v ? GERMAN_CITIES.filter(c => c.toLowerCase().startsWith(v.toLowerCase())).slice(0, 5) : []);
  };

  const apply = () => {
    onApply(draft);
    setExpanded(false);
  };

  const reset = () => {
    const cleared: AirbnbSearchValues = { ort: '', kategorie: 'alle', maxPreis: '', zimmer: 0 };
    setDraft(cleared);
    onReset();
  };

  const summaryParts: string[] = [];
  if (values.ort) summaryParts.push(values.ort);
  if (values.kategorie !== 'alle') summaryParts.push(KATEGORIE_LABELS[values.kategorie]);
  if (values.maxPreis) summaryParts.push(`bis ${Number(values.maxPreis).toLocaleString('de-DE')}€`);
  if (values.zimmer > 0) summaryParts.push(`${values.zimmer}+ Zi.`);

  return (
    <>
      {/* Collapsed Pill — entire pill is the trigger */}
      <div className="px-4 py-4 md:px-12">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setExpanded(true)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(true); } }}
          className="mx-auto flex h-14 w-full max-w-[680px] cursor-pointer items-center rounded-pill border border-border-default bg-white pl-2 pr-1 text-left shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
        >
          {/* Wo */}
          <div className="flex flex-[2] flex-col px-6 min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-foreground">Wo?</span>
            <span className={cn('truncate text-[13px]', values.ort ? 'text-foreground font-medium' : 'text-foreground-tertiary')}>
              {values.ort || 'Stadt oder PLZ'}
            </span>
          </div>
          <div className="hidden h-6 w-px bg-border sm:block" />
          {/* Kategorie */}
          <div className="hidden flex-[1.5] flex-col px-5 sm:flex min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-foreground">Kategorie</span>
            <span className={cn('truncate text-[13px]', values.kategorie !== 'alle' ? 'text-foreground font-medium' : 'text-foreground-tertiary')}>
              {values.kategorie === 'alle' ? 'Alle Kategorien' : KATEGORIE_LABELS[values.kategorie]}
            </span>
          </div>
          <div className="hidden h-6 w-px bg-border sm:block" />
          {/* Zimmer */}
          <div className="hidden flex-1 flex-col px-5 sm:flex min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-foreground">Zimmer</span>
            <span className={cn('truncate text-[13px]', values.zimmer > 0 ? 'text-foreground font-medium' : 'text-foreground-tertiary')}>
              {values.zimmer > 0 ? `${values.zimmer}+` : 'Beliebig'}
            </span>
          </div>
          {/* Decorative search icon (entire pill is clickable) */}
          <span aria-hidden="true" className="relative ml-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
            <Search className="h-[18px] w-[18px]" />
            {hasActive && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-foreground ring-2 ring-white" />}
          </span>
        </div>

        {/* Active summary */}
        {hasActive && (
          <p className="mx-auto mt-3 max-w-[720px] text-center text-[13px] text-foreground-secondary">
            {summaryParts.join(' · ')}
            <button onClick={reset} className="ml-2 underline-offset-2 hover:underline hover:text-foreground">
              × Zurücksetzen
            </button>
          </p>
        )}
      </div>

      {/* Expanded Overlay + Panel */}
      {expanded && (
        <>
          <div
            className="fixed inset-0 z-40 animate-fade-in bg-black/40"
            onClick={() => setExpanded(false)}
          />
          {/* Mobile fullscreen / Desktop centered panel */}
          <div className="fixed inset-x-0 top-0 z-50 flex h-full flex-col bg-white md:inset-x-auto md:left-1/2 md:top-[88px] md:h-auto md:max-h-[calc(100vh-100px)] md:w-[720px] md:-translate-x-1/2 md:overflow-y-auto md:rounded-3xl md:shadow-[0_24px_80px_rgba(0,0,0,0.16)]">
            {/* Mobile header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-4 md:hidden">
              <button onClick={() => setExpanded(false)} className="text-sm font-medium">← Schließen</button>
              <button onClick={reset} className="text-sm text-foreground-tertiary">Zurücksetzen</button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              {/* Row 1 - Wo */}
              <div>
                <label className="mb-2 block text-[13px] font-semibold text-foreground">Wo möchtest du wohnen?</label>
                <div className="relative">
                  <input
                    ref={ortInputRef}
                    value={draft.ort}
                    onChange={e => handleOrtChange(e.target.value)}
                    placeholder="Stadt, Stadtteil oder PLZ"
                    className="w-full rounded-xl bg-neutral px-[18px] py-[14px] text-[15px] text-foreground placeholder:text-foreground-tertiary focus:bg-white focus:outline-none focus:ring-2 focus:ring-foreground/10 border border-transparent focus:border-foreground"
                  />
                  {suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-xl border border-border bg-white p-1 shadow-dropdown">
                      {suggestions.map(c => (
                        <button
                          key={c}
                          onClick={() => { setDraft(d => ({ ...d, ort: c })); setSuggestions([]); }}
                          className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-neutral"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Row 2 - Kategorie */}
              <div>
                <label className="mb-2 block text-[13px] font-semibold text-foreground">Was suchst du?</label>
                <div className="flex flex-wrap gap-2">
                  {KAT_OPTIONS.map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => setDraft(d => ({ ...d, kategorie: opt.key }))}
                      className={cn(
                        'rounded-pill px-5 py-2 text-sm font-medium transition-colors',
                        draft.kategorie === opt.key ? 'bg-foreground text-background' : 'bg-neutral text-foreground-secondary hover:bg-border'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 3 - Preis */}
              <div>
                <label className="mb-2 block text-[13px] font-semibold text-foreground">Maximaler Preis</label>
                <div className="flex flex-wrap gap-2">
                  {PREIS_PRESETS.map(p => (
                    <button
                      key={p.value}
                      onClick={() => setDraft(d => ({ ...d, maxPreis: d.maxPreis === p.value ? '' : p.value }))}
                      className={cn(
                        'rounded-pill px-5 py-2 text-sm font-medium transition-colors',
                        draft.maxPreis === p.value ? 'bg-foreground text-background' : 'bg-neutral text-foreground-secondary hover:bg-border'
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs text-foreground-tertiary">oder eigenen Betrag eingeben</p>
                <input
                  type="number"
                  value={draft.maxPreis}
                  onChange={e => setDraft(d => ({ ...d, maxPreis: e.target.value }))}
                  placeholder="z.B. 1.800"
                  className="mt-2 w-full rounded-xl bg-neutral px-[18px] py-[14px] text-[15px] text-foreground placeholder:text-foreground-tertiary focus:bg-white focus:outline-none focus:ring-2 focus:ring-foreground/10 border border-transparent focus:border-foreground"
                />
              </div>

              {/* Row 4 - Zimmer */}
              <div>
                <label className="mb-2 block text-[13px] font-semibold text-foreground">Mindestanzahl Zimmer</label>
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
            <div className="flex items-center justify-between gap-3 border-t border-border bg-white p-4 md:p-6">
              <button onClick={reset} className="text-[13px] text-foreground-secondary underline-offset-2 hover:text-foreground hover:underline">
                Alles zurücksetzen
              </button>
              <button
                onClick={apply}
                className="inline-flex items-center gap-2 rounded-pill bg-foreground px-8 py-3.5 text-[15px] font-semibold text-background transition-colors hover:bg-foreground/90"
              >
                <Search className="h-4 w-4" />
                {resultCount} Inserate anzeigen
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
