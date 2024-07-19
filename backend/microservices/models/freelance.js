const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');

class Freelance extends Model {}

Freelance.init({
  IdFree: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  adresse: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  ville: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  tel: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  blacklist: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  commentaires: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  document: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Freelance',
  tableName: 'freelance',
  timestamps: false
});

module.exports = Freelance;
