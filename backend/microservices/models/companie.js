const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');

class ParametreCompanie extends Model {}

ParametreCompanie.init({
  idCompanie: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  nomCompanie: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  adresseCompanie: {
    type: DataTypes.STRING(250),
    allowNull: true,
  },
  tel1Companie: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  tel2Compnie: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  email1Compagnie: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  email2Compagnie: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  sitewebCompagnie: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  registreCommerce: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  patente: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  identifiantFiscal: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  ice: {
    type: DataTypes.STRING(100),
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'parametreCompanie',
  tableName: 'parametre_companie',
  timestamps: false,
});

module.exports = ParametreCompanie;
