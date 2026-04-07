import { cn } from '@/lib/utils';

type StatusVariant = 'aktiv' | 'inaktiv' | 'verfuegbar' | 'reserviert' | 'vergeben' | 'offen' | 'gesehen' | 'beantwortet';

const variantStyles: Record<StatusVariant, string> = {
  aktiv: 'bg-success/15 text-success',
  verfuegbar: 'bg-success/15 text-success',
  inaktiv: 'bg-muted text-muted-foreground',
  reserviert: 'bg-warning/15 text-warning',
  vergeben: 'bg-destructive/15 text-destructive',
  offen: 'bg-warning/15 text-warning',
  gesehen: 'bg-info/15 text-info',
  beantwortet: 'bg-success/15 text-success',
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
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium', variantStyles[variant], className)}>
      {variantLabels[variant]}
    </span>
  );
}
