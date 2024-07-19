export interface Prestataire {
  IdPrest: number;
  nom: string;
  villeAssociation: {
    nomville: string;
    numville: number;
  };
  tel: string;
  gsm: string;
  responsable: string;
  noteCount: number;
  priorite: number;
  adresse: string;
  ville: string;
  fix: string;
  prioritaire: string;
  fonctionResponsable: string;
  mailResponsable: string;
  document: string;
  gsmResponsable: string;
  note: number;
  nomResponsable: string;
  blacklist: number;
  email: string;
  fax: string;
  remarques: string;
  aviscons: string;
  infonet: string;
  commission: string;
}

export interface PrestataireDetail {
  id: number;
  nom: string;
  adresse: string;
  villeId: number;
  villeNom: string | null;
  // Additional attributes
  priorite: string; // Assuming priority is a string
  fix: string; // Assuming fix is a string
  prioritaire: boolean;
  nomResponsable: string;
  fonctionResponsable: string;
  mailResponsable: string;
  document: string; // Assuming document is a string (might need adjustment)
  gsmResponsable: string;
  notes: NoteDetail[];
  domainesActivite: DomaineActiviteDetail[];
  tags: TagDetail[];
  documents: DocumentDetail[];
  autresPrest: AutresPrestDetail[];
  blacklist: boolean;
  email: string;
  fax: string;
  remarques: string;
  aviscons: string; // Assuming aviscons is a string (might need adjustment)
  infonet: string; // Assuming infonet is a string (might need adjustment)
  commission: number;
}


export interface NoteDetail {
  id: number;
  dateNote: Date | null;
  context: string;
  // Ajoutez d'autres attributs de Note selon les besoins
}

export interface DomaineActiviteDetail {
  id: number;
  nom: string;
  // Ajoutez d'autres attributs de DomaineActivite selon les besoins
}

export interface TagDetail {
  id: number;
  nom: string;
  // Ajoutez d'autres attributs de Tag selon les besoins
}

export interface DocumentDetail {
  id: number;
  nom: string;
  nomFichier: string;
  // Ajoutez d'autres attributs de Document selon les besoins
}

export interface AutresPrestDetail {
  id: number;
  cle: string;
  valeur: string;
  // Ajoutez d'autres attributs de AutresPrest selon les besoins
}


export interface Tag {
  idTag: number;
  nom: string;
}
export interface DomaineActivite {
  IdDomaine: number;
  nom: string;
  idDomGen?: number; // Optionnel si non nécessaire partout
}
export interface Ville {
  NumVille: number;
  NomVille: string;
}
