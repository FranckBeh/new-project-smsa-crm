const express = require('express');
const router = express.Router();
const ClientController = require('./../controllers/ClientController');  // Votre contrôleur de clients

// Mappage des routes aux fonctions du contrôleur
router.get('/', ClientController.getClientList);
router.get('/search', ClientController.searchClients);

// Opérations de base sur les clients
router.get('/last-id', ClientController.getLastId);
router.get('/clients/', ClientController.getClientList);
router.get('/count', ClientController.getClientCount);
router.get('/:id', ClientController.getClientById);
router.get('/clients/search', ClientController.getClientByAttributesHandler.bind(ClientController));
router.get('/checkLogin/:login', ClientController.checkAvailableLogins)
router.post('/create', ClientController.createClientWithFamily);
router.put('/update/:id', ClientController.updateClientWithFamily);
router.delete('/delete/:id', ClientController.deleteClientWithFamily);


// CRUD pour les clients
// router.post('/clients', ClientController.createClient);
// router.put('/clients/:id', ClientController.updateClient);
// router.delete('/clients/:id', ClientController.deleteClient);

// Opérations de recherche avancées
// router.get('/clients/export', ClientController.getExportClients);
// router.get('/clients/total-rows', ClientController.getTotalRows);
// router.get('/clients/list-by', ClientController.getListBy);

// Génération de mots-clés pour les clients
router.get('/clients/:id/all-keywords', ClientController.generateClientAllKeyWords);
router.get('/clients/:id/tendances', ClientController.getTendances);
router.get('/clients/next-bp-login', ClientController.getNextBpLogin);
router.get('/next-login/:id', ClientController.generateNewLogin);



// Gestion des contacts, conjoints, enfants et autres associés
router.get('/:id/contacts', ClientController.getContacts);
router.get('/clients/:id/conjoint', ClientController.getConjoint);
router.get('/clients/:id/enfants', ClientController.getEnfants);
router.get('/clients/:id/autres', ClientController.getAutres);
router.post('/clients/:id/contact', ClientController.addContact);
router.delete('/clients/:id/contacts', ClientController.deleteContacts);
router.delete('/clients/:id/conjoint', ClientController.deleteConjoint);
router.delete('/clients/:id/enfants', ClientController.deleteEnfants);
router.delete('/clients/:id/autres', ClientController.deleteAutres);

// Mise à jour des mots-clés et du mot de passe
router.put('/clients/:id/all-keywords', ClientController.updateClientAllKeyWords);
router.put('/clients/:id/init-pwd', ClientController.initPwd);


module.exports = router;
