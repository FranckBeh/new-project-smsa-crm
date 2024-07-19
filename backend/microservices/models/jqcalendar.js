const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');

class JqCalendar extends Model {}

JqCalendar.init({
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  Subject: {
    type: DataTypes.STRING(1000),
    allowNull: true
  },
  Location: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  Description: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  StartTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  EndTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  IsAllDayEvent: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  Color: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  RecurringRule: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'JqCalendar',
  tableName: 'jqcalendar',
  timestamps: false
});

module.exports = JqCalendar;
