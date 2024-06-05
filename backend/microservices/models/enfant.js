const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js'); // Assurez-vous que ceci pointe vers votre instance Sequelize

class Enfant extends Model {}

Enfant.init({
  IdClient: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  IdEnfant: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  anniversaire: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Enfant',
  tableName: 'enfant', // Specify the table name explicitly
  timestamps: false, // Disable timestamps if not needed
});

module.exports = Enfant;
