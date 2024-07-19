const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');

class ListClientTend extends Model {}

ListClientTend.init({
  IdClient: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  IdTendType: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  defaultTend: {
    type: DataTypes.TINYINT(1),
    defaultValue: 0,
    allowNull: false
  },
  oldCounter: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  ratio: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'ListClientTend',
  tableName: 'listclienttend',
  timestamps: false
});

module.exports = ListClientTend;
