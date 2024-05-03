const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');
const TypeClient = require('./typeClient'); 
const Societe = require('./societe'); 


class Client extends Model {}

Client.init({
  IdClient: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  nom: DataTypes.STRING(300),
  typeclient_id: DataTypes.STRING(765),
  anniversaire: {
    type: DataTypes.DATE,
    defaultValue: new Date('1990-01-01 00:00:00')
  },
  societe_id: DataTypes.STRING(765),
  civilite: DataTypes.STRING(765),
  fonction: DataTypes.STRING(765),
  satisfaction: DataTypes.STRING(765),
  context: DataTypes.STRING(765),
  situation: DataTypes.STRING(765),
  prenom: DataTypes.STRING(765),
  expiration: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date('2030-01-01 00:00:00')
  },
  inactif: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  isFixed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  keyWords: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: ''
  },
  allKeyWords: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: ''
  },
  password: DataTypes.STRING(100),
  plain_pwd: DataTypes.STRING(100),
  progress: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  login: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  latitude: DataTypes.DECIMAL(10,6),
  longitude: DataTypes.DECIMAL(10,6),
  newsletter_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  image_id: DataTypes.INTEGER,
  adressePerso: DataTypes.STRING(255),
  adressePro: DataTypes.STRING(255),
  fixePerso: DataTypes.STRING(255),
  fixePro: DataTypes.STRING(255),
  gsmPerso: DataTypes.STRING(255),
  gsmPro: DataTypes.STRING(255),
  mailPerso: DataTypes.STRING(255),
  mailPro: DataTypes.STRING(255),
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Client',
  tableName: 'client',

});

// Associations
//Client.belongsTo(TypeClient, { foreignKey: 'typeclient_id', as: 'type' });
//Client.belongsTo(Societe, { foreignKey: 'societe_id', as: 'societe' });


console.log(Client === sequelize.models.Client); // true
//module.exports = { Client, TypeClient, Societe };

//Client.belongsTo(Societe, { foreignKey: 'societe_id', as: 'societe' });
//Client.belongsTo(TypeClient, { foreignKey: 'typeclient_id', as: 'typeclient' });



module.exports = Client ;
