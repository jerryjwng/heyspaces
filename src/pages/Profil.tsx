import { useState } from 'react';
import { Camera, Lock, LayoutDashboard, Bell, Trash2, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/shared/navbar';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type ProfileData = {
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  stadt: string;
};

const INITIAL: ProfileData = {
  vorname: 'Max',
  nachname: 'Mustermann',
  email: 'max@heyspaces.de',
  telefon: '+49 176 12345678',
  stadt: 'München',
};

export default function Profil() {
  const [data, setData] = useState<ProfileData>(INITIAL);
  const [draft, setDraft] = useState<ProfileData>(INITIAL);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [pwOpen, setPwOpen] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });

  const [modus, setModus] = useState<'suchend' | 'inserierend'>('suchend');
  const [emailNotif, setEmailNotif] = useState(true);

  const initials = `${data.vorname[0] ?? ''}${data.nachname[0] ?? ''}`.toUpperCase();

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setData(draft);
    setEditing(false);
    setSaving(false);
    toast.success('Änderungen gespeichert', {
      icon: <CheckCircle2 className="h-[18px] w-[18px] text-[#4ADE80]" />,
    });
  };

  const handleCancel = () => {
    setDraft(data);
    setEditing(false);
  };

  const handlePwSave = async () => {
    if (!pw.current || !pw.next || pw.next !== pw.confirm) {
      toast.error('Bitte überprüfe deine Eingaben');
      return;
    }
    setPwSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setPwSaving(false);
    setPw({ current: '', next: '', confirm: '' });
    setPwOpen(false);
    toast.success('Passwort aktualisiert');
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar hideSearch />
      <main className="mx-auto max-w-[680px] px-6 pb-20 pt-12 md:px-12">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-[32px] font-bold tracking-[-0.5px] text-[#0C0C0C]">Mein Profil</h1>
          <p className="mt-1.5 text-[15px] text-[#6B6B6B]">
            Verwalte deine persönlichen Informationen und Einstellungen.
          </p>
        </header>

        {/* Avatar section */}
        <section className="mb-6 flex flex-col items-center gap-6 rounded-[20px] border border-[#EBEBEB] bg-white p-8 md:flex-row md:items-center">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-[#EBEBEB] bg-[#F5F5F3] text-[28px] font-bold text-[#6B6B6B]">
            {initials}
            <button
              type="button"
              aria-label="Foto ändern"
              className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#0C0C0C] text-white"
            >
              <Camera className="h-3 w-3" />
            </button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-[18px] font-bold text-[#0C0C0C]">{data.vorname} {data.nachname}</p>
            <p className="mt-1 text-sm text-[#6B6B6B]">{data.email}</p>
            <p className="mt-1 text-[13px] text-[#A8A8A8]">Mitglied seit Januar 2023</p>
          </div>
          <button
            type="button"
            className="w-full shrink-0 rounded-full border-[1.5px] border-[#EBEBEB] px-5 py-2 text-[13px] text-[#6B6B6B] transition-colors hover:border-[#0C0C0C] md:w-auto"
          >
            Foto ändern
          </button>
        </section>

        {/* Persönliche Daten */}
        <section className="mb-6 rounded-[20px] border border-[#EBEBEB] bg-white p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[18px] font-bold text-[#0C0C0C]">Persönliche Daten</h2>
            {!editing && (
              <button
                type="button"
                onClick={() => { setDraft(data); setEditing(true); }}
                className="rounded-full border-[1.5px] border-[#EBEBEB] px-[18px] py-1.5 text-[13px] text-[#6B6B6B] transition-colors hover:border-[#0C0C0C]"
              >
                Bearbeiten
              </button>
            )}
          </div>

          {!editing ? (
            <div>
              {[
                ['Vorname', data.vorname],
                ['Nachname', data.nachname],
                ['E-Mail', data.email],
                ['Telefon', data.telefon],
                ['Stadt', data.stadt],
              ].map(([label, value], i, arr) => (
                <div
                  key={label}
                  className={cn(
                    'flex items-center justify-between py-3.5',
                    i < arr.length - 1 && 'border-b border-[#F5F5F3]'
                  )}
                >
                  <span className="text-[13px] text-[#A8A8A8]">{label}</span>
                  <span className="text-sm font-medium text-[#0C0C0C]">{value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <FieldInput
                  label="Vorname"
                  value={draft.vorname}
                  onChange={v => setDraft(d => ({ ...d, vorname: v }))}
                />
                <FieldInput
                  label="Nachname"
                  value={draft.nachname}
                  onChange={v => setDraft(d => ({ ...d, nachname: v }))}
                />
              </div>
              <FieldInput
                label="E-Mail"
                type="email"
                value={draft.email}
                onChange={v => setDraft(d => ({ ...d, email: v }))}
              />
              <FieldInput
                label="Telefon"
                value={draft.telefon}
                onChange={v => setDraft(d => ({ ...d, telefon: v }))}
              />
              <FieldInput
                label="Stadt"
                value={draft.stadt}
                onChange={v => setDraft(d => ({ ...d, stadt: v }))}
              />

              <div className="mt-2 flex flex-col-reverse gap-3 md:flex-row md:justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="rounded-full border-[1.5px] border-[#EBEBEB] px-5 py-2.5 text-sm font-medium text-[#6B6B6B] transition-colors hover:border-[#0C0C0C] disabled:opacity-50"
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-full bg-[#0C0C0C] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-px disabled:opacity-60"
                >
                  {saving ? 'Speichern…' : 'Speichern'}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Sicherheit */}
        <section className="mb-6 rounded-[20px] border border-[#EBEBEB] bg-white p-8">
          <h2 className="mb-6 text-[18px] font-bold text-[#0C0C0C]">Sicherheit</h2>

          <div className={cn('flex items-center justify-between py-3.5', !pwOpen && 'border-b border-[#F5F5F3] last:border-0')}>
            <div className="flex items-start gap-2.5">
              <Lock className="mt-0.5 h-[18px] w-[18px] text-[#6B6B6B]" />
              <div>
                <p className="text-sm text-[#0C0C0C]">Passwort</p>
                <p className="text-xs text-[#A8A8A8]">Zuletzt geändert vor 3 Monaten</p>
              </div>
            </div>
            {!pwOpen && (
              <button
                type="button"
                onClick={() => setPwOpen(true)}
                className="rounded-full border-[1.5px] border-[#EBEBEB] px-4 py-1.5 text-[13px] text-[#6B6B6B] transition-colors hover:border-[#0C0C0C]"
              >
                Ändern
              </button>
            )}
          </div>

          {pwOpen && (
            <div className="mt-5">
              <FieldInput
                label="Aktuelles Passwort"
                type="password"
                value={pw.current}
                onChange={v => setPw(p => ({ ...p, current: v }))}
                placeholder="••••••••"
              />
              <FieldInput
                label="Neues Passwort"
                type="password"
                value={pw.next}
                onChange={v => setPw(p => ({ ...p, next: v }))}
                placeholder="Mindestens 8 Zeichen"
              />
              <FieldInput
                label="Passwort bestätigen"
                type="password"
                value={pw.confirm}
                onChange={v => setPw(p => ({ ...p, confirm: v }))}
                placeholder="Passwort wiederholen"
              />
              <div className="mt-2 flex flex-col-reverse gap-3 md:flex-row md:justify-end">
                <button
                  type="button"
                  onClick={() => { setPwOpen(false); setPw({ current: '', next: '', confirm: '' }); }}
                  disabled={pwSaving}
                  className="rounded-full border-[1.5px] border-[#EBEBEB] px-5 py-2.5 text-sm font-medium text-[#6B6B6B] transition-colors hover:border-[#0C0C0C] disabled:opacity-50"
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  onClick={handlePwSave}
                  disabled={pwSaving}
                  className="rounded-full bg-[#0C0C0C] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-px disabled:opacity-60"
                >
                  {pwSaving ? 'Speichern…' : 'Passwort speichern'}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Konto Einstellungen */}
        <section className="mb-6 rounded-[20px] border border-[#EBEBEB] bg-white p-8">
          <h2 className="mb-6 text-[18px] font-bold text-[#0C0C0C]">Konto Einstellungen</h2>

          {/* Modus */}
          <div className="flex items-center justify-between gap-4 border-b border-[#F5F5F3] py-3.5">
            <div className="flex items-start gap-2.5">
              <LayoutDashboard className="mt-0.5 h-[18px] w-[18px] text-[#6B6B6B]" />
              <div>
                <p className="text-sm text-[#0C0C0C]">Modus</p>
                <p className="mt-0.5 text-xs text-[#A8A8A8]">Wechsle zwischen Suchend und Inserierend</p>
              </div>
            </div>
            <div className="inline-flex shrink-0 rounded-full bg-[#F5F5F3] p-1">
              {(['suchend', 'inserierend'] as const).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModus(m)}
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-medium transition-colors duration-200',
                    modus === m ? 'bg-[#0C0C0C] text-white' : 'text-[#6B6B6B]'
                  )}
                >
                  {m === 'suchend' ? 'Suchend' : 'Inserierend'}
                </button>
              ))}
            </div>
          </div>

          {/* Benachrichtigungen */}
          <div className="flex items-center justify-between gap-4 py-3.5">
            <div className="flex items-start gap-2.5">
              <Bell className="mt-0.5 h-[18px] w-[18px] text-[#6B6B6B]" />
              <div>
                <p className="text-sm text-[#0C0C0C]">E-Mail Benachrichtigungen</p>
                <p className="mt-0.5 text-xs text-[#A8A8A8]">Erhalte Updates zu Anfragen</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={emailNotif}
              onClick={() => setEmailNotif(v => !v)}
              className={cn(
                'relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200',
                emailNotif ? 'bg-[#0C0C0C]' : 'bg-[#D4D4D0]'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200',
                  emailNotif ? 'translate-x-[22px]' : 'translate-x-0.5'
                )}
              />
            </button>
          </div>
        </section>

        {/* Konto löschen */}
        <section className="mb-6 rounded-[20px] border border-[#FEE8E8] bg-white p-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-start gap-2.5">
              <Trash2 className="mt-0.5 h-[18px] w-[18px] text-[#9B1C1C]" />
              <div>
                <p className="text-sm font-semibold text-[#9B1C1C]">Konto löschen</p>
                <p className="mt-0.5 text-xs text-[#A8A8A8]">Diese Aktion kann nicht rückgängig gemacht werden.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toast.error('Bitte kontaktiere den Support, um dein Konto zu löschen.')}
              className="w-full shrink-0 rounded-full border-[1.5px] border-[#FEE8E8] bg-transparent px-[18px] py-2 text-[13px] font-semibold text-[#9B1C1C] transition-colors hover:bg-[#FEE8E8] md:w-auto"
            >
              Konto löschen
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="mb-4">
      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#A8A8A8]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-[10px] border-[1.5px] border-transparent bg-[#F5F5F3] px-[18px] py-3.5 text-[15px] text-[#0C0C0C] outline-none transition-colors focus:border-[#0C0C0C] focus:bg-white"
      />
    </div>
  );
}
