const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');

class Actions extends Model {}

Actions.init({
  id_action: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  mailing: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  telefon: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Actions',
  tableName: 'actions',
  timestamps: false
});

module.exports = Actions;
