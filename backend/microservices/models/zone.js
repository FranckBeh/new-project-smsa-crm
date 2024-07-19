const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../../config/database.js');


class Zone extends Model {}
Zone.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  utilisateur: { type: DataTypes.INTEGER },
  image_id: { type: DataTypes.INTEGER },
  name: { type: DataTypes.STRING(100), allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  latitude: { type: DataTypes.DECIMAL(10,6), allowNull: false },
  longitude: { type: DataTypes.DECIMAL(10,6), allowNull: false },
  radius: { type: DataTypes.INTEGER, allowNull: false },
  from: { type: DataTypes.INTEGER, allowNull: false },
  to: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
  expiration: { type: DataTypes.DATE, allowNull: false },
  interval: { type: DataTypes.INTEGER, allowNull: false },
  update_date: { type: DataTypes.DATE, allowNull: false }
}, 

{ sequelize, 
    modelName: 'Zone',
    tableName: 'zone',
    timestamps: false,
 });

 module.exports = Zone;