const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');

class TendType extends Model {}

TendType.init({
    IdTendType: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    IdTendGen: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nom: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'tendtype',
    tableName: 'tendtype',
    timestamps: false, // Si votre table n'a pas de colonnes `createdAt` et `updatedAt`
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
});

module.exports = TendType;
