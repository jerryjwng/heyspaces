import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Home, Users, Key, Sparkles, X, Upload, FileText, CheckCircle2,
  Minus, Plus, Loader2, Image as ImageIcon, Check, RotateCw, AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Navbar } from '@/components/shared/navbar';
import { useAuthContext } from '@/contexts/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

type Kategorie = 'mieten' | 'wg_zimmer' | 'kaufen' | '';
type Step = 1 | 2 | 3;

const STEPS = [
  { n: 1, label: 'Grunddaten' },
  { n: 2, label: 'Details' },
  { n: 3, label: 'Fotos' },
] as const;

const KATEGORIEN = [
  { value: 'mieten' as const, label: 'Mieten', Icon: Home },
  { value: 'wg_zimmer' as const, label: 'WG-Zimmer', Icon: Users },
  { value: 'kaufen' as const, label: 'Kaufen', Icon: Key },
];

const inputCls =
  'w-full rounded-[10px] border-[1.5px] border-transparent bg-[#F5F5F3] px-[18px] py-[14px] text-[15px] text-[#0C0C0C] placeholder:text-[#A8A8A8] transition-colors duration-150 focus:bg-white focus:border-[#0C0C0C] focus:outline-none';

const labelCls =
  'mb-3 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#A8A8A8]';

function ProgressIndicator({ current }: { current: Step }) {
  return (
    <div className="mb-10 flex items-center">
      {STEPS.map((s, i) => {
        const done = current > s.n;
        const active = current === s.n;
        const reached = active || done;
        return (
          <div key={s.n} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-semibold transition-colors',
                  reached
                    ? 'bg-[#0C0C0C] text-white'
                    : 'border-[1.5px] border-[#EBEBEB] bg-white text-[#A8A8A8]',
                )}
              >
                {done ? <Check className="h-4 w-4" /> : s.n}
              </div>
              <span
                className={cn(
                  'mt-2 text-[12px] font-medium',
                  active ? 'text-[#0C0C0C]' : 'text-[#A8A8A8]',
                )}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  'mx-3 -mt-6 h-px flex-1',
                  current > s.n ? 'bg-[#0C0C0C]' : 'bg-[#EBEBEB]',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ───────── AI Assistant Modal ─────────
function AIAssistantModal({
  open,
  onClose,
  onApply,
  flaeche,
}: {
  open: boolean;
  onClose: () => void;
  onApply: (text: string) => void;
  flaeche: string;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [hints, setHints] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [generated, setGenerated] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const reset = () => { setState('idle'); setGenerated(''); };
  const handleClose = () => { reset(); setFiles([]); setHints(''); onClose(); };
  const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
  };
  const generate = () => {
    setState('loading');
    setTimeout(() => {
      const sizeText = flaeche ? `${flaeche} m²` : 'großzügigen';
      const text = `Diese attraktive Wohnung befindet sich in einer begehrten Lage und überzeugt durch ihre hochwertige Ausstattung. Die lichtdurchfluteten Räume bieten großzügigen Wohnkomfort auf ${sizeText} Wohnfläche. Die moderne Einbauküche sowie das stilvolle Bad wurden liebevoll gestaltet. Dank der optimalen Verkehrsanbindung sind Sie schnell in der Innenstadt. Ruhige Innenlage garantiert entspanntes Wohnen. Verfügbar ab sofort — vereinbaren Sie noch heute einen Besichtigungstermin.`;
      setGenerated(text);
      setState('success');
    }, 2000);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={handleClose} />
      <div className="fixed left-1/2 top-1/2 z-[51] w-[calc(100%-32px)] max-w-[560px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[24px] bg-white p-8 shadow-2xl max-h-[90vh]">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#0C0C0C]" />
              <h2 className="text-[20px] font-bold tracking-[-0.3px] text-[#0C0C0C]">KI-Assistent</h2>
            </div>
            <p className="ml-[28px] mt-1.5 max-w-[440px] text-[14px] leading-snug text-[#6B6B6B]">
              Lade Unterlagen hoch oder beschreibe deine Wohnung kurz — die KI erstellt den Rest.
            </p>
          </div>
          <button onClick={handleClose} className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F5F3] text-[#6B6B6B] transition-colors hover:bg-[#EBEBEB]">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="my-5 h-px bg-[#EBEBEB]" />
        <label className={labelCls}>UNTERLAGEN HOCHLADEN</label>
        <div onClick={() => fileRef.current?.click()} className="cursor-pointer rounded-[16px] border-2 border-dashed border-[#D4D4D0] bg-[#F5F5F3] p-6 text-center transition-colors hover:border-[#0C0C0C] hover:bg-[#EBEBEB]">
          <Upload className="mx-auto h-8 w-8 text-[#A8A8A8]" />
          <p className="mt-3 text-[14px] font-semibold text-[#0C0C0C]">Exposé, PDF oder Fotos</p>
          <p className="mt-1 text-[12px] text-[#A8A8A8]">PDF, JPG, PNG bis 10MB</p>
          <input ref={fileRef} type="file" accept=".pdf,image/*" multiple onChange={handleFiles} className="hidden" />
        </div>
        {files.length > 0 && (
          <div className="mt-2 space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between rounded-[10px] border border-[#EBEBEB] bg-white px-3.5 py-2.5">
                <div className="flex items-center gap-2 text-[13px] text-[#0C0C0C]">
                  <FileText className="h-4 w-4 text-[#6B6B6B]" />
                  <span className="truncate">{f.name}</span>
                </div>
                <button onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-[#A8A8A8] hover:text-[#0C0C0C]">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        <label className={cn(labelCls, 'mt-5')}>ZUSÄTZLICHE HINWEISE</label>
        <textarea value={hints} onChange={e => setHints(e.target.value)} placeholder="Was ist besonders an dieser Wohnung? z.B. renoviert 2023, ruhige Innenlage, Einbauküche vorhanden..." className={cn(inputCls, 'min-h-[100px] resize-y')} />
        <div className="mt-6">
          {state === 'idle' && (
            <button onClick={generate} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0C0C0C] px-4 py-4 text-[15px] font-semibold text-white transition-all hover:bg-[#2A2A2A] active:scale-[0.99]">
              <Sparkles className="h-4 w-4" />
              Beschreibung generieren
            </button>
          )}
          {state === 'loading' && (
            <>
              <button disabled className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0C0C0C] px-4 py-4 text-[15px] font-semibold text-white opacity-80">
                <Loader2 className="h-4 w-4 animate-spin" />
                Generiere...
              </button>
              <p className="mt-4 text-center text-[13px] text-[#6B6B6B]">KI analysiert deine Angaben...</p>
            </>
          )}
          {state === 'success' && (
            <div className="rounded-[16px] bg-[#E8F5EE] p-5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-[18px] w-[18px] text-[#1A6B3C]" />
                <span className="text-[14px] font-bold text-[#1A6B3C]">Beschreibung erstellt!</span>
              </div>
              <p className="mt-2 line-clamp-3 text-[13px] text-[#6B6B6B]">{generated.slice(0, 180)}...</p>
              <div className="mt-4 flex gap-2.5">
                <button onClick={() => { onApply(generated); handleClose(); }} className="rounded-full bg-[#0C0C0C] px-6 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#2A2A2A]">
                  Übernehmen
                </button>
                <button onClick={reset} className="rounded-full border-[1.5px] border-[#EBEBEB] px-6 py-2.5 text-[14px] text-[#6B6B6B] transition-colors hover:border-[#0C0C0C] hover:text-[#0C0C0C]">
                  Neu generieren
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ───────── Main page ─────────
export default function InseratNeu() {
  const navigate = useNavigate();
  const { id: editId } = useParams<{ id: string }>();
  const { user } = useAuthContext();
  const isEdit = Boolean(editId);

  const [step, setStep] = useState<Step>(1);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(isEdit);

  // form state
  const [kategorie, setKategorie] = useState<Kategorie>('');
  const [titel, setTitel] = useState('');
  const [beschreibung, setBeschreibung] = useState('');
  const [preis, setPreis] = useState('');
  const [preisUnit, setPreisUnit] = useState<'monat' | 'kauf'>('monat');
  const [flaeche, setFlaeche] = useState('');
  const [zimmer, setZimmer] = useState(1);
  const [verfuegbar, setVerfuegbar] = useState('');
  const [strasse, setStrasse] = useState('');
  const [hausnr, setHausnr] = useState('');
  const [plz, setPlz] = useState('');
  const [stadt, setStadt] = useState('');
  type PhotoStatus = 'existing' | 'uploading' | 'done' | 'error';
  type Photo = {
    id: string;
    url: string;          // preview blob URL while uploading, public URL when done/existing
    file?: File;
    path?: string;        // storage path once uploaded
    status: PhotoStatus;
  };
  const [photos, setPhotos] = useState<Photo[]>([]);
  const photoRef = useRef<HTMLInputElement>(null);

  const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_SIZE = 10 * 1024 * 1024;
  const BUCKET = 'inserate-bilder';

  const uploadPhoto = async (photo: Photo) => {
    if (!user || !photo.file) return;
    const ext = photo.file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
    setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, status: 'uploading' } : p));
    const { error } = await supabase.storage.from(BUCKET).upload(path, photo.file, {
      contentType: photo.file.type,
      upsert: false,
    });
    if (error) {
      setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, status: 'error' } : p));
      return;
    }
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
    setPhotos(prev => prev.map(p => p.id === photo.id
      ? { ...p, status: 'done', path, url: pub.publicUrl }
      : p));
  };

  // Load existing inserat in edit mode
  useEffect(() => {
    if (!isEdit || !editId || !user) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('inserate')
        .select('*')
        .eq('id', editId)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        toast.error('Inserat konnte nicht geladen werden.');
        navigate('/dashboard');
        return;
      }
      if (data.user_id !== user.id) {
        toast.error('Du kannst nur eigene Inserate bearbeiten.');
        navigate('/dashboard');
        return;
      }
      setKategorie(data.kategorie as Kategorie);
      setTitel(data.titel ?? '');
      setBeschreibung(data.beschreibung ?? '');
      setPreis(String(data.preis ?? ''));
      setPreisUnit(data.angebotstyp === 'kauf' ? 'kauf' : 'monat');
      setFlaeche(String(data.flaeche ?? ''));
      setZimmer(Number(data.zimmer ?? 1));
      setVerfuegbar(data.verfuegbar_ab ?? '');
      setStrasse(data.strasse ?? '');
      setHausnr(data.hausnummer ?? '');
      setPlz(data.plz ?? '');
      setStadt(data.stadt ?? '');
      setPhotos((data.bilder ?? []).map((url: string, i: number) => ({
        id: `existing-${i}-${Math.random().toString(36).slice(2, 8)}`,
        url,
        status: 'existing' as PhotoStatus,
        path: extractStoragePath(url),
      })));
      setLoadingExisting(false);
    })();
    return () => { cancelled = true; };
  }, [isEdit, editId, user, navigate]);

  function extractStoragePath(publicUrl: string): string | undefined {
    const marker = `/object/public/${BUCKET}/`;
    const idx = publicUrl.indexOf(marker);
    return idx >= 0 ? publicUrl.slice(idx + marker.length) : undefined;
  }

  const canStep1 = kategorie && titel.trim() && preis.trim();
  const canStep2 = flaeche && zimmer && verfuegbar && stadt.trim();

  const handlePhotos = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !user) return;
    const incoming = Array.from(e.target.files);
    e.target.value = '';
    const remaining = 10 - photos.length;
    const accepted: Photo[] = [];
    for (const f of incoming.slice(0, remaining)) {
      if (!ALLOWED.includes(f.type)) {
        toast.error('Nur JPG, PNG und WebP werden unterstützt.');
        continue;
      }
      if (f.size > MAX_SIZE) {
        toast.error('Foto ist zu groß. Maximal 10MB pro Bild.');
        continue;
      }
      accepted.push({
        id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        url: URL.createObjectURL(f),
        file: f,
        status: 'uploading',
      });
    }
    if (accepted.length === 0) return;
    setPhotos(prev => [...prev, ...accepted].slice(0, 10));
    accepted.forEach(p => { void uploadPhoto(p); });
  };

  const removePhoto = async (photo: Photo) => {
    setPhotos(prev => prev.filter(p => p.id !== photo.id));
    if (photo.path && (photo.status === 'done' || photo.status === 'existing')) {
      await supabase.storage.from(BUCKET).remove([photo.path]);
    }
  };

  const retryPhoto = (photo: Photo) => {
    if (!photo.file) return;
    void uploadPhoto({ ...photo, status: 'uploading' });
  };

  const submit = async () => {
    if (!user) {
      toast.error('Bitte melde dich an.');
      navigate('/login');
      return;
    }
    setSubmitting(true);

    const angebotstyp = preisUnit === 'kauf' ? 'kauf' : 'miete';
    const payload = {
      user_id: user.id,
      titel: titel.trim(),
      beschreibung: beschreibung.trim(),
      kategorie: kategorie || 'mieten',
      angebotstyp,
      preis: Number(preis) || 0,
      flaeche: Number(flaeche) || 0,
      zimmer: Number(zimmer) || 1,
      strasse: strasse.trim(),
      hausnummer: hausnr.trim() || null,
      plz: plz.trim(),
      stadt: stadt.trim(),
      verfuegbar_ab: verfuegbar || null,
      bilder: photos.filter(p => !p.file).map(p => p.url),
      status: 'aktiv',
    };

    if (isEdit && editId) {
      const { error } = await supabase
        .from('inserate')
        .update(payload)
        .eq('id', editId)
        .eq('user_id', user.id);
      setSubmitting(false);
      if (error) {
        toast.error('Speichern fehlgeschlagen. Bitte erneut versuchen.');
        return;
      }
      toast.success('Änderungen gespeichert.');
      navigate(`/inserate/${editId}`);
    } else {
      const { data, error } = await supabase
        .from('inserate')
        .insert(payload)
        .select('id')
        .single();
      setSubmitting(false);
      if (error || !data) {
        toast.error('Veröffentlichen fehlgeschlagen. Bitte erneut versuchen.');
        return;
      }
      toast.success('Dein Inserat ist jetzt live!');
      navigate(`/inserate/${data.id}`);
    }
  };

  if (loadingExisting) {
    return (
      <div className="min-h-screen bg-[#FAFAF8]">
        <Navbar />
        <div className="mx-auto flex max-w-[680px] items-center justify-center px-6 py-32">
          <Loader2 className="h-6 w-6 animate-spin text-[#6B6B6B]" />
        </div>
      </div>
    );
  }

  const submitLabel = isEdit
    ? (submitting ? 'Speichere...' : 'Speichern')
    : (submitting ? 'Veröffentliche...' : 'Inserat veröffentlichen');

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />

      <div className="mx-auto max-w-[680px] px-6 pb-20 pt-12 md:px-6">
        <ProgressIndicator current={step} />

        {/* ───── STEP 1 ───── */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h1 className="text-[28px] font-bold tracking-[-0.3px] text-[#0C0C0C]">
              {isEdit ? 'Inserat bearbeiten' : 'Was möchtest du anbieten?'}
            </h1>
            <p className="mt-2 text-[15px] text-[#6B6B6B]">
              Wähle eine Kategorie und beschreibe dein Inserat.
            </p>

            <div className="mt-10">
              <label className={labelCls}>KATEGORIE</label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {KATEGORIEN.map(({ value, label, Icon }) => {
                  const selected = kategorie === value;
                  return (
                    <button key={value} type="button" onClick={() => setKategorie(value)}
                      className={cn('rounded-[16px] border-[1.5px] p-5 text-center transition-all',
                        selected ? 'border-[#0C0C0C] bg-[#FAFAF8]' : 'border-[#EBEBEB] bg-white hover:border-[#D4D4D0]')}>
                      <Icon className={cn('mx-auto h-7 w-7', selected ? 'text-[#0C0C0C]' : 'text-[#6B6B6B]')} />
                      <p className="mt-2.5 text-[14px] font-semibold text-[#0C0C0C]">{label}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-7">
              <label className={labelCls}>TITEL DES INSERATS</label>
              <input value={titel} onChange={e => setTitel(e.target.value)} placeholder="z.B. Helle 3-Zimmer-Wohnung in Schwabing" className={inputCls} />
            </div>

            <div className="mt-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#A8A8A8]">BESCHREIBUNG</span>
                <button onClick={() => setAiOpen(true)} className="flex items-center gap-1.5 rounded-full bg-[#0C0C0C] px-3.5 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#2A2A2A]">
                  <Sparkles className="h-3.5 w-3.5" />
                  KI-Assistent nutzen
                </button>
              </div>
              {aiGenerated && (
                <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-[#E8F5EE] px-2.5 py-1 text-[11px] font-semibold text-[#1A6B3C]">
                  <Sparkles className="h-3 w-3" />
                  KI-generiert
                </div>
              )}
              <textarea value={beschreibung} onChange={e => { setBeschreibung(e.target.value); if (aiGenerated) setAiGenerated(false); }}
                placeholder="Beschreibe deine Immobilie — oder nutze den KI-Assistenten für eine professionelle Beschreibung."
                className={cn(inputCls, 'min-h-[160px] resize-y', aiGenerated && 'border-[#1A6B3C] bg-white')} />
            </div>

            <div className="mt-5">
              <label className={labelCls}>PREIS</label>
              <div className="flex gap-3">
                <input type="number" value={preis} onChange={e => setPreis(e.target.value)} placeholder="z.B. 1.500" className={cn(inputCls, 'flex-1')} />
                <select value={preisUnit} onChange={e => setPreisUnit(e.target.value as 'monat' | 'kauf')} className={cn(inputCls, 'w-[160px] cursor-pointer')}>
                  <option value="monat">€ / Monat</option>
                  <option value="kauf">€ Kaufpreis</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button disabled={!canStep1} onClick={() => setStep(2)}
                className="rounded-full bg-[#0C0C0C] px-8 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-[#2A2A2A] disabled:opacity-40">
                Weiter →
              </button>
            </div>
          </div>
        )}

        {/* ───── STEP 2 ───── */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h1 className="text-[28px] font-bold tracking-[-0.3px] text-[#0C0C0C]">Details zur Immobilie</h1>
            <p className="mt-2 text-[15px] text-[#6B6B6B]">Gib alle wichtigen Informationen an.</p>

            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelCls}>WOHNFLÄCHE</label>
                <div className="relative">
                  <input type="number" value={flaeche} onChange={e => setFlaeche(e.target.value)} placeholder="78" className={cn(inputCls, 'pr-12')} />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-[#A8A8A8]">m²</span>
                </div>
              </div>
              <div>
                <label className={labelCls}>ZIMMER</label>
                <div className="flex items-center justify-between rounded-[10px] bg-[#F5F5F3] px-4 py-3">
                  <button onClick={() => setZimmer(z => Math.max(0.5, +(z - 0.5).toFixed(1)))} className="flex h-7 w-7 items-center justify-center rounded-full text-[#0C0C0C] hover:bg-[#EBEBEB]">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-[15px] font-semibold text-[#0C0C0C]">{zimmer}</span>
                  <button onClick={() => setZimmer(z => +(z + 0.5).toFixed(1))} className="flex h-7 w-7 items-center justify-center rounded-full text-[#0C0C0C] hover:bg-[#EBEBEB]">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <label className={labelCls}>VERFÜGBAR AB</label>
              <input type="date" value={verfuegbar} onChange={e => setVerfuegbar(e.target.value)} className={inputCls} />
            </div>

            <div className="mt-5">
              <label className={labelCls}>ADRESSE</label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_140px]">
                <input value={strasse} onChange={e => setStrasse(e.target.value)} placeholder="Straße" className={inputCls} />
                <input value={hausnr} onChange={e => setHausnr(e.target.value)} placeholder="Nr." className={inputCls} />
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[140px_1fr]">
                <input value={plz} onChange={e => setPlz(e.target.value)} placeholder="PLZ" className={inputCls} />
                <input value={stadt} onChange={e => setStadt(e.target.value)} placeholder="Stadt" className={inputCls} />
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(1)} className="rounded-full border-[1.5px] border-[#EBEBEB] px-6 py-3.5 text-[15px] font-semibold text-[#6B6B6B] transition-colors hover:border-[#0C0C0C] hover:text-[#0C0C0C]">
                ← Zurück
              </button>
              <button disabled={!canStep2} onClick={() => setStep(3)}
                className="rounded-full bg-[#0C0C0C] px-8 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-[#2A2A2A] disabled:opacity-40">
                Weiter →
              </button>
            </div>
          </div>
        )}

        {/* ───── STEP 3 ───── */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h1 className="text-[28px] font-bold tracking-[-0.3px] text-[#0C0C0C]">Fotos hinzufügen</h1>
            <p className="mt-2 text-[15px] text-[#6B6B6B]">Gute Fotos erhöhen deine Chancen auf Vermietung.</p>

            <div onClick={() => photoRef.current?.click()} className="mt-10 cursor-pointer rounded-[20px] border-2 border-dashed border-[#D4D4D0] bg-[#F5F5F3] px-8 py-12 text-center transition-colors hover:border-[#0C0C0C] hover:bg-[#EBEBEB]">
              <Upload className="mx-auto h-10 w-10 text-[#A8A8A8]" />
              <p className="mt-3 text-[16px] font-semibold text-[#0C0C0C]">Fotos hier ablegen</p>
              <p className="mt-1 text-[14px] text-[#6B6B6B]">oder klicken zum Auswählen</p>
              <p className="mt-3 text-[12px] text-[#A8A8A8]">Bis zu 10 Fotos · JPG, PNG</p>
              <input ref={photoRef} type="file" accept="image/*" multiple onChange={handlePhotos} className="hidden" />
            </div>

            {photos.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {photos.map((p, i) => (
                  <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-[12px] bg-[#F5F5F3]">
                    <img src={p.url} alt="" className="h-full w-full object-cover" />
                    {i === 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-[#0C0C0C] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">Titelbild</span>
                    )}
                    <button onClick={() => setPhotos(photos.filter((_, j) => j !== i))} className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#0C0C0C] transition-colors hover:bg-white">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 flex justify-between gap-3">
              <button onClick={() => setStep(2)} className="rounded-full border-[1.5px] border-[#EBEBEB] px-6 py-3.5 text-[15px] font-semibold text-[#6B6B6B] transition-colors hover:border-[#0C0C0C] hover:text-[#0C0C0C]">
                ← Zurück
              </button>
              <button disabled={submitting} onClick={submit}
                className="flex items-center gap-2 rounded-full bg-[#0C0C0C] px-8 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-[#2A2A2A] disabled:opacity-70">
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitLabel}
              </button>
            </div>
          </div>
        )}
      </div>

      <AIAssistantModal open={aiOpen} onClose={() => setAiOpen(false)}
        onApply={(text) => { setBeschreibung(text); setAiGenerated(true); }}
        flaeche={flaeche} />
    </div>
  );
}
