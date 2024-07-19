export interface Note {
  IdClient: number;
  IdNote: number;
  dateNote: Date;
  context: string;
  domaine: string;
  priorite: string;
  IdPrest: number;
  prixAchat: number;
  prixVente: number;
  ville: string;
  etat: string;
  idUser: number;
  heure: string;
  actionPrise: string;
  satisfaction: number;
  commentSatis: string;
  rapport: number;
  IdProd: number;
  keyWords: string;
  IdFree: number;
  update_date: Date;
  isVisible: boolean;
  idprest: number;
  client: {
    nom: string;
    prenom: string;
    login: string;
  };
  utilisateur: {
    login: string;
  }; // Type à définir selon le besoin
  prestataire: {
    nom: string;
  };
  product: {
    nom: string;
  };
  societe: {
    nom: string;
  };
  villeNote: {
    nomville: string;
  };
  domaineActivite: {
    nom: string;
  };
}
