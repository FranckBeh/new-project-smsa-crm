export interface Clients {
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



