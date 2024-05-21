const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authzMiddleware');
const InvoiceController = require('./../controllers/InvoiceController');  // Votre contrôleur de factures

// Mappage des routes aux fonctions du contrôleur
router.get('/', InvoiceController.getInvoiceList);


// Opérations de base sur les factures
router.get('/count', InvoiceController.getInvoiceCount);
router.get('/last-id', InvoiceController.getLastId);
router.get('/invoices', InvoiceController.getInvoiceList);
router.get('/data/:id', InvoiceController.getInvoiceDataById);
router.get('/data', InvoiceController.getInvoiceData);
router.get('/searchInvoices',InvoiceController.searchInvoices);

// CRUD pour les factures
router.post('/createInvoice', InvoiceController.createInvoice);
router.put('/edit/:id',authenticate, authorize('Administrateur'), InvoiceController.updateInvoice);
router.delete('/delete/:id',authenticate, authorize('Administrateur'), InvoiceController.deleteInvoice);

// Opérations de recherche avancées
router.get('/invoices/export', InvoiceController.getExportInvoices);
router.get('/invoices/total-rows', InvoiceController.getTotalRows);
router.get('/list-by', InvoiceController.getListBy);

// Génération de références de factures
router.get('/first-ref/:type/:year?', InvoiceController.getFirstAvailableRef);
router.get('/last-ref/:type/:year?', InvoiceController.getLastAvailableRef);

// Gestion des articles et commentaires associés
router.get('/invoices/:id/articles', InvoiceController.getArticles);
router.get('/invoices/:id/commentaires', InvoiceController.getCommentaires);
router.post('/invoices/:id/article', InvoiceController.addArticle);
router.post('/invoices/:id/commentaire', InvoiceController.addCommentaire);
router.delete('/invoices/:id/articles', InvoiceController.deleteAllArticles);
router.delete('/invoices/:id/commentaires', InvoiceController.deleteAllCommentaires);

// Paiement d'une facture
//router.put('/:id/pay', InvoiceController.validateInvoice);
// Route pour valider une facture spécifique en utilisant PATCH
//router.patch('/validate/:idInv', InvoiceController.validateInvoice);
router.put('/:idInv/validate', InvoiceController.validateInvoiceById);
module.exports = router;
