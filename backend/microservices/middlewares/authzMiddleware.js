function authorize(role) {
  return async (req, res, next) => {
    const user = req.user;
    if (!user) {
      console.log('Utilisateur non authentifié');
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    // Vérifier si l'utilisateur est actif
    if (user.active !== 1) {
      console.log(`L'utilisateur ${user.login} est désactivé`);
      return res.status(403).json({ message: 'Accès interdit. Compte désactivé' });
    }

    // Vérifier si l'utilisateur est en ligne
    if (user.online !== 1) {
      console.log(`L'utilisateur ${user.login} est hors ligne`);
      return res.status(403).json({ message: 'Accès interdit. Utilisateur hors ligne' });
    }

    // Vérifier le rôle de l'utilisateur
    if (role === 'Administrateur' && user.role !== 'Administrateur') {
      console.log(`L'utilisateur ${user.login} n'est pas un administrateur`);
      return res.status(403).json({ message: 'Accès interdit. Rôle administrateur requis' });
    } else if (role === 'Concierge' && user.role !== 'Concierge') {
      console.log(`L'utilisateur ${user.login} n'est pas un concierge`);
      return res.status(403).json({ message: 'Accès interdit. Rôle concierge requis' });
    }

    // Si toutes les vérifications réussissent, passer à la prochaine fonction du middleware
    console.log(`Autorisation réussie pour l'utilisateur ${user.login}`);
    next();
  };
}

module.exports = authorize;
