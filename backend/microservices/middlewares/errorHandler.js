// errorHandler.js
function errorHandler(err, req, res, next) {
    console.error(err); // Log l'erreur pour le développement
    res.status(500).json({ error: err.message || 'Une erreur est survenue' });
  }
  
  module.exports = errorHandler;
  