export interface Invoice {
  societe: {
    nom: string | null;
  };
  articles:ArticlesInvoices[];
  totalQuantite: number | null;
  listinvart: Listinvart[];
  nc: number;
  totalTTC: number;
  type: number;
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
  totalTVA: number;
  footer: string | null;
  idSociete: number;
  autreSociete: string | null;
  adresseSociete: string | null;
  autreQuantiteTitle: string | null;
  idUser: string | null;
  dateCreation: Date;
  BDC: string;
  parent: string | null;
  major: number;
}

export interface InvoiceCopy {

  articles: Articles[];
  totalTTC: number;
  type: string;
  reference: number | null;
  etat: number;
  isProFormat: number;
  isValidated: number;
  paymentMode: number;
  paymentComment: string | null;
  paymentDate: Date | null;
  date: Date;
  tva: number;
  totalTVA: number;
  footer: string | null;
  idSociete: number;
  autreSociete: string | null;
  adresseSociete: string | null;
  autreQuantiteTitle:   number | null;
  idUser: string | null;
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

export interface ArticlesInvoices {
  nbrArticles: number | null;
  totalTTC: number | null;

}

export enum InvoiceColumns {
  id = 'id',
  customerName = 'customerName',
  // Ajoutez d'autres clés nécessaires ici
}

export interface Listinvart {
  idArticle: number;
  designation: string;
  nbrArticles: number;
  quantite: number;
  postPrixUnit: Float64Array;
  autreQuantite: number;
}

export interface Articles {

	idArticle: number;
  designation: string;
  postPrixUnit: Float64Array;
  quantite: number;
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
export interface InvoicePreview {
  idInv: number;
  reference: string;
  type: number;
  etat: number
  isProFormat: boolean;
  isValidated: number;
  nc: number;
  date: Date;
  tva: number;
  paymentDate: Date;
  paymentMode: number;
  societe: {
    nom: string;
    ice: string;
    adresse: string;
  };
  listinvart: Array<{
    idArticle: number;
    designation: string;
    quantite: number;
    postPrixUnit: number;
    autreQuantite: number;
  }>;
  parametreCompanie: {
    nomCompanie: string;
    adresseCompanie: string;
    tel1Companie: string | null;
    email1Compagnie:string;
    ice: number | null;
    tel2Compnie: string | null;
    email2Compagnie: string | null;
    sitewebCompagnie: string;
    registreCommerce: number;
    patente: number;
    identifiantFiscal: number;
  };
  utilisateur: {
    login: string;
  };
  nbrArticles: number;
  totalTTC: number;
  validationDate: Date;
  paymentComment: string;
  autreSociete: string;
  adresseSociete: string;
  dateCreation: Date;
}


// invoice.model.ts
