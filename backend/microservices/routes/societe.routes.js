const express = require('express');
const router = express.Router();
const societeController = require('./../controllers/SocieteController');

// Route pour récupérer toutes les sociétés
router.get('/', societeController.getAllSocietes);
router.get('/list', societeController.getSocieteList);
router.post('/create', societeController.createSociete);
router.put('/update/:idSociete', societeController.updateSociete)
router.delete('/delete/:idSociete', societeController.deleteSociete);

module.exports = router;
