import { useState } from 'react';
import { Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Inserat } from '@/lib/types';

interface AnfrageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inserat: Inserat;
}

export function AnfrageModal({ open, onOpenChange, inserat }: AnfrageModalProps) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    vorname: '',
    nachname: '',
    email: '',
    telefon: '',
    einzug_ab: '',
    nachricht: 'Hallo, ich interessiere mich für Ihre Wohnung...',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => setSent(false), 300);
  };

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
              <Button type="submit" className="w-full rounded-full">Anfrage senden</Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
