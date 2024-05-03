const express = require('express');
const dotenv = require('dotenv');
const pino = require('pino');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const UserController = require('./test1/UserController');
const invoiceRouter = require('./microservices/routes/invoice.routes');
const clientRouter = require('./microservices/routes/client.routes.js');
const userRoutes = require('./test1/user.routes.js');  //
const societeRouter = require('./microservices/routes/societe.routes.js');
const carteVisiteRouter = require('./microservices/routes/cartevisite.routes.js');
const compagnieRouter =require('./microservices/routes/companie.routes.js');


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
  logging: false, // Désactiver la journalisation Sequelize par défaut
  dialectOptions: {
    charset: 'utf8',
  },
});

sequelize.authenticate()
  .then(() => {
    console.log('La connexion à la base de données a été établie avec succès.');
  })
  .catch(err => {
    console.error('Impossible de se connecter à la base de données:', err);
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


// Enregistrement des routeurs
app.use('/invoices/', invoiceRouter);
app.use('/clients/', clientRouter);
//app.use('/count/', clientRouter);
app.use('/user', userRoutes);
app.use('/societes', societeRouter);
app.use('/cartesvisites', carteVisiteRouter);
app.use('/companies', compagnieRouter);

// ... (autres routes pour d'autres fonctionnalités)

// Graceful shutdown
async function gracefulShutdown() {
  logger.info('Fermeture du serveur...');
  await sequelize.close(); // Fermer la connexion à la base de données
  app.close(() => {
    logger.info('Serveur fermé.');
  });
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
//sequelize.sync();
// Démarrage du serveur
const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`Serveur en écoute sur le port ${port}`);
});
