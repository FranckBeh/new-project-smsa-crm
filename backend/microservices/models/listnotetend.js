const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');

class ListNoteTend extends Model {}

ListNoteTend.init({
  IdNote: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  IdTendType: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'ListNoteTend',
  tableName: 'listnotetend',
  timestamps: false
});

module.exports = ListNoteTend;
