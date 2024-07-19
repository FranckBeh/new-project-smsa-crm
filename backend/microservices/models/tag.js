const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');

class Tag extends Model {}

Tag.init({
    idTag: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true
    },
    nom: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'tag',
    tableName: 'tag',
    timestamps: false, // Si votre table n'a pas de colonnes `createdAt` et `updatedAt`
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
});

module.exports = Tag;
