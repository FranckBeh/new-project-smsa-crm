const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');

class Ville extends Model {}

Ville.init({
    NumVille: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    NomVille: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'ville',
    tableName: 'ville',
    timestamps: false, // Si votre table n'a pas de colonnes `createdAt` et `updatedAt`
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
});

module.exports = Ville;
