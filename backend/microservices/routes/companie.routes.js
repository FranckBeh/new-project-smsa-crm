const express = require('express');
const router = express.Router();
const ParametreCompanieController = require('../controllers/CompanieController');  // Votre contrôleur pour les paramètres des compagnies

// Mappage des routes aux fonctions du contrôleur
router.get('/', ParametreCompanieController.getAll);
router.get('/:id', ParametreCompanieController.getById);
router.post('/create', ParametreCompanieController.create);
router.put('/:id', ParametreCompanieController.update);
router.delete('/:id', ParametreCompanieController.delete);

router.get('/search/:query', ParametreCompanieController.search);
// Recherche et pagination
router.get('/search', ParametreCompanieController.search);
router.get('/paginate', ParametreCompanieController.paginate);

module.exports = router;
