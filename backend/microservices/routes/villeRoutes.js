const express = require('express');
const router = express.Router();
const villeController = require('./../controllers/villeController');

// CRUD routes for Ville
router.get('/', villeController.getAllVilles);
router.get('/:id', villeController.getVilleById);
router.post('/create', villeController.createVille);
router.put('/update/:id', villeController.updateVille);
router.delete('/delete/:id', villeController.deleteVille);

module.exports = router;
