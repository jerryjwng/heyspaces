import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Phone, CheckCircle2, Reply, MessageSquare, Inbox, Plus } from 'lucide-react';
import { Navbar } from '@/components/shared/navbar';
import { cn } from '@/lib/utils';

type Status = 'Offen' | 'Gesehen' | 'Beantwortet';
type Tab = 'gesendet' | 'erhalten';

const IMG = (id: string) => `https://images.unsplash.com/${id}?w=300&auto=format&fit=crop`;

interface SentItem {
  id: string;
  inserat: string;
  stadt: string;
  preis: string;
  bild: string;
  datum: string;
  status: Status;
  hasReply: boolean;
  message: string;
  reply?: string;
}

interface ReceivedItem {
  id: string;
  sender: string;
  name: string;
  email: string;
  telefon?: string;
  inserat: string;
  stadt: string;
  preis: string;
  bild: string;
  datum: string;
  status: Status;
  replied: boolean;
  message: string;
  reply?: string;
}

const MOCK_MSG =
  'Hallo, ich interessiere mich sehr für Ihre Wohnung und würde gerne einen Besichtigungstermin vereinbaren. Ich bin berufstätig und suche eine ruhige Wohnung für längerfristig. Wann wäre ein Termin möglich?';

const MOCK_REPLY =
  'Vielen Dank für Ihr Interesse! Ich würde mich freuen Sie die Wohnung zu zeigen. Passt Ihnen nächsten Samstag um 11 Uhr?';

const initialSent: SentItem[] = [
  { id: 's1', inserat: 'Helle 3-Zimmer in Schwabing', stadt: 'München', preis: '€ 1.750 / Monat', bild: IMG('photo-1502672260266-1c1ef2d93688'), datum: '15.03.2025', status: 'Beantwortet', hasReply: true, message: MOCK_MSG, reply: MOCK_REPLY },
  { id: 's2', inserat: 'WG-Zimmer Kreuzberg', stadt: 'Berlin', preis: '€ 580 / Monat', bild: IMG('photo-1545324418-cc1a3fa10c00'), datum: '18.03.2025', status: 'Gesehen', hasReply: false, message: MOCK_MSG },
  { id: 's3', inserat: 'Altbauwohnung am Main', stadt: 'Frankfurt', preis: '€ 1.680 / Monat', bild: IMG('photo-1522708323590-d24dbb6b0267'), datum: '20.03.2025', status: 'Offen', hasReply: false, message: MOCK_MSG },
];

const initialReceived: ReceivedItem[] = [
  { id: 'r1', sender: 'LM', name: 'Lena Müller', email: 'lena@beispiel.de', telefon: '0176-12345678', inserat: 'Helle 3-Zimmer in Schwabing', stadt: 'München', preis: '€ 1.750 / Monat', bild: IMG('photo-1502672260266-1c1ef2d93688'), datum: '15.03.2025', status: 'Beantwortet', replied: true, message: MOCK_MSG, reply: MOCK_REPLY },
  { id: 'r2', sender: 'TK', name: 'Thomas Klein', email: 'thomas@beispiel.de', telefon: '0151-99887766', inserat: 'Kompaktes Studio Maxvorstadt', stadt: 'München', preis: '€ 890 / Monat', bild: IMG('photo-1502672260266-1c1ef2d93688'), datum: '18.03.2025', status: 'Gesehen', replied: false, message: MOCK_MSG },
  { id: 'r3', sender: 'AS', name: 'Anna Schmidt', email: 'anna@beispiel.de', inserat: 'Helle 3-Zimmer in Schwabing', stadt: 'München', preis: '€ 1.750 / Monat', bild: IMG('photo-1502672260266-1c1ef2d93688'), datum: '20.03.2025', status: 'Offen', replied: false, message: MOCK_MSG },
];

const statusStyles: Record<Status, string> = {
  Offen: 'bg-status-yellow-bg text-status-yellow-fg',
  Gesehen: 'bg-status-blue-bg text-status-blue-fg',
  Beantwortet: 'bg-status-green-bg text-status-green-fg',
};

function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold transition-colors duration-300', statusStyles[status])}>
      {status}
    </span>
  );
}

const Anfragen = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('gesendet');
  const [sent] = useState(initialSent);
  const [received, setReceived] = useState(initialReceived);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<{ kind: Tab; data: SentItem | ReceivedItem } | null>(null);

  const [replyOpen, setReplyOpen] = useState(false);
  const [replyTarget, setReplyTarget] = useState<ReceivedItem | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);

  const openDetail = (kind: Tab, data: SentItem | ReceivedItem) => {
    setDetailItem({ kind, data });
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setTimeout(() => setDetailItem(null), 200);
  };

  const openReply = (item: ReceivedItem) => {
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

  const sendReply = () => {
    if (!replyTarget || !replyText.trim()) return;
    setReplyLoading(true);
    setTimeout(() => {
      setReceived(prev =>
        prev.map(r => (r.id === replyTarget.id ? { ...r, status: 'Beantwortet' as Status, replied: true, reply: replyText } : r))
      );
      setReplyLoading(false);
      setReplySuccess(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />
      <div className="mx-auto max-w-[900px] px-6 py-12 md:px-12 md:pt-12 md:pb-20">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[32px] font-bold tracking-[-0.5px] text-foreground">Meine Anfragen</h1>
          <p className="mt-1.5 text-[15px] text-foreground-secondary">Deine gesendeten und erhaltenen Anfragen.</p>
        </div>

        {/* Tab toggle */}
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

        {/* Lists */}
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
                    <img src={item.bild} alt="" className="h-14 w-[72px] flex-shrink-0 rounded-[10px] bg-neutral object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-[15px] font-semibold text-foreground">{item.inserat}</p>
                      <p className="mt-1 text-[13px] text-foreground-tertiary">Gesendet am {item.datum}</p>
                      {item.hasReply && (
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
                      {item.sender}
                    </div>
                    <button onClick={() => openDetail('erhalten', item)} className="flex-1 min-w-0 text-left">
                      <p className="text-[15px] font-semibold text-foreground">{item.name}</p>
                      <p className="mt-1 text-[13px] text-foreground-secondary">Anfrage für: {item.inserat}</p>
                      <p className="mt-1 text-[13px] text-foreground-tertiary">Eingegangen am {item.datum}</p>
                    </button>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={item.status} />
                      {item.replied ? (
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
      </div>

      {/* Detail modal */}
      {detailOpen && detailItem && (
        <Modal onClose={closeDetail}>
          <div className="flex items-start gap-3">
            <img src={detailItem.data.bild} alt="" className="h-11 w-14 flex-shrink-0 rounded-lg object-cover" />
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-foreground">{detailItem.data.inserat}</p>
              <p className="mt-0.5 text-[13px] text-foreground-tertiary">{detailItem.data.stadt} · {detailItem.data.preis}</p>
            </div>
          </div>

          <div className="my-5 h-px bg-border" />

          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-neutral text-xs font-semibold text-foreground-secondary">
                {detailItem.kind === 'erhalten' ? (detailItem.data as ReceivedItem).sender : 'DU'}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {detailItem.kind === 'erhalten' ? (detailItem.data as ReceivedItem).name : 'Du'}
                </p>
                <p className="text-xs text-foreground-tertiary">{detailItem.data.datum}</p>
              </div>
            </div>
            <StatusBadge status={detailItem.data.status} />
          </div>

          <div className="mb-5">
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground-tertiary">Nachricht</p>
            <div className="rounded-2xl rounded-tl-[4px] bg-neutral px-5 py-4 text-[15px] leading-relaxed text-foreground">
              {detailItem.data.message}
            </div>
          </div>

          {detailItem.data.reply && (
            <div className="mb-5">
              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-status-green-fg">Antwort des Anbieters</p>
              <div className="rounded-2xl rounded-tr-[4px] bg-status-green-bg px-5 py-4 text-[15px] leading-relaxed text-foreground">
                {detailItem.data.reply}
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
                  {(detailItem.data as ReceivedItem).email}
                </div>
                {(detailItem.data as ReceivedItem).telefon && (
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Phone className="h-4 w-4 text-foreground-tertiary" />
                    {(detailItem.data as ReceivedItem).telefon}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="mt-6 flex gap-3">
            {detailItem.kind === 'erhalten' && !(detailItem.data as ReceivedItem).replied ? (
              <>
                <button onClick={closeDetail} className="flex-1 rounded-full border border-border bg-white px-5 py-3 text-sm font-medium text-foreground-secondary hover:border-border-strong">
                  Schließen
                </button>
                <button
                  onClick={() => {
                    closeDetail();
                    setTimeout(() => openReply(detailItem.data as ReceivedItem), 220);
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
              <p className="mt-2 text-sm text-foreground-secondary">{replyTarget.name} wurde benachrichtigt.</p>
              <button onClick={closeReply} className="mt-6 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover">
                Schließen
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-[22px] font-bold text-foreground">Antwort senden</h2>
              <p className="mt-1.5 mb-6 text-sm text-foreground-secondary">An: {replyTarget.name}</p>

              <div className="mb-5 rounded-xl bg-neutral px-4 py-3.5">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-foreground-tertiary">Ihre Anfrage:</p>
                <p className="text-[13px] leading-relaxed text-foreground-secondary">
                  {replyTarget.message.slice(0, 100)}…
                </p>
              </div>

              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground-tertiary">Deine Antwort</p>
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder={`Hallo ${replyTarget.name.split(' ')[0]}, vielen Dank für Ihre Anfrage. Ich würde mich freuen…`}
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
      <div className="fixed left-1/2 top-1/2 z-[51] w-[calc(100%-32px)] max-w-[540px] -translate-x-1/2 -translate-y-1/2 animate-scale-in overflow-y-auto rounded-3xl bg-white p-8 shadow-xl" style={{ maxHeight: '90vh' }}>
        <button onClick={onClose} className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-neutral text-foreground-secondary hover:bg-border">
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </>
  );
}

function EmptyState({ icon, title, desc, cta, onCta }: { icon: React.ReactNode; title: string; desc: string; cta: string; onCta: () => void }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      {icon}
      <p className="mt-4 text-lg font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm text-foreground-secondary">{desc}</p>
      <button onClick={onCta} className="mt-5 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover">
        {cta.startsWith('+') && <Plus className="h-4 w-4" />}
        {cta.replace(/^\+\s*/, '')}
      </button>
    </div>
  );
}

export default Anfragen;
