const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');

class ListDomPres extends Model {}

ListDomPres.init({
  IdPrest: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'Prestataire', // Assurez-vous que le modèle Prestataire est correctement défini
      key: 'IdPrest'
    }
  },
  IdDomaine: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'DomaineActivite', // Assurez-vous que le modèle DomaineActivite est correctement défini
      key: 'IdDomaine'
    }
  }
}, {
  sequelize,
  modelName: 'ListDomPres',
  tableName: 'listdompres',
  timestamps: false
});

module.exports = ListDomPres;
