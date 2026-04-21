import { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Inserat } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/auth-context';
import { toast } from '@/hooks/use-toast';

interface AnfrageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inserat: Inserat;
}

export function AnfrageModal({ open, onOpenChange, inserat }: AnfrageModalProps) {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    vorname: '',
    nachname: '',
    email: '',
    telefon: '',
    einzug_ab: '',
    nachricht: 'Hallo, ich interessiere mich für Ihre Wohnung...',
  });

  // Prefill from logged-in user
  useEffect(() => {
    if (open && user) {
      setForm(f => ({
        ...f,
        vorname: f.vorname || user.vorname || '',
        nachname: f.nachname || user.nachname || '',
        email: f.email || user.email || '',
      }));
    }
  }, [open, user]);

  // Redirect to login if not authenticated when opening
  useEffect(() => {
    if (open && !user) {
      onOpenChange(false);
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
    }
  }, [open, user, navigate, location.pathname, onOpenChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('anfragen').insert({
      inserat_id: inserat.id,
      sender_id: user.id,
      empfaenger_id: inserat.user_id,
      nachricht: form.nachricht,
      vorname: form.vorname,
      nachname: form.nachname,
      email: form.email || user.email,
      telefon: form.telefon || null,
      einzug_ab: form.einzug_ab || null,
      status: 'offen',
    });
    setLoading(false);

    if (error) {
      toast({
        title: 'Fehler beim Senden',
        description: 'Die Anfrage konnte nicht gesendet werden. Bitte versuche es erneut.',
        variant: 'destructive',
      });
      return;
    }

    // Mark profile as having sent a request
    await supabase.from('profiles').update({ has_requests: true }).eq('id', user.id);
    setSent(true);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => setSent(false), 300);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        {sent ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15">
              <Check className="h-7 w-7 text-success" />
            </div>
            <p className="text-lg font-medium">Ihre Anfrage wurde gesendet.</p>
            <Button variant="outline" className="rounded-full" onClick={handleClose}>
              Schließen
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Anfrage senden</DialogTitle>
              <DialogDescription className="truncate">{inserat.titel}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Vorname</Label>
                  <Input value={form.vorname} onChange={e => setForm({ ...form, vorname: e.target.value })} required />
                </div>
                <div>
                  <Label>Nachname</Label>
                  <Input value={form.nachname} onChange={e => setForm({ ...form, nachname: e.target.value })} required />
                </div>
              </div>
              <div>
                <Label>E-Mail</Label>
                <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <Label>Telefon <span className="text-muted-foreground">(optional)</span></Label>
                <Input value={form.telefon} onChange={e => setForm({ ...form, telefon: e.target.value })} />
              </div>
              <div>
                <Label>Einzug ab <span className="text-muted-foreground">(optional)</span></Label>
                <Input type="date" value={form.einzug_ab} onChange={e => setForm({ ...form, einzug_ab: e.target.value })} />
              </div>
              <div>
                <Label>Nachricht</Label>
                <Textarea rows={4} value={form.nachricht} onChange={e => setForm({ ...form, nachricht: e.target.value })} required />
              </div>
              <Button type="submit" disabled={loading} className="w-full rounded-full">
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Wird gesendet…</> : 'Anfrage senden'}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
