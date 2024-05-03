export interface Invoice {
  societe: {
    nom: string;
  };
  listinvart: Listinvart[];
  nc: number;
  totalTTC: number;
  type: string;
  id: number;
  customerName: string;
  customerAddress: string;
  reference: string;
  totalAmount: number;
  invoiceType: invoiceType[];
  items: Item[];
  total: number;
  idInv: number;
  etat: number;
  isProFormat: number;
  isValidated: number;
  validationDate: Date;
  paymentMode: number;
  paymentComment: string | null;
  paymentDate: Date | null;
  date: Date;
  tva: number;
  footer: string | null;
  idSociete: number;
  autreSociete: string | null;
  adresseSociete: string | null;
  autreQuantiteTitle: string | null;
  idUser: number | null;
  dateCreation: Date;
  BDC: string;
  parent: string | null;
  major: number;
}

export interface Item {
  name: string;
  quantity: number;
  price: number;
}

export interface invoiceType {
  id: number;
  name: string;
}

export enum InvoiceColumns {
  id = 'id',
  customerName = 'customerName',
  // Ajoutez d'autres clés nécessaires ici
}

export interface Listinvart {
  designation: string;
  nbrArticles: string;
  quantite: number;
  postPrixUnit: number;
  autreQuantite: number;
}

// model societé
export interface Societe {
  idSociete: number;
  nom: string;
  ice: string;
  adresse: string;
}


// invoice.model.ts
