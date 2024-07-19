const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js'); // Assurez-vous que vous importez correctement l'instance sequelize
const Client = require('./client'); // Assurez-vous que Client est correctement exporté dans client.js

class TypeClient extends Model {}

TypeClient.init({
  NumType: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  NomType: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  abreviation: DataTypes.STRING(10)
}, {
  sequelize,
  modelName: 'TypeClient',
  tableName: 'typeclient',
  timestamps: false,
});


module.exports = TypeClient;
