CREATE TABLE public.inserate (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titel TEXT NOT NULL,
  beschreibung TEXT NOT NULL DEFAULT '',
  kategorie TEXT NOT NULL DEFAULT 'mieten',
  objekttyp TEXT,
  angebotstyp TEXT NOT NULL DEFAULT 'miete',
  preis INTEGER NOT NULL DEFAULT 0,
  warmmiete INTEGER,
  nebenkosten INTEGER,
  heizkosten INTEGER,
  preis_pro_qm DECIMAL(10,2),
  kaution INTEGER,
  flaeche INTEGER NOT NULL DEFAULT 0,
  zimmer INTEGER NOT NULL DEFAULT 1,
  etage INTEGER,
  gesamtgeschosse INTEGER,
  strasse TEXT NOT NULL DEFAULT '',
  hausnummer TEXT,
  plz TEXT NOT NULL DEFAULT '',
  stadt TEXT NOT NULL DEFAULT '',
  stadtteil TEXT,
  verfuegbar_ab DATE,
  status TEXT NOT NULL DEFAULT 'aktiv',
  bilder TEXT[] NOT NULL DEFAULT '{}',
  ausstattung_innen TEXT[] NOT NULL DEFAULT '{}',
  ausstattung_aussen TEXT[] NOT NULL DEFAULT '{}',
  baujahr INTEGER,
  heizungsart TEXT,
  energietraeger TEXT,
  energieklasse TEXT,
  energieverbrauch DECIMAL(10,2),
  energieausweis_typ TEXT,
  objektzustand TEXT,
  stichwoerter TEXT[] NOT NULL DEFAULT '{}',
  besichtigungshinweise TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.inserate ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inserate sind öffentlich einsehbar"
  ON public.inserate FOR SELECT
  USING (true);

CREATE POLICY "Nutzer können eigene Inserate erstellen"
  ON public.inserate FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Nutzer können eigene Inserate bearbeiten"
  ON public.inserate FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Nutzer können eigene Inserate löschen"
  ON public.inserate FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_inserate_updated_at
  BEFORE UPDATE ON public.inserate
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_inserate_user_id ON public.inserate(user_id);
CREATE INDEX idx_inserate_kategorie ON public.inserate(kategorie);
CREATE INDEX idx_inserate_stadt ON public.inserate(stadt);