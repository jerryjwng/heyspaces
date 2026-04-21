import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, CheckCircle2, Reply, MessageSquare, Inbox, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/shared/navbar';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/auth-context';
import { toast } from '@/hooks/use-toast';

type DbStatus = 'offen' | 'gesehen' | 'beantwortet';
type Tab = 'gesendet' | 'erhalten';

interface AnfrageRow {
  id: string;
  inserat_id: string;
  sender_id: string;
  empfaenger_id: string;
  nachricht: string;
  antwort: string | null;
  vorname: string;
  nachname: string;
  email: string;
  telefon: string | null;
  einzug_ab: string | null;
  status: DbStatus;
  created_at: string;
  inserat?: {
    id: string;
    titel: string;
    stadt: string;
    preis: number;
    kategorie: string;
    bilder: string[];
  } | null;
  sender_profile?: {
    vorname: string;
    nachname: string;
  } | null;
}

const statusLabel: Record<DbStatus, string> = {
  offen: 'Offen',
  gesehen: 'Gesehen',
  beantwortet: 'Beantwortet',
};

const statusStyles: Record<DbStatus, string> = {
  offen: 'bg-status-yellow-bg text-status-yellow-fg',
  gesehen: 'bg-status-blue-bg text-status-blue-fg',
  beantwortet: 'bg-status-green-bg text-status-green-fg',
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

const formatPrice = (n: number, kategorie: string) =>
  kategorie === 'kaufen'
    ? `€ ${n.toLocaleString('de-DE')}`
    : `€ ${n.toLocaleString('de-DE')} / Monat`;

const initialsOf = (vn: string, nn: string) =>
  ((vn?.[0] ?? '') + (nn?.[0] ?? '')).toUpperCase() || '··';

function StatusBadge({ status }: { status: DbStatus }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold', statusStyles[status])}>
      {statusLabel[status]}
    </span>
  );
}

const Anfragen = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [tab, setTab] = useState<Tab>('gesendet');
  const [sent, setSent] = useState<AnfrageRow[]>([]);
  const [received, setReceived] = useState<AnfrageRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<{ kind: Tab; data: AnfrageRow } | null>(null);

  const [replyOpen, setReplyOpen] = useState(false);
  const [replyTarget, setReplyTarget] = useState<AnfrageRow | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);

  const fetchAnfragen = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [sentRes, recRes] = await Promise.all([
      supabase
        .from('anfragen')
        .select('*, inserat:inserate(id, titel, stadt, preis, kategorie, bilder)')
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('anfragen')
        .select('*, inserat:inserate(id, titel, stadt, preis, kategorie, bilder)')
        .eq('empfaenger_id', user.id)
        .order('created_at', { ascending: false }),
    ]);

    setSent((sentRes.data ?? []) as AnfrageRow[]);

    // Fetch sender profiles for received
    const recRaw = (recRes.data ?? []) as AnfrageRow[];
    const senderIds = Array.from(new Set(recRaw.map(r => r.sender_id)));
    let profilesMap: Record<string, { vorname: string; nachname: string }> = {};
    if (senderIds.length) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, vorname, nachname')
        .in('id', senderIds);
      profilesMap = Object.fromEntries((profiles ?? []).map(p => [p.id, { vorname: p.vorname, nachname: p.nachname }]));
    }
    setReceived(recRaw.map(r => ({ ...r, sender_profile: profilesMap[r.sender_id] ?? null })));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchAnfragen();
  }, [fetchAnfragen]);

  const openDetail = async (kind: Tab, data: AnfrageRow) => {
    setDetailItem({ kind, data });
    setDetailOpen(true);

    // Auto-set status to 'gesehen' when receiver opens an 'offen' anfrage
    if (kind === 'erhalten' && data.status === 'offen') {
      const { error } = await supabase
        .from('anfragen')
        .update({ status: 'gesehen' })
        .eq('id', data.id);
      if (!error) {
        setReceived(prev => prev.map(r => (r.id === data.id ? { ...r, status: 'gesehen' } : r)));
        setDetailItem({ kind, data: { ...data, status: 'gesehen' } });
      }
    }
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setTimeout(() => setDetailItem(null), 200);
  };

  const openReply = (item: AnfrageRow) => {
    setReplyTarget(item);
    setReplyText('');
    setReplySuccess(false);
    setReplyOpen(true);
  };

  const closeReply = () => {
    setReplyOpen(false);
    setTimeout(() => {
      setReplyTarget(null);
      setReplySuccess(false);
      setReplyText('');
    }, 200);
  };

  const sendReply = async () => {
    if (!replyTarget || !replyText.trim()) return;
    setReplyLoading(true);
    const { error } = await supabase
      .from('anfragen')
      .update({ antwort: replyText, status: 'beantwortet' })
      .eq('id', replyTarget.id);
    setReplyLoading(false);
    if (error) {
      toast({ title: 'Fehler', description: 'Antwort konnte nicht gesendet werden.', variant: 'destructive' });
      return;
    }
    setReceived(prev =>
      prev.map(r => (r.id === replyTarget.id ? { ...r, status: 'beantwortet', antwort: replyText } : r))
    );
    setReplySuccess(true);
  };

  const senderName = (a: AnfrageRow) =>
    a.sender_profile ? `${a.sender_profile.vorname} ${a.sender_profile.nachname}`.trim() : `${a.vorname} ${a.nachname}`.trim();

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />
      <div className="mx-auto max-w-[900px] px-6 py-12 md:px-12 md:pt-12 md:pb-20">
        <div className="mb-10">
          <h1 className="text-[32px] font-bold tracking-[-0.5px] text-foreground">Meine Anfragen</h1>
          <p className="mt-1.5 text-[15px] text-foreground-secondary">Deine gesendeten und erhaltenen Anfragen.</p>
        </div>

        <div className="mb-8">
          <div className="inline-flex rounded-full bg-neutral p-1">
            <button
              onClick={() => setTab('gesendet')}
              className={cn(
                'rounded-full px-6 py-2 text-sm transition-all duration-200',
                tab === 'gesendet' ? 'bg-foreground font-semibold text-white' : 'font-medium text-foreground-secondary'
              )}
            >
              Gesendet ({sent.length})
            </button>
            <button
              onClick={() => setTab('erhalten')}
              className={cn(
                'rounded-full px-6 py-2 text-sm transition-all duration-200',
                tab === 'erhalten' ? 'bg-foreground font-semibold text-white' : 'font-medium text-foreground-secondary'
              )}
            >
              Erhalten ({received.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-foreground-tertiary" />
          </div>
        ) : (
          <div key={tab} className="animate-fade-in">
            {tab === 'gesendet' && (
              sent.length === 0 ? (
                <EmptyState
                  icon={<MessageSquare className="h-10 w-10 text-[#D4D4D0]" />}
                  title="Noch keine Anfragen gesendet"
                  desc="Entdecke Inserate und sende deine erste Anfrage."
                  cta="Inserate entdecken"
                  onCta={() => navigate('/inserate')}
                />
              ) : (
                <div className="flex flex-col gap-3">
                  {sent.map(item => (
                    <button
                      key={item.id}
                      onClick={() => openDetail('gesendet', item)}
                      className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5 text-left transition-all duration-150 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
                    >
                      {item.inserat?.bilder?.[0] ? (
                        <img src={item.inserat.bilder[0]} alt="" className="h-14 w-[72px] flex-shrink-0 rounded-[10px] bg-neutral object-cover" />
                      ) : (
                        <div className="h-14 w-[72px] flex-shrink-0 rounded-[10px] bg-neutral" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-[15px] font-semibold text-foreground">{item.inserat?.titel ?? 'Inserat entfernt'}</p>
                        <p className="mt-1 text-[13px] text-foreground-tertiary">Gesendet am {formatDate(item.created_at)}</p>
                        {item.antwort && (
                          <div className="mt-2 flex items-center gap-1.5">
                            <Reply className="h-3.5 w-3.5 text-status-green-fg" />
                            <span className="text-[13px] font-medium text-status-green-fg">Anbieter hat geantwortet</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <StatusBadge status={item.status} />
                        <span className="text-xs text-foreground-tertiary transition-colors hover:text-foreground">Details ansehen →</span>
                      </div>
                    </button>
                  ))}
                </div>
              )
            )}

            {tab === 'erhalten' && (
              received.length === 0 ? (
                <EmptyState
                  icon={<Inbox className="h-10 w-10 text-[#D4D4D0]" />}
                  title="Noch keine Anfragen erhalten"
                  desc="Erstelle ein Inserat um Anfragen zu erhalten."
                  cta="+ Inserat erstellen"
                  onCta={() => navigate('/inserate/neu')}
                />
              ) : (
                <div className="flex flex-col gap-3">
                  {received.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5 transition-all duration-150 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border bg-neutral text-[14px] font-semibold text-foreground-secondary">
                        {initialsOf(item.sender_profile?.vorname ?? item.vorname, item.sender_profile?.nachname ?? item.nachname)}
                      </div>
                      <button onClick={() => openDetail('erhalten', item)} className="flex-1 min-w-0 text-left">
                        <p className="text-[15px] font-semibold text-foreground">{senderName(item)}</p>
                        <p className="mt-1 text-[13px] text-foreground-secondary">Anfrage für: {item.inserat?.titel ?? 'Inserat entfernt'}</p>
                        <p className="mt-1 text-[13px] text-foreground-tertiary">Eingegangen am {formatDate(item.created_at)}</p>
                      </button>
                      <div className="flex flex-col items-end gap-2">
                        <StatusBadge status={item.status} />
                        {item.status === 'beantwortet' ? (
                          <div className="flex items-center gap-1.5 text-xs font-medium text-status-green-fg">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Beantwortet
                          </div>
                        ) : (
                          <button
                            onClick={() => openReply(item)}
                            className="rounded-full bg-foreground px-4 py-1.5 text-[13px] font-semibold text-white transition-all hover:bg-primary-hover"
                          >
                            Antworten
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {detailOpen && detailItem && (
        <Modal onClose={closeDetail}>
          <div className="flex items-start gap-3">
            {detailItem.data.inserat?.bilder?.[0] && (
              <img src={detailItem.data.inserat.bilder[0]} alt="" className="h-11 w-14 flex-shrink-0 rounded-lg object-cover" />
            )}
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-foreground">{detailItem.data.inserat?.titel ?? 'Inserat entfernt'}</p>
              {detailItem.data.inserat && (
                <p className="mt-0.5 text-[13px] text-foreground-tertiary">
                  {detailItem.data.inserat.stadt} · {formatPrice(detailItem.data.inserat.preis, detailItem.data.inserat.kategorie)}
                </p>
              )}
            </div>
          </div>

          <div className="my-5 h-px bg-border" />

          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-neutral text-xs font-semibold text-foreground-secondary">
                {detailItem.kind === 'erhalten'
                  ? initialsOf(detailItem.data.sender_profile?.vorname ?? detailItem.data.vorname, detailItem.data.sender_profile?.nachname ?? detailItem.data.nachname)
                  : 'DU'}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {detailItem.kind === 'erhalten' ? senderName(detailItem.data) : 'Du'}
                </p>
                <p className="text-xs text-foreground-tertiary">{formatDate(detailItem.data.created_at)}</p>
              </div>
            </div>
            <StatusBadge status={detailItem.data.status} />
          </div>

          <div className="mb-5">
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground-tertiary">Nachricht</p>
            <div className="rounded-2xl rounded-tl-[4px] bg-neutral px-5 py-4 text-[15px] leading-relaxed text-foreground">
              {detailItem.data.nachricht}
            </div>
          </div>

          {detailItem.data.antwort && (
            <div className="mb-5">
              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-status-green-fg">Antwort des Anbieters</p>
              <div className="rounded-2xl rounded-tr-[4px] bg-status-green-bg px-5 py-4 text-[15px] leading-relaxed text-foreground">
                {detailItem.data.antwort}
              </div>
            </div>
          )}

          {detailItem.kind === 'erhalten' && (
            <>
              <div className="my-5 h-px bg-border" />
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground-tertiary">Kontaktdaten</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Mail className="h-4 w-4 text-foreground-tertiary" />
                  {detailItem.data.email}
                </div>
                {detailItem.data.telefon && (
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Phone className="h-4 w-4 text-foreground-tertiary" />
                    {detailItem.data.telefon}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="mt-6 flex gap-3">
            {detailItem.kind === 'erhalten' && detailItem.data.status !== 'beantwortet' ? (
              <>
                <button onClick={closeDetail} className="flex-1 rounded-full border border-border bg-white px-5 py-3 text-sm font-medium text-foreground-secondary hover:border-border-strong">
                  Schließen
                </button>
                <button
                  onClick={() => {
                    closeDetail();
                    setTimeout(() => openReply(detailItem.data), 220);
                  }}
                  className="flex-1 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
                >
                  Antworten
                </button>
              </>
            ) : (
              <button onClick={closeDetail} className="w-full rounded-full bg-neutral px-5 py-3 text-sm font-semibold text-foreground hover:bg-border">
                Schließen
              </button>
            )}
          </div>
        </Modal>
      )}

      {/* Reply modal */}
      {replyOpen && replyTarget && (
        <Modal onClose={closeReply}>
          {replySuccess ? (
            <div className="flex flex-col items-center py-6 text-center">
              <CheckCircle2 className="h-12 w-12 text-status-green-fg" />
              <p className="mt-4 text-[20px] font-bold text-foreground">Antwort gesendet!</p>
              <p className="mt-2 text-sm text-foreground-secondary">{senderName(replyTarget)} wurde benachrichtigt.</p>
              <button onClick={closeReply} className="mt-6 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover">
                Schließen
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-[22px] font-bold text-foreground">Antwort senden</h2>
              <p className="mt-1.5 mb-6 text-sm text-foreground-secondary">An: {senderName(replyTarget)}</p>

              <div className="mb-5 rounded-xl bg-neutral px-4 py-3.5">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-foreground-tertiary">Anfrage:</p>
                <p className="text-[13px] leading-relaxed text-foreground-secondary">
                  {replyTarget.nachricht.slice(0, 140)}{replyTarget.nachricht.length > 140 ? '…' : ''}
                </p>
              </div>

              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground-tertiary">Deine Antwort</p>
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder={`Hallo ${(replyTarget.sender_profile?.vorname ?? replyTarget.vorname)}, vielen Dank für Ihre Anfrage…`}
                className="min-h-[140px] w-full resize-y rounded-[10px] border-[1.5px] border-transparent bg-neutral px-[18px] py-3.5 text-[15px] text-foreground transition-colors focus:border-foreground focus:bg-white focus:outline-none"
              />

              <div className="mt-6 flex gap-3">
                <button onClick={closeReply} className="flex-1 rounded-full border border-border bg-white px-5 py-3 text-sm font-medium text-foreground-secondary hover:border-border-strong">
                  Abbrechen
                </button>
                <button
                  onClick={sendReply}
                  disabled={replyLoading || !replyText.trim()}
                  className="flex-1 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-hover disabled:opacity-60"
                >
                  {replyLoading ? 'Wird gesendet…' : 'Antwort senden'}
                </button>
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
};

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-50 animate-fade-in bg-black/50" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="fixed left-1/2 top-1/2 z-[51] w-[calc(100vw-32px)] max-w-[520px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
        style={{ maxHeight: '90vh' }}
      >
        {children}
      </div>
    </>
  );
}

function EmptyState({ icon, title, desc, cta, onCta }: { icon: React.ReactNode; title: string; desc: string; cta: string; onCta: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-white py-16 text-center">
      {icon}
      <h3 className="mt-4 text-[18px] font-bold text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-foreground-secondary">{desc}</p>
      <button onClick={onCta} className="mt-6 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover">
        {cta}
      </button>
    </div>
  );
}

export default Anfragen;
