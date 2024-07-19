const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');

class DomaineGen extends Model {}

DomaineGen.init({
  IdDomaine: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  domaine: {
    type: DataTypes.STRING(765),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'DomaineGen',
  tableName: 'domainegen',
  timestamps: false
});

module.exports = DomaineGen;
