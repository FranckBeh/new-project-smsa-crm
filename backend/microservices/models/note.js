const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');

class Note extends Model {}

Note.init({
  IdClient: {
    type: DataTypes.INTEGER,
    allowNull: true, 
  },
  IdNote: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true 
  },
  dateNote: {
    type: DataTypes.DATE,
    allowNull: true
  },
  context: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  domaine: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  priorite: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  IdPrest: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  prixAchat: {
    type: DataTypes.FLOAT(10,2),
    defaultValue: 0.00
  },
  prixVente: {
    type: DataTypes.FLOAT(10,2),
    defaultValue: 0.00
  },
  ville: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  etat: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  idUser: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  heure: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  actionPrise: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  satisfaction: {
    type: DataTypes.INTEGER,
    defaultValue: 3
  },
  commentSatis: {
    type: DataTypes.STRING(500),
    defaultValue: ''
  },
  rapport: {
    type: DataTypes.INTEGER,
    defaultValue: -1
  },
  IdProd: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  keyWords: {
    type: DataTypes.STRING(100),
    defaultValue: ''
  },
  IdFree: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  update_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  isVisible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'Note',
  tableName: 'note',
  timestamps: false
});

module.exports = Note;
