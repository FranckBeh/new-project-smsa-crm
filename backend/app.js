const invoiceRouter = require('./microservices/routes/invoice.routes');

const express = require('express');
const app = express();

// Middleware pour analyser les requêtes JSON
app.use(express.json());
app.use('/invoices/', invoiceRouter);

// Définissez vos routes ici

module.exports = app; // Exportez l'application
