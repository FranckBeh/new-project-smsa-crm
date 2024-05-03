const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../../config/database.js');

class Conjoint extends Model {}

Conjoint.init({
  IdClient: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  IdConjoint: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  nom: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  gsmPro: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  anniversaire: {
    type: DataTypes.DATE,
    allowNull: true
  },
  mail: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  gsmPerso: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Conjoint',
  tableName: 'conjoint',
  timestamps: false
});

module.exports = Conjoint;