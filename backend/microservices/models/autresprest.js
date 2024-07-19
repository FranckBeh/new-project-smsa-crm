const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');

class AutresPrest extends Model {}

AutresPrest.init({
  IdPrest: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  IdAutres: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cle: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  valeur: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  infoSecu: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  sequelize,
  modelName: 'AutresPrest',
  tableName: 'autresprest',
  timestamps: false
});

module.exports = AutresPrest;
