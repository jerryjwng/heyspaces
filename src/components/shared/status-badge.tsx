import { cn } from '@/lib/utils';

type StatusVariant = 'aktiv' | 'inaktiv' | 'verfuegbar' | 'reserviert' | 'vergeben' | 'offen' | 'gesehen' | 'beantwortet';

const variantStyles: Record<StatusVariant, string> = {
  aktiv: 'bg-status-green-bg text-status-green-fg',
  verfuegbar: 'bg-status-green-bg text-status-green-fg',
  inaktiv: 'bg-neutral text-foreground-secondary',
  reserviert: 'bg-status-yellow-bg text-status-yellow-fg',
  vergeben: 'bg-status-red-bg text-status-red-fg',
  offen: 'bg-status-yellow-bg text-status-yellow-fg',
  gesehen: 'bg-status-blue-bg text-status-blue-fg',
  beantwortet: 'bg-status-green-bg text-status-green-fg',
};

const variantLabels: Record<StatusVariant, string> = {
  aktiv: 'Aktiv',
  verfuegbar: 'Verfügbar',
  inaktiv: 'Inaktiv',
  reserviert: 'Reserviert',
  vergeben: 'Vergeben',
  offen: 'Offen',
  gesehen: 'Gesehen',
  beantwortet: 'Beantwortet',
};

interface StatusBadgeProps {
  variant: StatusVariant;
  className?: string;
}

export function StatusBadge({ variant, className }: StatusBadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-pill px-3 py-1 text-[11px] font-semibold tracking-[0.02em]', variantStyles[variant], className)}>
      {variantLabels[variant]}
    </span>
  );
}
