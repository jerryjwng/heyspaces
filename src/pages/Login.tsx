import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useAuthContext } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';

type Mode = 'login' | 'register';
type Errors = Record<string, string>;

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

const inputClass = (hasError: boolean) =>
  cn(
    'w-full rounded-[10px] border-[1.5px] bg-[#F5F5F3] px-[18px] py-[14px] text-[15px] text-[#0C0C0C] placeholder:text-[#A8A8A8] transition-all duration-150 outline-none focus:bg-white',
    hasError ? 'border-[#E53E3E]' : 'border-transparent focus:border-[#0C0C0C]'
  );

const labelClass = 'mb-2 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#A8A8A8]';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp } = useAuthContext();

  const [mode, setMode] = useState<Mode>(location.pathname === '/registrieren' ? 'register' : 'login');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  // Form state
  const [vorname, setVorname] = useState('');
  const [nachname, setNachname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agb, setAgb] = useState(false);

  useEffect(() => {
    setMode(location.pathname === '/registrieren' ? 'register' : 'login');
  }, [location.pathname]);

  useEffect(() => {
    setErrors({});
    setSubmitted(false);
  }, [mode]);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!email.trim()) e.email = 'E-Mail ist erforderlich.';
    else if (!/.+@.+\..+/.test(email)) e.email = 'Ungültige E-Mail-Adresse.';
    if (!password) e.password = 'Passwort ist erforderlich.';
    else if (password.length < 8) e.password = 'Mindestens 8 Zeichen.';
    if (mode === 'register') {
      if (!vorname.trim()) e.vorname = 'Vorname ist erforderlich.';
      if (!nachname.trim()) e.nachname = 'Nachname ist erforderlich.';
      if (!agb) e.agb = 'Bitte AGB akzeptieren.';
    }
    return e;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    setSubmitted(true);
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password, { vorname, nachname });
      }
      await new Promise(r => setTimeout(r, 500));
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const onChange = (field: string, setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    if (submitted) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const ErrorMsg = ({ msg }: { msg?: string }) =>
    msg ? (
      <p className="mt-1.5 flex items-center gap-1 text-xs text-[#E53E3E]">
        <AlertCircle className="h-3.5 w-3.5" />
        {msg}
      </p>
    ) : null;

  return (
    <div className="min-h-screen bg-[#FAFAF8] md:grid md:grid-cols-[55fr_45fr]">
      {/* LEFT PANEL — desktop only */}
      <aside className="hidden h-screen flex-col justify-between bg-[#0C0C0C] p-12 md:flex">
        <div className="text-[18px] font-bold tracking-[-0.025em] text-white">HeySpaces</div>
        <div>
          <h1 className="mb-4 max-w-[320px] text-[36px] font-bold leading-[1.2] tracking-[-0.5px] text-white">
            Der einfachste Weg zu deiner neuen Wohnung.
          </h1>
          <p className="text-[15px] leading-[1.6] text-white/50">
            Tausende Inserate. Keine Provision.<br />Direkt vom Anbieter.
          </p>
        </div>
        <div className="flex gap-6 text-xs text-white/40">
          <span>1.200+ Inserate</span>
          <span>Kostenlos</span>
          <span>Keine Provision</span>
        </div>
      </aside>

      {/* RIGHT PANEL */}
      <main className="flex min-h-screen flex-col justify-center overflow-y-auto bg-[#FAFAF8] px-6 py-8 md:p-12">
        <div className="mx-auto w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="mb-8 text-[18px] font-bold tracking-[-0.025em] text-[#0C0C0C] md:hidden">HeySpaces</div>

          {/* Mode toggle */}
          <div className="mb-8 flex rounded-full bg-[#EBEBEB] p-1">
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cn(
                  'flex-1 rounded-full py-2.5 text-sm transition-all duration-200',
                  mode === m ? 'bg-[#0C0C0C] font-semibold text-white' : 'font-medium text-[#6B6B6B]'
                )}
              >
                {m === 'login' ? 'Anmelden' : 'Registrieren'}
              </button>
            ))}
          </div>

          <div key={mode} className="animate-[fadeSlide_200ms_ease]">
            <h2 className="mb-1.5 text-[24px] font-bold tracking-[-0.3px] text-[#0C0C0C]">
              {mode === 'login' ? 'Willkommen zurück' : 'Konto erstellen'}
            </h2>
            <p className="mb-7 text-sm text-[#6B6B6B]">
              {mode === 'login'
                ? 'Melde dich mit deiner E-Mail-Adresse an.'
                : 'Kostenlos registrieren und loslegen.'}
            </p>

            <form onSubmit={handleSubmit} noValidate>
              {mode === 'register' && (
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>VORNAME</label>
                    <input
                      type="text"
                      placeholder="Max"
                      value={vorname}
                      onChange={onChange('vorname', setVorname)}
                      className={inputClass(!!errors.vorname)}
                    />
                    <ErrorMsg msg={errors.vorname} />
                  </div>
                  <div>
                    <label className={labelClass}>NACHNAME</label>
                    <input
                      type="text"
                      placeholder="Mustermann"
                      value={nachname}
                      onChange={onChange('nachname', setNachname)}
                      className={inputClass(!!errors.nachname)}
                    />
                    <ErrorMsg msg={errors.nachname} />
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className={labelClass}>E-MAIL</label>
                <input
                  type="email"
                  placeholder="name@beispiel.de"
                  value={email}
                  onChange={onChange('email', setEmail)}
                  className={inputClass(!!errors.email)}
                />
                <ErrorMsg msg={errors.email} />
              </div>

              <div className={mode === 'login' ? 'mb-6' : 'mb-5'}>
                <div className="mb-2 flex items-center justify-between">
                  <label className={cn(labelClass, 'mb-0')}>PASSWORT</label>
                  {mode === 'login' && (
                    <button type="button" className="text-xs text-[#6B6B6B] hover:text-[#0C0C0C] hover:underline">
                      Passwort vergessen?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  placeholder="Mindestens 8 Zeichen"
                  value={password}
                  onChange={onChange('password', setPassword)}
                  className={inputClass(!!errors.password)}
                />
                <ErrorMsg msg={errors.password} />
              </div>

              {mode === 'register' && (
                <div className="mb-6">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={agb}
                      onClick={() => {
                        setAgb(!agb);
                        if (submitted) setErrors(prev => ({ ...prev, agb: '' }));
                      }}
                      className={cn(
                        'mt-0.5 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded border-[1.5px] transition-colors',
                        agb ? 'border-[#0C0C0C] bg-[#0C0C0C]' : 'border-[#D4D4D0] bg-white'
                      )}
                    >
                      {agb && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                    <span className="text-[13px] leading-[1.5] text-[#6B6B6B]">
                      Ich akzeptiere die{' '}
                      <a href="#" className="text-[#0C0C0C] underline">Nutzungsbedingungen</a>{' '}
                      und{' '}
                      <a href="#" className="text-[#0C0C0C] underline">Datenschutzerklärung</a>
                    </span>
                  </label>
                  <ErrorMsg msg={errors.agb} />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={cn(
                  'flex w-full items-center justify-center rounded-full bg-[#0C0C0C] py-4 text-[15px] font-semibold text-white transition-all duration-150 hover:-translate-y-px hover:bg-[#2A2A2A]',
                  loading && 'opacity-80 cursor-not-allowed bg-[#2A2A2A] hover:translate-y-0'
                )}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : mode === 'login' ? (
                  'Anmelden'
                ) : (
                  'Kostenlos registrieren'
                )}
              </button>

              {mode === 'login' ? (
                <>
                  <div className="my-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[#EBEBEB]" />
                    <span className="text-[13px] text-[#A8A8A8]">oder</span>
                    <div className="h-px flex-1 bg-[#EBEBEB]" />
                  </div>
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2.5 rounded-full border-[1.5px] border-[#EBEBEB] bg-white py-3.5 text-sm font-medium text-[#0C0C0C] transition-colors hover:bg-[#F5F5F3]"
                  >
                    <GoogleIcon />
                    Mit Google anmelden
                  </button>
                </>
              ) : (
                <p className="mt-4 text-center text-xs text-[#A8A8A8]">
                  Du kannst jederzeit sowohl suchen als auch inserieren.
                </p>
              )}
            </form>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default Login;
