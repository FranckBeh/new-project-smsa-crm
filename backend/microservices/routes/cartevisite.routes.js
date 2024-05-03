const express = require('express');
const router = express.Router();
const CarteVisiteController = require('./../controllers/CarteVisiteController');  // Votre contrôleur de cartes de visite

// Mappage des routes aux fonctions du contrôleur
router.get('/', CarteVisiteController.getAllCartes);

// Opérations CRUD sur les cartes de visite
router.get('/:id', CarteVisiteController.getById);
router.post('/create', CarteVisiteController.create);
router.put('/:id', CarteVisiteController.update);
router.delete('/:id', CarteVisiteController.delete);

router.get('/search/:query', CarteVisiteController.search);
// Recherche et pagination
router.get('/search', CarteVisiteController.search);
router.get('/paginate', CarteVisiteController.paginate);

module.exports = router;
