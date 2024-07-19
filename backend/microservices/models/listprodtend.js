const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');

class ListProdTend extends Model {}

ListProdTend.init({
  IdProd: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  IdTendType: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'ListProdTend',
  tableName: 'listprodtend',
  timestamps: false
});

module.exports = ListProdTend;
