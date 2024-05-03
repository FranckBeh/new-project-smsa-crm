const Sequelize = require('sequelize');
const config = require('./../config.json');  // Assurez-vous que le chemin vers votre fichier config.json est correct

const env = process.env.NODE_ENV || 'development';
const { username, password, database, host, dialect } = config[env];

const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: dialect,
});

module.exports = sequelize;
