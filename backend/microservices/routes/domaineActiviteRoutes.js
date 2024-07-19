const express = require('express');
const router = express.Router();
const domaineActiviteController = require('./../controllers/domaineActiviteController');

// CRUD routes for DomaineActivite
router.get('/', domaineActiviteController.getAllDomaines);
router.get('/:id', domaineActiviteController.getDomaineById);
router.post('/', domaineActiviteController.createDomaine);
router.put('/:id', domaineActiviteController.updateDomaine);
router.delete('/:id', domaineActiviteController.deleteDomaine);

module.exports = router;
