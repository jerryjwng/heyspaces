import { Link } from 'react-router-dom';
import { Heart, Home, ArrowRight, Square, DoorOpen, MapPin } from 'lucide-react';
import { Inserat, KATEGORIE_LABELS } from '@/lib/types';
import { cn } from '@/lib/utils';

interface InseratCardProps {
  inserat: Inserat;
  isFavorite?: boolean;
  onFavorite?: (id: string) => void;
}

export function InseratCard({ inserat, isFavorite = false, onFavorite }: InseratCardProps) {
  const isInactive = inserat.status === 'vergeben';

  const priceLabel =
    inserat.kategorie === 'kaufen'
      ? `€ ${inserat.preis.toLocaleString('de-DE')}`
      : `€ ${inserat.preis.toLocaleString('de-DE')} / Monat`;

  return (
    <Link to={`/inserate/${inserat.id}`} className="group block">
      <article
        className={cn(
          'overflow-hidden rounded-[28px] bg-surface p-3 shadow-card transition-all duration-200 ease-out',
          'hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]',
          isInactive && 'opacity-60'
        )}
      >
        {/* Header: icon + title + address */}
        <div className="flex items-start gap-3 px-2 pt-2">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral">
            <Home className="h-5 w-5 text-foreground" strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[17px] font-semibold tracking-[-0.01em] text-foreground">
              {inserat.titel}
            </h3>
            <p className="mt-0.5 truncate text-[14px] text-foreground-tertiary">
              {inserat.strasse}, {inserat.plz} {inserat.stadt}
            </p>
          </div>
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); onFavorite?.(inserat.id); }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-neutral"
            aria-label="Favorit"
          >
            <Heart
              className={cn(
                'h-[18px] w-[18px] transition-colors',
                isFavorite ? 'fill-status-red-fg text-status-red-fg' : 'text-foreground-tertiary'
              )}
              strokeWidth={1.75}
            />
          </button>
        </div>

        {/* Feature pills */}
        <div className="mt-4 flex flex-wrap gap-2 px-2">
          <Pill>{KATEGORIE_LABELS[inserat.kategorie]}</Pill>
          <Pill icon={<Square className="h-3.5 w-3.5" strokeWidth={2} />}>{inserat.flaeche} m²</Pill>
          <Pill icon={<DoorOpen className="h-3.5 w-3.5" strokeWidth={2} />}>{inserat.zimmer} Zimmer</Pill>
          <Pill icon={<MapPin className="h-3.5 w-3.5" strokeWidth={2} />}>{inserat.stadt}</Pill>
        </div>

        {/* Image with floating CTA */}
        <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-[20px] bg-neutral">
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
              <Home className="h-10 w-10" strokeWidth={1.5} />
            </div>
          )}

          {/* Floating Details pill */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-[hsl(var(--sand))] py-1.5 pl-5 pr-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
            <span className="text-[14px] font-medium text-foreground">{priceLabel}</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background">
              <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function Pill({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-foreground">
      {icon}
      {children}
    </span>
  );
}
