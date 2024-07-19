const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js'); // ajuster le chemin en fonction de votre configuration

class ActionNote extends Model {}

ActionNote.init({
  idAction: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  idNote: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idUser: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  dateAction: {
    type: DataTypes.DATE,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(1000),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'ActionNote',
  tableName: 'actionnote',
  timestamps: false
});

module.exports = ActionNote;
