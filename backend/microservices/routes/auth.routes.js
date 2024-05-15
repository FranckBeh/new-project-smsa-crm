// authRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Utilisateur = require('../models/utilisateur');
const router = express.Router();

// Route de connexion
router.post('/login', async (req, res) => {
  const { login, password } = req.body;

  try {
    const user = await Utilisateur.findOne({ where: { login } });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Générer le JWT
    const token = jwt.sign({ userId: user.IdUser }, process.env.JWT_SECRET, { expiresIn: '2h' });

    // Renvoyer le JWT
    res.status(200).json({ token, userId: user.IdUser });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
});

// Route de déconnexion
router.post('/logout', (req, res) => {
  // Vous pouvez gérer ici la déconnexion de l'utilisateur (par exemple, invalider le JWT ou supprimer les cookies de session)
  // Dans cet exemple, nous renvoyons simplement une réponse réussie
  res.status(200).json({ message: 'Déconnexion réussie', redirectTo: '/login' });
});

module.exports = router;
