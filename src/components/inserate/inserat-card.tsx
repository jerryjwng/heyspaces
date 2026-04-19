import { Link } from 'react-router-dom';
import { Heart, MapPin, Square, DoorOpen } from 'lucide-react';
import { Inserat, KATEGORIE_LABELS } from '@/lib/types';
import { cn } from '@/lib/utils';

interface InseratCardProps {
  inserat: Inserat;
  isFavorite?: boolean;
  onFavorite?: (id: string) => void;
}

export function InseratCard({ inserat, isFavorite = false, onFavorite }: InseratCardProps) {
  const isInactive = inserat.status === 'vergeben';
  const initials = inserat.owner
    ? `${inserat.owner.vorname?.[0] ?? ''}${inserat.owner.nachname?.[0] ?? ''}`.toUpperCase()
    : '';
  const ownerShort = inserat.owner
    ? `${inserat.owner.vorname} ${inserat.owner.nachname?.[0] ?? ''}.`
    : '';

  return (
    <Link to={`/inserate/${inserat.id}`} className="group block">
      <article
        className={cn(
          'overflow-hidden rounded-2xl bg-surface transition-all duration-200 ease-out',
          'hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]',
          isInactive && 'opacity-60'
        )}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral">
          {inserat.bilder?.[0] ? (
            <img
              src={inserat.bilder[0]}
              alt={inserat.titel}
              loading="lazy"
              className={cn(
                'h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]',
                isInactive && 'grayscale'
              )}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-foreground-tertiary">
              <MapPin className="h-8 w-8" />
            </div>
          )}

          {/* Category pill — blue */}
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--status-blue-bg))] px-3 py-1.5 text-[13px] font-semibold text-[hsl(var(--status-blue-fg))]">
            <MapPin className="h-3.5 w-3.5" strokeWidth={2.25} />
            {KATEGORIE_LABELS[inserat.kategorie]}
          </span>

          {/* Favorite */}
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); onFavorite?.(inserat.id); }}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition-transform hover:scale-110"
            aria-label="Favorit"
          >
            <Heart
              className={cn(
                'h-[17px] w-[17px] transition-colors',
                isFavorite ? 'fill-status-red-fg text-status-red-fg' : 'text-foreground-secondary'
              )}
              strokeWidth={1.75}
            />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 pb-4 pt-5">
          <p className="text-[22px] font-bold tracking-[-0.02em] text-foreground">
            {inserat.kategorie === 'kaufen'
              ? `€ ${inserat.preis.toLocaleString('de-DE')}`
              : `€ ${inserat.preis.toLocaleString('de-DE')} / Monat`}
          </p>
          <p className="mt-1.5 truncate text-[15px] text-foreground-secondary">
            {inserat.titel}
          </p>

          {/* Detail icons row */}
          <div className="mt-4 flex items-center gap-5 text-[14px] text-foreground-tertiary">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-[15px] w-[15px]" strokeWidth={1.75} />
              {inserat.stadt}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Square className="h-[15px] w-[15px]" strokeWidth={1.75} />
              {inserat.flaeche} m²
            </span>
            <span className="inline-flex items-center gap-1.5">
              <DoorOpen className="h-[15px] w-[15px]" strokeWidth={1.75} />
              {inserat.zimmer} Zimmer
            </span>
          </div>
        </div>

        {/* Owner footer */}
        {inserat.owner && (
          <div className="gap-2.5 border-t border-border px-5 py-3.5 flex items-center justify-start font-sans">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral text-[11px] font-semibold text-foreground-secondary">
              {initials}
            </span>
            <span className="text-[14px] text-foreground-secondary">{ownerShort}</span>
          </div>
        )}
      </article>
    </Link>
  );
}
