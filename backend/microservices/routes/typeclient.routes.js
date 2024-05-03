const express = require('express');
const router = express.Router();
const TypeClientController = require('./../controllers/TypeClientController');  // Votre contrôleur de types de clients

// Mappage des routes aux fonctions du contrôleur
router.get('/', TypeClientController.getAll);

// Opérations CRUD sur les types de clients
router.get('/:id', TypeClientController.getById);
router.post('/', TypeClientController.create);
router.put('/:id', TypeClientController.update);
router.delete('/:id', TypeClientController.delete);

// Recherche et pagination
router.get('/search', TypeClientController.search);
router.get('/paginate', TypeClientController.paginate);

module.exports = router;
