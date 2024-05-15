export interface Entreprise {
  idCompanie: number;
  nomCompanie: string;
  adresseCompanie: string | null;
  tel1Companie: string | null;
  tel2Compnie: number | null;
  email1Compagnie: number | null;
  email2Compagnie: number | null;
  sitewebCompagnie: number | null;
  registreCommerce: number | null;
  patente: number | null;
  identifiantFiscal: number | null;
  ice: number | null;
}

interface SelectedEntreprise extends Entreprise {
  // Définissez les propriétés supplémentaires spécifiques à SelectedEntreprise si nécessaire
  nomCompanie: string;
  adresseCompanie: string | null;
  tel1Companie: string | null;
  tel2Compnie: number | null;
  email1Compagnie: number | null;
  email2Compagnie: number | null;
  sitewebCompagnie: number | null;
  registreCommerce: number | null;
  patente: number | null;
  identifiantFiscal: number | null;
  ice: number | null;
}

