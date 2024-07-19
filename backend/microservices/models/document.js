// src/models/Document.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

class Document extends Model {}

Document.init(
  {
    IdDocument: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    IdPrest: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nomFichier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idFree: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    idInv: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cheminFichier: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Document",
    tableName: "document",
    timestamps: false,
  }
);

module.exports = Document;
