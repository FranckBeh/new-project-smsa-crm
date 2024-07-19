const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');

class Product extends Model {}

Product.init({
    IdProd: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    nom: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    expDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(0) // Equivalent to '0000-00-00 00:00:00'
    },
    keyWords: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: ''
    }
}, {
    sequelize,
    tableName: 'product',
    modelName: 'Product',
    timestamps: false, // If your table doesn't have `createdAt` and `updatedAt` fields
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
});

module.exports = Product;
