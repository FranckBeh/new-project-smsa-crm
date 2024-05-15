const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');
const Invoice = require('./invoice');

class Listinvart extends Model {}

Listinvart.init({
  idArticle: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  idInv: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  designation: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  postPrixUnit: {
    type: DataTypes.FLOAT(10, 2),
    defaultValue: '0.00'
  },
  prePrixUnit: {
    type: DataTypes.FLOAT(10, 2),
    defaultValue: '0.00'
  },
  quantite: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  autreQuantite: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: '1'
  }
}, {
  sequelize, // instance de connexion
  modelName: 'Listinvart', // nom du modèle
  tableName: 'listinvart', // nom de la table
  timestamps: false,
});



module.exports = Listinvart;
