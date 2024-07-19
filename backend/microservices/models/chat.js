const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');

class Chat extends Model {}

Chat.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  sender: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  receiver: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  read_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Chat',
  tableName: 'chat',
  timestamps: false
});

module.exports = Chat;
