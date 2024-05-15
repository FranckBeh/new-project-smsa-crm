const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');
const Invoice = require('./invoice');

class Utilisateur extends Model {}

Utilisateur.init({
  IdUser: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  login: DataTypes.STRING(100),
  password: DataTypes.STRING(100),
  email: DataTypes.STRING(255),
  tel: DataTypes.STRING(255),
  prenom: DataTypes.STRING(255),
  nom: DataTypes.STRING(255),
  role: DataTypes.STRING(255),
  online: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'Utilisateur',
  tableName: 'utilisateur',
  timestamps: false,
});



module.exports = Utilisateur;
