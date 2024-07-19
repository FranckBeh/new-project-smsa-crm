const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');


class ActionRec extends Model {}

ActionRec.init({
  idAction: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  idRec: {
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
    type: DataTypes.STRING(10000),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'ActionRec',
  tableName: 'actionrec',
  timestamps: false
});

module.exports = ActionRec;
