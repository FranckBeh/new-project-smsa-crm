export interface Clients {
  IdClient: number;
  nom: string;
  prenom: string;
  typeclient:{
    NumType: number;
    NomType: string;
  };
  fixePerso: string;
  fixePro: string;
  mailPerso: string;
  mailPro: string;
  societe:{
    idSociete: number;
    nom: string;
  };
  login: string;
  expiration: Date;
  fonction: string;
  inactif: number;
  typeclient_id: number;
  gsmPerso: string;
  gsmPro: string;
  societe_id: number;
  situation: string;
  civilite: string;
  conjoint: Conjoint;
  enfants: Array <{
    nom: string;
    anniversaire: Date;
  }>;
  nbrEnfant: boolean;

}


export interface ClientsResponse {
  IdClient: number;
  nom: string;
  prenom: string;
  typeclient:{
    NomType: string;
  };
  fixePerso: string;
  fixePro: string;
  mailPerso: string;
  mailPro: string;
  societe:{
    nom: string;
  };
  login: string;
  expiration: Date;
  fonction: string;
  inactif: number;
  totalClients: number;
  clients: Clients[];
}


export interface TypeClient {
  NumType: number;
  NomType: string;
  abreviation?: string; // '?' marque ce champ comme optionnel
}

export interface Conjoint{
  nom: string;
  gsmPro: string; //
  anniversaire: Date
  mail: string; //
  gsmPerso:string; //,

}


export interface Enfant{
  nom: string;
  anniversaire: Date;

}

export interface ClientPayload {
  clientData: Clients;
  conjointData?: Conjoint;
  enfantsData?: Enfant[];
}
