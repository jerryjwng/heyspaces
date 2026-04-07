import { Inserat } from '@/lib/types';
import { InseratCard } from './inserat-card';

interface InseratGridProps {
  inserate: Inserat[];
  favorites?: string[];
  onFavorite?: (id: string) => void;
}

export function InseratGrid({ inserate, favorites = [], onFavorite }: InseratGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {inserate.map(inserat => (
        <InseratCard
          key={inserat.id}
          inserat={inserat}
          isFavorite={favorites.includes(inserat.id)}
          onFavorite={onFavorite}
        />
      ))}
    </div>
  );
}
