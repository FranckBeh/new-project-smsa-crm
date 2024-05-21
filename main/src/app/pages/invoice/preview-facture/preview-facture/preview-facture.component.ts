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
      this.totalTTCMessage = `A votre aimable règlement la somme de : ${this.invoice.totalTTC.toFixed(2)} DH (${this.totalTTCInWords})`;
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
          console.log('Facture validée', response);
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

  exportToPDFOld(): void {
    const pdfContent = document.getElementById('pdf-content');
    const pdfFooter = document.getElementById('pdf-footer');
    const elementsToHide = document.querySelectorAll('.hide-pdf');

    // Cacher les éléments non désirés avant la capture
    elementsToHide.forEach(element => {
      if (element instanceof HTMLElement) {
        element.style.display = 'none';
      }
    });

    if (pdfContent && pdfFooter) {
      html2canvas(pdfContent).then((canvas) => {
        // Une fois la capture terminée, réafficher les éléments
        elementsToHide.forEach(element => {
          if (element instanceof HTMLElement) {
            element.style.display = '';
          }
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // Largeur de la page A4 en mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Ajouter l'image au document PDF
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

        // Obtenir la hauteur du footer
        const footerHeight = pdfFooter.clientHeight;

        // Déplacer le curseur vers le bas de la page pour ajouter le footer
        //pdf.setFillColor(240); // Couleur de fond grise
        pdf.rect(0, pdf.internal.pageSize.height - footerHeight, pdf.internal.pageSize.width, footerHeight, 'F');

        // Convertir le PDF en fichier téléchargeable
        const fileName = `${this.getTypeText(this.invoice.type)}_${this.invoice.reference}.pdf`;
        pdf.save(fileName);
      });
    } else {
      console.error('L\'élément avec l\'ID spécifié est introuvable.');
    }
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${day}/${month}/${year}`;
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
      let hundredText = hundredPart > 1 ? getUnit(hundredPart) + ' cent' : 'cent ';
      return rest === 0 ? hundredText : hundredText + (rest < 100 && hundredPart !== 1 ? ' ' : '') + getTen(rest);
    }

    function getBigNumber(num: number, scale: string) {
      if (num === 0) return '';
      if (num === 1 && scale !== 'cent') return 'mille';
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
  result += thousands > 0 ? getBigNumber(thousands, 'mille') : '';
  result += hundreds > 0 ? ' ' + getHundred(hundreds) : '';

  // Ajout de la devise "dirhams" pour les montants entiers, même si les centimes sont à zéro
  let dirhamsPart = amount >= 1 ? ' dirhams' : '';

  return result.trim() + dirhamsPart + centimesPart;
  }





  exportToPDF(): void {
    this.getBase64ImageFromURL('assets/images/logos/logo_smsa.png').then((base64Image: any) => {

      const docDefinition: TDocumentDefinitions = {
        pageOrientation: 'portrait',
        pageSize: 'A4',
        footer: {
          columns: [
            {
              // Positionnez le texte juste en dessous de la ligne
              text: [
                'Adresse : ' + this.invoice.parametreCompanie.adresseCompanie,
                'Téléphone : ' + this.invoice.parametreCompanie.tel1Companie,
                'Email : ' + this.invoice.parametreCompanie.email1Compagnie,
                'Site Web : ' + this.invoice.parametreCompanie.sitewebCompagnie,
                'ICE : ' + this.invoice.parametreCompanie.ice,
                'IF : ' + this.invoice.parametreCompanie.identifiantFiscal,
                'RC : ' + this.invoice.parametreCompanie.registreCommerce
              ].join(' | '),
              style: 'footer',
             // absolutePosition: { x: 10, y: 770 }, // Ajustez cette valeur pour déplacer le texte vers le bas
            //  margin: [10, 10, 0, 0],
            alignment: 'center',
              fillColor: '#f2f2f2', // Couleur de fond gris
              color: '#663300', // Couleur de texte marron
            }
          ]
        },
      content: [
        {
          image: base64Image, // Remplacez par le chemin réel de votre logo
          width: 90,
          alignment: 'left',
          style: 'header',
        },
        {
          text: this.invoice.parametreCompanie.nomCompanie,
          style: 'header',
          alignment: 'right',
          margin: [0, -60, 0, 0]

        },
        { text: ' ', margin: [0, 50] }, // Espacement entre le logo et le reste du contenu
        {
          text: [
            ...(this.invoice.nc !== 1 ? [this.invoice.societe.nom, this.invoice.societe.adresse] : [this.invoice.autreSociete, this.invoice.adresseSociete]),

          ],
          style: 'subheader',
          alignment: 'right',

        },
        {
          text:[
            ...(this.invoice.societe.ice ? ['ICE : ' + this.invoice.societe.ice] : []),
          ],
          style: 'subheader',
          alignment: 'right',
          margin: [0, 5] ,
        },

        {
          text: this.getTypeText(this.invoice.type) + ' N° 000' + this.invoice.reference + '/' + formatDate(this.invoice.dateCreation, 'yyyy', 'en-US'),
          alignment: 'center',
          margin: [0, 20],
          style: 'invoiceNumber',
        },
        { text: ' ', margin: [0, 10] }, // Espacement avant la table
        {
          table: {
            widths: ['*', 'auto', 100, 110],
            body: [
              // Headers
              [{ text: 'Désignation', fillColor: '#f2f2f2' }, { text: 'Quantité', fillColor: '#f2f2f2' }, { text: 'Prix unitaire HT', fillColor: '#f2f2f2' }, { text: 'Total', fillColor: '#f2f2f2' }],
              // Data rows
              ...this.invoice.listinvart.map((item: { designation: any; quantite: number; postPrixUnit: number; }) => [
                item.designation,
                item.quantite,
                { text: `${item.postPrixUnit.toFixed(2)} DH`, alignment: 'right' },
                { text: `${(item.quantite * item.postPrixUnit).toFixed(2)} DH`, alignment: 'right' }
              ]),
              // TVA row
              [
                { text: 'TVA(20%):', colSpan: 3, alignment: 'right' }, {}, {},
                { text: `${this.invoice.tva.toFixed(2)} DH` , alignment: 'right' }
              ],
              // Total TTC row
              [
                { text: 'Total TTC:', colSpan: 3, alignment: 'right' }, {}, {},
                { text: `${this.invoice.totalTTC.toFixed(2)} DH`, alignment: 'right',layout:'noBorders' }
              ]
            ]
          },
          layout:{
            hLineColor:'#f2f2f2',
            vLineColor: '#f2f2f2'
          }
        },

        {
          text: this.totalTTCMessage,
          alignment: 'center',
          style: 'totalTTCMessage',
          margin: [0, 30]
        },





      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [20,0]
        },
        subheader: {
          fontSize: 14,
          margin: [0, 5, 0, 10]
        },
        invoiceNumber: {
          fontSize: 14,
          bold: true,
          margin: [0, 20, 0, 10]
        },
        footer: {
          fontSize: 10,
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
