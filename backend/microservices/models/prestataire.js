const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');

class Prestataire extends Model {}

Prestataire.init({
  IdPrest: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  priorite: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  nom: DataTypes.STRING(100),
  adresse: DataTypes.STRING(255),
  ville: DataTypes.STRING(255),
  fix: DataTypes.STRING(255),
  prioritaire: DataTypes.STRING(255),
  fonctionResponsable: DataTypes.STRING(255),
  mailResponsable: DataTypes.STRING(255),
  document: DataTypes.STRING(255),
  gsmResponsable: DataTypes.STRING(255),
  note: DataTypes.INTEGER,
  nomResponsable: DataTypes.STRING(255),
  blacklist: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  email: DataTypes.STRING(200),
  fax: DataTypes.STRING(200),
  remarques: DataTypes.STRING(300),
  aviscons: DataTypes.TEXT,
  infonet: DataTypes.TEXT,
  commission: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  modelName: 'Prestataire',
  tableName: 'prestataire',

});

module.exports = Prestataire;
