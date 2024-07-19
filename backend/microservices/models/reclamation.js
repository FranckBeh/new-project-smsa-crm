const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');

class Reclamation extends Model {}

Reclamation.init({
    IdRec: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    IdClient: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    IdPrest: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    IdUser: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dateRec: {
        type: DataTypes.DATE,
        allowNull: false
    },
    context: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    reponse: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    etat: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    IdFree: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize,
    modelName: 'reclamation',
    tableName: 'reclamation',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
});

module.exports = Reclamation;
