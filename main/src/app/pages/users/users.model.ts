export interface Utilisateur {
  IdUser: number;
  login: string;
  password: string;
  email: string;
  tel: string | null;
  prenom: string;
  nom: string;
  role: string;
  online: number;
  active: boolean;
}
