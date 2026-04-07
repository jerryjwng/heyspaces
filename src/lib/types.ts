export type Kategorie = 'mieten' | 'wg_zimmer' | 'kaufen';

export type InseratStatus = 'aktiv' | 'reserviert' | 'vergeben' | 'inaktiv';

export type AnfrageStatus = 'offen' | 'gesehen' | 'beantwortet';

export type User = {
  id: string;
  email: string;
  vorname: string;
  nachname: string;
  has_listings: boolean;
  has_requests: boolean;
  created_at?: string;
};

export type Inserat = {
  id: string;
  user_id: string;
  titel: string;
  beschreibung: string;
  kategorie: Kategorie;
  preis: number;
  flaeche: number;
  zimmer: number;
  strasse: string;
  stadt: string;
  plz: string;
  verfuegbar_ab: string;
  status: InseratStatus;
  bilder: string[];
  created_at: string;
  updated_at?: string;
  owner?: User;
};

export type Anfrage = {
  id: string;
  inserat_id: string;
  sender_id: string;
  empfaenger_id?: string;
  nachricht: string;
  vorname: string;
  nachname: string;
  email: string;
  telefon?: string;
  einzug_ab?: string;
  status: AnfrageStatus;
  created_at: string;
  inserat?: Inserat;
  sender?: User;
};

export type Favorit = {
  id: string;
  user_id: string;
  inserat_id: string;
  created_at: string;
};

export const KATEGORIE_LABELS: Record<Kategorie, string> = {
  mieten: 'Mieten',
  wg_zimmer: 'WG-Zimmer',
  kaufen: 'Kaufen',
};
