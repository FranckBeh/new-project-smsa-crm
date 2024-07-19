const express = require('express');
const router = express.Router();
const upload = require('./../middlewares/multerConfig');
const PrestataireController = require('./../controllers/PrestataireController');




// Routes pour les prestataires
router.get('/', PrestataireController.getList); // Liste des prestataires
router.get('/list', PrestataireController.getAllPrestataires); // Liste de tous les prestataires
router.get('/:id', PrestataireController.getPrestataireById); // Détails d'un prestataire par ID
// router.post('/create', PrestataireController.create); // Créer un nouveau prestataire
router.put('/update/:id', PrestataireController.update); // Mettre à jour les informations d'un prestataire
router.delete('/delete/:id', PrestataireController.delete); // Supprimer un prestataire
router.post('/prestataires', upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'documents', maxCount: 10 }
  ]), PrestataireController.createPrestataire);

router.put('/updatePrestataire/:id', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'documents', maxCount: 10 }]), PrestataireController.updatePrestataire);
router.get('/prestataires/search', PrestataireController.searchPrestataires);
  
// Routes pour les domaines et tags
router.get('/:id/domaines', PrestataireController.getDomaines); // Domaines d'un prestataire
router.get('/:id/tags', PrestataireController.getTags); // Tags d'un prestataire
router.post('/dom', PrestataireController.addToListDom); // Ajouter un domaine à un prestataire
router.post('/tag', PrestataireController.addToListTag); // Ajouter un tag à un prestataire
router.delete('/:id/domaines', PrestataireController.deleteAllDomaines); // Supprimer tous les domaines d'un prestataire
router.delete('/:id/tags', PrestataireController.deleteAllTags); // Supprimer tous les tags d'un prestataire

// Autres fonctionnalités
router.get('/count', PrestataireController.getPrestCount); // Nombre total de prestataires
router.get('/last-id', PrestataireController.getLastId); // ID du dernier prestataire
router.get('/blacklist', PrestataireController.getListBlack); // Liste des prestataires blacklistés
router.get('/dom-ville/:idDom/:ville', PrestataireController.getListByDomVille); // Prestataires par domaine et ville
router.get('/tag/:idTag', PrestataireController.getListByTag); // Prestataires par tag
router.get('/nom/:name/page/:page', PrestataireController.getIdNom); // ID d'un prestataire par nom et page
router.get('/:id/documents', PrestataireController.getDocuments); // Documents d'un prestataire
router.get('/:id/autres', PrestataireController.getAutres); // Autres informations sur un prestataire
router.delete('/:id/documents', PrestataireController.deleteAllDocuments); // Supprimer tous les documents d'un prestataire
router.delete('/:id/autres', PrestataireController.deleteAutres); // Supprimer d'autres informations sur un prestataire

// Fonctionnalités spécifiques
router.put('/priorite', PrestataireController.setPriorite); // Mettre à jour la priorité d'un prestataire
router.get('/:idPrest/hotel-nuites/:dt1/:dt2', PrestataireController.getHotelNuites); // Nuitées d'hôtel pour un prestataire
router.get('/suggestions/:strSearch', PrestataireController.getSuggestions); // Suggestions de recherche

module.exports = router;
