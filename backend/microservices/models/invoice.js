// models/invoice.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');

class Invoice extends Model {}


Invoice.init({
  idInv: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  reference: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
  },
  etat: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
  },
  isProFormat: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
  },
  isValidated: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
  },
  validationDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  paymentMode: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  paymentComment: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  paymentDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  tva: {
    type: DataTypes.FLOAT(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  footer: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  idSociete: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  autreSociete: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  adresseSociete: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  autreQuantiteTitle: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  idUser: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
 dateCreation: {
   type: DataTypes.DATE,
   defaultValue: DataTypes.NOW,
  },
  BDC: {
    type: DataTypes.STRING(15),
    defaultValue: '',
  },
  parent: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  major: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  sequelize, // instance de connexion
  modelName: 'Invoice', // nom du modèle
  tableName: 'invoice', // nom de la table
  timestamps: false, // désactivation de la gestion automatique des champs createdAt et updatedAt
});



console.log(Invoice === sequelize.models.Invoice); // true

module.exports =  Invoice ;
