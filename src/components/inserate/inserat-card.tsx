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

  return (
    <Link to={`/inserate/${inserat.id}`} className="group block">
      <div className={cn('overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md', isInactive && 'opacity-75')}>
        {/* Image */}
        <div className="relative aspect-[4/3] bg-muted">
          <div className={cn('flex h-full items-center justify-center text-muted-foreground', isInactive && 'grayscale')}>
            <MapPin className="h-8 w-8" />
          </div>

          {/* Category badge */}
          <span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm">
            {KATEGORIE_LABELS[inserat.kategorie]}
          </span>

          {/* Favorite */}
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); onFavorite?.(inserat.id); }}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm hover:scale-110 transition-transform"
          >
            <Heart className={cn('h-4 w-4', isFavorite ? 'fill-destructive text-destructive' : 'text-muted-foreground')} />
          </button>

          {/* Status badge */}
          {(inserat.status === 'reserviert' || inserat.status === 'vergeben') && (
            <div className="absolute bottom-3 left-3">
              <StatusBadge variant={inserat.status} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-lg font-semibold">
            {inserat.kategorie === 'kaufen'
              ? `${inserat.preis.toLocaleString('de-DE')} €`
              : `${inserat.preis.toLocaleString('de-DE')} € / Monat`}
          </p>
          <p className="mt-1 truncate text-sm font-medium text-foreground">{inserat.titel}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {inserat.stadt} · {inserat.flaeche} m² · {inserat.zimmer} Zi.
          </p>

          {inserat.owner && (
            <>
              <div className="my-3 border-t border-border" />
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {inserat.owner.vorname[0]}{inserat.owner.nachname[0]}
                </div>
                <span className="text-xs text-muted-foreground">{inserat.owner.vorname} {inserat.owner.nachname}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
