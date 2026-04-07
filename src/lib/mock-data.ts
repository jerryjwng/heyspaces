import { User, Inserat, Anfrage } from './types';

export const mockUsers: User[] = [
  { id: 'u1', email: 'max@heyspaces.de', vorname: 'Max', nachname: 'Mustermann', has_listings: true, has_requests: false, created_at: '2024-01-15' },
  { id: 'u2', email: 'lena@beispiel.de', vorname: 'Lena', nachname: 'Müller', has_listings: true, has_requests: true, created_at: '2024-03-22' },
  { id: 'u3', email: 'thomas@beispiel.de', vorname: 'Thomas', nachname: 'Klein', has_listings: true, has_requests: false, created_at: '2024-06-10' },
];

export const mockInserate: Inserat[] = [
  {
    id: 'i1', user_id: 'u1', titel: 'Helle 2-Zimmer-Wohnung in Schwabing', beschreibung: 'Wunderschöne, lichtdurchflutete Wohnung in zentraler Lage. Frisch renoviert mit Eichenparkett und moderner Einbauküche. Balkon mit Blick ins Grüne. Perfekt für Singles oder Paare.',
    kategorie: 'mieten', preis: 1250, flaeche: 65, zimmer: 2, strasse: 'Leopoldstraße 42', stadt: 'München', plz: '80802', verfuegbar_ab: '2025-03-01', status: 'aktiv', bilder: [], created_at: '2025-01-10', owner: mockUsers[0],
  },
  {
    id: 'i2', user_id: 'u2', titel: 'Gemütliches WG-Zimmer in Kreuzberg', beschreibung: 'Großes Zimmer (18m²) in netter 3er-WG. Altbau mit hohen Decken und Stuck. Gemeinsame Küche und Bad. Waschmaschine vorhanden. Nette Mitbewohner (m/w, 25-30).',
    kategorie: 'wg_zimmer', preis: 580, flaeche: 18, zimmer: 1, strasse: 'Oranienstraße 15', stadt: 'Berlin', plz: '10999', verfuegbar_ab: '2025-02-15', status: 'aktiv', bilder: [], created_at: '2025-01-12', owner: mockUsers[1],
  },
  {
    id: 'i3', user_id: 'u3', titel: 'Moderne 3-Zimmer-Wohnung zum Kauf', beschreibung: 'Neubauwohnung in begehrter Lage. 3 Zimmer, offene Küche, 2 Bäder, Fußbodenheizung. Tiefgaragenstellplatz und Kellerabteil inklusive. Energieeffizienzklasse A.',
    kategorie: 'kaufen', preis: 385000, flaeche: 92, zimmer: 3, strasse: 'Elbchaussee 120', stadt: 'Hamburg', plz: '22605', verfuegbar_ab: '2025-04-01', status: 'aktiv', bilder: [], created_at: '2025-01-08', owner: mockUsers[2],
  },
  {
    id: 'i4', user_id: 'u1', titel: 'Stilvolle Altbauwohnung am Main', beschreibung: 'Charmante Altbauwohnung mit Stuck und Dielenböden. 4 Zimmer, 2 Balkone, separate Küche. Ruhige Hinterhoflage in direkter Nähe zum Main.',
    kategorie: 'mieten', preis: 1680, flaeche: 110, zimmer: 4, strasse: 'Sachsenhäuser Ufer 8', stadt: 'Frankfurt', plz: '60594', verfuegbar_ab: '2025-05-01', status: 'reserviert', bilder: [], created_at: '2025-01-05', owner: mockUsers[0],
  },
  {
    id: 'i5', user_id: 'u2', titel: 'Großes WG-Zimmer in der Südstadt', beschreibung: 'Helles Zimmer (22m²) in entspannter 4er-WG. Große Wohnküche, 2 Bäder, Garten. Sehr gute Anbindung (5 Min. zum Hbf).',
    kategorie: 'wg_zimmer', preis: 450, flaeche: 22, zimmer: 1, strasse: 'Bonner Straße 65', stadt: 'Köln', plz: '50677', verfuegbar_ab: '2025-03-15', status: 'aktiv', bilder: [], created_at: '2025-01-14', owner: mockUsers[1],
  },
  {
    id: 'i6', user_id: 'u3', titel: 'Penthouse mit Dachterrasse', beschreibung: 'Exklusives Penthouse über den Dächern Münchens. 5 Zimmer, 60m² Dachterrasse, Panoramablick. Hochwertige Ausstattung mit Smart-Home-System.',
    kategorie: 'kaufen', preis: 890000, flaeche: 145, zimmer: 5, strasse: 'Maximilianstraße 35', stadt: 'München', plz: '80539', verfuegbar_ab: '2025-06-01', status: 'aktiv', bilder: [], created_at: '2025-01-11', owner: mockUsers[2],
  },
  {
    id: 'i7', user_id: 'u1', titel: 'Kompakte 1-Zimmer-Wohnung in Mitte', beschreibung: 'Frisch sanierte Einzimmerwohnung ideal für Studenten oder Berufspendler. Einbauküche, modernes Bad, Kellerabteil.',
    kategorie: 'mieten', preis: 750, flaeche: 35, zimmer: 1, strasse: 'Torstraße 88', stadt: 'Berlin', plz: '10119', verfuegbar_ab: '2025-02-01', status: 'vergeben', bilder: [], created_at: '2025-01-02', owner: mockUsers[0],
  },
  {
    id: 'i8', user_id: 'u2', titel: 'Familienfreundliche 4-Zimmer-Wohnung', beschreibung: 'Geräumige Wohnung in ruhiger Wohngegend. Große Küche, Abstellraum, eigener Garten. Schule und Kindergarten in Gehweite.',
    kategorie: 'mieten', preis: 1450, flaeche: 105, zimmer: 4, strasse: 'Eppendorfer Weg 22', stadt: 'Hamburg', plz: '20259', verfuegbar_ab: '2025-04-15', status: 'aktiv', bilder: [], created_at: '2025-01-13', owner: mockUsers[1],
  },
  {
    id: 'i9', user_id: 'u3', titel: 'Loft-Wohnung in Ehrenfeld', beschreibung: 'Außergewöhnliche Loft-Wohnung in ehemaliger Fabrik. Offener Grundriss, 4m Deckenhöhe, Sichtbeton und Stahl. Ideal für Kreative.',
    kategorie: 'kaufen', preis: 295000, flaeche: 78, zimmer: 2, strasse: 'Venloer Straße 200', stadt: 'Köln', plz: '50823', verfuegbar_ab: '2025-03-01', status: 'aktiv', bilder: [], created_at: '2025-01-09', owner: mockUsers[2],
  },
  {
    id: 'i10', user_id: 'u1', titel: 'Möbliertes WG-Zimmer Maxvorstadt', beschreibung: 'Voll möbliertes Zimmer (16m²) in 2er-WG. Schreibtisch, Bett, Schrank vorhanden. Uni und Englischer Garten fußläufig.',
    kategorie: 'wg_zimmer', preis: 620, flaeche: 16, zimmer: 1, strasse: 'Augustenstraße 50', stadt: 'München', plz: '80333', verfuegbar_ab: '2025-02-15', status: 'aktiv', bilder: [], created_at: '2025-01-15', owner: mockUsers[0],
  },
];

export const mockAnfragen: Anfrage[] = [
  {
    id: 'a1', inserat_id: 'i1', sender_id: 'u2', empfaenger_id: 'u1', nachricht: 'Hallo, ich interessiere mich sehr für Ihre Wohnung. Wäre eine Besichtigung möglich?', vorname: 'Lena', nachname: 'Müller', email: 'lena@beispiel.de', telefon: '0176-12345678', einzug_ab: '2025-03-01', status: 'offen', created_at: '2025-01-16', inserat: mockInserate[0], sender: mockUsers[1],
  },
  {
    id: 'a2', inserat_id: 'i5', sender_id: 'u1', empfaenger_id: 'u2', nachricht: 'Hi, das WG-Zimmer klingt super! Ich bin 28 und arbeite als Designer. Wann kann ich vorbeikommen?', vorname: 'Max', nachname: 'Mustermann', email: 'max@heyspaces.de', status: 'gesehen', created_at: '2025-01-15', inserat: mockInserate[4], sender: mockUsers[0],
  },
  {
    id: 'a3', inserat_id: 'i3', sender_id: 'u2', empfaenger_id: 'u3', nachricht: 'Guten Tag, wir sind sehr an der Wohnung interessiert. Ist der Preis verhandelbar?', vorname: 'Lena', nachname: 'Müller', email: 'lena@beispiel.de', telefon: '0176-12345678', status: 'beantwortet', created_at: '2025-01-14', inserat: mockInserate[2], sender: mockUsers[1],
  },
];

export const GERMAN_CITIES = [
  'München', 'Berlin', 'Hamburg', 'Frankfurt', 'Köln', 'Düsseldorf', 'Stuttgart', 'Leipzig', 'Dresden', 'Nürnberg', 'Hannover', 'Bremen', 'Bonn', 'Mannheim', 'Karlsruhe', 'Augsburg', 'Wiesbaden', 'Freiburg', 'Münster', 'Heidelberg',
];
