const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');
//const Client = require('./client'); // Assurez-vous que Client est correctement exporté dans client.js

const Contact = sequelize.define('Contact', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    IdClient: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    content: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    interlocutor: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'contact'
});

// Contact.belongsTo(Client, { foreignKey: 'IdClient', as: 'client' });

module.exports = Contact;
