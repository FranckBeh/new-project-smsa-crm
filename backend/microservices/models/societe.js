const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js'); // Votre instance de connexion Sequelize
const Client = require('./client'); // Assurez-vous que Client est correctement exporté dans client.js
const Invoice = require('./invoice');

class Societe extends Model {}

Societe.init({
  idSociete: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  nom: DataTypes.STRING(100),
  ice: DataTypes.STRING(100),
  adresse: DataTypes.STRING(200)
}, {
  sequelize,
  modelName: 'Societe',
  tableName: 'societe',
  timestamps: false,
});


module.exports = Societe;
