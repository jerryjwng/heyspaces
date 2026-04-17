import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { InseratCard } from '@/components/inserate/inserat-card';
import { AirbnbSearch, AirbnbSearchValues, KatFilter } from '@/components/shared/airbnb-search';
import { mockInserate } from '@/lib/mock-data';

type SortBy = 'newest' | 'price_asc' | 'price_desc' | 'size_asc';

const PAGE_SIZE = 9;

const InserateListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [values, setValues] = useState<AirbnbSearchValues>({
    ort: searchParams.get('stadt') || '',
    kategorie: (searchParams.get('kategorie') as KatFilter) || 'alle',
    maxPreis: searchParams.get('maxPreis') || '',
    zimmer: Number(searchParams.get('zimmer')) || 0,
  });

  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  // Sync URL whenever values change
  useEffect(() => {
    const p = new URLSearchParams();
    if (values.ort) p.set('stadt', values.ort);
    if (values.kategorie !== 'alle') p.set('kategorie', values.kategorie);
    if (values.maxPreis) p.set('maxPreis', values.maxPreis);
    if (values.zimmer > 0) p.set('zimmer', String(values.zimmer));
    setSearchParams(p, { replace: true });
  }, [values, setSearchParams]);

  const filtered = useMemo(() => {
    let result = mockInserate.filter(i => {
      if (values.ort && !i.stadt.toLowerCase().includes(values.ort.toLowerCase())) return false;
      if (values.kategorie !== 'alle' && i.kategorie !== values.kategorie) return false;
      if (values.maxPreis && i.preis > Number(values.maxPreis)) return false;
      if (values.zimmer > 0 && i.zimmer < values.zimmer) return false;
      return true;
    });
    switch (sortBy) {
      case 'price_asc': result = [...result].sort((a, b) => a.preis - b.preis); break;
      case 'price_desc': result = [...result].sort((a, b) => b.preis - a.preis); break;
      case 'size_asc': result = [...result].sort((a, b) => a.flaeche - b.flaeche); break;
      default: result = [...result].sort((a, b) => b.created_at.localeCompare(a.created_at));
    }
    return result;
  }, [values, sortBy]);

  const visible = showAll ? filtered : filtered.slice(0, PAGE_SIZE);
  const remaining = filtered.length - visible.length;

  const resetFilters = () => {
    setValues({ ort: '', kategorie: 'alle', maxPreis: '', zimmer: 0 });
  };

  const toggleFavorite = (id: string) => {
    setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
  };

  return (
    <div className="flex min-h-screen flex-col bg-sand">
      <Navbar hideSearch />

      {/* Airbnb-style search */}
      <div className="sticky top-[68px] z-30 border-b border-border bg-sand">
        <AirbnbSearch
          values={values}
          onApply={setValues}
          onReset={resetFilters}
          resultCount={filtered.length}
        />
      </div>

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
