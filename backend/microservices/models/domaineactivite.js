const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');

class DomaineActivite extends Model {}

DomaineActivite.init({
  IdDomaine: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  idDomGen: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  nom: {
    type: DataTypes.STRING, // Assurez-vous que la longueur est appropriée à votre besoin
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'DomaineActivite',
  tableName: 'domaineactivite',
  timestamps: false
});

module.exports = DomaineActivite;
