const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');

class TendGen extends Model {}

TendGen.init({
    IdTendGen: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    nom: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'tendgen',
    tableName: 'tendgen',
    timestamps: false, // Si votre table n'a pas de colonnes `createdAt` et `updatedAt`
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
});

module.exports = TendGen;
