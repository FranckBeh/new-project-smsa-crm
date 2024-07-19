import { AuthService } from './../../../auth/auth.service';
import { Invoice } from './../../../../models/invoice.model';
import { Alignment } from './../../../../../../node_modules/@types/pdfmake/interfaces.d';
import { InvoiceService } from './../../invoice.service';
import { InvoicePreview } from './../../invoice.model';
import { MatDialog } from '@angular/material/dialog';
// preview-facture.component.ts
import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF, { jsPDFOptions } from 'jspdf';

import html2canvas from 'html2canvas';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

import { formatDate } from '@angular/common';

import { franc } from 'franc';
import { DialogComponent } from 'src/app/layouts/dialog/dialog.component';




@Component({
  selector: 'app-preview-facture',
  templateUrl: './preview-facture.component.html',
  styleUrls: ['./preview-facture.component.scss']
})
export class PreviewFactureComponent implements OnInit {
  invoice: InvoicePreview;
  invoices: InvoicePreview[] = [];
  totalTTCInWords: string;
  totalTTCMessage: string;
  montantg: any;
  idInv: number;
  constructor(
    private invoiceService: InvoiceService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    const idInv=+this.route.snapshot.params['id'];
    this.invoiceService.getInvoiceDataById(id).subscribe((data: InvoicePreview) => {
      this.invoice = data;
      this.cdr.detectChanges();
     // console.log('Invoice', this.invoice);
      this.montantg = this.invoice.totalTTC.toFixed(2);
      this.totalTTCInWords = this.convertToWords(this.invoice.totalTTC);
      this.totalTTCMessage = `En votre aimable règlement la somme de : ${this.formatNumberWithSpaces(this.invoice.totalTTC.toFixed(2))} DHS (${this.totalTTCInWords})`;
    });

  //  this.route.params.subscribe(params => {
  //    this.idInv = params['idInv'];
      // Utilisez l'ID comme nécessaire
  //  });
  }



  validerFacture(idInv: number): void {
    if (this.authService.isAdmin()) {
      this.invoiceService.validateInvoice(idInv).subscribe({
        next: (response) => {
        //  console.log('Facture validée', response);
          const invoice = this.invoices.find((inv: InvoicePreview) => inv.idInv === idInv);
          if (invoice) {
            invoice.isValidated = 1;
          }

          this.dialog.open(DialogComponent, {
            data: {
              message: 'Facture Mise à jour avec succès'
            }
          });


          window.location.reload();
          this.router.navigate(['/invoice/preview-facture', idInv]);

        },
        error: (error) => {
          console.error('Erreur lors de la validation de la facture', error);
          this.dialog.open(DialogComponent, {
            data: {
              message: 'Erreur lors de la modificiation de la facture'
            }
          });
        }
      });
    }else{
      alert('Vous etes pas autorisé')
    }

  }

  validerEnAttente(idInv: number): void {
  
      this.invoiceService. validateInvoiceAttente(idInv).subscribe({
        next: (response) => {
        //  console.log('Facture validée', response);
          const invoice = this.invoices.find((inv: InvoicePreview) => inv.idInv === idInv);
          if (invoice) {
            invoice.etat = 1;
          }

          this.dialog.open(DialogComponent, {
            data: {
              message: 'Facture Mise à jour avec succès'
            }
          });


          window.location.reload();
          this.router.navigate(['/invoice/preview-facture', idInv]);

        },
        error: (error) => {
          console.error('Erreur lors de la validation de la facture', error);
          this.dialog.open(DialogComponent, {
            data: {
              message: 'Erreur lors de la modificiation de la facture'
            }
          });
        }
      });

  }


  getPaymentModeText(paymentMode: number): string {
    switch (paymentMode) {
      case 0:
        return 'Espèces';
      case 1:
        return 'Chèque';
      case 2:
        return 'Effet';
      case 3:
        return 'Carte bancaire';
      case 4:
        return 'Virement';
      default:
        return 'Impayé';
    }
  }

  getEtatText(etat: number): string {
    switch (etat) {
      case 0:
        return 'Créance';
      case 1:
        return 'Payée';
      default:
        return '';
    }
  }

  getValidate(isValidated: number): string {
    if (isValidated) {
      return 'Validé';
    } else {
      return 'Payée en attente';
    }
  }

  getEtatWithIsValidated(isValidated: number, etat:number): string {
    if (isValidated==1 && etat==1)
      return 'Payée';
    else if (isValidated==0 && etat==0)
      return 'Créance';
    else if (isValidated==0 && etat==1)
      return 'Payée en attente';
    else
      return '';
  }

  getTypeText(type: number): string{
    switch (type) {
      case 0:
        return 'Devis';
      case 1:
        return 'Facture';
      case 2:
        return 'Bon de Livraison';
      case 3:
        return 'Avoir';
      default:
        return '';
    }
  }
  getFormattedReference(): string {
    const year = this.invoice.dateCreation.getFullYear();
    const referenceNumber = this.invoice.reference.padStart(6, '0'); // Remplir le numéro de référence avec des zéros à gauche si nécessaire
    return `f ${referenceNumber}/${year}`;
  }



  private formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${day}/${month}/${year}`;
  }

 formatNumberWithSpaces(montantàconvertir: any) {
    return montantàconvertir.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

getBase64ImageFromURL(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // nécessaire pour charger des images de domaines différents
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) { // Vérifiez que ctx n'est pas null
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL('image/png');
          resolve(dataURL);
        } else {
          reject(new Error('Impossible de créer le contexte 2D'));
        }
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }
   convertToWords(amount: number): string {
    const underTwenty = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
    const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', '', 'quatre-vingt', ''];

    function getUnit(num: number) {
        return underTwenty[num];
    }

    function getTen(num: number) {
        if (num < 20) return getUnit(num);
        if (num >= 70 && num < 80) {
            return 'soixante-' + getUnit(num - 60);
        }
        if (num >= 90 && num < 100) {
            return 'quatre-vingt-' + getUnit(num - 80);
        }
        let tenWord = tens[Math.floor(num / 10)];
        let unit = num % 10;
        if (unit === 0) return tenWord;
        return tenWord + (unit === 1 && Math.floor(num / 10) !== 8 ? ' et un' : '-' + getUnit(unit));
    }

    function getHundred(num: number) {
        if (num < 100) return getTen(num);
        let hundredPart = Math.floor(num / 100);
        let rest = num % 100;
        let hundredText = hundredPart > 1 ? getUnit(hundredPart) + ' cent' : 'cent';
        return rest === 0 ? hundredText : hundredText + ' ' + getTen(rest);
    }

    function getBigNumber(num: number, scale: string) {
        if (num === 0) return '';
        if (num === 1 && scale === 'mille') return 'mille';
        return getHundred(num) + ' ' + scale + (num > 1 && scale === 'million' ? 's' : '');
    }

    let result = '';
    let centimes = Math.round((amount - Math.floor(amount)) * 100);
    let centimesPart = centimes > 0 ? ' et ' + getTen(centimes) + ' centimes' : '';
    let remaining = Math.floor(amount);
    let millions = Math.floor(remaining / 1000000);
    remaining -= millions * 1000000;
    let thousands = Math.floor(remaining / 1000);
    remaining -= thousands * 1000;
    let hundreds = remaining;

    result += millions > 0 ? getBigNumber(millions, 'million') + ' ' : '';
    result += thousands > 0 ? getBigNumber(thousands, 'mille') + ' ' : '';
    result += hundreds > 0 ? getHundred(hundreds) : '';

    // Ajout de la devise "dirhams" pour les montants entiers, même si les centimes sont à zéro
    let dirhamsPart = amount >= 1 ? ' dirhams' : '';

    return result.trim() + dirhamsPart + centimesPart;
}

exportToPDF(): void {
  this.getBase64ImageFromURL('assets/images/logos/logo_multi.png').then((base64Image: any) => {
    const docDefinition: TDocumentDefinitions = {
      pageOrientation: 'portrait',
      pageSize: 'A4',
      footer: (currentPage, pageCount) => {
        const param = this.invoice.parametreCompanie;
        const address = param.adresseCompanie ? 'Adresse : ' + param.adresseCompanie : '';
        const phone = param.tel1Companie ? 'Téléphone : ' + param.tel1Companie : '';
        const email = param.email1Compagnie ? 'Email : ' + param.email1Compagnie : '';
        const website = param.sitewebCompagnie ? 'Site Web : ' + param.sitewebCompagnie : '';

        const ice = param.ice ? 'ICE : ' + param.ice : '';
        const ifiscal = param.identifiantFiscal ? 'IF : ' + param.identifiantFiscal : '';
        const rc = param.registreCommerce ? 'RC : ' + param.registreCommerce : '';
        const patente = param.patente ? 'Patente : ' + param.patente : '';

        return {
          stack: [
            {
              canvas: [
                { type: 'line', x1: 0, y1: 0, x2: 555, y2: 0, lineWidth: 1, lineColor: '#333333' }
              ],
              margin: [20, 0]
            },
            {
              columns: [
                {
                  text: [address, phone, email, website].filter(Boolean).join(' | '),
                  style: 'footer',
                  alignment: 'center',
                  fillColor: '#f2f2f2',
                  color: '#663300',
                  margin: [20, 10, 20, 0]
                }
              ]
            },
            {
              columns: [
                {
                  text: [ice, ifiscal, rc, patente].filter(Boolean).join(' | '),
                  style: 'footer',
                  alignment: 'center',
                  fillColor: '#f2f2f2',
                  color: '#663300',
                  margin: [20, 0, 20, 10]
                }
              ]
            }
          ]
        };
      },
      content: [
        {
          columns: [
            {
              image: base64Image,
              width: 70,
              alignment: 'left',
              margin: [0, 10, 0, 10]
            },
            {
              text: [
                { text: this.invoice.parametreCompanie.nomCompanie + '\n', bold: true, fontSize: 15 },
                { text: 'Voyage | Événementiel | Conciergerie privé | Conciergerie d\'entreprise', fontSize: 10 }
              ],
              alignment: 'right',
              margin: [0, 30, 0, 0],
              color: '#663300',
            }
          ]
        },
        {
          columns: [
            {
              width: '*',
              text: ''
            },
            {
              width: 'auto',
              table: {
                body: [
                  [
                    { text: 'Date :', bold: true, alignment: 'left' },
                    { text: formatDate(this.invoice.dateCreation, 'dd/MM/yyyy', 'en-US'), alignment: 'left' }
                  ],
                  [
                    { text: 'Société / Client :', bold: true, alignment: 'left' },
                    { text: this.invoice.nc !== 1 ? this.invoice.societe.nom : this.invoice.autreSociete, alignment: 'left' }
                  ],
                  [
                    { text: '', bold: true, alignment: 'left' },
                    { text: this.invoice.nc!== 1? this.invoice.societe.adresse : ' ', alignment: 'left' }
                  ],
                  ...(this.invoice.societe.ice
                    ? [
                        [
                          { text: 'ICE :', bold: true, alignment: 'left' },
                          { text: this.invoice.societe.ice, bold: true,alignment: 'left' }
                        ]
                      ]
                    : this.invoice.nc == 1
                    ? [
                        [
                          { text: 'ICE :', bold: true, alignment: 'left' },
                          { text: this.invoice.adresseSociete, bold: true,alignment: 'left' }
                        ]
                      ]
                    : [])
                ]
              },
              layout: 'noBorders',
              margin: [0, 20, 0, 20]
            }
          ]
        },
        {
          table: {
            widths: ['auto'],
            body: [
              [
                {
                  text: this.getTypeText(this.invoice.type) + ' N° 000' + this.invoice.reference + '/' + formatDate(this.invoice.dateCreation, 'yyyy', 'en-US'),
                  alignment: 'center',
                  margin: [10, 10, 10, 10],
                  style: 'invoiceNumber',
                }
              ]
            ]
          },
          layout: {
            hLineWidth: function (i: number, node: any) {
              return 1;
            },
            vLineWidth: function (i: number, node: any) {
              return 1;
            },
            hLineColor: function (i: number, node: any) {
              return '#663300';
            },
            vLineColor: function (i: number, node: any) {
              return '#663300';
            },
          },
          margin: [0, 10, 0, 20],
        },
        {
          table: {
            headerRows: 1,
            widths: ['10%', '*', '25%', '25%'],
            body: [
                [
                    { text: 'Quantité', style: 'tableHeader', alignment: 'center' },
                    { text: 'Désignation', style: 'tableHeader', alignment: 'center' },
                    { text: 'Prix unitaire TTC', style: 'tableHeader', alignment: 'center' },
                    { text: 'Total', style: 'tableHeader', alignment: 'center' }
                ],
                ...this.invoice.listinvart.map((item: { designation: any; quantite: number; postPrixUnit: number; }) => [
                    { text: item.quantite.toString(), alignment: 'center', fillColor: '#ffffff', margin: [0, this.invoice.listinvart.length > 1 ? 10 : 20, 0, 0], border: [true, true, true, true] },
                    { text: item.designation, fillColor: '#ffffff', margin: [0, this.invoice.listinvart.length > 1 ? 10 : 20, 0, 10], border: [true, true, true, true] },
                    { text: `${item.postPrixUnit.toFixed(2)} DH`, alignment: 'center', fillColor: '#ffffff', margin: [0, this.invoice.listinvart.length > 1 ? 10 : 20, 0, 0], border: [true, true, true, true] },
                    { text: `${(item.quantite * item.postPrixUnit).toFixed(2)} DH`, alignment: 'center', fillColor: '#ffffff', margin: [0, this.invoice.listinvart.length > 1 ? 10 : 20, 0, 0], border: [true, true, true, true] }
                ]),
                [
                    {}, {}, { text: 'dont T.V.A ', alignment: 'right', margin: [0, 60, 0, 0], border: [true, true, true, true] },
                    { text: `${this.invoice.tva.toFixed(2)} DH`, alignment: 'center', fillColor: '#ffffff', margin: [0, 60, 0, 0], border: [true, true, true, true] }
                ],
                [
                    {}, {}, { text: 'Total TTC', alignment: 'right', bold: true, border: [true, true, true, true] },
                    { text: `${this.formatNumberWithSpaces(this.invoice.totalTTC.toFixed(2))} DH`, alignment: 'center', fillColor: '#ffffff', border: [true, true, true, true] }
                ]
            ]
        },
          layout: {
            hLineWidth: function (i: number, node: any) {
              return i === 0 || i === node.table.body.length ? 1.5 : 0.5;
            },
            vLineWidth: function (i: number, node: any) {
              return 0.5;
            },
            hLineColor: function (i: number, node: any) {
              return '#000000';
            },
            vLineColor: function (i: number, node: any) {
              return '#000000';
            },
            paddingLeft: (i: number, node: any) => 4,
            paddingRight: (i: number, node: any) => 4,
            paddingTop: (i: number, node: any) => 2,
            paddingBottom: (i: number, node: any) => 2,
            fillColor: (rowIndex: number, node: any, columnIndex: number) => { return rowIndex === 0 ? '#663300' : null; },
            // Add dashed borders
            defaultBorder: false,
            hLineStyle: function (i: number, node: any) {
              return { dash: { length: 2, space: 2 } };
            },
            vLineStyle: function (i: number, node: any) {
              return { dash: { length: 2, space: 2 } };
            }
          },
          margin: [0, 30, 0, 20]
        },
        {
          text: this.totalTTCMessage,
          alignment: 'center',
          style: 'totalTTCMessage',
          margin: [0, 30, 0, 20]
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 12,
          margin: [0, 5, 0, 10]
        },
        invoiceNumber: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 10]
        },
        tableHeader: {
          fillColor: '#663300',
          color: '#fff',
          bold: true,
          fontSize: 10,
          alignment: 'center'
        },
        footer: {
          fontSize: 8,
          bold: false,
          margin: [5, 5, 5, 5],
          alignment: 'center'
        },
        totalTTCMessage: {
          fontSize: 12,
          margin: [0, 0, 0, 20]
        }
      }
    };

    const fileName = `${this.getTypeText(this.invoice.type)}_${this.invoice.reference}.pdf`;

    pdfMake.createPdf(docDefinition).download(fileName);
  }).catch((error: any) => {
    console.error(error);
  });
}


}
