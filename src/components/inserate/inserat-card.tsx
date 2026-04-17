import { Link } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';
import { Inserat, KATEGORIE_LABELS } from '@/lib/types';
import { StatusBadge } from '@/components/shared/status-badge';
import { cn } from '@/lib/utils';

interface InseratCardProps {
  inserat: Inserat;
  isFavorite?: boolean;
  onFavorite?: (id: string) => void;
}

export function InseratCard({ inserat, isFavorite = false, onFavorite }: InseratCardProps) {
  const isInactive = inserat.status === 'vergeben';
  const showStatus = inserat.status !== 'aktiv';

  return (
    <Link to={`/inserate/${inserat.id}`} className="group block">
      <article
        className={cn(
          'overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-200 ease-out',
          'hover:-translate-y-1 hover:border-border-default hover:shadow-card-hover',
          isInactive && 'opacity-60'
        )}
      >
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-sand">
          <div className={cn('flex h-full items-center justify-center text-foreground-tertiary transition-transform duration-300 group-hover:scale-[1.03]', isInactive && 'grayscale')}>
            <MapPin className="h-8 w-8" />
          </div>

          {/* Category */}
          <span className="absolute left-3 top-3 rounded-pill border border-white/60 bg-white/90 px-3 py-1 text-[11px] font-semibold text-foreground backdrop-blur-md">
            {KATEGORIE_LABELS[inserat.kategorie]}
          </span>

          {/* Favorite */}
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); onFavorite?.(inserat.id); }}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/90 backdrop-blur-md transition-transform hover:scale-110"
            aria-label="Favorit"
          >
            <Heart className={cn('h-[15px] w-[15px] transition-colors', isFavorite ? 'fill-status-red-fg text-status-red-fg' : 'text-foreground-secondary group-hover:text-foreground')} />
          </button>
        </div>

        {/* Content */}
        <div className="px-[22px] pb-4 pt-5">
          <p className="text-[20px] font-bold tracking-[-0.02em] text-foreground">
            {inserat.kategorie === 'kaufen'
              ? `${inserat.preis.toLocaleString('de-DE')} €`
              : `${inserat.preis.toLocaleString('de-DE')} € / Monat`}
          </p>
          <p className="mt-1.5 truncate text-sm font-medium leading-tight text-foreground">
            {inserat.titel}
          </p>
          <p className="mt-2 text-[13px] text-foreground-tertiary">
            {inserat.stadt} · {inserat.flaeche} m² · {inserat.zimmer} Zi.
          </p>
        </div>

        {/* Footer */}
        {(inserat.owner || showStatus) && (
          <div className="flex items-center justify-between border-t border-border px-[22px] py-3.5">
            {inserat.owner ? (
              <span className="text-[13px] font-medium text-foreground-secondary">
                {inserat.owner.vorname} {inserat.owner.nachname}
              </span>
            ) : <span />}
            {showStatus && <StatusBadge variant={inserat.status} />}
          </div>
        )}
      </article>
    </Link>
  );
}
