const express = require('express');
const router = express.Router();
const PrestataireController = require('./../controllers/PrestataireController');  // Votre contrôleur de prestataires

// Mappage des routes aux fonctions du contrôleur
router.get('/', PrestataireController.getAll);

// Opérations CRUD sur les prestataires
router.get('/:id', PrestataireController.getById);
router.post('/', PrestataireController.create);
router.put('/:id', PrestataireController.update);
router.delete('/:id', PrestataireController.delete);

// Recherche et pagination
router.get('/search', PrestataireController.search);
router.get('/paginate', PrestataireController.paginate);

module.exports = router;
