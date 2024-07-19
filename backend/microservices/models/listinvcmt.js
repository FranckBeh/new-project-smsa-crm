const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database.js');

class Listinvcmt extends Model {}

Listinvcmt.init( {
  idCommentaire: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  idInv: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  IdUser: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  dateCommentaire: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  },
  commentaire: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Listinvcmt',
  tableName: 'listinvcmt'
 //timestamps: false,
});

module.exports = { Listinvcmt };
