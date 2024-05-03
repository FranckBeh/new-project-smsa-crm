const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../../config/database.js');

class ClientOld extends Model {}

ClientOld.init({
  IdClient: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  nom: {
    type: DataTypes.STRING(300),
    allowNull: true
  },
  type: {
    type: DataTypes.STRING(765),
    allowNull: true
  },
  login: {
    type: DataTypes.STRING(765),
    allowNull: true
  },
  anniversaire: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('1900-01-01 23:59:59')
  },
  gsmPerso: {
    type: DataTypes.STRING(765),
    allowNull: true
  },
  fixDom: {
    type: DataTypes.STRING(765),
    allowNull: true
  },
  societe: {
    type: DataTypes.STRING(765),
    allowNull: true
  },
  civilite: {
    type: DataTypes.STRING(765),
    allowNull: true
  },
  fonction: {
    type: DataTypes.STRING(765),
    allowNull: true
  },
  satisfaction: {
    type: DataTypes.STRING(765),
    allowNull: true
  },
  context: {
    type: DataTypes.STRING(765),
    allowNull: true
  },
  situation: {
    type: DataTypes.STRING(765),
    allowNull: true
  },
  adressePro: {
    type: DataTypes.STRING(765),
    allowNull: true
  },
  adresseDom: {
    type: DataTypes.STRING(765),
    allowNull: true
  },
  mailPro: {
    type: DataTypes.STRING(765),
    allowNull: true
  },
  mail: {
    type: DataTypes.STRING(300),
    allowNull: true
  },
  fax: {
    type: DataTypes.STRING(765),
    allowNull: true
  },
  fixPro: {
    type: DataTypes.STRING(765),
    allowNull: true
  },
  gsmPro: {
    type: DataTypes.STRING(765),
    allowNull: true
  },
  image: {
    type: DataTypes.STRING(765),
    allowNull: true
  },
  prenom: {
    type: DataTypes.STRING(765),
    allowNull: true
  },
  expiration: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('1990-01-01 23:59:59')
  },
  loginCFCIM: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  inactif: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isFixed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  keyWords: {
    type: DataTypes.STRING(100),
    defaultValue: ''
  },
  allKeyWords: {
    type: DataTypes.STRING(255),
    defaultValue: ''
  },
  platCard: {
    type: DataTypes.STRING(4),
    defaultValue: '0000'
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  password_: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  modelName: 'ClientOld',
  tableName: 'client_old',
  timestamps: false
});

module.exports = ClientOld;