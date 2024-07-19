const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');

class Image extends Model {}

Image.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  extension: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  binary: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Image',
  tableName: 'image',
  timestamps: false
});

module.exports = Image;
