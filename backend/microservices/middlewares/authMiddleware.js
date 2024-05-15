const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/utilisateur');

async function authenticate(req, res, next) {
  try {
    console.log('Authenticating user...');
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('Authorization header is missing');
      return res.status(401).json({ message: 'JWT manquant' });
    }

    const token = authHeader.split(' ')[1];
    console.log(`Token received: ${token}`);
    
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`Token decoded: ${JSON.stringify(decodedToken)}`);

    // Vérifier si le token a expiré
    if (decodedToken.exp * 1000 < Date.now()) {
      console.log('Token has expired');
      return res.status(401).json({ message: 'Session expirée' });
    }

    const user = await Utilisateur.findByPk(decodedToken.userId);
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    console.log(`User authenticated: ${user.login}`);
    req.user = user;
    next();
  } catch (error) {
    console.log(`Authentication error: ${error.message}`);
    return res.status(401).json({ message: 'JWT invalide' });
  }
}

module.exports = authenticate;
