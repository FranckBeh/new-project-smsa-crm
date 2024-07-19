const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');

class HotelNote extends Model {}

HotelNote.init({
  idHotelNote: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idNote: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  categorie: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  nbrnuits: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'HotelNote',
  tableName: 'hotelnote',
  timestamps: false
});

module.exports = HotelNote;
