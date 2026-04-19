import { User, Inserat, Anfrage } from './types';

export const mockUsers: User[] = [
  { id: 'u1', email: 'max@heyspaces.de', vorname: 'Max', nachname: 'Mustermann', has_listings: true, has_requests: false, created_at: '2024-01-15' },
  { id: 'u2', email: 'lena@beispiel.de', vorname: 'Lena', nachname: 'Müller', has_listings: true, has_requests: true, created_at: '2024-03-22' },
  { id: 'u3', email: 'thomas@beispiel.de', vorname: 'Thomas', nachname: 'Klein', has_listings: true, has_requests: false, created_at: '2024-06-10' },
];

const IMG = (id: string, w = 600) => `https://images.unsplash.com/${id}?w=${w}&auto=format&fit=crop`;

export const mockInserate: Inserat[] = [
  {
    id: '1', user_id: 'u1',
    titel: 'Helle 3-Zimmer in Schwabing',
    beschreibung: 'Diese wunderschöne 3-Zimmer-Wohnung liegt im Herzen von Schwabing. Komplett renoviert 2022, moderne Einbauküche, großer Balkon, ruhige Innenlage.',
    kategorie: 'mieten',
    objekttyp: 'Wohnung',
    angebotstyp: 'miete',
    preis: 1750,
    warmmiete: 2050,
    nebenkosten: 180,
    heizkosten: 120,
    preis_pro_qm: 22.44,
    kaution: 5250,
    flaeche: 78, zimmer: 3,
    etage: 2, gesamtgeschosse: 4,
    strasse: 'Leopoldstraße 42', stadt: 'München', plz: '80804', stadtteil: 'Schwabing',
    verfuegbar_ab: '2025-05-01', status: 'aktiv',
    bilder: [IMG('photo-1502672260266-1c1ef2d93688')],
    ausstattung_innen: ['Einbauküche', 'Parkett', 'Fußbodenheizung', 'Badewanne', 'Dusche', 'Aufzug'],
    ausstattung_aussen: ['Balkon', 'Tiefgarage', 'Fahrradkeller'],
    baujahr: 1968,
    heizungsart: 'Zentralheizung',
    energietraeger: 'Gas',
    energieklasse: 'C',
    energieverbrauch: 98.5,
    energieausweis_typ: 'Verbrauchsausweis',
    objektzustand: 'Renoviert 2022',
    stichwoerter: ['Ruhige Innenlage', 'Helle Räume', 'Gute Verkehrsanbindung'],
    besichtigungshinweise: 'Nur nach vorheriger Absprache per Anfrage.',
    created_at: '2025-01-15', owner: mockUsers[0],
  },
  {
    id: '2', user_id: 'u2', titel: 'Gemütliches WG-Zimmer Kreuzberg', beschreibung: 'Großes Zimmer (18m²) in netter 3er-WG. Altbau mit hohen Decken und Stuck. Gemeinsame Küche und Bad.',
    kategorie: 'wg_zimmer', preis: 580, flaeche: 18, zimmer: 1, strasse: 'Oranienstraße 15', stadt: 'Berlin', plz: '10999', verfuegbar_ab: '2025-02-15', status: 'aktiv', bilder: [IMG('photo-1545324418-cc1a3fa10c00')], created_at: '2025-01-14', owner: mockUsers[1],
  },
  {
    id: '3', user_id: 'u3', titel: 'Moderne 3-Zimmer zum Kauf', beschreibung: 'Neubauwohnung in begehrter Lage. 3 Zimmer, offene Küche, 2 Bäder, Fußbodenheizung. Tiefgaragenstellplatz inklusive.',
    kategorie: 'kaufen', preis: 385000, flaeche: 92, zimmer: 3, strasse: 'Elbchaussee 120', stadt: 'Hamburg', plz: '22605', verfuegbar_ab: '2025-04-01', status: 'aktiv', bilder: [IMG('photo-1484154218962-a197022b5858')], created_at: '2025-01-13', owner: mockUsers[2],
  },
  {
    id: '4', user_id: 'u1', titel: 'Stilvolle Altbauwohnung am Main', beschreibung: 'Charmante Altbauwohnung mit Stuck und Dielenböden. 4 Zimmer, 2 Balkone, separate Küche.',
    kategorie: 'mieten', preis: 1680, flaeche: 110, zimmer: 4, strasse: 'Sachsenhäuser Ufer 8', stadt: 'Frankfurt', plz: '60594', verfuegbar_ab: '2025-05-01', status: 'reserviert', bilder: [IMG('photo-1522708323590-d24dbb6b0267')], created_at: '2025-01-12', owner: mockUsers[0],
  },
  {
    id: '5', user_id: 'u2', titel: 'Großes WG-Zimmer Südstadt', beschreibung: 'Helles Zimmer (22m²) in entspannter 4er-WG. Große Wohnküche, 2 Bäder, Garten.',
    kategorie: 'wg_zimmer', preis: 450, flaeche: 22, zimmer: 1, strasse: 'Bonner Straße 65', stadt: 'Köln', plz: '50677', verfuegbar_ab: '2025-03-15', status: 'aktiv', bilder: [IMG('photo-1560448204-e02f11c3d0e2')], created_at: '2025-01-11', owner: mockUsers[1],
  },
  {
    id: '6', user_id: 'u3', titel: 'Penthouse mit Dachterrasse', beschreibung: 'Exklusives Penthouse über den Dächern Münchens. 5 Zimmer, 60m² Dachterrasse, Panoramablick.',
    kategorie: 'kaufen', preis: 890000, flaeche: 145, zimmer: 5, strasse: 'Maximilianstraße 35', stadt: 'München', plz: '80539', verfuegbar_ab: '2025-06-01', status: 'aktiv', bilder: [IMG('photo-1565182999561-18d7dc61c393')], created_at: '2025-01-10', owner: mockUsers[2],
  },
  {
    id: '7', user_id: 'u1', titel: 'Kompaktes Studio Maxvorstadt', beschreibung: 'Frisch saniertes Studio ideal für Studenten oder Berufspendler. Einbauküche, modernes Bad.',
    kategorie: 'mieten', preis: 890, flaeche: 32, zimmer: 1, strasse: 'Augustenstraße 50', stadt: 'München', plz: '80333', verfuegbar_ab: '2025-02-01', status: 'aktiv', bilder: [IMG('photo-1502672260266-1c1ef2d93688')], created_at: '2025-01-09', owner: { ...mockUsers[0], vorname: 'Anna', nachname: 'Schmidt' },
  },
  {
    id: '8', user_id: 'u2', titel: 'WG-Zimmer nahe Uni Hamburg', beschreibung: 'Möbliertes Zimmer in Studenten-WG. Sehr gute Anbindung zur Uni und Innenstadt.',
    kategorie: 'wg_zimmer', preis: 420, flaeche: 16, zimmer: 1, strasse: 'Grindelallee 100', stadt: 'Hamburg', plz: '20146', verfuegbar_ab: '2025-03-01', status: 'vergeben', bilder: [IMG('photo-1545324418-cc1a3fa10c00')], created_at: '2025-01-08', owner: mockUsers[1],
  },
  {
    id: '9', user_id: 'u1', titel: 'Familienhaus mit Garten', beschreibung: 'Großzügiges Einfamilienhaus mit Garten in ruhiger Lage. 6 Zimmer, 2 Bäder, Keller.',
    kategorie: 'kaufen', preis: 620000, flaeche: 180, zimmer: 6, strasse: 'Lindenallee 12', stadt: 'Berlin', plz: '14195', verfuegbar_ab: '2025-05-01', status: 'aktiv', bilder: [IMG('photo-1484154218962-a197022b5858')], created_at: '2025-01-07', owner: mockUsers[0],
  },
  {
    id: '10', user_id: 'u1', titel: 'Renovierte 2-Zimmer Altstadt', beschreibung: 'Komplett renovierte Altbauwohnung in zentraler Lage. Hochwertige Ausstattung.',
    kategorie: 'mieten', preis: 1200, flaeche: 58, zimmer: 2, strasse: 'Hohe Straße 30', stadt: 'Köln', plz: '50667', verfuegbar_ab: '2025-04-01', status: 'aktiv', bilder: [IMG('photo-1522708323590-d24dbb6b0267')], created_at: '2025-01-06', owner: { ...mockUsers[0], vorname: 'Anna', nachname: 'Schmidt' },
  },
  {
    id: '11', user_id: 'u3', titel: 'WG-Zimmer Prenzlauer Berg', beschreibung: 'Schönes Zimmer in 3er-WG. Helle Räume, Altbau-Charme, super Lage.',
    kategorie: 'wg_zimmer', preis: 650, flaeche: 24, zimmer: 1, strasse: 'Kastanienallee 88', stadt: 'Berlin', plz: '10435', verfuegbar_ab: '2025-03-15', status: 'aktiv', bilder: [IMG('photo-1560448204-e02f11c3d0e2')], created_at: '2025-01-05', owner: mockUsers[2],
  },
  {
    id: '12', user_id: 'u1', titel: 'Neubau-Wohnung mit Balkon', beschreibung: 'Moderne Neubauwohnung mit großem Südbalkon. Hochwertige Einbauküche, Fußbodenheizung.',
    kategorie: 'mieten', preis: 2100, flaeche: 85, zimmer: 3, strasse: 'Arnulfstraße 200', stadt: 'München', plz: '80634', verfuegbar_ab: '2025-04-15', status: 'aktiv', bilder: [IMG('photo-1565182999561-18d7dc61c393')], created_at: '2025-01-04', owner: { ...mockUsers[0], vorname: 'Anna', nachname: 'Schmidt' },
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
