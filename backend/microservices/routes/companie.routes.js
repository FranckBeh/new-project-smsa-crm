const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authzMiddleware');
const ParametreCompanieController = require('../controllers/CompanieController');  // Votre contrôleur pour les paramètres des compagnies

// Mappage des routes aux fonctions du contrôleur
router.get('/', ParametreCompanieController.getAll);
router.get('/:id', ParametreCompanieController.getById);
router.post('/create',authenticate, authorize('Administrateur'), ParametreCompanieController.create);
router.put('/edit/:id',authenticate, authorize('Administrateur'), ParametreCompanieController.update);
router.delete('/delete/:id', authenticate, authorize('Administrateur'),ParametreCompanieController.delete);

router.get('/search/:query', ParametreCompanieController.search);
// Recherche et pagination
router.get('/search', ParametreCompanieController.search);
router.get('/paginate', ParametreCompanieController.paginate);

module.exports = router;
