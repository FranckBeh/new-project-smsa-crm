const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');

class ListDomFree extends Model {}

ListDomFree.init({
  IdFree: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  IdDomaine: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'ListDomFree',
  tableName: 'listdomfree',
  timestamps: false
});

module.exports = ListDomFree;
