const express = require('express');
const router = express.Router();
const societeController = require('./../controllers/SocieteController');

// Route pour récupérer toutes les sociétés
router.get('/', societeController.getAllSocietes);
router.get('/list', societeController.getSocieteList);

module.exports = router;
