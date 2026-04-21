import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/auth-context';
import { toast } from '@/hooks/use-toast';

export function useFavoriten() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }
    setLoading(true);
    supabase
      .from('favoriten')
      .select('inserat_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setFavorites((data ?? []).map(d => d.inserat_id));
        setLoading(false);
      });
  }, [user]);

  const toggle = useCallback(
    async (inseratId: string) => {
      if (!user) {
        navigate('/login');
        return;
      }
      const isFav = favorites.includes(inseratId);
      // optimistic
      setFavorites(prev => (isFav ? prev.filter(i => i !== inseratId) : [...prev, inseratId]));

      if (isFav) {
        const { error } = await supabase
          .from('favoriten')
          .delete()
          .eq('user_id', user.id)
          .eq('inserat_id', inseratId);
        if (error) {
          setFavorites(prev => [...prev, inseratId]);
          toast({ title: 'Fehler', description: 'Favorit konnte nicht entfernt werden.', variant: 'destructive' });
        }
      } else {
        const { error } = await supabase
          .from('favoriten')
          .insert({ user_id: user.id, inserat_id: inseratId });
        if (error) {
          setFavorites(prev => prev.filter(i => i !== inseratId));
          toast({ title: 'Fehler', description: 'Favorit konnte nicht gespeichert werden.', variant: 'destructive' });
        }
      }
    },
    [favorites, user, navigate]
  );

  return { favorites, toggle, loading };
}
