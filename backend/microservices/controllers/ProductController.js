
const { Op, fn, col, literal, QueryTypes } = require("sequelize");
const { Sequelize } = require("sequelize"); // Assurez-vous d'importer Sequelize et sequelize
const sequelize = require("../../config/database");
const Product = require('../models/product'); // Assurez-vous que le chemin vers votre modèle est correct

class ProductController {
  async getAllProducts(req, res) {
    try {
      const products = await Product.findAll();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des produits.' });
    }
  }

  async getProductById(req, res) {
    try {
      const productId = req.params.id; // Remplacez par le paramètre d'ID approprié
      const product = await Product.findByPk(productId);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Produit non trouvé.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Une erreur est survenue lors de la récupération du produit.' });
    }
  }

  async createProduct(req, res) {
    try {
      const newProduct = await Product.create(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: 'Une erreur est survenue lors de la création du produit.' });
    }
  }

  async updateProduct(req, res) {
    try {
      const productIdToUpdate = req.params.id; // Remplacez par l'ID du produit à mettre à jour
      const [updated] = await Product.update(req.body, { where: { IdProd: productIdToUpdate } });
      if (updated) {
        const updatedProduct = await Product.findByPk(productIdToUpdate);
        res.json(updatedProduct);
      } else {
        res.status(404).json({ error: 'Produit non trouvé.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour du produit.' });
    }
  }

  async deleteProduct(req, res) {
    try {
      const productIdToDelete = req.params.id; // Remplacez par l'ID du produit à supprimer
      const deleted = await Product.destroy({ where: { IdProd: productIdToDelete } });
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Produit non trouvé.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Une erreur est survenue lors de la suppression du produit.' });
    }
  }
}

module.exports = new ProductController();
