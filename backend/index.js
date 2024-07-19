const express = require('express');
const dotenv = require('dotenv');
const pino = require('pino');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const utilisateurRouter = require('./microservices/routes/utilisateur.routes.js');
const invoiceRouter = require('./microservices/routes/invoice.routes');
const clientRouter = require('./microservices/routes/client.routes.js');
// const userRoutes = require('./test1/user.routes.js');  //
const societeRouter = require('./microservices/routes/societe.routes.js');
const carteVisiteRouter = require('./microservices/routes/cartevisite.routes.js');
const compagnieRouter = require('./microservices/routes/companie.routes.js');
const authMiddleware = require('./microservices/middlewares/authMiddleware.js');
// const authzMiddleware = require('./microservices/middlewares/authzMiddleware.js');
const tagRoutes = require('./microservices/routes/tagRoutes');
const villeRoutes = require('./microservices/routes/villeRoutes');
const domaineActiviteRoutes = require('./microservices/routes/domaineActiviteRoutes');
const authRoutes = require('./microservices/routes/auth.routes.js');
const typeClientRouter = require('./microservices/routes/typeclient.routes');
const prestataireRouter = require('./microservices/routes/prestataire.routes');
const noteRouter = require('./microservices/routes/note.routes');
const productRouter = require('./microservices/routes/product.routes');
const errorHandler = require('./microservices/middlewares/errorHandler');

// Chargement des variables d'environnement
dotenv.config();

// Configuration de la journalisation
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
});

// Initialisation de Sequelize
const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  logging: process.env.DB_LOGGING === 'true', // Activer/Désactiver la journalisation en fonction de l'environnement
  dialectOptions: {
    charset: 'utf8',
  },
});

sequelize.authenticate()
  .then(() => {
    logger.info('La connexion à la base de données a été établie avec succès.');
  })
  .catch(err => {
    logger.error('Impossible de se connecter à la base de données:', err);
  });

// Gestionnaire d'erreurs global
process.on('uncaughtException', (err) => {
   logger.error('Erreur non interceptée :', err);
   process.exit(1);
});

process.on('unhandledRejection', (err) => {
   logger.error('Promesse non gérée rejetée :', err);
   process.exit(1);
});

// Création de l'application Express
const app = express(); 

// Middleware pour analyser les requêtes JSON
app.use(express.json());
app.use(cors());

// Middleware d'autorisation
// app.use(authzMiddleware);

// Enregistrement des routes d'authentification
app.use('/auth', authRoutes);

// Middleware d'authentification
app.use(authMiddleware);

// Enregistrement des routeurs
app.use('/invoices/', invoiceRouter);
app.use('/clients/', clientRouter);
// app.use('/count/', clientRouter);
app.use('/user', utilisateurRouter);
app.use('/societes', societeRouter);
app.use('/cartesvisites', carteVisiteRouter);
app.use('/companies', compagnieRouter);
app.use('/typeClient', typeClientRouter);
app.use('/prestataires', prestataireRouter);
app.use('/tags', tagRoutes);
app.use('/villes', villeRoutes);
app.use('/domaines', domaineActiviteRoutes);
app.use('/notes', noteRouter);
app.use('/products', productRouter);

// Utilisation du gestionnaire d'erreurs
app.use(errorHandler);

// Démarrage du serveur
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  logger.info(`Serveur en écoute sur le port ${port}`);
});

// Graceful shutdown
async function gracefulShutdown() {
  logger.info('Fermeture du serveur...');
  try {
    await sequelize.close(); // Fermer la connexion à la base de données
    server.close(() => {
      logger.info('Serveur fermé.');
      process.exit(0); // Terminer le processus après la fermeture du serveur
    });
  } catch (err) {
    logger.error('Erreur lors de la fermeture du serveur :', err);
    process.exit(1);
  }
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
