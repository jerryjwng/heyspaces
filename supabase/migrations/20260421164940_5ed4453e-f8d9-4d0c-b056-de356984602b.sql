
-- ANFRAGEN TABLE
CREATE TABLE public.anfragen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inserat_id UUID NOT NULL REFERENCES public.inserate(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  empfaenger_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nachricht TEXT NOT NULL,
  antwort TEXT,
  vorname TEXT NOT NULL,
  nachname TEXT NOT NULL,
  email TEXT NOT NULL,
  telefon TEXT,
  einzug_ab DATE,
  status TEXT NOT NULL DEFAULT 'offen',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.anfragen ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anfragen sichtbar für Sender und Empfänger"
  ON public.anfragen FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = empfaenger_id);

CREATE POLICY "Authentifizierte Nutzer können Anfragen erstellen"
  ON public.anfragen FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Empfänger können Anfragen aktualisieren"
  ON public.anfragen FOR UPDATE
  USING (auth.uid() = empfaenger_id);

CREATE TRIGGER update_anfragen_updated_at
  BEFORE UPDATE ON public.anfragen
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_anfragen_sender ON public.anfragen(sender_id, created_at DESC);
CREATE INDEX idx_anfragen_empfaenger ON public.anfragen(empfaenger_id, created_at DESC);
CREATE INDEX idx_anfragen_inserat ON public.anfragen(inserat_id);

-- FAVORITEN TABLE
CREATE TABLE public.favoriten (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  inserat_id UUID NOT NULL REFERENCES public.inserate(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, inserat_id)
);

ALTER TABLE public.favoriten ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Nutzer können eigene Favoriten sehen"
  ON public.favoriten FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Authentifizierte Nutzer können Favoriten erstellen"
  ON public.favoriten FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Nutzer können eigene Favoriten löschen"
  ON public.favoriten FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_favoriten_user ON public.favoriten(user_id);
