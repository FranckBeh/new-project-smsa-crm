const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');

class Autres extends Model {}

Autres.init({
  IdClient: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  IdAutres: {
    type: DataTypes.INTEGER,
    primaryKey: true
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
  modelName: 'Autres',
  tableName: 'autres',
  timestamps: false
});

module.exports = Autres;
