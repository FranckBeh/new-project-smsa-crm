const request = require('supertest');
const app = require('../app'); // Votre application Express


describe('Invoice API', () => {
    // Test pour la route GET /invoices
    it('should respond with a status code of 200 for GET /invoices', async () => {
      const res = await request(app).get('/invoices/25');
      expect(res.statusCode).toEqual(200);
    });
  it('should update an invoice', async () => {
    const res = await request(app)
      .put('/invoices/edit/82') // Remplacez ceci par l'URL correcte de votre API
      .send({
        idInv: 82,
        reference: 897,
        type: 1,
        etat: 1,
        isProFormat: 1,
        isValidated: 1,
        validationDate: '2024-01-01 00:00:00.000',
        paymentMode: 1,
        paymentComment: 'Paid',
        paymentDate: '2024-01-02 00:00:00.000',
        date: '2024-01-01 00:00:00.000',
        tva: 20,
        footer: 'Thank you for your business',
        idSociete: 1,
        autreSociete: 'Other Company',
        adresseSociete: '123 Street, City',
        autreQuantiteTitle: 'Other Quantity',
        idUser: 1,
        dateCreation: '2024-01-01 00:00:00.000',
        BDC: '123',
        parent: 'Parent Invoice',
        major: 1,
        articles: [
          {
            idArticle: 19960,
            idInv: 82,
            designation: 'Article 19960',
            postPrixUnit: 10.00,
            prePrixUnit: 9.00,
            quantite: 1,
            autreQuantite: 1
          }
        ]
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('reference', '897');
    // Ajoutez ici des assertions pour tous les autres champs que vous avez mis à jour
  });

  // Test pour la fonction de suppression
 // it('should delete an invoice', async () => {
   // const res = await request(app)
     // .delete('/invoices/delete/6'); // Remplacez ceci par l'URL correcte de votre API

  //  expect(res.statusCode).toEqual(200);
  //  expect(res.body).toHaveProperty('message', 'Facture supprimée avec succès');
 // });

  // Test pour la fonction de création
  it('should create a new invoice', async () => {
    const res = await request(app)
      .post('/invoices/createInvoice') // Remplacez ceci par l'URL correcte de votre API
      .send({
        idInv: '123456800',
        reference: '345800',
        type: 1,
        etat: 1,
        isProFormat: 1,
        isValidated: 1,
        validationDate: '2024-01-01 00:00:00.000',
        paymentMode: 1,
        paymentComment: 'Paid',
        paymentDate: '2024-01-02 00:00:00.000',
        date: '2024-01-01 00:00:00.000',
        tva: 20,
        footer: 'Thank you for your business',
        idSociete: 1,
        autreSociete: 'Other Company',
        adresseSociete: '123 Street, City',
        autreQuantiteTitle: 'Other Quantity',
        idUser: 1,
        dateCreation: '2024-01-01',
        BDC: '123',
        parent: 'Parent Invoice',
        major: 1,
        articles: [
          {
            idArticle: 88888,
            idInv:'123456800',
            designation: 'Article 88880',
            postPrixUnit: 10.00,
            prePrixUnit: 9.00,
            quantite: 1,
            autreQuantite: 1
          }
        ]
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('idInv', '123456800');
      expect(res.body).toHaveProperty('reference', '345800');
      expect(res.body).toHaveProperty('type', 1);
      expect(res.body).toHaveProperty('etat', 1);
      expect(res.body).toHaveProperty('isProFormat', 1);
      expect(res.body).toHaveProperty('isValidated', 1);
      expect(res.body).toHaveProperty('validationDate', '2024-01-01 00:00:00.000');
      expect(res.body).toHaveProperty('paymentMode', 1);
      expect(res.body).toHaveProperty('paymentComment', 'Paid');
      expect(res.body).toHaveProperty('paymentDate', '2024-01-02 00:00:00.000');
      expect(res.body).toHaveProperty('date', '2024-01-01');
      expect(res.body).toHaveProperty('tva', 20);
      expect(res.body).toHaveProperty('footer', 'Thank you for your business');
      expect(res.body).toHaveProperty('idSociete', 1);
      expect(res.body).toHaveProperty('autreSociete', 'Other Company');
      expect(res.body).toHaveProperty('adresseSociete', '123 Street, City');
      expect(res.body).toHaveProperty('autreQuantiteTitle', 'Other Quantity');
      expect(res.body).toHaveProperty('idUser', 1);
      expect(res.body).toHaveProperty('dateCreation', '2024-01-01 00:00:00.000');
      expect(res.body).toHaveProperty('BDC', '123');
      expect(res.body).toHaveProperty('parent', 'Parent Invoice');
      expect(res.body).toHaveProperty('major', 1);
      expect(res.body).toHaveProperty('articles', [
          {
              idArticle: 88888,
              idInv:'123456800',
              designation: 'Article 88888',
              postPrixUnit: 10.00,
              prePrixUnit: 9.00,
              quantite: 1,
              autreQuantite: 1
          }
      ]);
  });
});
