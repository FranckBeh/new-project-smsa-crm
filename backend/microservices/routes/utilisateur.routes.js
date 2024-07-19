const express = require('express');
const router = express.Router();
const UtilisateurController = require('./../controllers/UtilisateurController');

// Obtenir tous les utilisateurs
router.get('/', UtilisateurController.getAll);
router.get('/liste', UtilisateurController.getAll);
router.get('/allUser', UtilisateurController.getAllUser);
// Obtenir un utilisateur par ID
router.get('/:id', UtilisateurController.getById);

// Créer un nouvel utilisateur
router.post('/create', UtilisateurController.create);

// Mettre à jour un utilisateur
router.put('/update/:id', UtilisateurController.update);

// Supprimer un utilisateur
router.delete('/delete/:id', UtilisateurController.delete);

// Activer un utilisateur
router.put('/activate/:id', UtilisateurController.activate);

// Mettre un utilisateur en ligne
router.put('/online/:id', UtilisateurController.setOnline);

// Mettre un utilisateur hors ligne
router.put('/offline/:id', UtilisateurController.setOffline);

// Rechercher des utilisateurs
router.get('/search', UtilisateurController.searchUsers);

module.exports = router;
