const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');

class listTagPres extends Model {}

listTagPres.init({
    IdPrest: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idTag: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'ListTagPres',
  tableName: 'listtagpres',
  timestamps: false
});

module.exports = listTagPres ;
 	