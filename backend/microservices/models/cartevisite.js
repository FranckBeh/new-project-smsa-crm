const { Model, DataTypes, Sequelize  } = require('sequelize');
const sequelize = require('../../config/database.js');// Assurez-vous que ceci pointe vers votre instance Sequelize

class CarteVisite extends Model {}

CarteVisite.init({
  IdCarte: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  nom: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  fonction: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  adresse: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  tel: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  gsm: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  fax: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(300),
    allowNull: true
  },
  web: {
    type: DataTypes.STRING(300),
    allowNull: true
  },
  societe: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  logo: {
    type: DataTypes.STRING(300),
    allowNull: true
  },
  remarques: {
    type: DataTypes.STRING(400),
    allowNull: true
  }
}, {
    sequelize,
  modelName: 'CarteVisite',
  tableName: 'cartevisite',
  timestamps: false
});

module.exports = CarteVisite;
