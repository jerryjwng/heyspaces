import type { Tables } from '@/integrations/supabase/types';
import type { Inserat, Kategorie, InseratStatus, User } from './types';

type InserateRow = Tables<'inserate'>;
type ProfileRow = Pick<Tables<'profiles'>, 'id' | 'vorname' | 'nachname' | 'created_at'>;

export function mapInserat(row: InserateRow, ownerProfile?: ProfileRow | null): Inserat {
  const owner: User | undefined = ownerProfile
    ? {
        id: ownerProfile.id,
        email: '',
        vorname: ownerProfile.vorname,
        nachname: ownerProfile.nachname,
        has_listings: true,
        has_requests: false,
        created_at: ownerProfile.created_at,
      }
    : undefined;

  return {
    id: row.id,
    user_id: row.user_id,
    titel: row.titel,
    beschreibung: row.beschreibung,
    kategorie: row.kategorie as Kategorie,
    preis: row.preis,
    flaeche: row.flaeche,
    zimmer: row.zimmer,
    strasse: row.strasse,
    stadt: row.stadt,
    plz: row.plz,
    verfuegbar_ab: row.verfuegbar_ab ?? '',
    status: row.status as InseratStatus,
    bilder: row.bilder ?? [],
    created_at: row.created_at,
    updated_at: row.updated_at,
    owner,
    objekttyp: row.objekttyp ?? undefined,
    angebotstyp: row.angebotstyp,
    warmmiete: row.warmmiete ?? undefined,
    nebenkosten: row.nebenkosten ?? undefined,
    heizkosten: row.heizkosten ?? undefined,
    preis_pro_qm: row.preis_pro_qm ?? undefined,
    kaution: row.kaution ?? undefined,
    etage: row.etage ?? undefined,
    gesamtgeschosse: row.gesamtgeschosse ?? undefined,
    stadtteil: row.stadtteil ?? undefined,
    hausnummer: row.hausnummer ?? undefined,
    ausstattung_innen: row.ausstattung_innen ?? [],
    ausstattung_aussen: row.ausstattung_aussen ?? [],
    baujahr: row.baujahr ?? undefined,
    heizungsart: row.heizungsart ?? undefined,
    energietraeger: row.energietraeger ?? undefined,
    energieklasse: row.energieklasse ?? undefined,
    energieverbrauch: row.energieverbrauch ?? undefined,
    energieausweis_typ: row.energieausweis_typ ?? undefined,
    objektzustand: row.objektzustand ?? undefined,
    stichwoerter: row.stichwoerter ?? [],
    besichtigungshinweise: row.besichtigungshinweise ?? undefined,
  };
}
