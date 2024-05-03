const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');

class Document extends Model {}

Document.init({
  IdDocument: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  IdPrest: DataTypes.INTEGER,
  nom: DataTypes.STRING(300),
  nomFichier: DataTypes.STRING(300),
  idFree: DataTypes.INTEGER,
  idInv: DataTypes.INTEGER
}, {
  sequelize, // instance de connexion
  modelName: 'Document', // nom du modèle
  tableName: 'document' // nom de la table
});

module.exports = Document;
